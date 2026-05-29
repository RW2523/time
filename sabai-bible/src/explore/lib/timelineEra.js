/**
 * Shared timeline / era helpers for event list, map, and bottom bar.
 */

/** Map an event's `era` string to bottom timeline `match` keys */
export function timelineMatchFromEventEra(era) {
  if (!era || typeof era !== 'string') return null;
  const e = era.toLowerCase();
  if (e.includes('primeval')) return 'Primeval';
  if (e.includes('patriarch')) return 'Patriarchs';
  if (e.includes('wilderness') || e.includes('exodus')) return 'Exodus';
  if (e.includes('conquest')) return 'Conquest';
  if (e.includes('judge') || e.includes('ruth')) return 'Judges';
  if (
    e.includes('exile warning') ||
    e.includes('united kingdom') ||
    e.includes('divided kingdom') ||
    e.includes('judah kingdom') ||
    e.includes('transition to monarchy')
  ) {
    return 'Kingdom';
  }
  if (e.includes('exile') || e.includes('persian') || e.includes('return')) return 'Exile';
  if (e.includes('jesus') || e.includes('resurrection') || e.includes('ministry') || e.includes('church')) return 'Jesus';
  return null;
}

/** Same rule as the Events sidebar filter when a timeline chip is active */
export function eventMatchesTimelineFilter(event, activeEra) {
  if (!activeEra || activeEra === 'All') return true;
  return event.era.toLowerCase().includes(activeEra.toLowerCase());
}
