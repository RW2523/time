import { setCors, getSupabase, loadEvents } from '../../../_shared.js';

export default async function handler(req, res) {
  setCors(res);
  if (req.method === 'OPTIONS') return res.status(200).end();

  try {
    const { id } = req.query;
    const events  = await loadEvents();
    const event   = events.find((e) => e.id === id);
    if (!event) return res.status(404).json({ error: 'Event not found' });

    const sb = getSupabase();
    if (!sb) return res.json({ cached: false, eventId: id });

    const { data, error } = await sb
      .from('story_cache')
      .select('event_id, event_title, scene_count, has_audio, mode, generated_at')
      .eq('event_id', id)
      .single();

    if (error || !data) return res.json({ cached: false, eventId: id });

    return res.json({
      cached:      true,
      eventId:     data.event_id,
      title:       data.event_title,
      sceneCount:  data.scene_count,
      hasAudio:    data.has_audio,
      mode:        data.mode,
      generatedAt: data.generated_at
    });
  } catch (err) {
    console.error('[story/meta]', err);
    return res.status(500).json({ error: err.message });
  }
}
