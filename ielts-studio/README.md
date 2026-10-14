# Small Steps — IELTS Practice Lab v3

A four-week original IELTS-style practice bank for an Academic IELTS 6.5+ goal. The goal is not a score guarantee. There are 152 auto-scored questions (48 reading, 48 listening, 24 grammar, 32 vocabulary), eight full writing assignments (four Task 1, four Task 2) with planning/revision work, and 36 speaking prompts across Parts 1–3. The 88 activity views include annotation, synthesis, dictation, shadowing, paraphrasing, flashcards, error review and reflection. This is not a full IELTS mock test.

## Run

No packages, API keys, build or installation required. Python 3 is sufficient:

```sh
python3 -m http.server 8000 --bind 0.0.0.0 --directory /workspace/Project-1/ielts-studio
```

For GitHub Pages, deploy `main` from `/ (root)`. The repository root index forwards visitors to `ielts-studio/`. Publication and remote website readiness must be checked separately from local validation.

## Recommended workflow

- Session 1: reading and vocabulary.
- Session 2: listening and speaking.
- Session 3: writing, alternating Task 1 and Task 2 as needed.
- Optional session 4: revision and the error notebook.

Choose one or two activities per 35–45 minute session. These are substantial modules; completing every assignment takes more than a single session, and the four-week bank can be stretched to fit the learner. The 10-minute focus mode is for partial practice. Task 1 uses a 20-minute timer and a 150-word minimum; Task 2 uses 40 minutes and 250 words. Guided mode supplies strategies. Challenge mode hides those initial hints; it uses the same questions and is not an independent test of improvement.

All auto-scored questions include explanatory evidence. First-attempt correctness is retained separately from latest results. Wrong latest answers enter the error notebook. Repeating the same question tests recall and is explicitly labelled as review, not a new score. All questions in a set must be answered before grading. Typed completion answers are matched against curated answer aliases with case/spacing normalisation; the app does not infer unseen synonyms.

Writing includes tables of original practice data, argument maps, drafts, self-checks, revisions and change logs. Local checks count words/paragraphs and flag long sentences for review. They do not assess grammar, argument quality, or IELTS bands. The ChatGPT button prepares a detailed, evidence-based feedback request containing the real prompt, draft, revision and data, then opens ChatGPT with a prefill attempt and clipboard/manual-copy fallback. Speaking provides prompt navigation, notes, preparation timer, recording and reflection; audio must be supplied to chat for pronunciation/fluency review. AI feedback and voice conversation happen in the learner’s own ChatGPT account via explicit handoff. No API key or paid API backend is required. Website checks still do not predict bands or transcribe audio automatically.

## Audio and privacy

Listening uses browser English text-to-speech. Voices and playback depend on the device. It does not reproduce human conversations or IELTS accent variety. British Council, IELTS official and BBC links supplement the original exercises with externally maintained material. These links are references, not locally hosted audio.

Speaking recording requires microphone permission, MediaRecorder, and a secure context (HTTPS or localhost). Recordings remain in browser memory and are not uploaded. Download before closing the page. Actual microphone and audible voice quality need manual checks on the learner’s device.

Progress uses `smallsteps-v2` in localStorage for this browser and origin. Export JSON for backup; import v2 JSON to restore on another device (with explicit overwrite confirmation). Storage failures show a warning. Existing v1 work is retained under its original key and included as legacy content in exports; old Task 2 drafts are carried forward when present. Old completion flags are not treated as completion of the new expanded activities. Clearing storage deletes unexported work. No accounts, cloud sync, or analytics are used. Avoid sensitive details in practice answers.

## Validation

Playwright with system Chromium tests all 152 answer keys through UI input, all 88 activity views, unanswered guards, feedback, error review, first/latest result distinction, draft/revision/checklist persistence, dictation order-sensitive comparison, flashcard confidence, separate speaking notes, guided/challenge modes, timer controls, export/import validation and mobile overflow. Local HTTP requests verify assets. Audio hardware is not covered by headless tests.

Run the saved browser smoke suite while the server is running:

```sh
node /workspace/Project-1/tests/ielts-studio-smoke.cjs
```

The cloud machine supplies Playwright and system Chromium. On other machines, install Playwright in a separate test tools directory (no app runtime dependencies), make it resolvable by Node, and set `IELTS_CHROMIUM_PATH` to an installed Chromium executable. `IELTS_STUDIO_TEST_URL` overrides the default local test URL. Additional current-instance checks exercised MediaRecorder with synthetic input, the 60-second cue-card timer, legacy draft retention, and storage-failure messaging; these do not prove physical microphone availability.

## ChatGPT Coach (using the existing ChatGPT plan)

- Writing: open a draft/revision activity and select “Buka ChatGPT untuk feedback AI”. Empty drafts are blocked. The full assignment, table where relevant, draft and revision are included.
- Other open answers: select the desired field in the ChatGPT Coach section. Reading reviews include the reference passage; paraphrase reviews include source material. Short exercises explicitly request qualitative feedback rather than an overall IELTS band.
- Speaking: select Part 1, 2 or 3, then Coach or Mock examiner. Open ChatGPT, send the prepared prompt, then use the Voice/waveform button in ChatGPT and permit its microphone access. The partner is instructed to ask one question at a time and adapt to actual replies. Voice happens in ChatGPT, not inside this website. Account limits and feature availability apply.
- Recorded speaking: download the local recording and attach it manually in ChatGPT if supported by the account. A feedback prompt explicitly forbids assessing unheard audio and requests transcript-only feedback when audio analysis is unavailable.
- Return: paste received feedback and next assignments into the Coach panel. These are saved separately per module in existing progress storage and included in export/import. There is no automatic transfer of ChatGPT responses into the website.

Clicking a handoff button intentionally opens ChatGPT with learner context. For reasonably sized prompts the app uses `https://chatgpt.com/?q=...` to try prefilling the composer; this third-party behaviour is not guaranteed. The full prompt is also copied (when permission permits) and available in a selectable textarea. Long prompts use the plain ChatGPT URL with clipboard/manual fallback. If a popup is blocked, a regular link is shown. No login credentials, API keys or recordings are inserted into these links. Log in directly on ChatGPT with the existing subscription. ChatGPT subscription access is separate from API billing; this implementation uses no API.

Test the handoff UI while the local server runs:

```sh
node /workspace/Project-1/tests/chatgpt-coach-smoke.cjs
```

The test intercepts ChatGPT navigation locally so sample essays are never sent externally. It covers actual answer/reference inclusion, writing rubrics and revisions, open-answer safeguards, voice setup prompts, audio caveats, module-specific saved feedback/assignments, clipboard denial, long-prompt fallback and mobile layout. It does not verify ChatGPT’s current prefill behaviour, subscription status, microphone availability or voice features on the learner’s device.
