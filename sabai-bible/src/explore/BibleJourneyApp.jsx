/**
 * BibleJourneyApp — the full interactive Bible Journey Map embedded
 * as a self-contained component inside the SabAI Bible landing page.
 *
 * All imports use paths relative to src/explore/ so nothing references
 * the old repo root.
 */
import 'leaflet/dist/leaflet.css';
import './styles.css';
import L from 'leaflet';

// Fix Leaflet's default marker icons broken by Vite's asset hashing
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon   from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl:       markerIcon,
  shadowUrl:     markerShadow,
});

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import localEvents  from './data/bibleEvents.json';
import lineageTree  from './data/bible_lineage_timeline_family_tree.json';
import JourneyMap   from './components/JourneyMap.jsx';
import LineageTreeModal from './components/LineageTreeModal.jsx';
import BibleTimelineExplorer from './features/timeline/BibleTimelineExplorer.jsx';
import EventArtIcon  from './components/EventArtIcon.jsx';
import SpriteDebugGrid from './components/SpriteDebugGrid.jsx';
import { buildLineageIndex, matchEventToLineagePersonIds } from './lib/lineageMatch.js';
import { highlightEdgesForNodes, highlightNodesForTargets } from './lib/lineagePath.js';
import { getPersonPerspectiveEntry } from './lib/eventPersonPerspective.js';
import { timelineMatchFromEventEra } from './lib/timelineEra.js';
import {
  BookOpen, CalendarDays, ChevronLeft, ChevronRight, Download,
  Filter, GitBranch, HardDrive, Loader2, Map, Maximize2, MessageCircle,
  Minimize2, Pause, Play, Search, Settings, Sparkles, TreePine, Users,
  Wand2, X
} from 'lucide-react';

// API base — falls back gracefully to local data when no server is present
const API_BASE = import.meta.env.VITE_API_BASE || '';

const TIMELINE = [
  { label: 'Primeval',   match: 'Primeval',   sub: 'Beginning' },
  { label: 'Patriarchs', match: 'Patriarchs', sub: '2000–1700 BC' },
  { label: 'Exodus',     match: 'Exodus',     sub: '1600–1400 BC' },
  { label: 'Conquest',   match: 'Conquest',   sub: '1406 BC' },
  { label: 'Judges',     match: 'Judges',     sub: '1350–1050 BC' },
  { label: 'Kingdom',    match: 'Kingdom',    sub: '1050–586 BC' },
  { label: 'Exile',      match: 'Exile',      sub: '586–538 BC' },
  { label: 'Jesus',      match: 'Jesus',      sub: '5 BC–AD 30' },
];

function initials(name) {
  return name.split(/\s+/).slice(0, 2).map((w) => w[0]).join('').toUpperCase();
}
function lineageStepSubtitle(name, index, arr) {
  const n = arr.length;
  if (n <= 1) return 'Story anchor';
  if (index === n - 1) return 'Current story focus';
  if (index === 0) return 'Earlier in the line';
  return `From ${arr[index - 1]}`;
}
function formatLineageThread(names) {
  if (!names?.length) return '';
  if (names.length <= 3) return names.join(' → ');
  return `${names[0]} → … → ${names[names.length - 1]}`;
}
function roleForPerson(name, event) {
  const lower = name.toLowerCase();
  if (lower.includes('god'))      return 'Divine actor and covenant source';
  if (lower.includes('jesus'))    return 'Central figure of redemption';
  if (lower.includes('moses'))    return 'Deliverer and covenant leader';
  if (lower.includes('abraham'))  return 'Patriarch and promise bearer';
  if (lower.includes('david'))    return 'King and messianic ancestor';
  if (lower.includes('joseph'))   return 'Protector and providential leader';
  if (lower.includes('mary'))     return 'Mother of Jesus';
  if (lower.includes('paul'))     return 'Apostle and missionary';
  if (lower.includes('pharaoh'))  return 'Opposing ruler';
  if (lower.includes('israel'))   return 'People connected to the event';
  return `Involved in ${event.title}`;
}

function EventList({ events, selected, onSelect, query, setQuery, activeEra }) {
  const listRef = useRef(null);
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return events.filter((event) => {
      const matchesQuery = !q || [event.title, event.era, event.timelineDate, event.mapLocation, ...(event.references || []), ...(event.mainPeople || [])].join(' ').toLowerCase().includes(q);
      const matchesEra = !activeEra || event.era.toLowerCase().includes(activeEra.toLowerCase()) || activeEra === 'All';
      return matchesQuery && matchesEra;
    });
  }, [events, query, activeEra]);
  useEffect(() => {
    listRef.current?.querySelector(`button[data-event-id="${selected.id}"]`)?.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
  }, [selected.id]);
  const listSummary = useMemo(() => {
    if (activeEra && activeEra !== 'All') return `${activeEra} · ${filtered.length} of ${events.length}`;
    if (filtered.length !== events.length) return `${filtered.length} match${filtered.length === 1 ? '' : 'es'} · ${events.length} total`;
    return `All ${events.length} stories`;
  }, [activeEra, filtered.length, events.length]);
  return (
    <section className="events-panel panel">
      <div className="panel-title-row">
        <div><h2>Events</h2><p>{listSummary}</p></div>
        <button type="button" className="icon-button" aria-label="Filter events"><Filter size={16} /></button>
      </div>
      <div className="mini-search"><Search size={15} aria-hidden /><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search title, people, places…" /></div>
      <div className="event-list" ref={listRef}>
        {filtered.map((event) => (
          <button key={event.id} type="button" data-event-id={event.id} onClick={() => onSelect(event.id)} className={`event-row ${event.id === selected.id ? 'selected' : ''}`}>
            <EventArtIcon order={event.order} mapIcon={event.mapIcon} variant="list" />
            <span className="event-copy"><strong>{event.title}</strong><small>{event.references?.[0]} · {event.timelineDate}</small></span>
            <span className="event-order">{event.order}</span>
          </button>
        ))}
      </div>
    </section>
  );
}

function TopBar({ storyMode, setStoryMode, workspace, onWorkspace }) {
  return (
    <header className="topbar">
      <div><h1>Bible Journey Map</h1><span>Interactive atlas — real tiles, story markers, and journey routes</span></div>
      <div className="global-search"><Search size={18} /><input placeholder="Search events, people, places..." /></div>
      {/* Workspace toggle — Map vs Timeline */}
      <div style={{ display: 'flex', gap: '6px' }}>
        <button
          type="button"
          onClick={() => onWorkspace('journey')}
          className={`top-button${workspace === 'journey' ? ' active' : ''}`}
          style={{ gap: '6px' }}
        >
          <Map size={15} /> Map
        </button>
        <button
          type="button"
          onClick={() => onWorkspace('timeline')}
          className={`top-button${workspace === 'timeline' ? ' active' : ''}`}
          style={{ gap: '6px' }}
        >
          <CalendarDays size={15} /> Timeline
        </button>
      </div>
      <button onClick={() => setStoryMode(!storyMode)} className={`story-toggle ${storyMode ? 'on' : ''}`}>Story Mode <span /></button>
      <button className="icon-button"><Settings size={18} /></button>
    </header>
  );
}

function RightPanel({ selected, content, lineageMatchSummary, lineageFocusLabels, onOpenLineageTree, onViewAllPeople }) {
  const people = selected.mainPeople || [];
  const thread = selected.lineageConnection || [];
  const threadPreview = formatLineageThread(thread);
  const [personPerspectiveName, setPersonPerspectiveName] = useState(null);
  useEffect(() => { setPersonPerspectiveName(null); }, [selected.id]);
  useEffect(() => {
    if (!personPerspectiveName) return;
    const onKey = (e) => { if (e.key === 'Escape') setPersonPerspectiveName(null); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [personPerspectiveName]);
  const perspectiveEntry = personPerspectiveName != null ? getPersonPerspectiveEntry(selected.id, personPerspectiveName) : null;
  const perspectiveFallback = personPerspectiveName != null
    ? `Scripture does not include a separate first-person account for ${personPerspectiveName} in this scene. Open ${selected.references?.[0] || 'the relevant passage'} and read it with the event summary above. A useful lens from the text: ${selected.lesson}`
    : '';
  return (
    <aside className="right-panel">
      <section className="panel lineage-panel">
        <div className="lineage-panel__head">
          <div className="panel-title-row lineage-panel__title-row">
            <div><h2>Family thread</h2><p>How this story sits in Scripture's big story</p></div>
            <button type="button" className="icon-button" title="Open full family tree" onClick={onOpenLineageTree}><TreePine size={17} /></button>
          </div>
        </div>
        {lineageFocusLabels.length > 0 && (
          <div className="lineage-panel__focus-track">
            <span className="lineage-panel__focus-heading"><Sparkles size={14} aria-hidden /> Tree match for this event</span>
            <div className="lineage-panel__focus-pills">
              {lineageFocusLabels.slice(0, 5).map((name, i) => <span key={`${name}-${i}`} className="lineage-panel__pill">{name}</span>)}
              {lineageFocusLabels.length > 5 && <span className="lineage-panel__pill lineage-panel__pill--more">+{lineageFocusLabels.length - 5}</span>}
            </div>
          </div>
        )}
        {threadPreview && <p className="lineage-panel__thread-preview" title={thread.join(' → ')}><GitBranch size={14} aria-hidden /> {threadPreview}</p>}
        <div className="lineage-vine">
          {(selected.lineageConnection || []).length ? (
            (selected.lineageConnection || []).slice(0, 8).map((name, index, arr) => (
              <div key={`${name}-${index}`} className={`lineage-step ${index === arr.length - 1 ? 'lineage-step--active' : ''}`}>
                <div className="lineage-step__avatar-col">
                  {index > 0 && <span className="lineage-step__stem lineage-step__stem--up" aria-hidden />}
                  <div className="lineage-step__portrait-ring"><div className="portrait">{initials(name)}</div></div>
                  {index < arr.length - 1 && <span className="lineage-step__stem lineage-step__stem--down" aria-hidden />}
                </div>
                <div className="lineage-step__body"><strong>{name}</strong><small>{lineageStepSubtitle(name, index, arr)}</small></div>
              </div>
            ))
          ) : <p className="lineage-vine__empty">No lineage path for this event yet.</p>}
        </div>
        <div className="lineage-panel__cta-card">
          <div className="lineage-panel__cta-icon" aria-hidden><TreePine size={22} /></div>
          <div className="lineage-panel__cta-copy">
            <strong>Explore the full tree</strong>
            <p>{lineageMatchSummary ? <>Poster view highlights <em>{lineageMatchSummary}</em> on the messianic line.</> : <>Open the illustrated poster or the complete graph — names light up where this event connects.</>}</p>
          </div>
          <button type="button" className="primary lineage-panel__tree-cta" onClick={onOpenLineageTree}>Open tree <ChevronRight size={16} aria-hidden /></button>
        </div>
        {content?.lineageExplanation && <p className="ai-note">{content.lineageExplanation}</p>}
      </section>
      <section className="panel people-panel">
        <div className="panel-title-row">
          <div><h2>People Involved</h2><p>Tap someone to read their angle on this event</p></div>
          <button type="button" className="icon-button" aria-label="People involved"><Users size={17} /></button>
        </div>
        <div className="people-list">
          {people.map((name) => (
            <button key={name} type="button" className="person-row" onClick={() => setPersonPerspectiveName(name)}>
              <div className="portrait gold">{initials(name)}</div>
              <div className="person-row__text"><strong>{name}</strong><small>{roleForPerson(name, selected)}</small></div>
              <span className="person-row__hint" aria-hidden><MessageCircle size={16} strokeWidth={2} /></span>
            </button>
          ))}
        </div>
        <button type="button" className="link-button" onClick={onViewAllPeople}>View All People <ChevronRight size={15} /></button>
      </section>
      {personPerspectiveName && (
        <div className="person-perspective-root" role="dialog" aria-modal="true" aria-labelledby="person-perspective-title">
          <button type="button" className="person-perspective-backdrop" aria-label="Close" onClick={() => setPersonPerspectiveName(null)} />
          <div className="person-perspective-dialog">
            <button type="button" className="icon-button person-perspective__close" aria-label="Close" onClick={() => setPersonPerspectiveName(null)}><X size={20} /></button>
            <p className="person-perspective__kicker">Perspective on this event</p>
            <h2 id="person-perspective-title">{personPerspectiveName}</h2>
            <p className="person-perspective__event">{selected.title}</p>
            {selected.references?.[0] && <p className="person-perspective__ref"><BookOpen size={14} aria-hidden /> {selected.references[0]}</p>}
            <div className="person-perspective__body"><p>{perspectiveEntry?.perspective ?? perspectiveFallback}</p></div>
            <button type="button" className="primary person-perspective__done" onClick={() => setPersonPerspectiveName(null)}>Close</button>
          </div>
        </div>
      )}
    </aside>
  );
}

function Timeline({ activeEra, setActiveEra, scrollFocusPulse = 0 }) {
  const trackRef  = useRef(null);
  const sectionRef = useRef(null);
  useEffect(() => {
    if (!scrollFocusPulse) return;
    const run = () => {
      sectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      const active = trackRef.current?.querySelector('.timeline-node.active');
      active?.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
    };
    const id = window.requestAnimationFrame(() => window.requestAnimationFrame(run));
    return () => window.cancelAnimationFrame(id);
  }, [scrollFocusPulse, activeEra]);
  const scrollBy = (delta) => trackRef.current?.scrollBy({ left: delta, behavior: 'smooth' });
  return (
    <section ref={sectionRef} id="bible-timeline" className="timeline panel">
      <div className="timeline-heading"><CalendarDays size={18} aria-hidden /><strong>Bible Timeline</strong></div>
      <button type="button" className="round timeline-nav timeline-nav--prev" aria-label="Scroll timeline earlier" onClick={() => scrollBy(-160)}><ChevronLeft size={18} /></button>
      <div className="timeline-track" ref={trackRef}>
        <div className="timeline-track__rail" aria-hidden />
        {TIMELINE.map((t) => (
          <button key={t.label} type="button" data-timeline-match={t.match} onClick={() => setActiveEra(activeEra === t.match ? 'All' : t.match)} className={`timeline-node ${activeEra === t.match ? 'active' : ''}`}>
            <span className="timeline-node__dot" />
            <strong className="timeline-node__label">{t.label}</strong>
            <small className="timeline-node__sub">{t.sub}</small>
          </button>
        ))}
      </div>
      <button type="button" className="round timeline-nav timeline-nav--next" aria-label="Scroll timeline later" onClick={() => scrollBy(160)}><ChevronRight size={18} /></button>
    </section>
  );
}

function StoryCacheChoiceModal({ meta, eventLabel, busy, enterConfirm, onCloseNotNow, onLoadSaved, onConfirmReplace }) {
  const [step, setStep] = useState(() => (enterConfirm ? 'confirm' : 'pick'));
  useEffect(() => { setStep(enterConfirm ? 'confirm' : 'pick'); }, [meta?.eventId, enterConfirm]);
  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape' && !busy) onCloseNotNow(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [busy, onCloseNotNow]);
  if (!meta) return null;
  const dateStr = meta.generatedAt ? new Date(meta.generatedAt).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' }) : 'Unknown date';
  return (
    <div className="story-cache-modal-root" role="dialog" aria-modal="true" aria-labelledby="story-cache-title">
      <button type="button" className="story-cache-modal-backdrop" aria-label="Close dialog" onClick={() => !busy && onCloseNotNow()} />
      <div className="story-cache-modal">
        <button type="button" className="story-cache-modal__close" aria-label="Close" onClick={() => !busy && onCloseNotNow()}><X size={20} /></button>
        {step === 'pick' ? (
          <>
            <div className="story-cache-modal__icon"><HardDrive size={28} /></div>
            <h2 id="story-cache-title">Saved AI story video</h2>
            <p className="story-cache-modal__lede"><strong>{eventLabel}</strong> already has generated scenes and narration.</p>
            <ul className="story-cache-modal__facts">
              <li>Saved: {dateStr}</li><li>Scenes: {meta.sceneCount}</li>
              <li>Narration: {meta.hasAudio ? 'Yes' : 'No'}</li>
              <li className="story-cache-modal__ref">{meta.reference || meta.title}</li>
            </ul>
            <div className="story-cache-modal__actions">
              <button type="button" className="primary" disabled={busy} onClick={onLoadSaved}>{busy ? 'Loading…' : 'Load saved story'}</button>
              <button type="button" className="secondary" disabled={busy} onClick={() => setStep('confirm')}><Wand2 size={16} /> Create new version</button>
              <button type="button" className="story-cache-modal__ghost" disabled={busy} onClick={onCloseNotNow}>Not now</button>
            </div>
          </>
        ) : (
          <>
            <h2 className="story-cache-modal__warn-title">Replace saved files?</h2>
            <p className="story-cache-modal__lede">A new run will call Gemini again and overwrite images and narration for <strong>{eventLabel}</strong>.</p>
            <div className="story-cache-modal__actions">
              <button type="button" className="secondary" disabled={busy} onClick={() => setStep('pick')}>Back</button>
              <button type="button" className="primary danger" disabled={busy} onClick={onConfirmReplace}>{busy ? 'Generating…' : 'Yes, replace cache'}</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function StoryPlayer({ story, loading, onGenerate, onRegenerate, cacheBanner, onLoadCachedInline, onOpenReplaceModal, onDismissCacheBanner, audioRef, playing, setPlaying, sceneIndex, setSceneIndex, apiBase, sectionRef, exportEventId }) {
  const [audioProgress, setAudioProgress]   = useState(0);
  const [audioDuration, setAudioDuration]   = useState(0);
  const [videoCinema, setVideoCinema]       = useState(false);
  const [mp4Busy, setMp4Busy]               = useState(false);
  const exitCinema = useCallback(() => {
    setVideoCinema(false);
    if (typeof document !== 'undefined' && document.fullscreenElement) document.exitFullscreen().catch(() => {});
  }, []);
  const enterCinema = useCallback(async () => {
    if (!story) return;
    setVideoCinema(true);
    requestAnimationFrame(() => { sectionRef?.current?.requestFullscreen?.().catch(() => {}); });
  }, [story, sectionRef]);
  useEffect(() => {
    if (!videoCinema) return;
    const onFsChange = () => { if (!document.fullscreenElement) setVideoCinema(false); };
    document.addEventListener('fullscreenchange', onFsChange);
    return () => document.removeEventListener('fullscreenchange', onFsChange);
  }, [videoCinema]);
  useEffect(() => {
    if (!story) setVideoCinema(false);
  }, [story]);
  useEffect(() => {
    if (!story || story.audioUrl) return;
    let i = 0;
    const timer = setInterval(() => { i = (i + 1) % story.scenes.length; setSceneIndex(i); }, 4500);
    return () => clearInterval(timer);
  }, [story, setSceneIndex]);
  const audioSrc = story?.audioUrl ? `${apiBase}${story.audioUrl}` : null;
  const scene  = story?.scenes?.[sceneIndex];
  const imgSrc = scene?.imageUrl ? `${apiBase}${scene.imageUrl}` : null;
  const toggle = async () => {
    if (!audioRef.current || !audioSrc) return;
    if (playing) { audioRef.current.pause(); setPlaying(false); }
    else { await audioRef.current.play(); setPlaying(true); }
  };
  const downloadStoryMp4 = useCallback(async () => {
    const id = story?.eventId || exportEventId;
    if (!id || !story?.audioUrl) return;
    setMp4Busy(true);
    try {
      const r = await fetch(`${apiBase}/api/events/${id}/story-video.mp4`);
      if (!r.ok) { const e = await r.json().catch(() => ({})); throw new Error(e.error || `Download failed (${r.status})`); }
      const blob = await r.blob();
      const url  = URL.createObjectURL(blob);
      const a = document.createElement('a'); a.href = url; a.download = `${id}-story.mp4`; a.rel = 'noopener';
      document.body.appendChild(a); a.click(); a.remove(); URL.revokeObjectURL(url);
    } catch (e) { window.alert(e?.message || 'Could not build the video file.'); }
    finally { setMp4Busy(false); }
  }, [apiBase, story?.eventId, story?.audioUrl, exportEventId]);
  const onAudioTime = (e) => {
    if (!story?.scenes?.length) return;
    const el = e.currentTarget; const d = el.duration;
    if (d && Number.isFinite(d)) { setAudioDuration(d); setAudioProgress((el.currentTime / d) * 100); }
    const totalDuration = story.scenes.reduce((a, s) => a + Number(s.durationSec || 6), 0);
    let acc = 0;
    for (let i = 0; i < story.scenes.length; i++) {
      acc += Number(story.scenes[i].durationSec || totalDuration / story.scenes.length);
      if (el.currentTime <= acc) { setSceneIndex(i); break; }
    }
  };
  return (
    <section ref={sectionRef} className={`player panel story-player${videoCinema ? ' story-player--cinema' : ''}`}>
      {videoCinema && story && <button type="button" className="story-player__cinema-close" onClick={exitCinema} aria-label="Exit fullscreen"><X size={22} /></button>}
      {story && (
        <figure className={`story-theater${loading ? ' story-theater--busy' : ''}`}>
          <div className="story-theater__frame">
            {imgSrc ? <img src={imgSrc} alt={scene?.title || story.title} /> : <div className="story-theater__placeholder">Preparing scene…</div>}
            <div className="story-theater__shade" />
            <figcaption className="story-theater__caption">
              <span className="story-theater__badge">Scene {sceneIndex + 1} of {story.scenes.length}</span>
              <strong>{scene?.title || `Scene ${sceneIndex + 1}`}</strong>
              {scene?.narration && <p>{scene.narration}</p>}
            </figcaption>
          </div>
          {loading && <div className="story-theater__loading" role="status">Updating story…</div>}
          <div className="story-theater__scenes">
            {story.scenes.map((_, i) => <button key={i} type="button" className={`story-theater__tick ${i === sceneIndex ? 'active' : ''} ${i < sceneIndex ? 'done' : ''}`} onClick={() => setSceneIndex(i)} aria-label={`Scene ${i + 1}`} />)}
          </div>
          {audioDuration > 0 && <div className="story-theater__bar" aria-hidden><div className="story-theater__bar-fill" style={{ width: `${audioProgress}%` }} /></div>}
        </figure>
      )}
      <div className="player-toolbar">
        <div className="player-left">
          <div className="player-icon"><Sparkles size={24} /></div>
          <div><h3>AI Story Video</h3><p>Gemini builds illustrated scenes and narration.</p></div>
        </div>
        {story ? (
          <div className="player-actions">
            <button type="button" className="primary" onClick={toggle} disabled={!audioSrc}>{playing ? <Pause size={17} /> : <Play size={17} />} {audioSrc ? 'Play narration' : 'No audio'}</button>
            <audio ref={audioRef} src={audioSrc || undefined} onLoadedMetadata={(e) => { const d = e.currentTarget.duration; if (d && Number.isFinite(d)) setAudioDuration(d); }} onTimeUpdate={onAudioTime} onEnded={() => { setPlaying(false); setAudioProgress(0); }} controls className="player-audio" />
            <div className="scene-stepper" role="tablist">{story.scenes.map((s, i) => <button type="button" key={s.title + i} className={i === sceneIndex ? 'active' : ''} onClick={() => setSceneIndex(i)}>{i + 1}</button>)}</div>
            <button type="button" className="secondary story-cinema-toggle" onClick={videoCinema ? exitCinema : enterCinema}>{videoCinema ? <><Minimize2 size={17} /> Exit</> : <><Maximize2 size={17} /> Fullscreen</>}</button>
            <button type="button" className="secondary story-download-mp4" onClick={downloadStoryMp4} disabled={loading || mp4Busy || !audioSrc}>{mp4Busy ? <><Loader2 size={17} className="story-download-mp4__spin" aria-hidden /> Preparing…</> : <><Download size={17} aria-hidden /> Download MP4</>}</button>
            <button type="button" className="secondary story-regenerate" onClick={onRegenerate} disabled={loading}>{loading ? 'Working…' : 'New version'}</button>
          </div>
        ) : cacheBanner ? (
          <div className="story-cache-inline">
            <div className="story-cache-inline__row"><HardDrive size={20} className="story-cache-inline__icon" aria-hidden /><div><strong>Saved story on this device</strong><p className="story-cache-inline__meta">{cacheBanner.generatedAt ? new Date(cacheBanner.generatedAt).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' }) : 'Unknown date'} · {cacheBanner.sceneCount} scene{cacheBanner.sceneCount === 1 ? '' : 's'}{cacheBanner.hasAudio ? ' · With narration' : ''}</p></div></div>
            <div className="story-cache-inline__actions">
              <button type="button" className="primary" onClick={onLoadCachedInline} disabled={loading}>{loading ? 'Loading…' : 'Load saved story'}</button>
              <button type="button" className="secondary" onClick={onOpenReplaceModal} disabled={loading}><Wand2 size={15} /> New version</button>
              <button type="button" className="story-cache-inline__dismiss" onClick={onDismissCacheBanner}>Hide</button>
            </div>
          </div>
        ) : (
          <button type="button" className="primary" onClick={onGenerate} disabled={loading}>{loading ? 'Creating story…' : 'Create story video'}</button>
        )}
      </div>
    </section>
  );
}

function ContentDrawer({ selected, content, loading, onGenerate }) {
  return (
    <section className="content-drawer panel">
      <div className="drawer-header">
        <div><h2>{selected.title}</h2><p>{selected.references?.join(', ')} · {selected.timelineDate} · {selected.mapLocation}</p></div>
        <button className="secondary" onClick={onGenerate} disabled={loading}>{loading ? 'Creating...' : 'Generate AI Content'}</button>
      </div>
      <div className="drawer-grid">
        <article><h4>Event Details</h4><p>{content?.teachingSummary || selected.details}</p></article>
        <article><h4>Lesson</h4><p>{content?.applicationLesson || selected.lesson}</p></article>
        <article><h4>Map Route</h4><p>{content?.mapExplanation || `${selected.title} is mapped around ${selected.mapLocation}.`}</p></article>
        <article><h4>Video Idea</h4><p>{selected.videoIdea}</p></article>
      </div>
    </section>
  );
}

export default function BibleJourneyApp() {
  const [events, setEvents]                   = useState(localEvents);
  const [selectedId, setSelectedId]           = useState('call_of_abraham');
  const [lineageTreeOpen, setLineageTreeOpen] = useState(false);
  const [lineageTreeEntry, setLineageTreeEntry] = useState('default');
  const [query, setQuery]                     = useState('');
  const [activeEra, setActiveEra]             = useState('All');
  const [storyMode, setStoryMode]             = useState(true);
  const [content, setContent]                 = useState(null);
  const [contentLoading, setContentLoading]   = useState(false);
  const [story, setStory]                     = useState(null);
  const [storyLoading, setStoryLoading]       = useState(false);
  const [sceneIndex, setSceneIndex]           = useState(0);
  const [playing, setPlaying]                 = useState(false);
  const [storyCacheModal, setStoryCacheModal] = useState(null);
  const [storyCacheBanner, setStoryCacheBanner] = useState(null);
  const [mapPopupDismissNonce, setMapPopupDismissNonce] = useState(0);
  const [timelineScrollPulse, setTimelineScrollPulse]   = useState(0);
  const [listSelectSignal, setListSelectSignal]         = useState(0);
  const [spriteDebug, setSpriteDebug]         = useState(false);
  const [workspace, setWorkspace]             = useState('journey');
  const audioRef      = useRef(null);
  const storyPlayerRef = useRef(null);

  useEffect(() => {
    if (!import.meta.env.DEV) return;
    setSpriteDebug(new URLSearchParams(window.location.search).get('spriteDebug') === '1');
  }, []);

  const handleSelectFromMap = useCallback((id) => { setMapPopupDismissNonce((n) => n + 1); setSelectedId(id); }, []);
  const handleSelectFromSidebar = useCallback((id) => { setMapPopupDismissNonce((n) => n + 1); setListSelectSignal((n) => n + 1); setSelectedId(id); }, []);
  const handleFocusEventInTimeline = useCallback((eventId) => {
    const ev = events.find((e) => e.id === eventId);
    const match = timelineMatchFromEventEra(ev?.era);
    setMapPopupDismissNonce((n) => n + 1); setListSelectSignal((n) => n + 1);
    setSelectedId(eventId); setActiveEra(match ?? 'All'); setTimelineScrollPulse((n) => n + 1);
  }, [events]);
  const handleTimelineOpenMap = useCallback((id) => { if (!id) return; setSelectedId(id); setWorkspace('journey'); }, []);
  const handleTimelineOpenLineage = useCallback((id) => { if (!id) return; setSelectedId(id); setLineageTreeEntry('default'); setLineageTreeOpen(true); setWorkspace('journey'); }, []);

  // Try to load live events from API, silently fall back to local JSON
  useEffect(() => {
    if (!API_BASE) return;
    fetch(`${API_BASE}/api/events`).then((r) => r.json()).then(setEvents).catch(() => {});
  }, []);

  const selected = useMemo(() => events.find((e) => e.id === selectedId) || events[0], [events, selectedId]);
  const { peopleById: lineagePeopleById, indexed: lineageIndexed } = useMemo(() => buildLineageIndex(lineageTree.people), []);
  const lineageTargetIds    = useMemo(() => matchEventToLineagePersonIds(selected, lineagePeopleById, lineageIndexed), [selected, lineagePeopleById, lineageIndexed]);
  const lineageHighlightNodes = useMemo(() => highlightNodesForTargets(lineageTargetIds, lineagePeopleById, lineageTree.metadata?.rootId || 'adam'), [lineageTargetIds, lineagePeopleById]);
  const lineageHighlightEdges = useMemo(() => highlightEdgesForNodes(lineageHighlightNodes, lineageTree.relationships || []), [lineageHighlightNodes]);
  const lineageMatchSummary = useMemo(() => lineageTargetIds.map((id) => lineagePeopleById.get(id)?.displayName || lineagePeopleById.get(id)?.name || id).join(' · '), [lineageTargetIds, lineagePeopleById]);
  const lineageFocusLabels  = useMemo(() => lineageTargetIds.map((id) => lineagePeopleById.get(id)?.displayName || lineagePeopleById.get(id)?.name || id), [lineageTargetIds, lineagePeopleById]);

  useEffect(() => {
    setContent(null); setStory(null); setSceneIndex(0); setPlaying(false);
    setStoryCacheModal(null); setStoryCacheBanner(null);
    if (!API_BASE) return;
    const ac = new AbortController();
    (async () => {
      try {
        const r = await fetch(`${API_BASE}/api/events/${selectedId}/story/meta`, { signal: ac.signal });
        if (!r.ok) return;
        const meta = await r.json();
        if (!ac.signal.aborted && meta.cached) setStoryCacheModal(meta);
      } catch { /* silent */ }
    })();
    return () => ac.abort();
  }, [selectedId]);

  const loadCachedStory = async () => {
    setStoryLoading(true);
    try {
      const r = await fetch(`${API_BASE}/api/events/${selected.id}/story`);
      if (!r.ok) throw new Error('Could not load saved story.');
      const data = await r.json();
      if (data.error) throw new Error(data.error);
      setStory(data); setSceneIndex(0); setStoryCacheModal(null); setStoryCacheBanner(null);
      requestAnimationFrame(() => storyPlayerRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }));
    } catch (err) { window.alert(err.message || 'Load failed.'); }
    finally { setStoryLoading(false); }
  };

  const handleCloseStoryCacheModal = () => {
    if (storyCacheModal) { const { enterConfirm: _e, ...snap } = storyCacheModal; setStoryCacheBanner({ ...snap, cached: true }); }
    setStoryCacheModal(null);
  };

  const generateContent = async () => {
    setContentLoading(true);
    try {
      const response = await fetch(`${API_BASE}/api/events/${selected.id}/content`, { method: 'POST' });
      const data = await response.json();
      if (data.error) throw new Error(data.error);
      setContent(data);
    } catch {
      setContent({ teachingSummary: selected.details, applicationLesson: selected.lesson, mapExplanation: `${selected.title} is mapped around ${selected.mapLocation}.`, lineageExplanation: `${selected.title} connects through ${selected.lineageConnection?.join(' → ')}.` });
    } finally { setContentLoading(false); }
  };

  const generateStory = async ({ force = false } = {}) => {
    setStoryLoading(true);
    try {
      const response = await fetch(`${API_BASE}/api/events/${selected.id}/story`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ sceneCount: 4, force }) });
      const data = await response.json();
      if (data.error) throw new Error(data.error);
      setStory(data); setSceneIndex(0); setStoryCacheModal(null); setStoryCacheBanner(null);
      requestAnimationFrame(() => storyPlayerRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }));
    } catch (err) { window.alert(err.message || 'Story generation failed.'); }
    finally { setStoryLoading(false); }
  };

  return (
    <div className="bjm-root">
      <div className="app-shell">
        <div className="app-main">
          <TopBar storyMode={storyMode} setStoryMode={setStoryMode} workspace={workspace} onWorkspace={setWorkspace} />
          {import.meta.env.DEV && spriteDebug && <SpriteDebugGrid />}
          {lineageTreeOpen && (
            <LineageTreeModal open={lineageTreeOpen} onClose={() => { setLineageTreeOpen(false); setLineageTreeEntry('default'); }} tree={lineageTree} highlightNodeIds={lineageHighlightNodes} highlightEdgeIds={lineageHighlightEdges} targetPersonIds={lineageTargetIds} eventTitle={selected.title} selectedEventId={selected.id} entryMode={lineageTreeEntry} />
          )}
          {storyCacheModal && (
            <StoryCacheChoiceModal meta={storyCacheModal} enterConfirm={Boolean(storyCacheModal.enterConfirm)} eventLabel={selected.title} busy={storyLoading} onCloseNotNow={handleCloseStoryCacheModal} onLoadSaved={loadCachedStory} onConfirmReplace={() => generateStory({ force: true })} />
          )}
          {workspace === 'timeline' ? (
            <div className="bible-timeline-workspace">
              <BibleTimelineExplorer apiBase={API_BASE} mapEvents={events} onClose={() => setWorkspace('journey')} onOpenMapEvent={handleTimelineOpenMap} onOpenLineage={handleTimelineOpenLineage} />
            </div>
          ) : (
            <>
              <div className="workspace">
                <EventList events={events} selected={selected} onSelect={handleSelectFromSidebar} query={query} setQuery={setQuery} activeEra={activeEra} />
                <div className="center-stack">
                  <JourneyMap events={events} selected={selected} activeEra={activeEra} onSelect={handleSelectFromMap} onFocusInTimeline={handleFocusEventInTimeline} listSelectSignal={listSelectSignal} story={story} sceneIndex={sceneIndex} apiBase={API_BASE} mapPopupDismissNonce={mapPopupDismissNonce} />
                  <Timeline activeEra={activeEra} setActiveEra={setActiveEra} scrollFocusPulse={timelineScrollPulse} />
                </div>
                <RightPanel selected={selected} content={content} lineageMatchSummary={lineageMatchSummary} lineageFocusLabels={lineageFocusLabels} onOpenLineageTree={() => { setLineageTreeEntry('default'); setLineageTreeOpen(true); }} onViewAllPeople={() => { setLineageTreeEntry('fullMap'); setLineageTreeOpen(true); }} />
              </div>
              <StoryPlayer sectionRef={storyPlayerRef} story={story} loading={storyLoading} onGenerate={() => generateStory()} onRegenerate={() => generateStory({ force: true })} cacheBanner={!story && storyCacheBanner && storyCacheBanner.eventId === selectedId ? storyCacheBanner : null} onLoadCachedInline={loadCachedStory} onOpenReplaceModal={() => { if (storyCacheBanner) { setStoryCacheModal({ ...storyCacheBanner, enterConfirm: true }); setStoryCacheBanner(null); } }} onDismissCacheBanner={() => setStoryCacheBanner(null)} audioRef={audioRef} playing={playing} setPlaying={setPlaying} sceneIndex={sceneIndex} setSceneIndex={setSceneIndex} apiBase={API_BASE} exportEventId={selected.id} />
              <ContentDrawer selected={selected} content={content} loading={contentLoading} onGenerate={generateContent} />
            </>
          )}
        </div>
      </div>
    </div>
  );
}
