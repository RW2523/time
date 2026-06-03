/**
 * FILE 01 — api/_shared.js
 * ─────────────────────────────────────────────────────────────
 * PURPOSE:  Shared utilities imported by ALL Vercel serverless
 *           API functions. Exports the Gemini AI client, the
 *           Supabase cache client, model constants, retry logic,
 *           the WAV header builder, and the SVG placeholder.
 *
 * USED BY:  02_server_story.js, 03_server_story_meta.js
 * RUNTIME:  Node.js 20+ (Vercel serverless function)
 * PACKAGE:  @google/genai, @supabase/supabase-js
 */

import { readFile } from 'fs/promises';
import path from 'path';
import { GoogleGenAI } from '@google/genai';
import { createClient } from '@supabase/supabase-js';

// ── AI Model selection ────────────────────────────────────────────────────────
// Override any of these via Vercel environment variables.
export const TEXT_MODEL  = process.env.GEMINI_TEXT_MODEL  || 'gemini-2.5-flash';
export const IMAGE_MODEL = process.env.GEMINI_IMAGE_MODEL || 'gemini-3.1-flash-image';
export const TTS_MODEL   = process.env.GEMINI_TTS_MODEL   || 'gemini-2.5-flash-preview-tts';
export const TTS_VOICE   = process.env.GEMINI_TTS_VOICE   || 'Kore';

// ── Gemini AI client ──────────────────────────────────────────────────────────
// Returns null if GEMINI_API_KEY is not set → callers fall back to demo content.
export function getAI() {
  if (!process.env.GEMINI_API_KEY) return null;
  return new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
}

// ── Supabase client ───────────────────────────────────────────────────────────
// Used for caching generated stories so they don't need to be regenerated
// every time a user opens the same event.
// Returns null if env vars are missing/invalid — caching just becomes a no-op.
export function getSupabase() {
  let url = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || '';
  const key = process.env.SUPABASE_SERVICE_KEY
           || process.env.SUPABASE_ANON_KEY
           || process.env.VITE_SUPABASE_ANON_KEY
           || '';

  // Strip any accidental /rest/v1/ path suffix copied from the Supabase dashboard
  url = url.trim().replace(/\/rest\/v1(\/.*)?$/, '').replace(/\/$/, '');

  const validUrl = url && /^https:\/\/[a-z0-9]+\.supabase\.co$/.test(url);
  if (!validUrl || !key) {
    if (url && !validUrl) {
      console.warn('[supabase] SUPABASE_URL looks invalid — expected https://<project>.supabase.co');
    }
    return null;
  }
  return createClient(url, key.trim(), { auth: { persistSession: false } });
}

// ── Bible events data ─────────────────────────────────────────────────────────
// Reads the bundled JSON file. Path is relative to Vercel's /var/task root.
export async function loadEvents() {
  const p = path.join(process.cwd(), 'sabai-bible', 'src', 'explore', 'data', 'bibleEvents.json');
  return JSON.parse(await readFile(p, 'utf-8'));
}

// ── CORS headers ──────────────────────────────────────────────────────────────
export function setCors(res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
}

// ── Gemini response helpers ───────────────────────────────────────────────────
export function getText(response) {
  if (response?.text) return response.text;
  const parts = response?.candidates?.[0]?.content?.parts || response?.parts || [];
  return parts.map((p) => p.text || '').join('\n').trim();
}

export function extractJson(text) {
  const clean = String(text || '').replace(/```json|```/g, '').trim();
  const start = clean.indexOf('{');
  const end   = clean.lastIndexOf('}');
  if (start === -1 || end === -1) throw new Error('Gemini response did not include JSON.');
  return JSON.parse(clean.slice(start, end + 1));
}

// ── Retry with exponential back-off ──────────────────────────────────────────
// Gemini 429 / 503 responses are retried up to 4 times before throwing.
function sleep(ms) { return new Promise((r) => setTimeout(r, ms)); }

function isTransient(err) {
  const s = err?.status ?? err?.error?.code ?? err?.cause?.status;
  if (s === 429 || s === 503) return true;
  return /UNAVAILABLE|RESOURCE_EXHAUSTED|overloaded|503|429/i.test(String(err?.message || ''));
}

export async function withRetry(fn, label, { maxAttempts = 4, baseMs = 800 } = {}) {
  let last;
  for (let i = 1; i <= maxAttempts; i++) {
    try { return await fn(); }
    catch (err) {
      last = err;
      if (i >= maxAttempts || !isTransient(err)) throw err;
      const delay = Math.min(16000, baseMs * 2 ** (i - 1) + Math.random() * 400);
      console.warn(`[gemini] ${label} attempt ${i}/${maxAttempts} failed, retry in ${Math.round(delay)}ms`);
      await sleep(delay);
    }
  }
  throw last;
}

// ── WAV header builder ────────────────────────────────────────────────────────
// Gemini TTS returns raw PCM audio. This wraps it in a standard WAV container
// so browsers can play it without a custom decoder.
export function buildWav(pcm, { channels = 1, sampleRate = 24000, bitsPerSample = 16 } = {}) {
  const byteRate   = (sampleRate * channels * bitsPerSample) / 8;
  const blockAlign = (channels * bitsPerSample) / 8;
  const buf = Buffer.alloc(44 + pcm.length);
  buf.write('RIFF', 0);
  buf.writeUInt32LE(36 + pcm.length, 4);
  buf.write('WAVE', 8);  buf.write('fmt ', 12);
  buf.writeUInt32LE(16, 16);  buf.writeUInt16LE(1, 20);
  buf.writeUInt16LE(channels, 22);  buf.writeUInt32LE(sampleRate, 24);
  buf.writeUInt32LE(byteRate, 28);  buf.writeUInt16LE(blockAlign, 32);
  buf.writeUInt16LE(bitsPerSample, 34);
  buf.write('data', 36);  buf.writeUInt32LE(pcm.length, 40);
  pcm.copy(buf, 44);
  return buf;
}

// ── SVG placeholder ───────────────────────────────────────────────────────────
// Returned if image generation fails — gives a styled fallback instead of a
// broken image so the video still renders something meaningful.
export function placeholderSvgDataUrl(title, subtitle, index) {
  const esc = (s) => String(s || '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1280" height="720" viewBox="0 0 1280 720">
<defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
<stop offset="0" stop-color="#0f4a4a"/><stop offset="0.45" stop-color="#c99a36"/><stop offset="1" stop-color="#f6ead3"/>
</linearGradient></defs>
<rect width="1280" height="720" fill="url(#g)"/>
<path d="M0 590 C210 510 360 635 540 560 C740 470 865 610 1280 510 L1280 720 L0 720 Z" fill="#2e625c" opacity="0.55"/>
<rect x="140" y="150" width="1000" height="420" rx="34" fill="#fff9eb" opacity="0.94"/>
<text x="640" y="285" text-anchor="middle" font-family="Georgia,serif" font-size="54" fill="#103f3f" font-weight="700">${esc(title)}</text>
<text x="640" y="360" text-anchor="middle" font-family="Arial,sans-serif" font-size="26" fill="#5d4a31">${esc(subtitle)}</text>
<text x="640" y="430" text-anchor="middle" font-family="Arial,sans-serif" font-size="20" fill="#8b6b2d">Scene ${index}</text>
</svg>`;
  return `data:image/svg+xml;base64,${Buffer.from(svg).toString('base64')}`;
}
