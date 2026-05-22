import { spawn, spawnSync } from 'node:child_process';
import fssync from 'node:fs';
import path from 'node:path';

function assertFfmpegAvailable() {
  const r = spawnSync('ffmpeg', ['-version'], { encoding: 'utf8' });
  if (r.error?.code === 'ENOENT') {
    const e = new Error('ffmpeg is not installed on the server (required for MP4 export).');
    e.code = 'FFMPEG_MISSING';
    throw e;
  }
}

/**
 * @param {string} wavPath
 * @returns {number}
 */
export function ffprobeDurationSeconds(wavPath) {
  const r = spawnSync(
    'ffprobe',
    [
      '-v',
      'error',
      '-show_entries',
      'format=duration',
      '-of',
      'default=noprint_wrappers=1:nokey=1',
      wavPath
    ],
    { encoding: 'utf8' }
  );
  if (r.error?.code === 'ENOENT') {
    const e = new Error('ffprobe is not available (install ffmpeg).');
    e.code = 'FFMPEG_MISSING';
    throw e;
  }
  if (r.status !== 0) {
    const e = new Error(r.stderr?.trim() || 'ffprobe failed');
    e.code = 'FFPROBE_FAILED';
    throw e;
  }
  const s = parseFloat(String(r.stdout || '').trim(), 10);
  if (!Number.isFinite(s) || s <= 0.2) {
    const e = new Error('Could not read narration duration');
    e.code = 'BAD_AUDIO';
    throw e;
  }
  return s;
}

/**
 * @param {string[]} args
 * @returns {Promise<void>}
 */
function runFfmpeg(args) {
  return new Promise((resolve, reject) => {
    const p = spawn('ffmpeg', args, { stdio: ['ignore', 'ignore', 'pipe'] });
    let err = '';
    p.stderr.on('data', (c) => {
      err += c;
    });
    p.on('error', reject);
    p.on('close', (code) => {
      if (code === 0) resolve();
      else reject(new Error(err.trim().slice(-4000) || `ffmpeg exited ${code}`));
    });
  });
}

/**
 * @param {number[]} durationsSec per slide (loop duration each)
 * @param {{ width: number; height: number; fps: number; xfade: number }} opts
 */
function buildVideoFilterGraph(durationsSec, { width, height, fps, xfade }) {
  const n = durationsSec.length;
  const parts = [];
  for (let i = 0; i < n; i += 1) {
    const d = durationsSec[i];
    const frames = Math.max(1, Math.round(d * fps));
    const base = `[${i}:v]scale=${width}:${height}:force_original_aspect_ratio=decrease,pad=${width}:${height}:(ow-iw)/2:(oh-ih)/2`;
    parts.push(`${base},format=yuv420p,settb=AVTB,fps=${fps},trim=duration=${d.toFixed(4)},setpts=PTS-STARTPTS[v${i}]`);
  }
  if (n === 1) {
    parts.push(`[v0]setpts=PTS-STARTPTS[outv]`);
    return parts.join(';');
  }
  let graph = parts.join(';');
  let prev = '[v0]';
  let acc = durationsSec[0];
  for (let i = 1; i < n; i += 1) {
    const offset = acc - xfade;
    const outLabel = i === n - 1 ? 'outv' : `tx${i}`;
    graph += `;${prev}[v${i}]xfade=transition=fade:duration=${xfade.toFixed(4)}:offset=${offset.toFixed(4)}[${outLabel}]`;
    prev = `[${outLabel}]`;
    acc += durationsSec[i] - xfade;
  }
  return graph;
}

/**
 * Per-scene stills + narration.wav → single H.264 + AAC MP4 (slide timing matches audio length).
 *
 * @param {{ eventDir: string; manifest: object; outPath: string }} opts
 */
export async function renderStoryMp4({ eventDir, manifest, outPath }) {
  assertFfmpegAvailable();

  const scenes = Array.isArray(manifest.scenes) ? manifest.scenes : [];
  if (!scenes.length) {
    const e = new Error('Story has no scenes');
    e.code = 'NO_SCENES';
    throw e;
  }

  const imagePaths = [];
  for (let i = 0; i < scenes.length; i += 1) {
    const url = scenes[i]?.imageUrl;
    const bn = path.basename(String(url || ''));
    if (!bn || bn !== path.basename(bn)) {
      const e = new Error('Invalid scene image reference');
      e.code = 'BAD_MANIFEST';
      throw e;
    }
    const abs = path.join(eventDir, bn);
    if (!fssync.existsSync(abs)) {
      const e = new Error(`Missing scene file: ${bn}`);
      e.code = 'MISSING_IMAGE';
      throw e;
    }
    imagePaths.push(abs);
  }

  const wavPath = path.join(eventDir, 'narration.wav');
  if (!fssync.existsSync(wavPath)) {
    const e = new Error('No narration.wav — generate the story with audio first.');
    e.code = 'NO_AUDIO';
    throw e;
  }

  const audioDur = ffprobeDurationSeconds(wavPath);
  const n = imagePaths.length;
  const weights = scenes.map((s) => Math.max(0.5, Number(s.durationSec || 6)));
  const sumW = weights.reduce((a, b) => a + b, 0);

  let xfade = Math.min(0.55, Math.max(0.12, audioDur / (8 * Math.max(n, 2))));
  const minPer = 0.35;
  let durationsSec = [];

  for (let iter = 0; iter < 12; iter += 1) {
    const targetSum = audioDur + (n - 1) * xfade;
    durationsSec = weights.map((w) => (w / sumW) * targetSum);
    const minD = Math.min(...durationsSec);
    if (minD > xfade + minPer) break;
    xfade = Math.max(0.08, minD * 0.35);
  }

  const width = 1920;
  const height = 1080;
  const fps = 30;
  const filterComplex = buildVideoFilterGraph(durationsSec, { width, height, fps, xfade });

  const inputArgs = [];
  for (let i = 0; i < n; i += 1) {
    inputArgs.push('-loop', '1', '-t', durationsSec[i].toFixed(4), '-i', imagePaths[i]);
  }
  inputArgs.push('-i', wavPath);

  const audioInputIndex = n;

  const args = [
    '-y',
    ...inputArgs,
    '-filter_complex',
    filterComplex,
    '-map',
    '[outv]',
    '-map',
    `${audioInputIndex}:a`,
    '-c:v',
    'libx264',
    '-preset',
    'medium',
    '-crf',
    '20',
    '-pix_fmt',
    'yuv420p',
    '-c:a',
    'aac',
    '-b:a',
    '192k',
    '-shortest',
    '-movflags',
    '+faststart',
    outPath
  ];

  await runFfmpeg(args);
}
