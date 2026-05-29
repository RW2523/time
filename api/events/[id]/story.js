import {
  setCors, getAI, loadEvents,
  getText, extractJson, withRetry,
  buildWav, placeholderSvgDataUrl,
  TEXT_MODEL, IMAGE_MODEL, TTS_MODEL, TTS_VOICE
} from '../../_shared.js';

export const config = { maxDuration: 60 };

function fallbackStory(event) {
  const scenes = [
    { title: 'Setting the Scene',   durationSec: 6, narration: `${event.title} takes place in ${event.mapLocation}.`, imagePrompt: `Biblical map scene: ${event.title}` },
    { title: 'The Main Event',      durationSec: 8, narration: event.summary || event.details || event.title, imagePrompt: `Biblical illustration of ${event.title}` },
    { title: 'People Involved',     durationSec: 7, narration: `Key people include ${(event.mainPeople || []).join(', ')}.`, imagePrompt: `People in ${event.title}` },
    { title: 'The Lesson',          durationSec: 7, narration: event.lesson || `${event.title} teaches us about God's faithfulness.`, imagePrompt: `Symbolic scene for ${event.title}` }
  ];
  return {
    title: event.title,
    reference: (event.references || []).join('; '),
    narration: scenes.map((s) => s.narration).join(' '),
    scenes,
    quiz: [
      { question: `Where did ${event.title} happen?`, answer: event.mapLocation || 'See references' },
      { question: 'What is the main lesson?', answer: event.lesson || 'Trust in God' }
    ]
  };
}

async function generateStoryPlan(ai, event, sceneCount) {
  if (!ai) return fallbackStory(event);
  const prompt = `You are building an educational Bible app. Return ONLY valid JSON.
Create a short story-video plan for this Bible event.
Event: ${JSON.stringify(event, null, 2)}
Required JSON:
{
  "title": "string",
  "reference": "string",
  "narration": "single narration transcript, 120-190 words, reverent and clear",
  "scenes": [
    {"title":"string","durationSec":number,"narration":"1-2 sentences","imagePrompt":"detailed 16:9 biblical illustrated scene, warm spiritual style, no gore, no modern objects"}
  ],
  "quiz": [{"question":"string","answer":"string"}]
}
Create exactly ${sceneCount} scenes. Keep facts aligned with references.`;
  const r = await withRetry(
    () => ai.models.generateContent({ model: TEXT_MODEL, contents: prompt }),
    'storyPlan'
  );
  return extractJson(getText(r));
}

async function generateImageDataUrl(ai, prompt) {
  if (!ai) return null;
  try {
    const r = await withRetry(
      () => ai.models.generateContent({
        model: IMAGE_MODEL,
        contents: `${prompt}\nCreate one 16:9 image. Style: premium illustrated Bible storybook, warm parchment palette, cinematic lighting, respectful, no text overlays.`
      }),
      'generateImage'
    );
    const parts  = r?.candidates?.[0]?.content?.parts || r?.parts || [];
    const imgPart = parts.find((p) => p.inlineData || p.inline_data);
    const inline  = imgPart?.inlineData || imgPart?.inline_data;
    if (!inline?.data) return null;
    const mime = inline.mimeType || inline.mime_type || 'image/png';
    return `data:${mime};base64,${inline.data}`;
  } catch {
    return null;
  }
}

async function generateAudioDataUrl(ai, narration) {
  if (!ai) return null;
  try {
    const r = await withRetry(
      () => ai.models.generateContent({
        model: TTS_MODEL,
        contents: `Say in a warm, calm, reverent Bible documentary narrator voice:\n${narration}`,
        config: {
          responseModalities: ['AUDIO'],
          speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: TTS_VOICE } } }
        }
      }),
      'generateTts'
    );
    const parts    = r?.candidates?.[0]?.content?.parts || r?.parts || [];
    const audPart  = parts.find((p) => p.inlineData || p.inline_data);
    const inline   = audPart?.inlineData || audPart?.inline_data;
    if (!inline?.data) return null;
    let buf = Buffer.from(inline.data, 'base64');
    const mime = inline.mimeType || inline.mime_type || '';
    if (!mime.includes('wav') && !buf.subarray(0, 4).equals(Buffer.from('RIFF'))) {
      buf = buildWav(buf);
    }
    return `data:audio/wav;base64,${buf.toString('base64')}`;
  } catch {
    return null;
  }
}

export default async function handler(req, res) {
  setCors(res);
  if (req.method === 'OPTIONS') return res.status(200).end();

  // GET → no cached stories on serverless
  if (req.method === 'GET') {
    return res.status(404).json({ error: 'No cached story', cached: false });
  }
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const { id } = req.query;
    const sceneCount = Math.min(Math.max(Number(req.body?.sceneCount || 4), 3), 6);

    const events = await loadEvents();
    const event  = events.find((e) => e.id === id);
    if (!event) return res.status(404).json({ error: 'Event not found' });

    const ai   = getAI();
    const plan = await generateStoryPlan(ai, event, sceneCount);

    // Generate images in parallel (each returns a data URL or placeholder SVG)
    const sceneImages = await Promise.all(
      plan.scenes.map((s, i) =>
        generateImageDataUrl(ai, s.imagePrompt).then(
          (url) => url || placeholderSvgDataUrl(s.title || event.title, (event.references || [])[0] || '', i + 1)
        )
      )
    );

    const scenes = plan.scenes.map((s, i) => ({
      ...s,
      imageUrl: sceneImages[i]
    }));

    // Generate audio
    const audioDataUrl = await generateAudioDataUrl(ai, plan.narration);

    const manifest = {
      mode: ai ? 'gemini' : 'demo-fallback',
      eventId: event.id,
      generatedAt: new Date().toISOString(),
      title: plan.title || event.title,
      reference: plan.reference || (event.references || []).join(', '),
      narration: plan.narration,
      audioUrl: audioDataUrl,
      scenes,
      quiz: plan.quiz || [],
      event
    };

    return res.json(manifest);
  } catch (err) {
    console.error('[story]', err);
    const transient = /UNAVAILABLE|503|429|overloaded/i.test(String(err?.message || ''));
    return res.status(transient ? 503 : 500).json({
      error: transient
        ? "Google's AI is temporarily busy (high demand). Wait a moment and press Create again."
        : (err.message || 'Story generation failed')
    });
  }
}
