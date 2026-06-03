# Bible Journey Map — Video Generation Kit

> **Audience:** Developers who need to understand, modify, or reuse the  
> AI-powered video generation pipeline from the Bible Journey Map app.  
> This kit contains only the files relevant to video generation — nothing else.

---

## What this kit contains

| # | File | Role |
|---|------|------|
| 01 | `01_server_shared.js` | Shared server utilities (Gemini AI client, Supabase client, WAV builder, retry logic) |
| 02 | `02_server_story.js` | **Core API** — generates story script + images + TTS audio; caches to Supabase |
| 03 | `03_server_story_meta.js` | Lightweight cache-status API (called before user clicks Generate) |
| 04 | `04_client_makeStoryVideo.js` | **Client-side video renderer** — Canvas + MediaRecorder + Web Audio API |
| 05 | `05_client_generateStory_and_StoryPlayer.jsx` | React component — UI, `generateStory()` fetch, video player |
| 06 | `06_database_story_cache.sql` | Supabase SQL migration to create the `story_cache` table |

---

## The Big Picture

```
User clicks "Create story video"
         │
         ▼
 React: generateStory()            ← FILE 05
  POST /api/events/:id/story       ← FILE 02
         │
         ├─ Check Supabase cache ──── cached? → return immediately
         │
         ├─ Gemini TEXT model        → story script (title, narration, 4 scenes)
         │
         ├─ Gemini IMAGE model × 4  → scene illustrations (parallel)
         │  (each returns base64 JPEG inside the API response)
         │
         └─ Gemini TTS model         → WAV audio narration (base64)
                  │
                  ▼
         Build manifest JSON  {title, scenes:[{imageUrl, narration}], audioUrl}
         Save to Supabase            ← FILE 06
         Return manifest to browser
                  │
                  ▼
 React: StoryPlayer receives manifest  ← FILE 05
 User clicks "Create Video"
         │
         ▼
 makeStoryVideo(manifest)              ← FILE 04
  • AudioContext (sync, before any await)
  • Decode WAV audio → AudioBuffer
  • Load 4 base64 images → HTMLImageElement[]
  • Build timeline: intro → scene1 → scene2 → ... → outro
  • canvas.captureStream(30fps) + MediaRecorder
  • Mix audio stream into recording
  • rAF loop: drawFrame() per frame
      - intro card (title + scripture reference)
      - scene: Ken Burns zoom + crossfade + caption text
      - outro card (scripture + branding)
      - progress bar overlay
  • recorder.stop() → Blob (WebM or MP4)
  • Save to IndexedDB
         │
         ▼
 <video src={URL.createObjectURL(blob)} controls />
 User can Download MP4/WebM
```

---

## Step-by-Step Flow

### Step 1 — User selects a Bible event

The app calls `GET /api/events/:id/story/meta` (**File 03**) immediately when an event is selected. This returns a tiny JSON:

```json
{ "cached": true, "sceneCount": 4, "hasAudio": true, "generatedAt": "2026-05-28T..." }
```

If `cached: true`, the UI shows a "Saved story" banner with "Load saved" / "New version" buttons. No Gemini API call is made yet.

---

### Step 2 — Story generation (server-side, ~60-90s)

When the user clicks **"Create story video"**, React calls `generateStory()` (**File 05**), which posts to `POST /api/events/:id/story`.

The serverless function (**File 02**) runs three Gemini calls:

#### 2A. Text model → story script

```
Model: gemini-2.5-flash
Input: Bible event JSON (title, era, references, people, summary, lesson)
Output: JSON with title, narration (130-200 words), 4 scene objects
        Each scene: { title, durationSec, narration, imagePrompt }
```

The `imagePrompt` in each scene is a detailed English prompt for the image model.

#### 2B. Image model → 4 illustrations (parallel)

```
Model: gemini-3.1-flash-image
Config: responseModalities: ['IMAGE', 'TEXT']   ← REQUIRED
Input: imagePrompt + art-direction prefix
Output: base64 JPEG inline in response
```

> **Why `responseModalities: ['IMAGE', 'TEXT']`?**  
> Without this config, Gemini defaults to text-only output even when an image model is used. This must be explicitly set or the API returns empty results.

Each image is ~200-400 KB base64 encoded and returned as a `data:image/jpeg;base64,...` URL.

#### 2C. TTS model → WAV narration

```
Model: gemini-2.5-flash-preview-tts
Voice: Kore (warm, calm documentary narrator)
Config: responseModalities: ['AUDIO']
Input: the full narration text
Output: raw PCM audio bytes
```

Gemini TTS returns raw PCM (not a WAV file). The `buildWav()` function in **File 01** wraps it in a 44-byte RIFF/WAV header so browsers can play it. The sample rate is parsed from the response's `mimeType` field (e.g. `audio/pcm;rate=24000`).

#### 2D. Result manifest

The server assembles everything into a manifest:

```json
{
  "mode": "gemini",
  "eventId": "call_of_abraham",
  "title": "The Call of Abraham",
  "reference": "Genesis 12:1-9",
  "narration": "In the land of Ur...",
  "audioUrl": "data:audio/wav;base64,...",
  "scenes": [
    {
      "title": "The Divine Call",
      "durationSec": 8,
      "narration": "God speaks to Abram...",
      "imageUrl": "data:image/jpeg;base64,..."
    }
    // ... 3 more scenes
  ],
  "quiz": [...]
}
```

This manifest is saved to Supabase (`story_cache` table — **File 06**) and returned to the browser.

---

### Step 3 — Client-side video rendering (File 04)

Once the React component receives the manifest, the user clicks **"Create Video"**. This calls `makeStoryVideo(story, onProgress)`.

#### Critical: AudioContext timing

```javascript
// MUST be synchronous — before ANY await
const audioCtx = new AudioContext();

// Only then do async work:
const images = await Promise.all(scenes.map(s => loadImg(s.imageUrl)));
const audioBuffer = await decodeAudio(story.audioUrl, audioCtx);
```

Chrome/Edge's autoplay policy suspends any `AudioContext` created after an `await` (even a tiny one). Creating it synchronously — in the direct call stack of the button click handler — guarantees it starts in the `running` state.

#### Timeline segments

```
0s              2.5s                           (2.5 + scene durations)s
|── intro ───────|── scene 1 ──|── scene 2 ──| ... |── outro ──|
```

If the audio duration differs from the sum of `durationSec` values, all scene durations are scaled proportionally so the video and audio end at the same time.

#### Canvas rendering (per frame)

Each call to `drawFrame()` handles three segment types:

| Segment | What gets drawn |
|---------|----------------|
| `intro` | Dark background, gold divider bars, event title, scripture reference, fade in/out |
| `scene` | Ken Burns zoom (100%→108%), crossfade between scenes, bottom gradient, scene title + caption text, scene counter |
| `outro` | Dark background, scripture reference, branding, fade out |

A thin gradient progress bar is drawn at the very bottom of every frame.

#### Recording stream

```javascript
const vidStream = canvas.captureStream(30);
const audioDestNode = audioCtx.createMediaStreamDestination();
audioSrcNode.connect(audioDestNode);
// Delay audio start by INTRO_S so it doesn't play during the title card
audioSrcNode.start(audioCtx.currentTime + INTRO_S);

const recStream = new MediaStream([
  ...vidStream.getVideoTracks(),
  ...audioDestNode.stream.getAudioTracks()
]);

const recorder = new MediaRecorder(recStream, {
  mimeType: 'video/mp4',   // falls back to webm on Firefox
  videoBitsPerSecond: 5_000_000
});
```

#### Background tab handling

`requestAnimationFrame` freezes when a tab is not in focus (Chrome throttles it). A `setInterval` running at 1 fps acts as a backup to keep canvas frames being produced even when the tab is in the background.

#### Output

When the timeline ends, `recorder.stop()` is called. The accumulated chunks are assembled into a `Blob`. The extension is `mp4` or `webm` depending on what `MediaRecorder.isTypeSupported()` returned.

The Blob is:
1. Shown in a `<video>` element via `URL.createObjectURL(blob)`
2. Saved to IndexedDB (`saveVideoLocally`) so it survives page refresh
3. Available for download via `<a download>`

---

## Environment Variables

| Variable | Where | Purpose |
|----------|-------|---------|
| `GEMINI_API_KEY` | Vercel / `.env` | Gemini API access (required) |
| `GEMINI_TEXT_MODEL` | Vercel / `.env` | Override text model (default: `gemini-2.5-flash`) |
| `GEMINI_IMAGE_MODEL` | Vercel / `.env` | Override image model (default: `gemini-3.1-flash-image`) |
| `GEMINI_TTS_MODEL` | Vercel / `.env` | Override TTS model (default: `gemini-2.5-flash-preview-tts`) |
| `GEMINI_TTS_VOICE` | Vercel / `.env` | TTS voice name (default: `Kore`) |
| `SUPABASE_URL` | Vercel / `.env` | `https://<project>.supabase.co` — NO `/rest/v1` suffix |
| `SUPABASE_SERVICE_KEY` | Vercel / `.env` | Supabase service role key (for server writes) |
| `VITE_API_BASE` | `sabai-bible/.env` | Leave EMPTY for Vercel; set to `http://localhost:8787` for local dev |

---

## Database Setup

Run **File 06** once in your Supabase Dashboard → SQL Editor:

```sql
-- Creates story_cache table with RLS policies
-- Safe to run multiple times (uses IF NOT EXISTS / DROP IF EXISTS)
```

The `story_data` column stores the full manifest as JSONB (typically 3-7 MB per event). PostgreSQL JSONB handles this well but Supabase's default row size limits apply.

---

## Deployment (Vercel)

The API files live at `api/events/[id]/story.js` and `api/events/[id]/story/meta.js`. Vercel maps these to:

- `POST /api/events/call_of_abraham/story`
- `GET  /api/events/call_of_abraham/story/meta`

The `vercel.json` rewrite rule `"/api/(.*)" → "/api/$1"` ensures these routes are handled by the serverless functions and not the SPA fallback.

**Build command** (from `vercel.json`):
```bash
npm install --prefix . && cd sabai-bible && npm ci && npm run build
```

The frontend Vite build produces `sabai-bible/dist/` which Vercel serves as static assets. The `VITE_API_BASE` env var must be empty (or unset) in the Vercel environment so the frontend uses relative `/api/...` paths.

---

## Common Issues & Fixes

| Problem | Root Cause | Fix |
|---------|-----------|-----|
| Video renders silently (no audio) | `AudioContext` created after an `await` — browser suspends it | Create `AudioContext` synchronously before any `await` in the button handler |
| Image model returns text, no image bytes | Missing `responseModalities: ['IMAGE', 'TEXT']` in config | Add the config field (File 02, line 73) |
| TTS audio is garbled / wrong speed | `buildWav` using wrong sample rate | Parse `sampleRate` from `mimeType` field of TTS response (e.g. `audio/pcm;rate=24000`) |
| Supabase client fails to initialize | `SUPABASE_URL` contains `/rest/v1/` suffix | Strip the suffix — `getSupabase()` does this automatically |
| Story API returns `localhost` error in browser | `VITE_API_BASE=http://localhost:8787` baked into Vite bundle | Empty `sabai-bible/.env`; put localhost URL only in `sabai-bible/.env.development.local` |
| `MediaRecorder` not found | Safari / older browser | Show "use Chrome/Edge" message — check `isVideoSupported()` before calling `makeStoryVideo()` |
| Video pauses/freezes in background tab | `rAF` throttled by browser | The `setInterval` backup in `makeStoryVideo` handles this — keep tab in foreground for best quality |

---

## Extending the Pipeline

### Add more scenes
Change `sceneCount` in the `generateStory()` fetch call (File 05). The API accepts 3–6 scenes.

### Change the TTS voice
Set `GEMINI_TTS_VOICE` environment variable. Available voices: `Kore`, `Charon`, `Fenrir`, `Aoede`, `Puck`.

### Change art style
Edit the `fullPrompt` prefix in `generateImage()` (File 02, line 67). Currently uses "premium illustrated Bible storybook, parchment palette, warm golden-hour light".

### Force regeneration (bypass cache)
Send `{ force: true }` in the POST body. Used by the "New version" button in the UI.

### Video resolution
Change `W` and `H` constants in File 04 (currently `1280 × 720`).

### Video bitrate
Change `videoBitsPerSecond` in the `MediaRecorder` options in File 04 (currently `5_000_000` = 5 Mbps).

---

## File Reading Order for New Developers

1. Read this README fully
2. Read **File 01** to understand shared utilities
3. Read **File 02** to understand what the server generates and returns
4. Read **File 04** to understand how the browser turns that data into a video
5. Read **File 05** to understand how the React UI wires it all together
6. Run **File 06** in Supabase if you're setting up caching

Files **03** is a minor supporting file you can read last.
