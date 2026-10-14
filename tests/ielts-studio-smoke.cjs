const {chromium}=require('playwright');
const fs=require('fs');
(async()=>{
 const browser=await chromium.launch({headless:true,executablePath:process.env.IELTS_CHROMIUM_PATH||'/usr/bin/chromium'});
 const page=await browser.newPage({viewport:{width:1280,height:900}});
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 const expect=(x,msg)=>{if(!x)throw Error(msg)};
 await page.goto(process.env.IELTS_STUDIO_TEST_URL||'http://127.0.0.1:8000');
 const counts=await page.evaluate(()=>({q:bank.length,a:steps.reduce((n,s)=>n+s.length,0)*curriculum.length,s:curriculum.reduce((n,w)=>n+w.speaking.part1.length+w.speaking.part3.length+1,0)}));
 expect(counts.q===152&&counts.a===88&&counts.s===36,'Content counts');
 const content=await page.evaluate(()=>bank.map(q=>({uid:q.uid,prompt:q.prompt,answer:q.answer,options:q.options,type:q.type})));
 expect(new Set(content.map(q=>q.uid)).size===152,'Unique IDs');expect(content.every(q=>q.answer.length&&q.prompt&&(q.type==='text'||q.options.includes(q.answer[0]))),'Valid answer keys');
 // Incomplete submissions must not become results.
 await page.locator('[data-step="1"]').click();await page.locator('#check').click();expect((await page.locator('#quizfeedback').innerText()).includes('6 soal kosong'),'Unanswered guard');expect(await page.evaluate(()=>Object.keys(state.results).length)===0,'No zero-answer grading');
 // Wrong first attempt creates an error; correcting it retains the first-attempt result.
 async function fillSet(wrong=false){const questions=await page.locator('[data-question]').evaluateAll(nodes=>nodes.map(n=>n.dataset.question));for(let i=0;i<questions.length;i++){const q=content.find(q=>q.uid===questions[i]);const fs=page.locator(`[data-question="${q.uid}"]`);if(q.type==='text')await fs.locator('input').fill(wrong&&i===0?'incorrect answer':q.answer[0]);else await fs.locator('input').filter({visible:true}).nth(q.options.indexOf(wrong&&i===0?q.options.find(o=>o!==q.answer[0]):q.answer[0])).check();}await page.locator('#check').click();return questions.length;}
 await fillSet(true);expect((await page.locator('#quizfeedback').innerText()).includes('5/6'),'Mixed score');
 await page.locator('[data-skill="5"]').click();expect(await page.locator('[data-question]').count()===1,'Error notebook');await fillSet();expect((await page.locator('#quizfeedback').innerText()).includes('bukan tes baru'),'Review distinction');
 expect(await page.evaluate(()=>state.results['0/r1'].firstCorrect===false&&state.results['0/r1'].correct===true),'First result preserved');
 // Score all question sets through the UI and render all activities.
 let answered=0;
 for(let w=0;w<4;w++){
  await page.locator('#week').selectOption(String(w));
  for(let sk=0;sk<6;sk++){
   await page.locator(`[data-skill="${sk}"]`).click();
   const activities=await page.locator('[data-step]').count();
   for(let st=0;st<activities;st++){
    await page.locator(`[data-step="${st}"]`).click();
    expect((await page.locator('#lesson').innerText()).length>50,`Activity ${w}/${sk}/${st}`);
    if(await page.locator('[data-question]').count())answered+=await fillSet();
   }
  }
 }
 expect(answered===152,`All 152 questions: ${answered}`);expect(await page.evaluate(()=>Object.keys(state.results).length)===152,'Saved results');
 // Drafts, revisions and self-checks survive reload.
 await page.locator('#week').selectOption('0');await page.locator('[data-skill="2"]').click();await page.locator('[data-step="4"]').click();
 await page.locator('#field-task2-draft').fill('Universities should improve existing facilities because reliable maintenance helps students.');await page.locator('#field-task2-revision').fill('Revised essay with a concession and a concrete example.');await page.locator('[data-self-check="0/task2-0"]').check();await page.locator('#review-writing').click();expect((await page.locator('#writingfeedback').innerText()).includes('di bawah minimum 250'),'Writing length advice');
 await page.reload();await page.locator('[data-skill="2"]').click();await page.locator('[data-step="4"]').click();expect((await page.locator('#field-task2-draft').inputValue()).includes('maintenance'),'Draft persistence');expect((await page.locator('#field-task2-revision').inputValue()).includes('concession'),'Revision persistence');expect(await page.locator('[data-self-check="0/task2-0"]').isChecked(),'Checklist persistence');
 // Dictation algorithm handles identical words in the wrong order.
 expect(await page.evaluate(()=>wordDiff(['one','two'],['two','one']).distance)>0,'Dictation ordering');
 await page.locator('[data-skill="1"]').click();await page.locator('[data-step="2"]').click();await page.locator('#check-dictation').click();expect((await page.locator('#dictation-feedback').innerText()).includes('dulu'),'Empty dictation guard');await page.locator('#field-dictation').fill('Today I want to explain why a lower energy bill does not automatically prove that an intervention worked. Imagine that we install sensors and see consumption fall by eighteen per cent.');await page.locator('#check-dictation').click();expect((await page.locator('#dictation-feedback').innerText()).includes('0 edit'),'Exact dictation');
 // Cards and speaking navigation.
 await page.locator('[data-skill="4"]').click();expect(await page.locator('#card-definition').isHidden(),'Hidden card meaning');await page.locator('#flip').click();expect(await page.locator('#card-definition').isVisible(),'Card flip');await page.locator('#card-again').click();expect(await page.evaluate(()=>state.cards['0/0'])==='again','Card confidence');
 await page.locator('[data-skill="3"]').click();await page.locator('#speaking-note textarea').fill('Answer one');await page.locator('#next-prompt').click();await page.locator('#speaking-note textarea').fill('Answer two');await page.locator('#previous-prompt').click();expect(await page.locator('#speaking-note textarea').inputValue()==='Answer one','Speaking separate notes');
 // Guided versus challenge, timer and activity completion.
 await page.locator('#mode').selectOption('exam');expect(await page.locator('.strategy').count()===0,'Challenge hides strategy');await page.locator('#short').check();await page.locator('#timer').click();expect(await page.locator('#clock').innerText()==='10:00','Short timer');await page.locator('#pause-timer').click();expect(await page.locator('#pause-timer').innerText()==='Lanjut','Pause');await page.locator('[data-step="1"]').click();expect(await page.locator('#clock').innerText()==='','Timer clears on navigation');await page.locator('#complete').click();expect((await page.locator('#complete').innerText()).includes('Batalkan'),'Completion toggle');
 // Export and import, including rejecting invalid data.
 const dp=page.waitForEvent('download');await page.locator('#export').click();const download=await dp;const exported=JSON.parse(fs.readFileSync(await download.path(),'utf8'));expect(exported.version===2&&Object.keys(exported.results).length===152,'Complete export');
 await page.locator('#import').setInputFiles({name:'invalid.json',mimeType:'application/json',buffer:Buffer.from('{"version":2}')});await page.waitForFunction(()=>document.getElementById('storage-status').textContent.includes('tidak valid'));
 page.once('dialog',d=>d.accept());await page.locator('#import').setInputFiles({name:'progress.json',mimeType:'application/json',buffer:Buffer.from(JSON.stringify(exported))});await page.waitForFunction(()=>document.getElementById('storage-status').textContent.includes('berhasil'));
 // Mobile overflow and screenshot.
 await page.setViewportSize({width:390,height:844});for(let sk=0;sk<6;sk++){await page.locator(`[data-skill="${sk}"]`).click();expect(!await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),`Mobile skill ${sk}`);}
 await page.setViewportSize({width:1280,height:900});await page.locator('[data-skill="0"]').click();
 expect(errors.length===0,errors.join('\n'));console.log('PASS: 152 answer keys, 88 activity views, scoring, unanswered guards, error review, first/latest results, drafts/revisions/checklists, dictation, flashcards, speaking notes, timers, export/import, mobile layout; no browser errors.');await browser.close();
})().catch(e=>{console.error(e);process.exit(1)});
