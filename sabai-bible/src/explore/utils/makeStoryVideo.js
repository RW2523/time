/**
 * makeStoryVideo — client-side video generation
 * Creates a professional HD video from a story manifest (images + TTS audio).
 * Uses Canvas API for rendering and MediaRecorder for capture.
 * Output: WebM or MP4 Blob depending on browser support.
 */

const W = 1280;
const H = 720;
const FPS = 30;
const TRANSITION_S = 0.6;  // crossfade duration between scenes
const INTRO_S = 2.5;        // intro title card duration
const OUTRO_S = 2.0;        // outro card duration

// ── Helpers ───────────────────────────────────────────────────────────────────
function loadImg(dataUrl) {
  return new Promise((resolve) => {
    if (!dataUrl) { resolve(null); return; }
    const img = new Image();
    img.onload  = () => resolve(img);
    img.onerror = () => resolve(null);
    img.src = dataUrl;
  });
}

async function decodeAudio(dataUrl, ctx) {
  if (!dataUrl) return null;
  try {
    const base64 = dataUrl.includes(',') ? dataUrl.split(',')[1] : dataUrl;
    const binary = atob(base64);
    const bytes  = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
    return await ctx.decodeAudioData(bytes.buffer);
  } catch { return null; }
}

function wrapText(ctx2d, text, x, y, maxW, lineH) {
  const words = String(text || '').split(' ');
  let line = '';
  let cy = y;
  for (const word of words) {
    const test = line ? `${line} ${word}` : word;
    if (ctx2d.measureText(test).width > maxW && line) {
      ctx2d.fillText(line, x, cy);
      line = word; cy += lineH;
    } else { line = test; }
  }
  if (line) ctx2d.fillText(line, x, cy);
}

// ── Easing ────────────────────────────────────────────────────────────────────
const easeOut = (t) => 1 - (1 - t) ** 2;
const clamp   = (v, a, b) => Math.max(a, Math.min(b, v));

// ── Frame renderer ─────────────────────────────────────────────────────────────
function drawFrame(ctx2d, state, story, images) {
  const { elapsed, totalDur, segments } = state;

  ctx2d.clearRect(0, 0, W, H);
  ctx2d.fillStyle = '#0b1a14';
  ctx2d.fillRect(0, 0, W, H);

  // Determine segment
  let seg = null;
  for (const s of segments) {
    if (elapsed >= s.start && elapsed < s.end) { seg = s; break; }
  }
  if (!seg && segments.length) seg = segments[segments.length - 1];
  if (!seg) return;

  const segT  = clamp((elapsed - seg.start) / (seg.end - seg.start), 0, 1);

  if (seg.type === 'intro') {
    // ── Intro card ──────────────────────────────────────────────────────────
    const alpha = segT < 0.3 ? easeOut(segT / 0.3) : segT > 0.8 ? 1 - easeOut((segT - 0.8) / 0.2) : 1;
    ctx2d.globalAlpha = alpha;

    // Gold ornament bar
    const barGrad = ctx2d.createLinearGradient(0, 0, W, 0);
    barGrad.addColorStop(0, 'transparent');
    barGrad.addColorStop(0.3, '#c9a84c');
    barGrad.addColorStop(0.7, '#c9a84c');
    barGrad.addColorStop(1, 'transparent');
    ctx2d.fillStyle = barGrad;
    ctx2d.fillRect(0, H / 2 - 110, W, 2);

    // Event title
    ctx2d.textAlign = 'center';
    ctx2d.font = 'bold 62px Georgia, serif';
    ctx2d.fillStyle = '#ffffff';
    ctx2d.shadowColor = 'rgba(0,0,0,0.6)'; ctx2d.shadowBlur = 16;
    wrapText(ctx2d, story.title || '', W / 2 - 300, H / 2 - 60, 600, 72);

    ctx2d.font = '26px Arial, sans-serif';
    ctx2d.fillStyle = '#c9a84c';
    ctx2d.shadowBlur = 0;
    ctx2d.fillText(story.reference || story.event?.era || '', W / 2, H / 2 + 60);

    ctx2d.font = '18px Arial, sans-serif';
    ctx2d.fillStyle = 'rgba(255,255,255,0.5)';
    ctx2d.fillText('SabAI Bible • AI Story Video', W / 2, H / 2 + 100);

    ctx2d.fillStyle = barGrad;
    ctx2d.fillRect(0, H / 2 + 120, W, 2);
    ctx2d.textAlign = 'left';
    ctx2d.globalAlpha = 1;

  } else if (seg.type === 'scene') {
    // ── Scene ───────────────────────────────────────────────────────────────
    const img   = images[seg.sceneIdx];
    const scene = story.scenes[seg.sceneIdx];

    // Fade from prev / fade to next
    const fadeIn  = clamp(segT / (TRANSITION_S / (seg.end - seg.start)), 0, 1);
    const fadeOut = segT > 1 - TRANSITION_S / (seg.end - seg.start)
      ? clamp((1 - segT) / (TRANSITION_S / (seg.end - seg.start)), 0, 1)
      : 1;
    const imgAlpha = fadeIn * fadeOut;

    // Ken Burns — slow zoom from 100% → 108%
    const scale = 1 + easeOut(segT) * 0.08;
    const sw = W * scale, sh = H * scale;
    const ox = (sw - W) / 2, oy = (sh - H) / 2;

    if (img) {
      ctx2d.globalAlpha = imgAlpha;
      ctx2d.drawImage(img, -ox, -oy, sw, sh);
      ctx2d.globalAlpha = 1;
    }

    // Bottom gradient
    const grad = ctx2d.createLinearGradient(0, H * 0.35, 0, H);
    grad.addColorStop(0, 'rgba(0,0,0,0)');
    grad.addColorStop(1, 'rgba(0,0,0,0.88)');
    ctx2d.fillStyle = grad;
    ctx2d.fillRect(0, 0, W, H);

    // Top gradient (thin)
    const topGrad = ctx2d.createLinearGradient(0, 0, 0, 90);
    topGrad.addColorStop(0, 'rgba(0,0,0,0.55)');
    topGrad.addColorStop(1, 'rgba(0,0,0,0)');
    ctx2d.fillStyle = topGrad;
    ctx2d.fillRect(0, 0, W, 90);

    ctx2d.globalAlpha = imgAlpha;

    // Story title (top-left, gold)
    ctx2d.font = '600 17px Arial, sans-serif';
    ctx2d.fillStyle = '#c9a84c';
    ctx2d.letterSpacing = '2px';
    ctx2d.fillText((story.title || '').toUpperCase().slice(0, 40), 42, 46);
    ctx2d.letterSpacing = '0px';

    // Scene counter (top-right)
    ctx2d.textAlign = 'right';
    ctx2d.font = '16px Arial, sans-serif';
    ctx2d.fillStyle = 'rgba(255,255,255,0.65)';
    ctx2d.fillText(`${seg.sceneIdx + 1} / ${story.scenes.length}`, W - 42, 46);
    ctx2d.textAlign = 'left';

    // Scene title (bottom)
    ctx2d.shadowColor = 'rgba(0,0,0,0.9)';
    ctx2d.shadowBlur = 12;
    ctx2d.font = 'bold 44px Georgia, serif';
    ctx2d.fillStyle = '#ffffff';
    wrapText(ctx2d, scene.title || '', 50, H - 140, W - 100, 52);

    // Narration caption
    ctx2d.font = '22px Arial, sans-serif';
    ctx2d.fillStyle = 'rgba(255,255,255,0.88)';
    ctx2d.shadowBlur = 8;
    wrapText(ctx2d, scene.narration || '', 50, H - 72, W - 100, 28);
    ctx2d.shadowBlur = 0;

    ctx2d.globalAlpha = 1;

  } else if (seg.type === 'outro') {
    // ── Outro card ──────────────────────────────────────────────────────────
    const alpha = segT < 0.4 ? easeOut(segT / 0.4) : 1 - easeOut((segT - 0.4) / 0.6);
    ctx2d.globalAlpha = Math.max(0, alpha);
    ctx2d.textAlign = 'center';
    ctx2d.font = '28px Georgia, serif';
    ctx2d.fillStyle = '#c9a84c';
    ctx2d.fillText(story.reference || '', W / 2, H / 2 - 20);
    ctx2d.font = '18px Arial, sans-serif';
    ctx2d.fillStyle = 'rgba(255,255,255,0.5)';
    ctx2d.fillText('SabAI Bible', W / 2, H / 2 + 20);
    ctx2d.textAlign = 'left';
    ctx2d.globalAlpha = 1;
  }

  // ── Progress bar (always) ─────────────────────────────────────────────────
  ctx2d.fillStyle = 'rgba(255,255,255,0.15)';
  ctx2d.fillRect(0, H - 4, W, 4);
  const barGrad2 = ctx2d.createLinearGradient(0, 0, W, 0);
  barGrad2.addColorStop(0, '#6ee7b7');
  barGrad2.addColorStop(1, '#c9a84c');
  ctx2d.fillStyle = barGrad2;
  ctx2d.fillRect(0, H - 4, clamp(elapsed / totalDur, 0, 1) * W, 4);
}

// ── Best supported MIME ───────────────────────────────────────────────────────
function bestMime() {
  const candidates = [
    'video/mp4;codecs=avc1.42E01E,mp4a.40.2',
    'video/mp4',
    'video/webm;codecs=vp9,opus',
    'video/webm;codecs=vp8,opus',
    'video/webm',
  ];
  for (const m of candidates) {
    if (typeof MediaRecorder !== 'undefined' && MediaRecorder.isTypeSupported(m)) return m;
  }
  return 'video/webm';
}

// ── Main export ───────────────────────────────────────────────────────────────
/**
 * @param {object} story   – the story manifest from the API
 * @param {function} onProgress – called with 0..1
 * @returns {Promise<Blob>}
 */
export async function makeStoryVideo(story, onProgress) {
  // 1. Load images
  onProgress?.(0.02);
  const images = await Promise.all((story.scenes || []).map((s) => loadImg(s.imageUrl)));
  onProgress?.(0.08);

  // 2. Set up audio
  const audioCtx    = new AudioContext();
  const audioBuffer = await decodeAudio(story.audioUrl, audioCtx);
  const audioDur    = audioBuffer?.duration || 0;

  // 3. Build timeline segments
  const rawDurs = (story.scenes || []).map((s) => Number(s.durationSec) || 7);
  const sceneTotal = rawDurs.reduce((a, b) => a + b, 0);
  // If audio exists, scale scene durations so video matches audio exactly
  const scale = audioDur > 2 ? (audioDur / sceneTotal) : 1;
  const scaledDurs = rawDurs.map((d) => d * scale);

  const segments = [];
  segments.push({ type: 'intro', start: 0, end: INTRO_S });
  let cursor = INTRO_S;
  scaledDurs.forEach((dur, i) => {
    segments.push({ type: 'scene', sceneIdx: i, start: cursor, end: cursor + dur });
    cursor += dur;
  });
  segments.push({ type: 'outro', start: cursor, end: cursor + OUTRO_S });
  const totalDur = cursor + OUTRO_S;

  // 4. Set up canvas
  const canvas = document.createElement('canvas');
  canvas.width = W; canvas.height = H;
  const ctx2d = canvas.getContext('2d', { alpha: false });

  // 5. Set up MediaRecorder
  const mimeType  = bestMime();
  const vidStream = canvas.captureStream(FPS);
  let   recStream = vidStream;

  if (audioBuffer) {
    const srcNode  = audioCtx.createBufferSource();
    srcNode.buffer = audioBuffer;
    const destNode = audioCtx.createMediaStreamDestination();
    srcNode.connect(destNode);
    // Delay audio start to match intro card
    srcNode.start(audioCtx.currentTime + INTRO_S);
    recStream = new MediaStream([
      ...vidStream.getVideoTracks(),
      ...destNode.stream.getAudioTracks(),
    ]);
  }

  const recorder = new MediaRecorder(recStream, {
    mimeType,
    videoBitsPerSecond: 5_000_000,
  });
  const chunks = [];
  recorder.ondataavailable = (e) => { if (e.data.size > 0) chunks.push(e.data); };

  return new Promise((resolve, reject) => {
    recorder.onstop = () => {
      audioCtx.close();
      const ext  = mimeType.startsWith('video/mp4') ? 'mp4' : 'webm';
      const blob = new Blob(chunks, { type: mimeType });
      blob._ext  = ext;
      resolve(blob);
    };
    recorder.onerror = reject;

    recorder.start(500); // collect data every 500ms

    const startWall = performance.now();
    let lastScene = -1;

    function tick() {
      const elapsed = (performance.now() - startWall) / 1000;

      drawFrame(ctx2d, { elapsed, totalDur, segments }, story, images);
      onProgress?.(0.1 + 0.88 * clamp(elapsed / totalDur, 0, 1));

      if (elapsed >= totalDur + 0.3) {
        recorder.stop();
      } else {
        requestAnimationFrame(tick);
      }
    }

    requestAnimationFrame(tick);
  });
}

/** Download a blob as a file */
export function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob);
  const a = Object.assign(document.createElement('a'), {
    href: url, download: filename, rel: 'noopener',
  });
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 10000);
}

/** Save blob to IndexedDB so it persists across page refreshes */
export async function saveVideoLocally(eventId, blob) {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open('sabai-story-videos', 1);
    req.onupgradeneeded = (e) => e.target.result.createObjectStore('videos');
    req.onsuccess = (e) => {
      const db  = e.target.result;
      const tx  = db.transaction('videos', 'readwrite');
      const put = tx.objectStore('videos').put({ blob, ext: blob._ext || 'webm', ts: Date.now() }, eventId);
      put.onsuccess = () => resolve();
      put.onerror   = reject;
    };
    req.onerror = reject;
  });
}

/** Load blob from IndexedDB */
export async function loadVideoLocally(eventId) {
  return new Promise((resolve) => {
    const req = indexedDB.open('sabai-story-videos', 1);
    req.onupgradeneeded = (e) => e.target.result.createObjectStore('videos');
    req.onsuccess = (e) => {
      const db  = e.target.result;
      const tx  = db.transaction('videos', 'readonly');
      const get = tx.objectStore('videos').get(eventId);
      get.onsuccess = (ev) => {
        const rec = ev.target.result;
        if (!rec) { resolve(null); return; }
        const url = URL.createObjectURL(rec.blob);
        resolve({ url, ext: rec.ext, ts: rec.ts });
      };
      get.onerror = () => resolve(null);
    };
    req.onerror = () => resolve(null);
  });
}
