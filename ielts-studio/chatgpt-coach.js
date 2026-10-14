/* ChatGPT handoff uses the user's ChatGPT account. No API key or backend. */
'use strict';
const ChatGPTCoach = (() => {
  const root='https://chatgpt.com/';
  function wrap(task){return `Kamu tutor IELTS Academic saya. Target saya minimal band 6.5 untuk S2, dengan fokus writing dan konsistensi. Saya belajar 3–4 kali seminggu.\n\n${task}\n\nBerikan feedback berdasarkan jawaban saya, bukan kunci tetap. Jelaskan dalam bahasa Indonesia, contoh perbaikannya dalam bahasa Inggris. Kutip bagian nyata dari jawaban sebelum mengoreksi; jangan mengarang kesalahan atau fakta. Pilih maksimal 3 prioritas dan satu latihan lanjutan yang sesuai kelemahan saya. Jangan menulis ulang seluruh jawaban sebelum saya mencoba revisi. Band IELTS, jika diberikan, hanya estimasi dan bukan skor resmi. Jika bukti terlalu sedikit, katakan apa yang belum dapat dinilai.`;}
  async function open(prompt,target){
    // The learner explicitly chooses to send this context to ChatGPT.
    const query=`${root}?q=${encodeURIComponent(prompt)}`;
    const url=query.length<=7000?query:root;
    let copying;
    try{copying=navigator.clipboard.writeText(prompt).then(()=>true,()=>false);}catch{copying=Promise.resolve(false);}
    window.open(url,'_blank','noopener,noreferrer');
    const copied=await copying;
    const status=target||document.getElementById('coach-status');
    if(status){status.innerHTML=`<div class="feedback"><strong>Langkah berikutnya di ChatGPT</strong><p>Login dengan akun langgananmu. Jika prompt sudah muncul, tekan Kirim. ${copied?'Jika belum muncul, tempel (Paste / Ctrl+V) prompt yang sudah disalin.':'Jika prompt belum muncul, salin dari kotak di bawah, tempel ke ChatGPT, lalu tekan Kirim.'}</p><p>Jika tab baru tidak terbuka, gunakan tautan ini: <a href="${html(url)}" target="_blank" rel="noopener noreferrer">Buka ChatGPT ↗</a></p><details ${copied?'':'open'}><summary>Lihat / salin prompt lengkap</summary><textarea readonly aria-label="Prompt untuk ChatGPT">${html(prompt)}</textarea></details></div>`;}
  }
  function writingPrompt(task,focus){
    const data=wk().task1;
    const prompt=task==='task1'?`${data.title}\n${data.unit}\n${data.columns.join(' | ')}\n${data.rows.map(r=>r.join(' | ')).join('\n')}`:wk().task2;
    const draft=state.fields[`${week}/${task}-draft`]||'';
    const revision=state.fields[`${week}/${task}-revision`]||'';
    const reviewFocus=focus||(revision.trim()?'revision':'draft');
    return wrap(`Fokus penilaian utama: ${reviewFocus==='revision'?'versi revisi':'draft pertama'}. Nilai IELTS Academic Writing ${task==='task1'?'Task 1':'Task 2'} berdasarkan empat kriteria: ${task==='task1'?'Task Achievement':'Task Response'}, Coherence & Cohesion, Lexical Resource, Grammatical Range & Accuracy. Untuk setiap kriteria: berikan bukti dari tulisan saya dan tindakan perbaikan. Cek ketepatan data untuk Task 1 dan apakah seluruh pertanyaan terjawab untuk Task 2. Jangan memberikan estimasi band keseluruhan jika jawaban terlalu pendek (minimum Task 1 150 kata, Task 2 250 kata) atau belum cukup untuk dinilai. Jika ada revisi, bandingkan dengan draft dan tunjukkan kemajuan serta masalah yang tersisa.\n\nSoal/data:\n${prompt}\n\nDraft:\n${draft}\n\nRevisi:\n${revision||'(belum ada)'}\n\nRevision log:\n${state.fields[`${week}/${task}-changes`]||'(belum ada)'}`);
  }
  function voicePrompt(part,style){
    const s=wk().speaking;
    const task=part==='Part 1'?s.part1.join('\n'):part==='Part 2'?s.cue:s.part3.join('\n');
    return `Act as my IELTS Academic speaking partner. My goal is at least 6.5 for postgraduate study. Topic: ${wk().title}. Today practise ${part}.\n\nUse these prompts as a starting point, then adapt follow-up questions to what I actually say:\n${task}\n\n${style==='exam'?'Exam practice: ask one question at a time, allow me to finish, and save feedback until I say “end practice”. For Part 2 give the cue card, allow one minute of preparation and a one-to-two-minute long turn. This is practice, not an official exam.':'Coach practice: ask one question at a time. After my answer, offer one short correction if needed and a relevant follow-up question. Keep responses brief so I speak more than you.'}\n\nI will switch on ChatGPT Voice to speak. Start by asking the first question in English and wait for my reply. Use Indonesian only when I request clarification. When I say “end practice”, give evidence-based feedback and three priorities. If you can actually hear audio, discuss noticeable pronunciation/fluency patterns carefully; if you only have text, do not score pronunciation or acoustic fluency. Any score is unofficial; say when there is insufficient evidence. Do not invent learner errors or claim to be a certified examiner.`;
  }
  function audioPrompt(){return wrap(`Saya akan melampirkan rekaman speaking sendiri setelah pesan ini. Jangan memberi feedback sebelum rekamannya benar-benar dilampirkan dan dapat diakses.\n\nModul: ${wk().title}\nCue card: ${wk().speaking.cue}\nPart 1: ${wk().speaking.part1.join(' / ')}\nPart 3: ${wk().speaking.part3.join(' / ')}\n\nNilai relevansi, pengembangan jawaban, vocabulary dan grammar. Jika audio bisa didengar, berikan contoh pronunciation/fluency yang terdengar beserta timestamp bila tersedia. Jika audio tidak dapat dianalisis, katakan keterbatasannya dan minta transkrip; jangan mengarang penilaian suara. Pilih 3 prioritas dan satu pertanyaan untuk mencoba ulang.`);}
  function mount(){
    const panel=document.getElementById('coach-activity');
    const sourceSelect=document.getElementById('coach-source');
    panel.hidden=true;
    const fields=[...document.querySelectorAll('#lesson textarea[data-field]')];
    sourceSelect.innerHTML='';
    if(fields.length&&skill!==3&&skill!==5){
      panel.hidden=false;
      fields.forEach(el=>{const label=document.querySelector(`label[for="${el.id}"]`);sourceSelect.add(new Option(label?.textContent||'Jawaban',el.dataset.field));});
      const revision=fields.find(el=>el.dataset.field.endsWith('-revision')&&el.value.trim());
      const draft=fields.find(el=>el.dataset.field.endsWith('-draft'));
      if(revision||draft)sourceSelect.value=(revision||draft).dataset.field;
    }
    document.getElementById('coach-feedback').value=state.fields[`${week}/chatgpt-feedback`]||'';
    document.getElementById('coach-next-task').value=state.fields[`${week}/chatgpt-next-task`]||'';
    document.getElementById('coach-module').textContent=`Modul ${week+1} · ${wk().title}`;
    document.getElementById('coach-part').value=skill===3?(step===1?'Part 2':step===2?'Part 3':'Part 1'):'Part 1';
    document.getElementById('coach-status').innerHTML='';
  }
  document.getElementById('coach-review').onclick=()=>{
    const uid=document.getElementById('coach-source').value;
    const answer=state.fields[uid]||'';
    const target=document.getElementById('coach-status');
    if(typeof answer!=='string'||!answer.trim()){target.textContent='Isi jawabanmu dulu sebelum meminta feedback.';return;}
    if(skill===2&&(step===2||step===4)&&/-(draft|revision)$/.test(uid)){open(writingPrompt(step===2?'task1':'task2',uid.endsWith('-revision')?'revision':'draft'),target);return;}
    const label=document.getElementById('coach-source').selectedOptions[0].textContent;
    const reference=skill===0?wk().paragraphs.join('\n\n'):skill===1?wk().listening[1].script:skill===2?(step===1?`${wk().task1.title}\n${wk().task1.columns.join(' | ')}\n${wk().task1.rows.map(r=>r.join(' | ')).join('\n')}`:wk().task2):wk().paragraphs[5];
    open(wrap(`Latihan: ${skills[skill]} · ${steps[skill][step]}\nInstruksi yang saya jawab: ${label}\n\nBahan/soal referensi:\n${reference}\n\nJawaban saya:\n${answer}\n\nCek akurasi terhadap sumber, kelengkapan ide, struktur, grammar, dan vocabulary. Untuk paraphrase, cek apakah makna dan tingkat kepastian tetap sama. Ini tugas latihan singkat, bukan respons IELTS penuh: jangan memberi band keseluruhan.`),target);
  };
  document.getElementById('coach-voice').onclick=()=>open(voicePrompt(document.getElementById('coach-part').value,document.getElementById('coach-style').value));
  document.getElementById('coach-audio').onclick=()=>open(audioPrompt());
  for(const [id,suffix] of [['coach-feedback','chatgpt-feedback'],['coach-next-task','chatgpt-next-task']]){
    document.getElementById(id).oninput=e=>{state.fields[`${week}/${suffix}`]=e.target.value;save();};
  }
  return {open,writingPrompt,audioPrompt,mount};
})();
window.ChatGPTCoach=ChatGPTCoach;
ChatGPTCoach.mount();
