import { setCors, loadEvents } from '../../../_shared.js';

export default async function handler(req, res) {
  setCors(res);
  if (req.method === 'OPTIONS') return res.status(200).end();

  try {
    const { id } = req.query;
    const events = await loadEvents();
    const event  = events.find((e) => e.id === id);
    if (!event) return res.status(404).json({ error: 'Event not found' });
    // Vercel functions are stateless — no disk cache
    return res.json({ cached: false, eventId: event.id });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
