# Bible Journey Map App

A complete React + Node prototype for an interactive Bible Journey Map tab.

## What it includes

- 50 major Bible events in `src/data/bibleEvents.json`
- Left chronological event list
- Center illustrated interactive map with clickable event markers
- Right-side lineage and people involved panels
- Bottom Bible timeline slider
- Gemini-powered event content generation
- Gemini-powered story package generation:
  - narration script
  - scene image prompts
  - generated scene images
  - generated voice narration
  - browser playback using images + voice as a story-video experience

## Requirements

- Node.js 20+
- A Gemini API key from Google AI Studio

## Setup

```bash
cd bible-journey-map-app
npm install
cp .env.example .env
```

Edit `.env`:

```env
GEMINI_API_KEY=your_google_ai_studio_api_key_here
PORT=8787
CLIENT_ORIGIN=http://localhost:5173
```

## Run locally

```bash
npm run dev
```

Open:

```text
http://localhost:5173
```

The backend runs at:

```text
http://localhost:8787
```

Health check:

```text
http://localhost:8787/api/health
```

## How to test the AI features

1. Open the app.
2. Select an event from the left panel.
3. Click **Generate AI Content** to create enhanced teaching content.
4. Click **Create Story Video** to generate:
   - scene plan
   - images
   - narration audio
5. Press **Play Narration** to play the generated image + voice story.

Generated files are saved in:

```text
server/generated/<event_id>/
```

Each story includes:

```text
story.json
scene-1.png / scene-1.svg
scene-2.png / scene-2.svg
scene-3.png / scene-3.svg
scene-4.png / scene-4.svg
narration.wav
```

## Demo mode

If `GEMINI_API_KEY` is not set, the app still works in demo mode:

- event list works
- map works
- lineage and people panels work
- story generation uses SVG placeholders
- audio may be unavailable

For full AI image and voice generation, add a valid Gemini API key.

## Important files

```text
src/App.jsx                  Main UI
src/styles.css               Full application styling
src/data/bibleEvents.json    App-ready 50 Bible event dataset
server/index.js              Express API + Gemini integration
.env.example                 Environment variable template
```

## Notes

This prototype creates a story-video style playback using generated images and generated narration audio. It does not require a video-rendering pipeline. Later, you can add server-side MP4 rendering with ffmpeg or use Veo for native generated video.
