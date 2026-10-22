# Envelo

**Know before you spend.** Envelo is an AI envelope-budgeting app. Describe your month in plain words and it builds your envelope budget; then, before you buy something, Spend Check tells you whether your budget can take it.

Built with React 18, Vite, Tailwind CSS, Redux Toolkit, Firebase (Auth + Firestore) and Google Gemini.

## Features

- **AI Plan Builder.** Type something like "I earn ₦450k, rent is ₦150k, saving for December". Envelo returns envelopes with amounts, flags shortfalls and adds practical notes. The plan opens in the editor so you can change anything before saving.
- **Spend Check.** On any budget, ask "Can I afford a ₦40,000 dinner?" and get a yes / careful / no answer, the envelope it should come from, and a suggestion.
- A rich-text editor, search, sorting, a dashboard, light/dark themes and a mobile layout.

## Getting started

1. Install dependencies:

   ```bash
   npm install
   ```

2. Copy `.env.example` to `.env` and fill it in (see the comments in that file).
   - `VITE_*` values are the Firebase web config. They are bundled into the browser app, which is expected for Firebase.
   - `GEMINI_*`, `AI_TIMEOUT` and `MAX_RETRIES` are **server-only**. They are read by the AI endpoint and never shipped to the browser. Don't give them a `VITE_` prefix.

3. In the Firebase console, enable **Email/Password** sign-in.

4. Start the dev server. The AI endpoint runs inside it, so no extra tools are needed:

   ```bash
   npm run dev
   ```

## How the AI works

```
Browser ──(Firebase ID token)──▶ POST /api/ai ──▶ Gemini API
```

- `server/ai.mjs` holds all the AI logic: prompts, response schemas, validation, retries and error messages.
- In development it is served by a small Vite middleware (`vite.config.js`). In production it runs as a Netlify Function (`netlify/functions/ai.mjs`).
- Every request must carry a valid Firebase ID token, so only signed-in users can spend your Gemini quota.
- Gemini returns structured JSON (a response schema), which the server checks and trims before it reaches the UI.
- **Retries:** network errors, 5xx and short 429s are retried with exponential backoff, up to `MAX_RETRIES`, within `AI_TIMEOUT` seconds in total. Long quota limits fail fast with a clear message.
- **Fallback model:** set `GEMINI_FALLBACK_MODEL` to switch retries to another model when the main one is overloaded.
- **What Gemini sees:** only the text the user sends. That is their description for the Plan Builder, or the budget they're checking plus their question for Spend Check. Envelo has no bank access.

### Gemini quota

The free tier is very small (for example, 20 requests per day per model, shared by all your users). For real use, enable billing on the Google AI project that owns `GEMINI_API_KEY`.

## Deploying to Netlify

`netlify.toml` already sets the build command, the publish folder and the functions folder. In **Site settings → Environment variables**, add every variable from `.env.example`.

Netlify functions time out after **10 seconds** by default (26 seconds at most, on request), and Gemini can be slower than that under load. Set `AI_TIMEOUT` a little below your function timeout, and keep `GEMINI_THINKING_LEVEL=low` for faster answers.

## Scripts

| Command         | What it does                                   |
| --------------- | ---------------------------------------------- |
| `npm run dev`   | Start the dev server (including `/api/ai`)     |
| `npm run build` | Production build into `build/`                 |
| `npm run serve` | Preview the production build (no AI endpoint)  |

## Firestore

Budgets live in the `notes` collection:

| Field         | Type      | Notes                                      |
| ------------- | --------- | ------------------------------------------ |
| `uid`         | string    | Owner's Firebase Auth uid                  |
| `title`       | string    | Optional; older entries don't have one     |
| `notes`       | string    | Rich-text HTML from the editor             |
| `createdAt`   | timestamp | Used for sorting and stats                 |
| `updatedAt`   | timestamp | Set on every edit                          |
| `dateCreated` | string    | Legacy display date, kept for older builds |

Recommended security rules, so each user can only reach their own budgets:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /notes/{noteId} {
      allow read, update, delete: if request.auth != null && resource.data.uid == request.auth.uid;
      allow create: if request.auth != null && request.resource.data.uid == request.auth.uid;
    }
  }
}
```

## Project structure

```
netlify/functions/  Production AI endpoint (thin wrapper)
server/             Shared AI logic (prompts, schemas, retries, auth check)
src/
  components/
    elements/       Reusable UI pieces (Button, Card, TextField, Alert, …)
    widgets/        App pieces (AppShell, AiPlanBuilder, SpendCheck, NoteEditor, …)
  hooks/            useNotes
  page/             Route screens (Landing, Home, Notes, NoteDetail, auth pages)
  services/         Client for the AI endpoint
  store/            Redux slices for the user session and budgets
  utils/            Formatting, validation, plan rendering, error messages
```
