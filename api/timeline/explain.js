import { setCors, getAI, getText, extractJson, withRetry, TEXT_MODEL } from '../_shared.js';

export const config = { maxDuration: 30 };

export default async function handler(req, res) {
  setCors(res);
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const event = req.body?.event;
    const mode  = req.body?.mode || 'simple';
    if (!event?.title) return res.status(400).json({ error: 'Missing event' });

    const ai = getAI();
    if (!ai) {
      return res.json({
        mode: 'demo-fallback',
        summary: `${event.title} is recorded in Scripture (${event.referenceText || (event.references || []).join(', ') || 'see references'}).`,
        whyItMatters: 'This moment contributes to the unfolding story of God\'s dealings with humanity.',
        historicalContext: 'Place this passage in its literary and historical context using trusted commentaries.',
        spiritualLesson: 'Let the text shape how you trust and obey God today.',
        keyPeople: [],
        keyPlaces: [],
        crossReferences: event.references || [],
        discussionQuestions: [`What does ${event.title} teach about God?`, 'How does this connect to later Scripture?']
      });
    }

    const modeLine = {
      kids:   'Write for children (ages 8–12): simple words, short sentences.',
      pastor: 'Write for pastors: concise exegesis-aware notes, still accessible.',
      study:  'Write for adult Bible study: clear and structured.'
    }[mode] || 'Write for a general audience: clear and reverent.';

    const prompt = `You are generating Bible study content for a Bible timeline app. Use only the event data provided. Do not invent unsupported details. ${modeLine}

Event:
Title: ${event.title}
Date: ${event.dateLabel}
Era: ${event.eraGroup}
Reference: ${event.referenceText}
Testament: ${event.scriptureTestament}
References: ${(event.references || []).join('; ')}

Return valid JSON only:
{
  "summary": "2-3 sentence explanation.",
  "whyItMatters": "Why this event matters in the Bible story.",
  "historicalContext": "Brief historical or biblical context.",
  "spiritualLesson": "A practical faith lesson.",
  "keyPeople": ["..."],
  "keyPlaces": ["..."],
  "crossReferences": ["..."],
  "discussionQuestions": ["..."]
}`;

    const r = await withRetry(
      () => ai.models.generateContent({ model: TEXT_MODEL, contents: prompt }),
      'timelineExplain'
    );
    return res.json({ mode: 'gemini', ...extractJson(getText(r)) });
  } catch (err) {
    console.error('[timeline/explain]', err);
    const transient = /UNAVAILABLE|503|429|overloaded/i.test(String(err?.message || ''));
    return res.status(transient ? 503 : 500).json({ error: err.message || 'Explain failed' });
  }
}
