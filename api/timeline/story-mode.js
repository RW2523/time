import { setCors, getAI, getText, extractJson, withRetry, TEXT_MODEL } from '../_shared.js';

export const config = { maxDuration: 30 };

export default async function handler(req, res) {
  setCors(res);
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const events   = req.body?.events;
    const audience = req.body?.audience || 'general';
    const duration = req.body?.duration || 'short';
    if (!Array.isArray(events) || events.length === 0) {
      return res.status(400).json({ error: 'events array required' });
    }

    const ai = getAI();
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

    const slice = events.slice(0, Math.min(24, events.length));
    const prompt = `You are building a guided Bible timeline "story mode" sequence for an educational app.
Ground content ONLY in the provided event titles and references.
Audience: ${audience}. Length: ${duration}.

Events:
${JSON.stringify(slice.map((e) => ({ id: e.id, title: e.title, dateLabel: e.dateLabel, eraGroup: e.eraGroup, referenceText: e.referenceText, references: e.references })), null, 2)}

Return valid JSON only:
{
  "title": "string",
  "narration": "one paragraph overview",
  "scenes": [
    {"eventId":"string","title":"string","imagePrompt":"string","voiceText":"1-3 sentences","scriptureReference":"string"}
  ]
}`;

    const r = await withRetry(
      () => ai.models.generateContent({ model: TEXT_MODEL, contents: prompt }),
      'timelineStoryMode'
    );
    return res.json({ mode: 'gemini', ...extractJson(getText(r)) });
  } catch (err) {
    console.error('[timeline/story-mode]', err);
    const transient = /UNAVAILABLE|503|429|overloaded/i.test(String(err?.message || ''));
    return res.status(transient ? 503 : 500).json({ error: err.message || 'Story mode failed' });
  }
}
