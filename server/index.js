import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import fs from 'node:fs/promises';
import fssync from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { GoogleGenAI } from '@google/genai';
import { renderStoryMp4 } from './storyVideoExport.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, '..');
const DATA_PATH = path.join(ROOT, 'src', 'data', 'bibleEvents.json');
const TIMELINE_JSON_PATH = path.join(ROOT, 'public', 'data', 'complete_bible_timeline_events.json');
const GENERATED_DIR = path.join(__dirname, 'generated');
const PORT = Number(process.env.PORT || 8787);

const TEXT_MODEL = process.env.GEMINI_TEXT_MODEL || 'gemini-2.5-flash';
const IMAGE_MODEL = process.env.GEMINI_IMAGE_MODEL || 'gemini-2.0-flash-exp-image-generation';
const TTS_MODEL = process.env.GEMINI_TTS_MODEL || 'gemini-2.5-flash-preview-tts';
const TTS_VOICE = process.env.GEMINI_TTS_VOICE || 'Kore';

const app = express();
app.use(cors({ origin: process.env.CLIENT_ORIGIN || '*' }));
app.use(express.json({ limit: '20mb' }));
app.use('/generated', express.static(GENERATED_DIR));

let ai = null;
if (process.env.GEMINI_API_KEY) {
  ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
}

async function loadEvents() {
  const raw = await fs.readFile(DATA_PATH, 'utf-8');
  return JSON.parse(raw);
}

function slugify(value) {
  return String(value).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

function getText(response) {
  if (response?.text) return response.text;
  const parts = response?.candidates?.[0]?.content?.parts || response?.parts || [];
  return parts.map((p) => p.text || '').join('\n').trim();
}

function extractJson(text) {
  const clean = String(text || '').replace(/```json|```/g, '').trim();
  const start = clean.indexOf('{');
  const end = clean.lastIndexOf('}');
  if (start === -1 || end === -1) throw new Error('Gemini response did not include JSON.');
  return JSON.parse(clean.slice(start, end + 1));
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/** Google GenAI often returns 503 UNAVAILABLE or 429 when capacity is spiked — retryable. */
function isTransientGeminiError(err) {
  const status = err?.status ?? err?.error?.code ?? err?.cause?.status;
  if (status === 429 || status === 503) return true;
  const msg = `${err?.message || ''} ${err?.error?.message || ''} ${JSON.stringify(err?.error || {})}`;
  return /UNAVAILABLE|RESOURCE_EXHAUSTED|DEADLINE_EXCEEDED|overloaded|try again later|503|429|high demand/i.test(msg);
}

/**
 * @template T
 * @param {() => Promise<T>} fn
 * @param {string} label
 */
async function withGeminiRetry(fn, label, { maxAttempts = 5, baseDelayMs = 900, maxDelayMs = 20000 } = {}) {
  let lastErr;
  for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
    try {
      return await fn();
    } catch (err) {
      lastErr = err;
      const retry = attempt < maxAttempts && isTransientGeminiError(err);
      if (!retry) throw err;
      const backoff = Math.min(maxDelayMs, baseDelayMs * 2 ** (attempt - 1) + Math.random() * 500);
      console.warn(`[gemini] ${label}: attempt ${attempt}/${maxAttempts} failed (${String(err?.message || err).slice(0, 140)}), retry in ${Math.round(backoff)}ms`);
      await sleep(backoff);
    }
  }
  throw lastErr;
}

async function ensureDir(dir) {
  await fs.mkdir(dir, { recursive: true });
}

function escapeXml(s = '') {
  return String(s)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;');
}

async function writePlaceholderSvg(filePath, title, subtitle, sceneIndex) {
  const gradientId = `g${sceneIndex}`;
  const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="1280" height="720" viewBox="0 0 1280 720">
  <defs>
    <linearGradient id="${gradientId}" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#0f4a4a"/>
      <stop offset="0.45" stop-color="#c99a36"/>
      <stop offset="1" stop-color="#f6ead3"/>
    </linearGradient>
    <filter id="shadow"><feDropShadow dx="0" dy="18" stdDeviation="18" flood-opacity="0.22"/></filter>
  </defs>
  <rect width="1280" height="720" fill="url(#${gradientId})"/>
  <circle cx="1020" cy="130" r="130" fill="#fff7e6" opacity="0.28"/>
  <path d="M0 590 C210 510 360 635 540 560 C740 470 865 610 1280 510 L1280 720 L0 720 Z" fill="#2e625c" opacity="0.55"/>
  <path d="M0 640 C280 570 500 690 770 600 C950 540 1080 620 1280 590 L1280 720 L0 720 Z" fill="#173f3d" opacity="0.45"/>
  <g filter="url(#shadow)">
    <rect x="140" y="150" width="1000" height="420" rx="34" fill="#fff9eb" opacity="0.94"/>
    <text x="640" y="285" text-anchor="middle" font-family="Georgia, serif" font-size="58" fill="#103f3f" font-weight="700">${escapeXml(title)}</text>
    <text x="640" y="360" text-anchor="middle" font-family="Arial, sans-serif" font-size="28" fill="#5d4a31">${escapeXml(subtitle)}</text>
    <text x="640" y="440" text-anchor="middle" font-family="Arial, sans-serif" font-size="22" fill="#8b6b2d">Generated placeholder scene ${sceneIndex}</text>
  </g>
</svg>`;
  await fs.writeFile(filePath, svg, 'utf8');
}

function buildWav(pcmBuffer, { channels = 1, sampleRate = 24000, bitsPerSample = 16 } = {}) {
  const byteRate = (sampleRate * channels * bitsPerSample) / 8;
  const blockAlign = (channels * bitsPerSample) / 8;
  const wav = Buffer.alloc(44 + pcmBuffer.length);
  wav.write('RIFF', 0);
  wav.writeUInt32LE(36 + pcmBuffer.length, 4);
  wav.write('WAVE', 8);
  wav.write('fmt ', 12);
  wav.writeUInt32LE(16, 16);
  wav.writeUInt16LE(1, 20);
  wav.writeUInt16LE(channels, 22);
  wav.writeUInt32LE(sampleRate, 24);
  wav.writeUInt32LE(byteRate, 28);
  wav.writeUInt16LE(blockAlign, 32);
  wav.writeUInt16LE(bitsPerSample, 34);
  wav.write('data', 36);
  wav.writeUInt32LE(pcmBuffer.length, 40);
  pcmBuffer.copy(wav, 44);
  return wav;
}

function fallbackStory(event) {
  const scenes = [
    {
      title: 'Setting the Scene',
      durationSec: 6,
      narration: `${event.title} takes place in ${event.mapLocation}.`,
      imagePrompt: `Illustrated biblical map scene for ${event.title} in ${event.mapLocation}`
    },
    {
      title: 'The Main Event',
      durationSec: 8,
      narration: event.summary,
      imagePrompt: `Biblical story illustration of ${event.title}, warm cinematic educational style`
    },
    {
      title: 'People Involved',
      durationSec: 7,
      narration: `Key people include ${event.mainPeople.join(', ')}.`,
      imagePrompt: `Character-focused illustration of ${event.mainPeople.slice(0, 3).join(', ')} in ${event.title}`
    },
    {
      title: 'Lesson',
      durationSec: 7,
      narration: event.lesson,
      imagePrompt: `Symbolic hopeful Bible lesson scene for ${event.title}`
    }
  ];
  return {
    title: event.title,
    reference: event.references.join('; '),
    narration: scenes.map((s) => s.narration).join(' '),
    scenes,
    quiz: [
      { question: `Where did ${event.title} happen?`, answer: event.mapLocation },
      { question: 'What is the main lesson?', answer: event.lesson }
    ]
  };
}

async function generateStoryPlan(event, sceneCount = 4) {
  if (!ai) return fallbackStory(event);
  const prompt = `You are building an educational Bible app feature called Bible Journey Map.
Return ONLY valid JSON. No markdown.
Create a short story-video plan for this Bible event.

Event data:
${JSON.stringify(event, null, 2)}

Required JSON shape:
{
  "title": "string",
  "reference": "string",
  "narration": "single complete narration transcript, 120-190 words, reverent and clear",
  "scenes": [
    {"title":"string", "durationSec": number, "narration":"1-2 sentences", "imagePrompt":"detailed 16:9 illustrated biblical scene prompt, warm spiritual educational style, no gore, no modern objects"}
  ],
  "quiz": [
    {"question":"string", "answer":"string"}
  ]
}

Create exactly ${sceneCount} scenes. Keep all facts aligned with the references. Do not add speculative doctrine.`;
  const response = await withGeminiRetry(
    () => ai.models.generateContent({ model: TEXT_MODEL, contents: prompt }),
    'generateStoryPlan'
  );
  return extractJson(getText(response));
}

async function generateImage(prompt, outFile) {
  if (!ai) return false;
  const safePrompt = `${prompt}\nCreate one 16:9 image. Style: premium illustrated Bible storybook map/app visual, warm parchment palette, cinematic lighting, respectful, educational, no text overlays.`;
  const response = await withGeminiRetry(
    () =>
      ai.models.generateContent({
        model: IMAGE_MODEL,
        contents: safePrompt,
        config: {
          responseModalities: ['IMAGE', 'TEXT']
        }
      }),
    'generateImage'
  );
  const parts = response?.candidates?.[0]?.content?.parts || response?.parts || [];
  const imagePart = parts.find((p) => p.inlineData || p.inline_data);
  const inline = imagePart?.inlineData || imagePart?.inline_data;
  if (!inline?.data) return false;
  const imageBuffer = Buffer.from(inline.data, 'base64');
  await fs.writeFile(outFile, imageBuffer);
  return true;
}

async function generateTts(text, outFile) {
  if (!ai) return false;
  const response = await withGeminiRetry(
    () =>
      ai.models.generateContent({
        model: TTS_MODEL,
        contents: `Say in a warm, calm, reverent Bible documentary narrator voice:\n${text}`,
        config: {
          responseModalities: ['AUDIO'],
          speechConfig: {
            voiceConfig: {
              prebuiltVoiceConfig: {
                voiceName: TTS_VOICE
              }
            }
          }
        }
      }),
    'generateTts'
  );
  const parts = response?.candidates?.[0]?.content?.parts || response?.parts || [];
  const audioPart = parts.find((p) => p.inlineData || p.inline_data);
  const inline = audioPart?.inlineData || audioPart?.inline_data;
  if (!inline?.data) return false;
  let audioBuffer = Buffer.from(inline.data, 'base64');
  const mime = inline.mimeType || inline.mime_type || '';
  if (!mime.includes('wav') && !audioBuffer.subarray(0, 4).equals(Buffer.from('RIFF'))) {
    const rateMatch = mime.match(/rate=(\d+)/i);
    const sampleRate = rateMatch ? parseInt(rateMatch[1], 10) : 24000;
    audioBuffer = buildWav(audioBuffer, { sampleRate });
  }
  await fs.writeFile(outFile, audioBuffer);
  return true;
}

app.get('/api/health', (_req, res) => {
  res.json({
    ok: true,
    geminiConfigured: Boolean(process.env.GEMINI_API_KEY),
    models: { text: TEXT_MODEL, image: IMAGE_MODEL, tts: TTS_MODEL, voice: TTS_VOICE }
  });
});

app.get('/api/events', async (_req, res) => {
  const events = await loadEvents();
  res.json(events);
});

app.get('/api/events/:id', async (req, res) => {
  const events = await loadEvents();
  const event = events.find((e) => e.id === req.params.id);
  if (!event) return res.status(404).json({ error: 'Event not found' });
  res.json(event);
});

app.post('/api/events/:id/content', async (req, res) => {
  try {
    const events = await loadEvents();
    const event = events.find((e) => e.id === req.params.id);
    if (!event) return res.status(404).json({ error: 'Event not found' });

    if (!ai) {
      return res.json({
        mode: 'demo-fallback',
        title: event.title,
        teachingSummary: event.details,
        applicationLesson: event.lesson,
        mapExplanation: `${event.title} is mapped around ${event.mapLocation}.`,
        discussionQuestions: [
          `What happens in ${event.title}?`,
          `Who is involved in ${event.title}?`,
          `What lesson does this event teach?`
        ]
      });
    }

    const prompt = `Return only valid JSON. Build enriched app content for this Bible event, suitable for a family/teacher Bible app. Keep it reverent and reference-based.
Event: ${JSON.stringify(event, null, 2)}
JSON shape:
{
 "teachingSummary":"150-220 words",
 "mapExplanation":"where it appears on the map and why",
 "lineageExplanation":"how this event connects to the broader Bible story",
 "applicationLesson":"practical lesson in 2-3 sentences",
 "discussionQuestions":["question", "question", "question"],
 "quiz":[{"question":"string","options":["A","B","C","D"],"answer":"string"}],
 "visualPrompts":["image prompt 1", "image prompt 2", "image prompt 3"]
}`;
    const response = await withGeminiRetry(
      () => ai.models.generateContent({ model: TEXT_MODEL, contents: prompt }),
      'eventContent'
    );
    res.json({ mode: 'gemini', ...extractJson(getText(response)) });
  } catch (err) {
    console.error(err);
    const transient = isTransientGeminiError(err);
    const status = transient ? 503 : 500;
    const message = transient
      ? "Google's AI is temporarily busy (high demand). Wait a minute and try again, or use a cached story if you have one."
      : err.message || 'Server error';
    res.status(status).json({ error: message, transient, code: err?.status || err?.error?.code });
  }
});

app.get('/api/events/:id/story/meta', async (req, res) => {
  try {
    const events = await loadEvents();
    const event = events.find((e) => e.id === req.params.id);
    if (!event) return res.status(404).json({ error: 'Event not found' });
    const manifestPath = path.join(GENERATED_DIR, event.id, 'story.json');
    if (!fssync.existsSync(manifestPath)) {
      return res.json({ cached: false, eventId: event.id });
    }
    const raw = JSON.parse(await fs.readFile(manifestPath, 'utf-8'));
    res.json({
      cached: true,
      eventId: event.id,
      generatedAt: raw.generatedAt || null,
      sceneCount: Array.isArray(raw.scenes) ? raw.scenes.length : 0,
      hasAudio: Boolean(raw.audioUrl),
      title: raw.title || event.title,
      reference: raw.reference || '',
      mode: raw.mode || 'unknown'
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/events/:id/story', async (req, res) => {
  try {
    const events = await loadEvents();
    const event = events.find((e) => e.id === req.params.id);
    if (!event) return res.status(404).json({ error: 'Event not found' });
    const manifestPath = path.join(GENERATED_DIR, event.id, 'story.json');
    if (!fssync.existsSync(manifestPath)) {
      return res.status(404).json({ error: 'No cached story', cached: false });
    }
    const existing = JSON.parse(await fs.readFile(manifestPath, 'utf-8'));
    res.json(existing);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/events/:id/story-video.mp4', async (req, res) => {
  let outPath = null;
  try {
    const events = await loadEvents();
    const event = events.find((e) => e.id === req.params.id);
    if (!event) return res.status(404).json({ error: 'Event not found' });

    const eventDir = path.join(GENERATED_DIR, event.id);
    const manifestPath = path.join(eventDir, 'story.json');
    if (!fssync.existsSync(manifestPath)) {
      return res.status(404).json({ error: 'No cached story' });
    }
    const manifest = JSON.parse(await fs.readFile(manifestPath, 'utf-8'));

    outPath = path.join(os.tmpdir(), `bj-story-${event.id}-${Date.now()}.mp4`);
    await renderStoryMp4({ eventDir, manifest, outPath });

    const filename = `${slugify(event.title || event.id)}-story.mp4`;
    res.download(outPath, filename, (err) => {
      fs.unlink(outPath).catch(() => {});
      if (err) console.error('[story-video]', err.message);
    });
  } catch (err) {
    if (outPath) await fs.unlink(outPath).catch(() => {});
    console.error('[story-video]', err);
    const code = err.code;
    if (code === 'FFMPEG_MISSING') return res.status(503).json({ error: err.message });
    if (
      code === 'NO_AUDIO' ||
      code === 'NO_SCENES' ||
      code === 'MISSING_IMAGE' ||
      code === 'BAD_MANIFEST' ||
      code === 'BAD_AUDIO' ||
      code === 'FFPROBE_FAILED'
    ) {
      return res.status(400).json({ error: err.message });
    }
    if (!res.headersSent) res.status(500).json({ error: err.message || 'Export failed' });
  }
});

app.post('/api/events/:id/story', async (req, res) => {
  try {
    const sceneCount = Math.min(Math.max(Number(req.body?.sceneCount || 4), 3), 6);
    const force = Boolean(req.body?.force);
    const events = await loadEvents();
    const event = events.find((e) => e.id === req.params.id);
    if (!event) return res.status(404).json({ error: 'Event not found' });

    const eventDir = path.join(GENERATED_DIR, event.id);
    const manifestPath = path.join(eventDir, 'story.json');
    await ensureDir(eventDir);

    if (!force && fssync.existsSync(manifestPath)) {
      const existing = JSON.parse(await fs.readFile(manifestPath, 'utf-8'));
      return res.json(existing);
    }

    const story = await generateStoryPlan(event, sceneCount);
    const scenes = [];

    for (let i = 0; i < story.scenes.length; i += 1) {
      const scene = story.scenes[i];
      const imageName = `scene-${i + 1}.png`;
      const imagePath = path.join(eventDir, imageName);
      let imageOk = false;
      try {
        imageOk = await generateImage(scene.imagePrompt, imagePath);
      } catch (err) {
        console.warn('Image generation failed. Using placeholder.', err.message);
      }
      if (!imageOk) {
        const svgName = `scene-${i + 1}.svg`;
        const svgPath = path.join(eventDir, svgName);
        await writePlaceholderSvg(svgPath, scene.title || event.title, event.references.join(', '), i + 1);
        scenes.push({ ...scene, imageUrl: `/generated/${event.id}/${svgName}` });
      } else {
        scenes.push({ ...scene, imageUrl: `/generated/${event.id}/${imageName}` });
      }
    }

    const audioPath = path.join(eventDir, 'narration.wav');
    let audioUrl = null;
    try {
      const audioOk = await generateTts(story.narration, audioPath);
      if (audioOk) audioUrl = `/generated/${event.id}/narration.wav`;
    } catch (err) {
      console.warn('TTS failed. Continuing without generated audio.', err.message);
    }

    const manifest = {
      mode: ai ? 'gemini' : 'demo-fallback',
      eventId: event.id,
      generatedAt: new Date().toISOString(),
      title: story.title || event.title,
      reference: story.reference || event.references.join(', '),
      narration: story.narration,
      audioUrl,
      scenes,
      quiz: story.quiz || [],
      event
    };
    await fs.writeFile(manifestPath, JSON.stringify(manifest, null, 2), 'utf-8');
    res.json(manifest);
  } catch (err) {
    console.error(err);
    const transient = isTransientGeminiError(err);
    const status = transient ? 503 : 500;
    const message = transient
      ? "Google's AI is temporarily busy (high demand). The server already retried several times — wait a minute and press create again, or load a saved story."
      : err.message || 'Story generation failed';
    res.status(status).json({ error: message, transient, code: err?.status || err?.error?.code });
  }
});

function buildEventCardImagePrompt(event) {
  return `Wide cinematic landscape illustration for a Bible atlas app hero background (no text, no letters, no watermark).
Subject: ${event.title}
Location: ${event.mapLocation || 'biblical lands'}
Era: ${event.era || 'biblical'}
Style: premium illustrated Bible storybook / parchment map aesthetic, warm golden-hour light, soft painterly detail, reverent and educational, no gore, no modern objects or people in contemporary dress.`;
}

app.get('/api/events/:id/event-card', async (req, res) => {
  try {
    const events = await loadEvents();
    const event = events.find((e) => e.id === req.params.id);
    if (!event) return res.status(404).json({ error: 'Event not found' });
    const eventDir = path.join(GENERATED_DIR, event.id);
    const metaPath = path.join(eventDir, 'event-card.json');
    const pngPath = path.join(eventDir, 'event-card.png');
    const svgPath = path.join(eventDir, 'event-card.svg');
    let imageUrl = null;
    if (fssync.existsSync(pngPath)) imageUrl = `/generated/${event.id}/event-card.png`;
    else if (fssync.existsSync(svgPath)) imageUrl = `/generated/${event.id}/event-card.svg`;
    if (imageUrl) {
      let meta = {};
      try {
        if (fssync.existsSync(metaPath)) meta = JSON.parse(await fs.readFile(metaPath, 'utf8'));
      } catch {
        /* ignore */
      }
      return res.json({ cached: true, ...(meta || {}), imageUrl });
    }
    return res.json({ cached: false, imageUrl: null });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/events/:id/event-card', async (req, res) => {
  try {
    const force = Boolean(req.body?.force);
    const events = await loadEvents();
    const event = events.find((e) => e.id === req.params.id);
    if (!event) return res.status(404).json({ error: 'Event not found' });
    const eventDir = path.join(GENERATED_DIR, event.id);
    await ensureDir(eventDir);
    const pngPath = path.join(eventDir, 'event-card.png');
    const svgPath = path.join(eventDir, 'event-card.svg');
    const metaPath = path.join(eventDir, 'event-card.json');
    if (!force && fssync.existsSync(pngPath)) {
      const meta = fssync.existsSync(metaPath) ? JSON.parse(await fs.readFile(metaPath, 'utf8')) : {};
      return res.json({ cached: true, imageUrl: `/generated/${event.id}/event-card.png`, ...meta });
    }
    if (!force && fssync.existsSync(svgPath)) {
      const meta = fssync.existsSync(metaPath) ? JSON.parse(await fs.readFile(metaPath, 'utf8')) : {};
      return res.json({ cached: true, imageUrl: `/generated/${event.id}/event-card.svg`, ...meta });
    }
    if (fssync.existsSync(pngPath)) await fs.unlink(pngPath).catch(() => {});
    if (fssync.existsSync(svgPath)) await fs.unlink(svgPath).catch(() => {});
    if (fssync.existsSync(metaPath)) await fs.unlink(metaPath).catch(() => {});

    const prompt = buildEventCardImagePrompt(event);
    let imageOk = false;
    if (ai) {
      try {
        imageOk = await generateImage(prompt, pngPath);
      } catch (err) {
        console.warn('[event-card] Gemini image failed', err.message);
      }
    }
    if (!imageOk) {
      await writePlaceholderSvg(svgPath, event.title, event.mapLocation || event.era || '', 1);
      const meta = {
        generatedAt: new Date().toISOString(),
        mode: ai ? 'placeholder' : 'demo',
        imageUrl: `/generated/${event.id}/event-card.svg`
      };
      await fs.writeFile(metaPath, JSON.stringify(meta, null, 2), 'utf8');
      return res.json(meta);
    }
    const meta = {
      generatedAt: new Date().toISOString(),
      mode: 'gemini',
      imageUrl: `/generated/${event.id}/event-card.png`
    };
    await fs.writeFile(metaPath, JSON.stringify(meta, null, 2), 'utf8');
    res.json(meta);
  } catch (err) {
    console.error(err);
    const transient = isTransientGeminiError(err);
    const status = transient ? 503 : 500;
    res.status(status).json({
      error: err.message || 'Event card generation failed',
      transient,
      code: err?.status || err?.error?.code
    });
  }
});

async function loadTimelineBundle() {
  const raw = await fs.readFile(TIMELINE_JSON_PATH, 'utf-8');
  return JSON.parse(raw);
}

function buildTimelineExplainPrompt(event, mode) {
  const modeLine =
    mode === 'kids'
      ? 'Write for children (ages 8–12): simple words, short sentences.'
      : mode === 'pastor'
        ? 'Write for pastors: concise exegesis-aware notes, still accessible.'
        : mode === 'study'
          ? 'Write for adult Bible study: clear and structured.'
          : 'Write for a general audience: clear and reverent.';
  return `You are generating Bible study content for a Bible timeline application.

Use only the event data and Bible references provided.
Do not invent unsupported details.
If the date is approximate, say it is approximate.
Explain clearly for a general Bible study audience.
${modeLine}

Event:
Title: ${event.title}
Date: ${event.dateLabel}
Era: ${event.eraGroup}
Reference: ${event.referenceText}
Testament: ${event.scriptureTestament}
References: ${(event.references || []).join('; ')}

Return valid JSON only:
{
  "summary": "2-3 sentence explanation of the event.",
  "whyItMatters": "Explain why this event matters in the Bible story.",
  "historicalContext": "Brief historical or biblical context.",
  "spiritualLesson": "A practical faith lesson.",
  "keyPeople": ["..."],
  "keyPlaces": ["..."],
  "crossReferences": ["..."],
  "discussionQuestions": ["..."]
}`;
}

function buildTimelineStoryPrompt(events, audience, duration) {
  const slice = events.slice(0, Math.min(24, events.length));
  return `You are building a guided Bible timeline "story mode" sequence for an educational app.
Ground content ONLY in the provided event titles and references. Do not invent unsupported historical claims.
Audience: ${audience}. Length: ${duration} (short = fewer scenes, medium = more).

Events JSON:
${JSON.stringify(
    slice.map((e) => ({
      id: e.id,
      title: e.title,
      dateLabel: e.dateLabel,
      eraGroup: e.eraGroup,
      referenceText: e.referenceText,
      references: e.references
    })),
    null,
    2
  )}

Return valid JSON only:
{
  "title": "string",
  "narration": "one paragraph overview",
  "scenes": [
    {
      "eventId": "string",
      "title": "string",
      "imagePrompt": "string",
      "voiceText": "1-3 sentences for narration",
      "scriptureReference": "string"
    }
  ]
}`;
}

app.get('/api/timeline/events', async (_req, res) => {
  try {
    const bundle = await loadTimelineBundle();
    res.json(bundle);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message || 'Timeline load failed' });
  }
});

app.post('/api/timeline/explain', async (req, res) => {
  try {
    const event = req.body?.event;
    const mode = req.body?.mode || 'simple';
    if (!event || !event.title) return res.status(400).json({ error: 'Missing event' });

    if (!ai) {
      return res.json({
        mode: 'demo-fallback',
        summary: `${event.title} is recorded in Scripture (${event.referenceText || (event.references || []).join(', ') || 'see references'}). Dates in ancient narratives are often approximate.`,
        whyItMatters: 'This moment contributes to the unfolding story of God’s dealings with humanity and with his people.',
        historicalContext: 'Place this passage in its literary and historical context using trusted commentaries.',
        spiritualLesson: 'Let the text shape how you trust and obey God today.',
        keyPeople: [],
        keyPlaces: [],
        crossReferences: event.references || [],
        discussionQuestions: [`What does ${event.title} teach about God?`, 'How does this connect to later Scripture?']
      });
    }

    const prompt = buildTimelineExplainPrompt(event, mode);
    const response = await withGeminiRetry(
      () => ai.models.generateContent({ model: TEXT_MODEL, contents: prompt }),
      'timelineExplain'
    );
    res.json({ mode: 'gemini', ...extractJson(getText(response)) });
  } catch (err) {
    console.error(err);
    const transient = isTransientGeminiError(err);
    res.status(transient ? 503 : 500).json({ error: err.message || 'Explain failed', transient });
  }
});

app.post('/api/timeline/story-mode', async (req, res) => {
  try {
    const events = req.body?.events;
    const audience = req.body?.audience || 'general';
    const duration = req.body?.duration || 'short';
    if (!Array.isArray(events) || events.length === 0) {
      return res.status(400).json({ error: 'events array required' });
    }

    if (!ai) {
      const scenes = events.slice(0, duration === 'medium' ? 12 : 6).map((e) => ({
        eventId: e.id,
        title: e.title,
        imagePrompt: `Illustrated biblical scene: ${e.title}`,
        voiceText: `${e.title}. ${e.referenceText || ''}`,
        scriptureReference: e.referenceText || (e.references || [])[0] || ''
      }));
      return res.json({
        mode: 'demo-fallback',
        title: 'Guided timeline walk',
        narration: scenes.map((s) => s.voiceText).join(' '),
        scenes
      });
    }

    const prompt = buildTimelineStoryPrompt(events, audience, duration);
    const response = await withGeminiRetry(
      () => ai.models.generateContent({ model: TEXT_MODEL, contents: prompt }),
      'timelineStoryMode'
    );
    res.json({ mode: 'gemini', ...extractJson(getText(response)) });
  } catch (err) {
    console.error(err);
    const transient = isTransientGeminiError(err);
    res.status(transient ? 503 : 500).json({ error: err.message || 'Story mode failed', transient });
  }
});

app.listen(PORT, () => {
  console.log(`Bible Journey Map API running at http://localhost:${PORT}`);
  console.log(`Gemini configured: ${Boolean(process.env.GEMINI_API_KEY)}`);
});
