import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  BookOpen,
  ChevronRight,
  GitBranch,
  Loader2,
  Map as MapIcon,
  Search,
  Sparkles,
  X,
  BookMarked,
  Film,
  Download
} from 'lucide-react';
import BibleEventSprite from '../../components/BibleEventSprite.jsx';
import styles from './BibleTimelineExplorer.module.css';
import {
  attachMapIcons,
  filterByTestament,
  getRelatedEvents,
  getTimelineDateDisplay,
  groupEventsByEra,
  loadTimelineEvents,
  searchTimelineEvents,
  sortTimelineEvents
} from './timelineUtils.js';
import { getReferencesForEvent } from './timelineReferenceParser.js';
import { getLineageContextForTimeline } from './timelineToLineageMap.js';
import { EXPLAIN_MODES } from './timelineGeminiPrompts.js';

const SCRUB_LABELS = [
  { match: /primeval|before time/i, short: 'Creation' },
  { match: /patriarch/i, short: 'Patriarchs' },
  { match: /egypt and exodus|exodus/i, short: 'Exodus' },
  { match: /wilderness|law/i, short: 'Law' },
  { match: /conquest/i, short: 'Conquest' },
  { match: /judges/i, short: 'Judges' },
  { match: /united kingdom/i, short: 'United Kingdom' },
  { match: /divided/i, short: 'Divided' },
  { match: /^exile$/i, short: 'Exile' },
  { match: /return|restoration/i, short: 'Return' },
  { match: /jesus/i, short: 'Jesus' },
  { match: /early church|apostolic/i, short: 'Church & Letters' }
];

function scrubLabelForEra(name) {
  for (const { match, short } of SCRUB_LABELS) {
    if (match.test(name)) return short;
  }
  return name.length > 18 ? `${name.slice(0, 16)}…` : name;
}

/**
 * @param {object} props
 * @param {string} props.apiBase
 * @param {{ id: string; order?: number; mapIcon?: string }[]} props.mapEvents
 * @param {() => void} props.onClose
 * @param {(mapEventId: string) => void} props.onOpenMapEvent
 * @param {(mapEventId: string) => void} props.onOpenLineage
 */
export default function BibleTimelineExplorer({ apiBase, mapEvents, onClose, onOpenMapEvent, onOpenLineage }) {
  const [bundle, setBundle] = useState(null);
  const [loadError, setLoadError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [testament, setTestament] = useState('all');
  const [searchInput, setSearchInput] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [activeEra, setActiveEra] = useState(null);
  const [selectedId, setSelectedId] = useState(null);
  const [filterMajor, setFilterMajor] = useState(false);
  const [filterJesus, setFilterJesus] = useState(false);
  const [filterMap, setFilterMap] = useState(false);
  const [aiMode, setAiMode] = useState('simple');
  const [aiResult, setAiResult] = useState(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [storyOpen, setStoryOpen] = useState(false);
  const [storyScenes, setStoryScenes] = useState([]);
  const [storyTitle, setStoryTitle] = useState('');
  const [storyIdx, setStoryIdx] = useState(0);
  const [storyLoading, setStoryLoading] = useState(false);
  const [dataView, setDataView] = useState(false);
  const listRef = useRef(null);

  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(searchInput), 250);
    return () => clearTimeout(t);
  }, [searchInput]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      setLoadError(null);
      try {
        const b = await loadTimelineEvents(apiBase);
        if (cancelled) return;
        setBundle(b);
      } catch (e) {
        if (!cancelled) setLoadError(e?.message || 'Failed to load timeline');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [apiBase]);

  const enrichedEvents = useMemo(() => {
    if (!bundle?.events) return [];
    return attachMapIcons(bundle.events, mapEvents || []);
  }, [bundle, mapEvents]);

  const grouped = useMemo(() => groupEventsByEra(enrichedEvents), [enrichedEvents]);

  const eraOrder = useMemo(() => {
    const fromMeta = bundle?.eraGroups?.map((g) => g.name) || [];
    const seen = new Set(fromMeta);
    for (const e of enrichedEvents) {
      if (e.eraGroup && !seen.has(e.eraGroup)) {
        fromMeta.push(e.eraGroup);
        seen.add(e.eraGroup);
      }
    }
    return fromMeta;
  }, [bundle, enrichedEvents]);

  const filteredEvents = useMemo(() => {
    let list = [...enrichedEvents];
    list = filterByTestament(list, testament === 'OT' ? 'OT' : testament === 'NT' ? 'NT' : 'all');
    list = searchTimelineEvents(debouncedSearch, list);
    if (filterMajor) list = list.filter((e) => e._computed?.importance === 'major');
    if (filterJesus) list = list.filter((e) => (e.eraGroup || '').toLowerCase().includes('jesus') || (e.title || '').toLowerCase().includes('jesus'));
    if (filterMap) list = list.filter((e) => Boolean(e._computed?.mapEventId));
    return sortTimelineEvents(list);
  }, [enrichedEvents, testament, debouncedSearch, filterMajor, filterJesus, filterMap]);

  const selected = useMemo(() => enrichedEvents.find((e) => e.id === selectedId) || null, [enrichedEvents, selectedId]);

  const related = useMemo(() => (selected ? getRelatedEvents(selected.id, enrichedEvents) : []), [selected, enrichedEvents]);

  const eraStats = useMemo(() => {
    const stats = new Map();
    for (const name of eraOrder) {
      const evs = grouped.get(name) || [];
      const years = evs.map((e) => e?.date?.sortYear).filter((y) => typeof y === 'number');
      const minY = years.length ? Math.min(...years) : null;
      const maxY = years.length ? Math.max(...years) : null;
      stats.set(name, {
        count: evs.length,
        range: minY != null && maxY != null ? `${minY} → ${maxY}` : '—'
      });
    }
    return stats;
  }, [eraOrder, grouped]);

  const scrollToEra = useCallback((eraName) => {
    setSelectedId(null);
    setActiveEra(eraName);
    const id = `bt-era-${encodeURIComponent(eraName).replace(/%/g, '_')}`;
    requestAnimationFrame(() => {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  }, []);

  const runAiExplain = useCallback(async () => {
    if (!selected) return;
    setAiLoading(true);
    setAiResult(null);
    try {
      const r = await fetch(`${apiBase.replace(/\/$/, '')}/api/timeline/explain`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ event: selected, mode: aiMode })
      });
      const data = await r.json();
      if (!r.ok) throw new Error(data.error || 'AI request failed');
      setAiResult(data);
    } catch (e) {
      setAiResult({ summary: e.message || 'Could not load AI insight.', mode: 'error' });
    } finally {
      setAiLoading(false);
    }
  }, [apiBase, selected, aiMode]);

  const runStoryMode = useCallback(async () => {
    const pool = activeEra ? (grouped.get(activeEra) || []).slice(0, 24) : filteredEvents.slice(0, 24);
    if (!pool.length) return;
    setStoryLoading(true);
    setStoryOpen(true);
    setStoryIdx(0);
    try {
      const r = await fetch(`${apiBase.replace(/\/$/, '')}/api/timeline/story-mode`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ events: pool, audience: 'general', duration: 'short' })
      });
      const data = await r.json();
      if (!r.ok) throw new Error(data.error || 'Story mode failed');
      setStoryTitle(data.title || 'Timeline story');
      setStoryScenes(Array.isArray(data.scenes) ? data.scenes : []);
    } catch {
      setStoryTitle('Story mode');
      setStoryScenes([]);
    } finally {
      setStoryLoading(false);
    }
  }, [apiBase, activeEra, grouped, filteredEvents]);

  const exportJson = () => {
    const blob = new Blob([JSON.stringify({ exportedAt: new Date().toISOString(), events: filteredEvents }, null, 2)], {
      type: 'application/json'
    });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'bible-timeline-export.json';
    a.click();
    URL.revokeObjectURL(a.href);
  };

  if (loading) {
    return (
      <div className={styles.root} style={{ alignItems: 'center', justifyContent: 'center', gap: 12 }}>
        <Loader2 className="spin" size={28} />
        <p>Loading Bible timeline…</p>
      </div>
    );
  }

  if (loadError || !bundle) {
    return (
      <div className={styles.root} style={{ padding: 24 }}>
        <p>{loadError || 'No data'}</p>
        <button type="button" className="secondary" onClick={onClose}>
          Back
        </button>
      </div>
    );
  }

  const mapId = selected?._computed?.mapEventId;
  const lineageCtx = selected ? getLineageContextForTimeline(selected.id, selected.title) : null;

  return (
    <div className={styles.root}>
      <header className={styles.header}>
        <div className={styles.headerTop}>
          <div className={styles.titleBlock}>
            <h1>Bible Timeline</h1>
            <p>Explore the Bible from Creation to Revelation through time, events, people, places, and Scripture.</p>
          </div>
          <div className={styles.headerActions}>
            <button type="button" className={`secondary ${testament === 'OT' ? 'active' : ''}`} onClick={() => setTestament('OT')}>
              Old Testament
            </button>
            <button type="button" className={`secondary ${testament === 'NT' ? 'active' : ''}`} onClick={() => setTestament('NT')}>
              New Testament
            </button>
            <button type="button" className={`secondary ${testament === 'all' ? 'active' : ''}`} onClick={() => setTestament('all')}>
              All
            </button>
            <button type="button" className="secondary" onClick={runStoryMode}>
              <Film size={16} /> Story mode
            </button>
            <button type="button" className="secondary" onClick={exportJson}>
              <Download size={16} /> Export
            </button>
            <button type="button" className="icon-button" aria-label="Close timeline" onClick={onClose}>
              <X size={22} />
            </button>
          </div>
        </div>
        <div className={styles.searchWrap}>
          <div className={styles.search}>
            <Search size={18} aria-hidden />
            <input
              type="search"
              placeholder="Search events, books, references, eras…"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              aria-label="Search timeline"
            />
          </div>
          <span style={{ fontSize: 12, color: 'var(--muted)' }}>{filteredEvents.length} events</span>
        </div>
        <div className={styles.filters}>
          <button type="button" className={`${styles.filterBtn} ${filterMajor ? styles.filterBtnOn : ''}`} onClick={() => setFilterMajor((v) => !v)}>
            Major events
          </button>
          <button type="button" className={`${styles.filterBtn} ${filterJesus ? styles.filterBtnOn : ''}`} onClick={() => setFilterJesus((v) => !v)}>
            Jesus
          </button>
          <button type="button" className={`${styles.filterBtn} ${filterMap ? styles.filterBtnOn : ''}`} onClick={() => setFilterMap((v) => !v)}>
            Map match
          </button>
        </div>
      </header>

      <div className={styles.main}>
        <aside className={styles.sidebar}>
          <p className={styles.sidebarTitle}>Bible eras</p>
          <button
            type="button"
            className={`${styles.eraCard} ${activeEra === null ? styles.eraCardActive : ''}`}
            onClick={() => {
              setActiveEra(null);
              setSelectedId(null);
              listRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          >
            <strong>All eras</strong>
            <div className={styles.eraMeta}>{enrichedEvents.length} events · full timeline</div>
          </button>
          {eraOrder.map((name) => {
            const st = eraStats.get(name);
            return (
              <button
                key={name}
                type="button"
                className={`${styles.eraCard} ${activeEra === name ? styles.eraCardActive : ''}`}
                onClick={() => scrollToEra(name)}
              >
                <strong>{name}</strong>
                <div className={styles.eraMeta}>
                  {st?.count ?? 0} events · {st?.range ?? '—'}
                </div>
              </button>
            );
          })}
        </aside>

        <section className={styles.canvas} ref={listRef}>
          <div className={styles.canvasInner}>
            {activeEra === null
              ? eraOrder.map((eraName) => {
                  const evs = grouped.get(eraName) || [];
                  const visible = evs.filter((e) => filteredEvents.some((f) => f.id === e.id));
                  if (!visible.length) return null;
                  return (
                    <div key={eraName} id={`bt-era-${encodeURIComponent(eraName).replace(/%/g, '_')}`} style={{ marginBottom: 20 }}>
                      <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: 16, margin: '0 0 10px', color: '#142a28' }}>{eraName}</h3>
                      {visible.map((e) => (
                        <EventRow key={e.id} event={e} selected={selectedId === e.id} onSelect={() => setSelectedId(e.id)} />
                      ))}
                    </div>
                  );
                })
              : (grouped.get(activeEra) || [])
                  .filter((e) => filteredEvents.some((f) => f.id === e.id))
                  .map((e) => <EventRow key={e.id} event={e} selected={selectedId === e.id} onSelect={() => setSelectedId(e.id)} />)}
          </div>
        </section>

        <aside className={styles.detail}>
          {!selected && activeEra ? (
            <div className={styles.welcome}>
              <h2 style={{ margin: '0 0 8px', fontFamily: 'var(--font-serif)', fontSize: 18 }}>{activeEra}</h2>
              <p style={{ margin: 0, fontSize: 13, lineHeight: 1.5 }}>
                {eraStats.get(activeEra)?.count ?? 0} events in this era · span {eraStats.get(activeEra)?.range ?? '—'}. Scroll the center column or pick an event card.
              </p>
            </div>
          ) : !selected ? (
            <div className={styles.welcome}>
              <strong>Select an event</strong> to explore its Bible context, references, and connections to the map and family lineage.
            </div>
          ) : (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8 }}>
                <div>
                  <p style={{ margin: 0, fontSize: 12, color: '#6b8f7a', fontWeight: 700 }}>{getTimelineDateDisplay(selected)}</p>
                  <h2 style={{ margin: '6px 0 8px', fontFamily: 'var(--font-serif)', fontSize: 20, color: '#142a28' }}>{selected.title}</h2>
                  <div className={styles.badges}>
                    <span className={styles.badge}>{selected.eraGroup}</span>
                    <span className={selected.scriptureTestament?.includes('New') ? styles.badgeNt : styles.badgeOt}>
                      {selected.scriptureTestament || selected.section}
                    </span>
                    {selected._computed?.importance === 'major' ? <span className={styles.badgeJesus}>Major</span> : null}
                    {(selected.eraGroup || '').toLowerCase().includes('jesus') ? <span className={styles.badgeJesus}>Jesus era</span> : null}
                  </div>
                </div>
                {selected._computed?.iconOrder ? (
                  <BibleEventSprite order={selected._computed.iconOrder} mapIcon="book" variant="drawer" />
                ) : null}
              </div>
              <p style={{ fontSize: 13, marginTop: 12, lineHeight: 1.5, color: '#2d4a47' }}>
                <BookOpen size={14} style={{ verticalAlign: '-2px', marginRight: 6 }} />
                {selected.referenceText}
              </p>
              <ul style={{ margin: '10px 0 0', paddingLeft: 18, fontSize: 13, color: '#2d4a47' }}>
                {getReferencesForEvent(selected).map((r) => (
                  <li key={r}>{r}</li>
                ))}
              </ul>
              <p style={{ fontSize: 12, color: 'var(--muted)', marginTop: 10 }}>{bundle.metadata?.sourceNote}</p>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 16 }}>
                <button type="button" className="primary" disabled={!mapId} onClick={() => mapId && onOpenMapEvent(mapId)} title={mapId ? '' : 'No map anchor'}>
                  <MapIcon size={16} /> Open on map
                </button>
                <button type="button" className="secondary" disabled={!lineageCtx?.mapEventId} onClick={() => lineageCtx?.mapEventId && onOpenLineage(lineageCtx.mapEventId)}>
                  <GitBranch size={16} /> Open lineage
                </button>
                <button type="button" className="secondary" onClick={() => window.alert('Study notes can be saved in a future update.')}>
                  <BookMarked size={16} /> Study note
                </button>
              </div>

              <div style={{ marginTop: 20, paddingTop: 16, borderTop: '1px solid rgba(12,91,90,0.1)' }}>
                <h3 style={{ fontSize: 13, margin: '0 0 8px' }}>AI explain</h3>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 8 }}>
                  {EXPLAIN_MODES.map((m) => (
                    <button key={m.id} type="button" className={`secondary ${aiMode === m.id ? 'active' : ''}`} onClick={() => setAiMode(m.id)}>
                      {m.label}
                    </button>
                  ))}
                  <button type="button" className="primary" onClick={runAiExplain} disabled={aiLoading}>
                    {aiLoading ? <Loader2 className="spin" size={16} /> : <Sparkles size={16} />} Explain
                  </button>
                </div>
                {aiResult ? (
                  <div style={{ fontSize: 13, lineHeight: 1.55, color: '#2d4a47' }}>
                    {aiResult.summary ? (
                      <p>
                        <strong>Summary</strong> — {aiResult.summary}
                      </p>
                    ) : null}
                    {aiResult.whyItMatters ? (
                      <p>
                        <strong>Why it matters</strong> — {aiResult.whyItMatters}
                      </p>
                    ) : null}
                    {aiResult.historicalContext ? (
                      <p>
                        <strong>Context</strong> — {aiResult.historicalContext}
                      </p>
                    ) : null}
                    {aiResult.spiritualLesson ? (
                      <p>
                        <strong>Lesson</strong> — {aiResult.spiritualLesson}
                      </p>
                    ) : null}
                  </div>
                ) : null}
              </div>

              {related.length ? (
                <div style={{ marginTop: 18 }}>
                  <h3 style={{ fontSize: 13 }}>Related in this era</h3>
                  <ul style={{ fontSize: 12, paddingLeft: 16 }}>
                    {related.map((r) => (
                      <li key={r.id}>
                        <button type="button" className="link-button" onClick={() => setSelectedId(r.id)}>
                          {r.title}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}

              <button type="button" className="link-button" style={{ marginTop: 16 }} onClick={() => setDataView((v) => !v)}>
                {dataView ? 'Hide data view' : 'View data'}
              </button>
              {dataView ? <pre className={styles.dataPre}>{JSON.stringify({ event: selected, mapId, lineageCtx }, null, 2)}</pre> : null}
            </div>
          )}
        </aside>
      </div>

      <footer className={styles.scrubber}>
        {eraOrder.map((name) => (
          <button
            key={name}
            type="button"
            className={`${styles.scrubChip} ${activeEra === name ? styles.scrubChipActive : ''}`}
            onClick={() => scrollToEra(name)}
          >
            {scrubLabelForEra(name)}
          </button>
        ))}
      </footer>

      {storyOpen ? (
        <div className={styles.storyOverlay} role="dialog" aria-modal="true">
          <div className={styles.storyDialog}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8 }}>
              <h2 style={{ margin: 0, fontFamily: 'var(--font-serif)', fontSize: 18 }}>{storyTitle}</h2>
              <button type="button" className="icon-button" aria-label="Close" onClick={() => setStoryOpen(false)}>
                <X size={20} />
              </button>
            </div>
            {storyLoading ? (
              <p style={{ marginTop: 16 }}>
                <Loader2 className="spin" size={20} /> Preparing scenes…
              </p>
            ) : storyScenes[storyIdx] ? (
              <div style={{ marginTop: 14 }}>
                <p style={{ fontSize: 12, color: 'var(--muted)' }}>
                  Scene {storyIdx + 1} / {storyScenes.length}
                </p>
                <h3 style={{ fontSize: 16 }}>{storyScenes[storyIdx].title}</h3>
                <p style={{ fontSize: 14, lineHeight: 1.5 }}>{storyScenes[storyIdx].voiceText}</p>
                <p style={{ fontSize: 12 }}>{storyScenes[storyIdx].scriptureReference}</p>
                <div style={{ display: 'flex', gap: 8, marginTop: 16 }}>
                  <button type="button" className="secondary" disabled={storyIdx <= 0} onClick={() => setStoryIdx((i) => i - 1)}>
                    Previous
                  </button>
                  <button type="button" className="primary" disabled={storyIdx >= storyScenes.length - 1} onClick={() => setStoryIdx((i) => i + 1)}>
                    Next <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            ) : (
              <p style={{ marginTop: 12 }}>No scenes returned.</p>
            )}
          </div>
        </div>
      ) : null}
    </div>
  );
}

function EventRow({ event, selected, onSelect }) {
  const nt = (event.scriptureTestament || '').toLowerCase().includes('new');
  const major = event._computed?.importance === 'major';
  return (
    <button
      type="button"
      className={`${styles.eventCard} ${selected ? styles.eventCardSelected : ''} ${major ? styles.eventCardMajor : ''}`}
      onClick={onSelect}
    >
      <div className={styles.rowTop}>
        {event._computed?.iconOrder ? (
          <BibleEventSprite order={event._computed.iconOrder} mapIcon="book" variant="list" />
        ) : (
          <span style={{ width: 40, height: 40 }} />
        )}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8, alignItems: 'baseline' }}>
            <span className={styles.date}>{event.dateLabel}</span>
            <span className={styles.badge} style={{ fontSize: 8 }}>
              Open
            </span>
          </div>
          <h4 className={styles.title}>{event.title}</h4>
          <div className={styles.badges}>
            <span className={nt ? styles.badgeNt : styles.badgeOt}>{event.scriptureTestament || event.section}</span>
            <span className={styles.badge}>{event.eraGroup?.length > 22 ? `${event.eraGroup.slice(0, 20)}…` : event.eraGroup}</span>
            {major ? <span className={styles.badgeJesus}>Major</span> : null}
          </div>
          <p className={styles.ref}>{event.referenceText}</p>
        </div>
      </div>
    </button>
  );
}
