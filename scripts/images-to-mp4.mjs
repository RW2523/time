#!/usr/bin/env node
/**
 * Build a polished MP4 from still images: uniform 16:9 frame, crossfades, H.264.
 *
 * Requires: ffmpeg on PATH (brew install ffmpeg)
 *
 * Usage:
 *   node scripts/images-to-mp4.mjs --dir ./server/generated/birth_of_jesus --out ./output/story.mp4
 *   node scripts/images-to-mp4.mjs --dir ./slides --out video.mp4 --slide 4 --xfade 0.55 --transition fade
 *   node scripts/images-to-mp4.mjs --dir ./slides --out video.mp4 --width 1920 --height 1080 --fps 30
 *
 * Images: *.png *.jpg *.jpeg *.webp (sorted by filename)
 */

import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');

const IMAGE_EXT = new Set(['.png', '.jpg', '.jpeg', '.webp']);

function parseArgs(argv) {
  const out = {
    dir: '',
    out: '',
    slide: 4,
    xfade: 0.55,
    transition: 'fade',
    width: 1920,
    height: 1080,
    fps: 30,
    crf: 18,
    preset: 'slow',
    kenburns: false
  };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--dir') out.dir = argv[++i] || '';
    else if (a === '--out') out.out = argv[++i] || '';
    else if (a === '--slide') out.slide = Number(argv[++i]) || out.slide;
    else if (a === '--xfade') out.xfade = Number(argv[++i]) || out.xfade;
    else if (a === '--transition') out.transition = argv[++i] || out.transition;
    else if (a === '--width') out.width = Number(argv[++i]) || out.width;
    else if (a === '--height') out.height = Number(argv[++i]) || out.height;
    else if (a === '--fps') out.fps = Number(argv[++i]) || out.fps;
    else if (a === '--crf') out.crf = Number(argv[++i]) || out.crf;
    else if (a === '--preset') out.preset = argv[++i] || out.preset;
    else if (a === '--kenburns') out.kenburns = true;
  }
  return out;
}

function listImages(dir) {
  const abs = path.isAbsolute(dir) ? dir : path.join(ROOT, dir);
  if (!fs.existsSync(abs)) throw new Error(`Directory not found: ${abs}`);
  const files = fs
    .readdirSync(abs)
    .filter((f) => IMAGE_EXT.has(path.extname(f).toLowerCase()))
    .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }))
    .map((f) => path.join(abs, f));
  if (!files.length) throw new Error(`No images (${[...IMAGE_EXT].join(', ')}) in ${abs}`);
  return files;
}

function esc(s) {
  return s.replace(/\\/g, '\\\\').replace(/'/g, "\\'");
}

/**
 * Per-input: loop image for `slide` seconds, scale+pad, optional zoompan, format for xfade.
 */
function inputFilters(n, { width, height, fps, slide, kenburns }) {
  const parts = [];
  for (let i = 0; i < n; i++) {
    const base = `[${i}:v]scale=${width}:${height}:force_original_aspect_ratio=decrease,pad=${width}:${height}:(ow-iw)/2:(oh-ih)/2`;
    const kb = kenburns
      ? `,zoompan=z='min(zoom+0.0008,1.12)':d=${Math.round(slide * fps)}:x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':s=${width}x${height}:fps=${fps}`
      : '';
    parts.push(`${base}${kb},format=yuv420p,settb=AVTB,fps=${fps}[v${i}]`);
  }
  return parts.join(';');
}

function xfadeChain(n, { slide, xfade, transition }) {
  if (n === 1) return `;[v0]setpts=PTS-STARTPTS[outv]`;

  let graph = '';
  let prev = '[v0]';
  let totalLen = slide;

  for (let i = 1; i < n; i++) {
    const offset = totalLen - xfade;
    const outLabel = i === n - 1 ? 'outv' : `t${i}`;
    graph += `;${prev}[v${i}]xfade=transition=${transition}:duration=${xfade}:offset=${offset.toFixed(4)}[${outLabel}]`;
    prev = `[${outLabel}]`;
    totalLen += slide - xfade;
  }
  return graph;
}

function runFfmpeg(args) {
  const r = spawnSync('ffmpeg', args, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] });
  if (r.error) throw r.error;
  if (r.status !== 0) {
    throw new Error(`ffmpeg exited ${r.status}\n${r.stderr || r.stdout}`);
  }
}

function main() {
  const opts = parseArgs(process.argv.slice(2));
  if (!opts.dir || !opts.out) {
    console.error(`Usage: node scripts/images-to-mp4.mjs --dir <folder-with-images> --out <file.mp4> [options]

Options:
  --slide SEC     Visible length per image before transition (default ${4})
  --xfade SEC     Crossfade duration (default ${0.55})
  --transition    xfade name: fade, dissolve, slideleft, slideright, wipeleft, wiperight, radial (default fade)
  --width / --height   Output frame (default 1920 1080)
  --fps       default 30
  --crf       libx264 quality (default 18)
  --preset    libx264 preset (default slow)
  --kenburns  Subtle slow zoom on each slide
`);
    process.exit(1);
  }

  if (opts.xfade >= opts.slide) {
    console.error('Error: --xfade must be less than --slide');
    process.exit(1);
  }

  const images = listImages(opts.dir);
  const outAbs = path.isAbsolute(opts.out) ? opts.out : path.join(ROOT, opts.out);
  fs.mkdirSync(path.dirname(outAbs), { recursive: true });

  const n = images.length;
  const { width, height, fps, slide, xfade, transition, crf, preset, kenburns } = opts;

  const inputArgs = [];
  for (const img of images) {
    inputArgs.push('-loop', '1', '-t', String(slide), '-i', img);
  }

  const filterComplex = `${inputFilters(n, { width, height, fps, slide, kenburns })}${xfadeChain(n, { slide, xfade, transition })}`;

  const ffmpegArgs = [
    '-y',
    ...inputArgs,
    '-filter_complex',
    filterComplex,
    '-map',
    '[outv]',
    '-an',
    '-c:v',
    'libx264',
    '-preset',
    preset,
    '-crf',
    String(crf),
    '-pix_fmt',
    'yuv420p',
    '-movflags',
    '+faststart',
    outAbs
  ];

  console.error(`Images: ${n}`);
  console.error(`Output: ${outAbs}`);
  console.error('Running ffmpeg…');
  runFfmpeg(ffmpegArgs);
  console.error('Done.');
}

main();
