import {
  setCors, getAI, getSupabase, loadEvents,
  getText, extractJson, withRetry, buildWav, placeholderSvgDataUrl,
  TEXT_MODEL, IMAGE_MODEL, TTS_MODEL, TTS_VOICE
} from '../../_shared.js';

export const config = { maxDuration: 300 };

// ── Fallback plan (no Gemini) ─────────────────────────────────────────────────
function fallbackStory(event) {
  const people = (event.mainPeople || []).join(', ') || 'biblical figures';
  const scenes = [
    { title: 'Setting the Scene',  durationSec: 6, narration: `${event.title} takes place near ${event.mapLocation || 'the Holy Land'}.`,      imagePrompt: `Biblical landscape for ${event.title}` },
    { title: 'The Event Unfolds',  durationSec: 8, narration: event.summary || event.details || `This is the story of ${event.title}.`,         imagePrompt: `Illustrated biblical scene: ${event.title}` },
    { title: 'Key People',         durationSec: 7, narration: `This story involves ${people}.`,                                                   imagePrompt: `People involved in ${event.title}: ${people}` },
    { title: 'The Lesson',         durationSec: 7, narration: event.lesson || `${event.title} teaches us about God's faithfulness and love.`,    imagePrompt: `Symbolic hopeful scene for ${event.title}` }
  ];
  return {
    title: event.title,
    reference: (event.references || []).join('; '),
    narration: scenes.map((s) => s.narration).join(' '),
    scenes,
    quiz: [
      { question: `Where did ${event.title} take place?`, answer: event.mapLocation || 'See references' },
      { question: 'What is the key lesson?',              answer: event.lesson || 'Trust in God' }
    ]
  };
}

// ── Generate story plan via Gemini ────────────────────────────────────────────
async function generateStoryPlan(ai, event, sceneCount) {
  if (!ai) return fallbackStory(event);
  const prompt = `You are building an educational Bible Journey Map app. Return ONLY valid JSON — no markdown fences.

Generate a story-video script for this Bible event:
${JSON.stringify({ id: event.id, title: event.title, era: event.era, mapLocation: event.mapLocation, references: event.references, mainPeople: event.mainPeople, summary: event.summary || event.details, lesson: event.lesson }, null, 2)}

Return this exact JSON shape:
{
  "title": "string",
  "reference": "string — primary scripture reference",
  "narration": "string — complete narrator script, 130-200 words, reverent, clear, child-friendly",
  "scenes": [
    {
      "title": "string",
      "durationSec": number,
      "narration": "string — 1-2 sentence scene caption",
      "imagePrompt": "string — detailed 16:9 illustrated scene prompt, warm parchment palette, cinematic, no text overlays, no gore, no modern objects"
    }
  ],
  "quiz": [{"question":"string","answer":"string"}]
}

Generate exactly ${sceneCount} scenes. Keep facts strictly aligned with the scripture references.`;

  const r = await withRetry(
    () => ai.models.generateContent({ model: TEXT_MODEL, contents: prompt }),
    'storyPlan'
  );
  return extractJson(getText(r));
}

// ── Generate image → base64 data URL ─────────────────────────────────────────
async function generateImage(ai, prompt, index, eventTitle) {
  if (!ai) return placeholderSvgDataUrl(eventTitle, `Scene ${index}`, index);
  try {
    const fullPrompt = `${prompt}\n\nArt direction: premium illustrated Bible storybook, parchment palette, warm golden-hour light, soft painterly detail, reverent and educational. 16:9 widescreen composition. No text overlays, no watermarks, no modern objects.`;
    const r = await withRetry(
      () => ai.models.generateContent({
        model: IMAGE_MODEL,
        contents: fullPrompt,
        config: {
          responseModalities: ['IMAGE', 'TEXT'] // required for Gemini to return image bytes
        }
      }),
      `image-${index}`
    );
    const parts   = r?.candidates?.[0]?.content?.parts || r?.parts || [];
    const imgPart = parts.find((p) => p.inlineData || p.inline_data);
    const inline  = imgPart?.inlineData || imgPart?.inline_data;
    if (!inline?.data) {
      console.warn(`[image-${index}] no inlineData in response, using placeholder`);
      return placeholderSvgDataUrl(eventTitle, `Scene ${index}`, index);
    }
    const mime = inline.mimeType || inline.mime_type || 'image/png';
    return `data:${mime};base64,${inline.data}`;
  } catch (e) {
    console.warn(`[image-${index}] failed (${e.message}), using placeholder`);
    return placeholderSvgDataUrl(eventTitle, `Scene ${index}`, index);
  }
}

// ── Generate TTS → base64 data URL ────────────────────────────────────────────
async function generateAudio(ai, narration) {
  if (!ai) return null;
  try {
    const r = await withRetry(
      () => ai.models.generateContent({
        model: TTS_MODEL,
        contents: `Narrate this in a warm, calm, reverent Bible documentary narrator voice:\n\n${narration}`,
        config: {
          responseModalities: ['AUDIO'],
          speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: TTS_VOICE } } }
        }
      }),
      'tts'
    );
    const parts   = r?.candidates?.[0]?.content?.parts || r?.parts || [];
    const audPart = parts.find((p) => p.inlineData || p.inline_data);
    const inline  = audPart?.inlineData || audPart?.inline_data;
    if (!inline?.data) {
      console.warn('[tts] no audio data in response. Parts:', JSON.stringify((parts || []).map((p) => ({ keys: Object.keys(p) }))));
      return null;
    }
    let buf = Buffer.from(inline.data, 'base64');
    const mime = inline.mimeType || inline.mime_type || '';
    if (!mime.includes('wav') && !buf.subarray(0, 4).equals(Buffer.from('RIFF'))) {
      // Parse sample rate from mimeType (e.g. 'audio/pcm;rate=24000' or 'audio/L16;rate=22050')
      const rateMatch = mime.match(/rate=(\d+)/i);
      const sampleRate = rateMatch ? parseInt(rateMatch[1], 10) : 24000;
      buf = buildWav(buf, { sampleRate });
    }
    return `data:audio/wav;base64,${buf.toString('base64')}`;
  } catch (e) {
    console.warn('[tts] failed, continuing without audio:', e.message);
    return null;
  }
}

// ── Save manifest to Supabase ─────────────────────────────────────────────────
async function saveToSupabase(sb, event, manifest) {
  if (!sb) return;
  try {
    const { error } = await sb.from('story_cache').upsert({
      event_id:     event.id,
      event_title:  event.title,
      story_data:   manifest,
      scene_count:  manifest.scenes?.length || 0,
      has_audio:    Boolean(manifest.audioUrl),
      mode:         manifest.mode || 'gemini',
      generated_at: manifest.generatedAt
    }, { onConflict: 'event_id' });
    if (error) {
      const msg = error.message || String(error);
      if (/relation.*does not exist|does not exist|Invalid path/i.test(msg)) {
        console.error('[supabase] story_cache table not found. Run supabase/migrations/002_story_cache.sql in your Supabase SQL Editor.');
      } else {
        console.error('[supabase] save error:', msg);
      }
    } else {
      console.log(`[supabase] saved story for ${event.id}`);
    }
  } catch (e) {
    console.error('[supabase] save exception:', e.message);
  }
}

// ── Load manifest from Supabase ───────────────────────────────────────────────
async function loadFromSupabase(sb, eventId) {
  if (!sb) return null;
  try {
    const { data, error } = await sb
      .from('story_cache')
      .select('story_data, generated_at, scene_count, has_audio, video_url')
      .eq('event_id', eventId)
      .single();
    if (error || !data) return null;
    // Merge video_url into the story object so clients can skip rendering
    return { ...data.story_data, videoUrl: data.video_url || null };
  } catch {
    return null;
  }
}

// ─────────────────────────────────────────────────────────────────────────────
export default async function handler(req, res) {
  setCors(res);
  if (req.method === 'OPTIONS') return res.status(200).end();

  const { id } = req.query;
  const sb     = getSupabase();

  // ── GET: return cached story from Supabase ──────────────────────────────────
  if (req.method === 'GET') {
    const cached = await loadFromSupabase(sb, id);
    if (cached) return res.json(cached);
    return res.status(404).json({ error: 'No cached story', cached: false });
  }

  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  // ── POST: generate (or return cache if not forced) ──────────────────────────
  try {
    const sceneCount = Math.min(Math.max(Number(req.body?.sceneCount || 4), 3), 6);
    const force      = Boolean(req.body?.force);

    const events = await loadEvents();
    const event  = events.find((e) => e.id === id);
    if (!event) return res.status(404).json({ error: 'Event not found' });

    // Return from Supabase cache unless force-refresh requested
    if (!force) {
      const cached = await loadFromSupabase(sb, id);
      if (cached) {
        console.log(`[story] cache hit for ${id}`);
        return res.json({ ...cached, _cached: true });
      }
    }

    console.log(`[story] generating for ${id} (force=${force})`);
    const ai   = getAI();
    const plan = await generateStoryPlan(ai, event, sceneCount);

    // Generate images in parallel
    const sceneImages = await Promise.all(
      plan.scenes.map((s, i) => generateImage(ai, s.imagePrompt, i + 1, event.title))
    );

    // Generate audio
    const audioUrl = await generateAudio(ai, plan.narration);

    const manifest = {
      mode:        ai ? 'gemini' : 'demo-fallback',
      eventId:     event.id,
      generatedAt: new Date().toISOString(),
      title:       plan.title || event.title,
      reference:   plan.reference || (event.references || []).join(', '),
      narration:   plan.narration,
      audioUrl,
      scenes: plan.scenes.map((s, i) => ({ ...s, imageUrl: sceneImages[i] })),
      quiz:   plan.quiz || [],
      event
    };

    // Persist to Supabase asynchronously (don't block the response)
    saveToSupabase(sb, event, manifest).catch(() => {});

    return res.json(manifest);
  } catch (err) {
    console.error('[story]', err);
    const transient = /UNAVAILABLE|503|429|overloaded/i.test(String(err?.message || ''));
    return res.status(transient ? 503 : 500).json({
      error: transient
        ? "Google's AI is temporarily busy. Wait a moment and press Create again."
        : (err.message || 'Story generation failed')
    });
  }
}
