/**
 * One-off helper: regenerates src/data/eventPersonPerspectives.json from bibleEvents.json.
 * Run: node scripts/generate-event-person-perspectives.mjs
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');
const events = JSON.parse(fs.readFileSync(path.join(root, 'src/data/bibleEvents.json'), 'utf8'));

function godVoice(title, lesson, details) {
  return `In “${title},” Scripture presents God as the Lord of history: ${details.slice(0, 280)}${details.length > 280 ? '…' : ''} The story underscores this lesson: ${lesson}`;
}

function personVoice(person, title, summary, details, lesson) {
  const clip = details.length > 300 ? `${details.slice(0, 300).trim()}…` : details;
  return `From ${person}’s place in “${title}”: ${clip} In the story’s own terms, this connects with: ${summary} A key takeaway for readers is: ${lesson}`;
}

const out = {};
for (const e of events) {
  out[e.id] = {};
  const people = e.mainPeople || [];
  for (const p of people) {
    if (p === 'God') {
      out[e.id][p] = { perspective: godVoice(e.title, e.lesson, e.details) };
    } else {
      out[e.id][p] = { perspective: personVoice(p, e.title, e.summary, e.details, e.lesson) };
    }
  }
}

const dest = path.join(root, 'src/data/eventPersonPerspectives.json');
fs.writeFileSync(dest, JSON.stringify(out, null, 2), 'utf8');
console.log('Wrote', dest, 'entries:', Object.keys(out).length);
