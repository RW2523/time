import { setCors, getAI, loadEvents, getText, extractJson, withRetry, TEXT_MODEL } from '../../_shared.js';

export const config = { maxDuration: 30 };

export default async function handler(req, res) {
  setCors(res);
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const { id } = req.query;
    const events = await loadEvents();
    const event  = events.find((e) => e.id === id);
    if (!event) return res.status(404).json({ error: 'Event not found' });

    const ai = getAI();
    if (!ai) {
      return res.json({
        mode: 'demo-fallback',
        title: event.title,
        teachingSummary: event.details || `${event.title} is a significant event recorded in Scripture.`,
        applicationLesson: event.lesson || 'This event teaches us about God\'s faithfulness.',
        mapExplanation: `${event.title} is mapped around ${event.mapLocation}.`,
        discussionQuestions: [
          `What happens in ${event.title}?`,
          `Who is involved in ${event.title}?`,
          'What lesson does this event teach?'
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
 "discussionQuestions":["question","question","question"],
 "quiz":[{"question":"string","options":["A","B","C","D"],"answer":"string"}]
}`;

    const response = await withRetry(
      () => ai.models.generateContent({ model: TEXT_MODEL, contents: prompt }),
      'eventContent'
    );
    return res.json({ mode: 'gemini', ...extractJson(getText(response)) });
  } catch (err) {
    console.error('[content]', err);
    const transient = /UNAVAILABLE|503|429|overloaded/i.test(String(err?.message || ''));
    return res.status(transient ? 503 : 500).json({
      error: transient
        ? "Google's AI is temporarily busy. Wait a moment and try again."
        : (err.message || 'Content generation failed')
    });
  }
}
