# Small Steps — IELTS Studio

Four-week starter curriculum for IELTS Academic preparation: three main sessions and one optional session per week, 25–30 minutes each, with a 10-minute mode. Content is original practice material, not official IELTS questions. This is a starter programme, not a guarantee of band 6.5.

## Run

No package installation, credentials, or build step required. Python 3 serves the static app:

```sh
cd /workspace/Project-1
python3 -m http.server 8000 --bind 0.0.0.0 --directory ielts-studio
```

Open the app through the development environment's supported browser access, or run the same command on your computer. Onboarding does not provide a public preview URL.

## Learning loop

1. Choose a week and session. Start with Week 1.
2. Complete the exercise; reading and listening quizzes explain the answer.
3. Write or revise. Copy the writing feedback request into chat for a detailed review. Automated checks only count words/paragraphs; they do not grade grammar, task response, or IELTS bands.
4. Mark the session complete. Use the optional fourth session for speaking.

Listening uses browser text-to-speech, which requires available English voices. It is not an authentic IELTS listening recording. Official IELTS, British Council, and BBC links provide supplementary materials; linked content and availability are maintained by those providers.

Speaking recording requires microphone permission, MediaRecorder, and a secure browser context. Recordings are local, are not uploaded, and are not transcribed or graded. Download recordings before leaving a session. Browser voice playback and microphone hardware require a manual check.

Progress and drafts use localStorage for this browser and origin. Export JSON regularly; no account, cloud sync, or import interface is included. Clearing browser storage removes local progress. Do not put sensitive information in practice answers.

## Validation

Browser smoke checks cover lesson rendering, reading/listening feedback, word counts, draft persistence, progress, mobile layout, and JSON export. A local HTTP request should return the app HTML and assets successfully. No claim is made about achieving a particular IELTS score or automatic pronunciation assessment.
