# Bible Journey Map App

An interactive React + Node application that maps 50 major Bible events with AI-powered story videos — illustrated scenes, narration audio, and a downloadable MP4/WebM video — generated entirely using Google Gemini.

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────┐
│  Browser (React + Vite)                             │
│  sabai-bible/src/explore/BibleJourneyApp.jsx        │
│    ├── Events sidebar (50 Bible events)             │
│    ├── Interactive map (Leaflet)                    │
│    └── Video tab (StoryPlayer)                      │
│         └── makeStoryVideo.js (Canvas + MediaRecorder) │
└─────────────────┬───────────────────────────────────┘
                  │ fetch /api/events/:id/story
                  ▼
┌─────────────────────────────────────────────────────┐
│  Vercel Serverless Functions (Node.js 20)           │
│  api/events/[id]/story.js                           │
│    ├── Gemini TEXT   → story script (4 scenes)      │
│    ├── Gemini IMAGE  → 4 illustrations (parallel)   │
│    └── Gemini TTS    → WAV narration audio          │
│  api/_shared.js  (Gemini + Supabase clients)        │
└─────────────────┬───────────────────────────────────┘
                  │ upsert
                  ▼
┌─────────────────────────────────────────────────────┐
│  Supabase                                           │
│  story_cache table (JSONB)                          │
│  Caches manifests so repeat loads are < 5s         │
└─────────────────────────────────────────────────────┘
```

---

## Video Generation Flow

This is the primary feature. Here is the complete end-to-end flow:

1. **User selects a Bible event** — the app calls `/api/events/:id/story/meta` to check if a cached story exists.

2. **User clicks "Create story video"** — React calls `POST /api/events/:id/story`.

3. **Server generates content** (50-90 seconds, three Gemini calls):
   - **Text model** (`gemini-2.5-flash`) generates a story script: title, scripture reference, full narration (130-200 words), and 4 scenes each with a title, duration, caption, and image prompt.
   - **Image model** (`gemini-3.1-flash-image`) generates 4 illustrated Bible scenes in parallel from the image prompts. Returns base64 JPEG inline in the response. Requires `responseModalities: ['IMAGE', 'TEXT']`.
   - **TTS model** (`gemini-2.5-flash-preview-tts`) generates WAV narration audio from the full narration text. Returns raw PCM; the server wraps it in a RIFF/WAV header using `buildWav()`.

4. **Server returns the manifest** — a JSON object containing:
   - `scenes[].imageUrl` — base64 data URLs for each scene illustration
   - `audioUrl` — base64 data URL for the WAV narration
   - `title`, `reference`, `narration`, `quiz`, `event`

5. **Client renders the video** (browser-side, `makeStoryVideo.js`):
   - Creates an `AudioContext` **synchronously** (required by Chrome autoplay policy)
   - Decodes the WAV audio into an `AudioBuffer`
   - Loads all scene images into `HTMLImageElement` objects
   - Creates an off-screen 1280×720 canvas
   - Uses `canvas.captureStream(30fps)` + `MediaRecorder` to record the canvas
   - Mixes the audio stream into the recording
   - A `requestAnimationFrame` loop draws every frame: intro title card → scenes with Ken Burns zoom + crossfade transitions → outro card
   - When the timeline ends, `recorder.stop()` assembles the recorded chunks into a `Blob`
   - The video is shown in a `<video>` element and saved to IndexedDB for future page loads

6. **User downloads** the video as MP4 (Chrome/Edge) or WebM (Firefox).

For full technical details, see `video-generation-kit/README.md` and the numbered source files in that folder.

---

## Requirements

- Node.js 20+
- Google Gemini API key (from [Google AI Studio](https://aistudio.google.com))
- Supabase project (optional — for story caching)

---

## Setup

```bash
npm install
cp .env.example .env
```

Edit `.env`:

```env
GEMINI_API_KEY=your_google_ai_studio_api_key_here
GEMINI_IMAGE_MODEL=gemini-3.1-flash-image
GEMINI_TTS_MODEL=gemini-2.5-flash-preview-tts
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_KEY=your_supabase_service_key
PORT=8787
```

For the frontend (local dev only):

```bash
# sabai-bible/.env.development.local  (gitignored)
VITE_API_BASE=http://localhost:8787
```

> Leave `sabai-bible/.env` with `VITE_API_BASE=` empty. This ensures the Vite  
> production build uses relative `/api/...` paths and does not bake `localhost`  
> into the bundle.

---

## Run Locally

```bash
npm run dev
```

- Frontend: `http://localhost:5173`
- Backend API: `http://localhost:8787`
- Health check: `http://localhost:8787/api/health`

---

## Deploy to Vercel

The `vercel.json` at the repo root configures everything:

```json
{
  "buildCommand": "npm install --prefix . && cd sabai-bible && npm ci && npm run build",
  "outputDirectory": "sabai-bible/dist",
  "rewrites": [
    { "source": "/api/(.*)", "destination": "/api/$1" }
  ]
}
```

Set environment variables in the Vercel dashboard (Project → Settings → Environment Variables):
- `GEMINI_API_KEY`
- `GEMINI_IMAGE_MODEL`
- `SUPABASE_URL`
- `SUPABASE_SERVICE_KEY`

Do **not** set `VITE_API_BASE` in Vercel — it should remain empty so the frontend uses relative paths.

---

## Database Setup (Supabase)

Run `supabase/migrations/002_story_cache.sql` once in the Supabase Dashboard → SQL Editor. This creates the `story_cache` table where generated story manifests are stored.

---

## Demo Mode

If `GEMINI_API_KEY` is not set, the app still works:
- The event list, map, lineage, and people panels work normally
- Story generation uses SVG placeholders for images and no audio
- The video still renders (silent, with placeholder images)

---

## Key Files

```
api/
  _shared.js                 Gemini + Supabase client, WAV builder, retry logic
  events/[id]/
    story.js                 Core story generation API (text + images + TTS)
    story/meta.js            Cache status check
    content.js               AI-enhanced event content (separate feature)

sabai-bible/src/explore/
  BibleJourneyApp.jsx        Main React app + StoryPlayer component
  styles.css                 All UI styling
  utils/makeStoryVideo.js    Client-side video renderer
  data/bibleEvents.json      50 Bible events dataset

supabase/migrations/
  001_initial.sql            Base schema
  002_story_cache.sql        Story cache table

video-generation-kit/        Self-contained reference for the video pipeline
  README.md                  Detailed technical documentation
  01_server_shared.js        (annotated copy of api/_shared.js)
  02_server_story.js         (annotated copy of api/events/[id]/story.js)
  03_server_story_meta.js    (annotated copy of api/events/[id]/story/meta.js)
  04_client_makeStoryVideo.js (annotated copy of utils/makeStoryVideo.js)
  05_client_generateStory_and_StoryPlayer.jsx  (React video UI)
  06_database_story_cache.sql (Supabase migration)
```

---

## Common Issues

| Problem | Fix |
|---------|-----|
| "Could not reach the story server" | `VITE_API_BASE` is baked as `localhost` in build — empty it in `sabai-bible/.env` |
| Video has no audio | `AudioContext` created after an `await` — see `makeStoryVideo.js` comments |
| Images are SVG placeholders | `responseModalities: ['IMAGE', 'TEXT']` missing from Gemini image call |
| Supabase fails | `SUPABASE_URL` has `/rest/v1/` suffix — use only `https://<project>.supabase.co` |
| Story generation times out | Vercel free tier has 10s limit — upgrade to Pro for `maxDuration: 300` |
