import { setCors, getSupabase } from '../../_shared.js';

export const config = { maxDuration: 15 };

export default async function handler(req, res) {
  setCors(res);
  if (req.method === 'OPTIONS') return res.status(200).end();

  const { id } = req.query;
  const sb = getSupabase();

  // ── GET: return the stored video URL for an event ────────────────────────
  if (req.method === 'GET') {
    if (!sb) return res.json({ videoUrl: null });
    try {
      const { data, error } = await sb
        .from('story_cache')
        .select('video_url')
        .eq('event_id', id)
        .single();
      if (error || !data) return res.json({ videoUrl: null });
      return res.json({ videoUrl: data.video_url || null });
    } catch (err) {
      return res.json({ videoUrl: null });
    }
  }

  // ── POST: save the video URL after client-side upload to Supabase Storage ─
  if (req.method === 'POST') {
    const { videoUrl } = req.body || {};
    if (!videoUrl || typeof videoUrl !== 'string' || !videoUrl.startsWith('http')) {
      return res.status(400).json({ error: 'videoUrl must be a valid https URL' });
    }
    if (!sb) return res.json({ ok: false, reason: 'Supabase not configured' });
    try {
      const { error } = await sb
        .from('story_cache')
        .update({ video_url: videoUrl })
        .eq('event_id', id);
      if (error) throw error;
      return res.json({ ok: true, videoUrl });
    } catch (err) {
      console.error('[video-url]', err.message);
      return res.status(500).json({ ok: false, error: err.message });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
