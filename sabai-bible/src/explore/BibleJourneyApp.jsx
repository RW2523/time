/**
 * BibleJourneyApp — Tab-based layout: sidebar (events) + canvas (Map/Info/Family/People/Story).
 */
import 'leaflet/dist/leaflet.css';
import './styles.css';
import L from 'leaflet';

import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon   from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({ iconRetinaUrl: markerIcon2x, iconUrl: markerIcon, shadowUrl: markerShadow });

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import localEvents  from './data/bibleEvents.json';
import lineageTree  from './data/bible_lineage_timeline_family_tree.json';
import JourneyMap           from './components/JourneyMap.jsx';
import BibleKnowledgeGraph  from './components/BibleKnowledgeGraph.jsx';
import LineageTreeModal from './components/LineageTreeModal.jsx';
import BibleTimelineExplorer from './features/timeline/BibleTimelineExplorer.jsx';
import EventArtIcon  from './components/EventArtIcon.jsx';
import SpriteDebugGrid from './components/SpriteDebugGrid.jsx';
import { buildLineageIndex, matchEventToLineagePersonIds } from './lib/lineageMatch.js';
import { highlightEdgesForNodes, highlightNodesForTargets } from './lib/lineagePath.js';
import { getPersonPerspectiveEntry } from './lib/eventPersonPerspective.js';
import { timelineMatchFromEventEra } from './lib/timelineEra.js';
import { makeStoryVideo, downloadBlob, saveVideoLocally, loadVideoLocally, isVideoSupported, estimateVideoDuration } from './utils/makeStoryVideo.js';
import {
  BookOpen, CalendarDays, ChevronLeft, ChevronRight, Download,
  Filter, Film, GitBranch, HardDrive, Loader2, Map, MapPin, Maximize2,
  MessageCircle, Minimize2, Pause, Play, Search, Server, Settings,
  Sparkles, TreePine, Users, Wand2, X,
  Navigation, Globe, Compass, Route, Tag, Building2, ArrowRightLeft,
  Smartphone, Network
} from 'lucide-react';

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
  const l = name.toLowerCase();
  if (l.includes('god'))     return 'Divine actor and covenant source';
  if (l.includes('jesus'))   return 'Central figure of redemption';
  if (l.includes('moses'))   return 'Deliverer and covenant leader';
  if (l.includes('abraham')) return 'Patriarch and promise bearer';
  if (l.includes('david'))   return 'King and messianic ancestor';
  if (l.includes('joseph'))  return 'Protector and providential leader';
  if (l.includes('mary'))    return 'Mother of Jesus';
  if (l.includes('paul'))    return 'Apostle and missionary';
  if (l.includes('pharaoh')) return 'Opposing ruler';
  if (l.includes('israel'))  return 'People connected to the event';
  return `Involved in ${event.title}`;
}

/* ── Category badge config ───────────────────────────────────── */
const CATEGORY_META = {
  travel:  { label: 'Travel',  icon: <Route size={11} />,     color: 'var(--cat-travel)'  },
  event:   { label: 'Event',   icon: <Sparkles size={11} />,  color: 'var(--cat-event)'   },
  people:  { label: 'People',  icon: <Users size={11} />,     color: 'var(--cat-people)'  },
};

/* ── Event List ──────────────────────────────────────────────── */
function EventList({ events, selected, onSelect, query, setQuery, activeEra }) {
  const [activeCategory, setActiveCategory] = useState('all');
  const listRef = useRef(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return events.filter((e) => {
      const matchQ = !q || [e.title, e.era, e.timelineDate, e.mapLocation, ...(e.references || []), ...(e.mainPeople || [])].join(' ').toLowerCase().includes(q);
      const matchEra = !activeEra || e.era.toLowerCase().includes(activeEra.toLowerCase()) || activeEra === 'All';
      const matchCat = activeCategory === 'all' || e.category === activeCategory;
      return matchQ && matchEra && matchCat;
    });
  }, [events, query, activeEra, activeCategory]);

  useEffect(() => {
    listRef.current?.querySelector(`button[data-id="${selected.id}"]`)?.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
  }, [selected.id]);

  const counts = useMemo(() => ({
    all:    events.length,
    travel: events.filter(e => e.category === 'travel').length,
    event:  events.filter(e => e.category === 'event').length,
    people: events.filter(e => e.category === 'people').length,
  }), [events]);

  const summary = useMemo(() => {
    const label = activeCategory === 'all' ? 'All' : CATEGORY_META[activeCategory]?.label || activeCategory;
    if (filtered.length !== events.length) return `${label} · ${filtered.length} of ${events.length}`;
    return `All ${events.length} events`;
  }, [activeCategory, filtered.length, events.length]);

  const CATS = [
    { id: 'all',    label: 'All',    icon: <BookOpen size={11} />,  count: counts.all    },
    { id: 'travel', label: 'Travel', icon: <Route size={11} />,     count: counts.travel },
    { id: 'event',  label: 'Events', icon: <Sparkles size={11} />,  count: counts.event  },
    { id: 'people', label: 'People', icon: <Users size={11} />,     count: counts.people },
  ];

  return (
    <section className="events-panel panel">
      <div className="panel-title-row">
        <div><h2>Bible Events</h2><p>{summary}</p></div>
      </div>

      {/* Category filter tabs */}
      <div className="el-cat-tabs">
        {CATS.map(c => (
          <button key={c.id} type="button"
            className={`el-cat-tab${activeCategory === c.id ? ' active' : ''}`}
            onClick={() => setActiveCategory(c.id)}>
            {c.icon} {c.label}
            <span className="el-cat-count">{c.count}</span>
          </button>
        ))}
      </div>

      <div className="event-list" ref={listRef}>
        {filtered.map((ev) => {
          const catMeta = CATEGORY_META[ev.category];
          return (
            <button key={ev.id} type="button" data-id={ev.id} onClick={() => onSelect(ev.id)}
              className={`event-row${ev.id === selected.id ? ' selected' : ''}`}
              style={{ '--row-cat-color': catMeta?.color || 'transparent' }}>
              <EventArtIcon order={ev.order} mapIcon={ev.mapIcon} variant="list" />
              <span className="event-copy">
                <strong>{ev.title}</strong>
                <small>
                  {catMeta && <span className="event-cat-dot" style={{ background: catMeta.color }} />}
                  {ev.references?.[0]} · {ev.timelineDate}
                </small>
              </span>
              <span className="event-order">{ev.order}</span>
            </button>
          );
        })}
        {filtered.length === 0 && (
          <p className="el-empty">No {activeCategory !== 'all' ? activeCategory : ''} events match your filter.</p>
        )}
      </div>
    </section>
  );
}

/* ── Top Bar ─────────────────────────────────────────────────── */
function TopBar() {
  return (
    <header className="topbar">
      <div>
        <h1>Bible Journey Map</h1>
        <span>Interactive atlas — real tiles, story markers &amp; journey routes</span>
      </div>
    </header>
  );
}

/* ── Tab Bar ─────────────────────────────────────────────────── */
function TabBar({ activeTab, setActiveTab, selected }) {
  const tabs = [
    { id: 'info',   icon: <BookOpen size={14} />,  label: 'Info'   },
    { id: 'family', icon: <TreePine size={14} />,  label: 'Family' },
    { id: 'people', icon: <Users size={14} />,     label: 'People' },
    { id: 'story',  icon: <Film size={14} />,      label: 'Video'  },
    { id: 'graph',  icon: <Network size={14} />,   label: 'Graph'  },
  ];
  return (
    <nav className="bjm-tab-bar" aria-label="Content tabs">
      {tabs.map((t) => (
        <button key={t.id} type="button"
          className={`bjm-tab${activeTab === t.id ? ' active' : ''}`}
          onClick={() => setActiveTab(t.id)}
          aria-selected={activeTab === t.id}>
          {t.icon} {t.label}
        </button>
      ))}
      <div className="bjm-event-chip" aria-hidden>
        <EventArtIcon order={selected.order} mapIcon={selected.mapIcon} variant="strip" />
        <span>
          <strong>{selected.title}</strong>
          <small>{selected.references?.[0]} · {selected.timelineDate}</small>
        </span>
      </div>
    </nav>
  );
}

/* ── Timeline Strip ──────────────────────────────────────────── */
function Timeline({ activeEra, setActiveEra, scrollFocusPulse = 0 }) {
  const trackRef  = useRef(null);
  const sectionRef = useRef(null);
  useEffect(() => {
    if (!scrollFocusPulse) return;
    const run = () => {
      sectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      trackRef.current?.querySelector('.timeline-node.active')?.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
    };
    const id = window.requestAnimationFrame(() => window.requestAnimationFrame(run));
    return () => window.cancelAnimationFrame(id);
  }, [scrollFocusPulse, activeEra]);
  const scrollBy = (delta) => trackRef.current?.scrollBy({ left: delta, behavior: 'smooth' });
  return (
    <section ref={sectionRef} className="timeline panel">
      <div className="timeline-heading"><CalendarDays size={17} aria-hidden /><strong>Bible Timeline</strong></div>
      <button type="button" className="round timeline-nav timeline-nav--prev" onClick={() => scrollBy(-160)} aria-label="Earlier"><ChevronLeft size={17} /></button>
      <div className="timeline-track" ref={trackRef}>
        <div className="timeline-track__rail" aria-hidden />
        {TIMELINE.map((t) => (
          <button key={t.label} type="button" data-timeline-match={t.match}
            onClick={() => setActiveEra(activeEra === t.match ? 'All' : t.match)}
            className={`timeline-node${activeEra === t.match ? ' active' : ''}`}>
            <span className="timeline-node__dot" />
            <strong className="timeline-node__label">{t.label}</strong>
            <small className="timeline-node__sub">{t.sub}</small>
          </button>
        ))}
      </div>
      <button type="button" className="round timeline-nav timeline-nav--next" onClick={() => scrollBy(160)} aria-label="Later"><ChevronRight size={17} /></button>
    </section>
  );
}

/* ── Info Panel ──────────────────────────────────────────────── */
function InfoPanel({ selected, content, loading, onGenerate }) {
  const catMeta   = CATEGORY_META[selected.category] || CATEGORY_META.event;
  const pc        = selected.placeContext || {};
  const journey   = selected.journey;
  const eventTags = selected.eventTags || selected.tags || [];
  const roleTags  = selected.roleTags  || [];

  return (
    <div className="info-panel">
      {/* ── Hero row ── */}
      <div className="info-panel__hero">
        <EventArtIcon order={selected.order} mapIcon={selected.mapIcon} variant="hero" />
        <div className="info-panel__hero-body">
          <h2 className="info-panel__title">{selected.title}</h2>
          <div className="info-panel__meta">
            {selected.references?.[0] && <span><BookOpen size={12} aria-hidden /> {selected.references[0]}</span>}
            {selected.timelineDate && <span><CalendarDays size={12} aria-hidden /> {selected.timelineDate}</span>}
            {selected.era && <span className="info-panel__era-chip">{selected.era}</span>}
            {selected.mapLocation && <span><MapPin size={12} aria-hidden /> {selected.mapLocation}</span>}
          </div>
          {/* Category badge */}
          <span className="ip-cat-badge" style={{ '--badge-color': catMeta.color }}>
            {catMeta.icon} {catMeta.label}
          </span>
        </div>
      </div>

      {/* ── Thematic event tags ── */}
      {eventTags.length > 0 && (
        <div className="ip-tag-row">
          <Tag size={11} className="ip-tag-row__icon" />
          {eventTags.map(t => <span key={t} className="ip-event-tag">{t}</span>)}
        </div>
      )}

      {/* ── Place context card: ancient → modern ── */}
      {pc.ancient && (
        <div className="ip-place-card">
          <div className="ip-place-card__header">
            <Globe size={13} /> <strong>Location — Ancient &amp; Modern</strong>
          </div>
          <div className="ip-place-card__row">
            <div className="ip-place-card__col">
              <span className="ip-place-label">Ancient Name</span>
              <span className="ip-place-value">{pc.ancient}</span>
            </div>
            <ArrowRightLeft size={14} className="ip-place-arrow" />
            <div className="ip-place-card__col">
              <span className="ip-place-label">Modern Name</span>
              <span className="ip-place-value ip-place-value--modern">{pc.modern}</span>
            </div>
          </div>
          {pc.construction && (
            <p className="ip-place-construction"><Building2 size={11} /> {pc.construction}</p>
          )}
          {pc.significance && (
            <p className="ip-place-significance"><Sparkles size={11} /> {pc.significance}</p>
          )}
        </div>
      )}

      {/* ── Journey route card (travel events only) ── */}
      {journey && (
        <div className="ip-journey-card">
          <div className="ip-journey-card__header">
            <Route size={13} /> <strong>Journey Details</strong>
          </div>
          <div className="ip-journey-grid">
            <div className="ip-journey-item">
              <span className="ip-journey-lbl">Who Travelled</span>
              <span className="ip-journey-val">{journey.travelers?.join(', ')}</span>
            </div>
            <div className="ip-journey-item">
              <span className="ip-journey-lbl">From</span>
              <span className="ip-journey-val">{journey.from}</span>
            </div>
            <div className="ip-journey-item">
              <span className="ip-journey-lbl">To</span>
              <span className="ip-journey-val">{journey.to}</span>
            </div>
            {journey.via?.length > 0 && (
              <div className="ip-journey-item">
                <span className="ip-journey-lbl">Via</span>
                <span className="ip-journey-val">{journey.via.join(' → ')}</span>
              </div>
            )}
            <div className="ip-journey-item">
              <span className="ip-journey-lbl">Mode of Travel</span>
              <span className="ip-journey-val">{journey.mode}</span>
            </div>
            {journey.companions?.length > 0 && (
              <div className="ip-journey-item">
                <span className="ip-journey-lbl">Companions</span>
                <span className="ip-journey-val">{journey.companions.join(', ')}</span>
              </div>
            )}
            <div className="ip-journey-item ip-journey-item--wide">
              <span className="ip-journey-lbl">Reason / Purpose</span>
              <span className="ip-journey-val">{journey.reason}</span>
            </div>
            {journey.distance && (
              <div className="ip-journey-item">
                <span className="ip-journey-lbl">Distance</span>
                <span className="ip-journey-val ip-journey-val--highlight">{journey.distance}</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── Main content cards ── */}
      <div className="info-panel__grid">
        <div className="info-panel__card info-panel__card--wide">
          <h4><BookOpen size={11} aria-hidden /> Event Details</h4>
          <p>{content?.teachingSummary || selected.details || 'Detailed summary not available.'}</p>
        </div>
        <div className="info-panel__card">
          <h4><Sparkles size={11} aria-hidden /> Key Lesson</h4>
          <p>{content?.applicationLesson || selected.lesson || 'Lesson text not available.'}</p>
        </div>
        <div className="info-panel__card">
          <h4><MapPin size={11} aria-hidden /> Geographic Context</h4>
          <p>{content?.mapExplanation || `This event took place near ${selected.mapLocation || 'an unrecorded location'}. The geographic setting provides crucial historical context.`}</p>
        </div>
        <div className="info-panel__card info-panel__card--wide">
          <h4><Play size={11} aria-hidden /> Story Visualization Idea</h4>
          <p>{selected.videoIdea || 'A visual story concept for this event has not been added yet.'}</p>
        </div>
      </div>

      {/* ── Role tags (enriched person chips) ── */}
      {roleTags.length > 0 ? (
        <div className="info-panel__people">
          <h4>People &amp; Their Roles</h4>
          <div className="ip-role-list">
            {roleTags.map((rt) => (
              <div key={rt.person} className="ip-role-card">
                <div className="ip-role-card__avatar">{initials(rt.person)}</div>
                <div className="ip-role-card__body">
                  <strong>{rt.person}</strong>
                  <span className="ip-role-badge">{rt.role}</span>
                  {rt.origin && <small className="ip-role-origin"><Globe size={10} /> {rt.origin}</small>}
                  {rt.relation && <p className="ip-role-relation">{rt.relation}</p>}
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (selected.mainPeople || []).length > 0 && (
        <div className="info-panel__people">
          <h4>People in This Story</h4>
          <div className="info-panel__people-chips">
            {selected.mainPeople.map((name) => (
              <span key={name} className="info-panel__person-chip">
                <span className="info-panel__person-initials">{initials(name)}</span>
                {name}
              </span>
            ))}
          </div>
        </div>
      )}

      {selected.references?.length > 1 && (
        <div className="info-panel__refs">
          <h4>Scripture References</h4>
          <div className="info-panel__refs-list">
            {selected.references.map((ref) => (
              <span key={ref} className="info-panel__ref-chip">{ref}</span>
            ))}
          </div>
        </div>
      )}

      {API_BASE && (
        <div className="info-panel__actions">
          <button type="button" className="primary" onClick={onGenerate} disabled={loading}>
            {loading ? <><Loader2 size={15} className="spin" /> Enhancing with AI…</> : <><Wand2 size={15} /> Enhance with AI</>}
          </button>
        </div>
      )}
    </div>
  );
}

/* ── Family Panel ────────────────────────────────────────────── */
function FamilyPanel({ selected, content, lineageMatchSummary, lineageFocusLabels, onOpenLineageTree }) {
  const thread = selected.lineageConnection || [];
  const threadPreview = formatLineageThread(thread);
  return (
    <div className="family-panel">
      <div className="family-panel__header">
        <h2>Family Thread</h2>
        <p>How <em>{selected.title}</em> connects to Scripture's covenant narrative</p>
      </div>

      {lineageFocusLabels.length > 0 && (
        <div className="family-panel__match-card">
          <span className="family-panel__match-kicker"><Sparkles size={13} aria-hidden /> Family tree match for this event</span>
          <div className="family-panel__pills">
            {lineageFocusLabels.slice(0, 6).map((name, i) => <span key={i} className="lineage-panel__pill">{name}</span>)}
            {lineageFocusLabels.length > 6 && <span className="lineage-panel__pill lineage-panel__pill--more">+{lineageFocusLabels.length - 6}</span>}
          </div>
        </div>
      )}

      {threadPreview && (
        <div className="family-panel__thread">
          <GitBranch size={14} aria-hidden /> {threadPreview}
        </div>
      )}

      {thread.length > 0 ? (
        <div className="lineage-vine">
          {thread.slice(0, 8).map((name, index, arr) => (
            <div key={`${name}-${index}`} className={`lineage-step${index === arr.length - 1 ? ' lineage-step--active' : ''}`}>
              <div className="lineage-step__avatar-col">
                {index > 0 && <span className="lineage-step__stem" aria-hidden />}
                <div className="lineage-step__portrait-ring"><div className="portrait">{initials(name)}</div></div>
                {index < arr.length - 1 && <span className="lineage-step__stem" aria-hidden />}
              </div>
              <div className="lineage-step__body">
                <strong>{name}</strong>
                <small>{lineageStepSubtitle(name, index, arr)}</small>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="family-panel__empty">No lineage path recorded for this event.</p>
      )}

      <div className="family-panel__cta">
        <button type="button" className="primary" onClick={onOpenLineageTree}>
          <TreePine size={16} aria-hidden /> Open Full Family Tree
        </button>
        {lineageMatchSummary && (
          <p className="family-panel__cta-hint">Poster view highlights <strong>{lineageMatchSummary}</strong> on the messianic line.</p>
        )}
      </div>

      {content?.lineageExplanation && <p className="ai-note" style={{ marginTop: 14 }}>{content.lineageExplanation}</p>}
    </div>
  );
}

/* ── People Panel ────────────────────────────────────────────── */
function PeoplePanel({ selected }) {
  const [activeName, setActiveName] = useState(null);
  useEffect(() => { setActiveName(null); }, [selected.id]);

  const perspectiveEntry = activeName ? getPersonPerspectiveEntry(selected.id, activeName) : null;
  const fallback = activeName
    ? `Scripture doesn't record a separate first-person account for ${activeName} in this scene. Read ${selected.references?.[0] || 'the relevant passage'} focusing on this figure's actions and motivations.`
    : '';

  const people = selected.mainPeople || [];

  return (
    <div className="people-panel-view">
      <div className="people-panel-view__header">
        <h2>People in This Story</h2>
        <p>Tap a person to read their perspective on <em>{selected.title}</em></p>
      </div>

      {people.length === 0 && <p className="family-panel__empty">No people listed for this event.</p>}

      <div className="people-panel-view__list">
        {people.map((name) => {
          const rt = (selected.roleTags || []).find(r => r.person === name);
          return (
            <button key={name} type="button"
              className={`person-card${activeName === name ? ' active' : ''}`}
              onClick={() => setActiveName(activeName === name ? null : name)}>
              <div className="portrait gold">{initials(name)}</div>
              <div>
                <strong>{name}</strong>
                <small>{rt?.role || roleForPerson(name, selected)}</small>
                {rt?.origin && <span className="pc-origin"><Globe size={10} /> {rt.origin}</span>}
              </div>
              <ChevronRight size={15} className="person-card__chev" aria-hidden />
            </button>
          );
        })}
      </div>

      {activeName && (
        <div className="perspective-card">
          <div className="perspective-card__header">
            <div className="portrait gold" style={{ width: 52, height: 52, fontSize: 15 }}>{initials(activeName)}</div>
            <div>
              <strong>{activeName}</strong>
              <p>{selected.title}</p>
              {selected.references?.[0] && <small><BookOpen size={11} aria-hidden /> {selected.references[0]}</small>}
            </div>
          </div>
          {/* Role tag info */}
          {(() => {
            const rt = (selected.roleTags || []).find(r => r.person === activeName);
            if (!rt) return null;
            return (
              <div className="perspective-card__roletags">
                <span className="ip-role-badge">{rt.role}</span>
                {rt.origin && <span className="pc-origin"><Globe size={10} /> {rt.origin}</span>}
                {rt.relation && <p className="pc-relation">{rt.relation}</p>}
              </div>
            );
          })()}
          <p className="perspective-card__body">{perspectiveEntry?.perspective ?? fallback}</p>
        </div>
      )}
    </div>
  );
}

/* ── Story Panel ─────────────────────────────────────────────── */
function StoryPanel(props) {
  if (props.storyError) {
    return (
      <div className="story-api-state">
        <div className="story-api-state__icon" aria-hidden>⚠️</div>
        <h3>Story generation failed</h3>
        <p>{props.storyError}</p>
        <div className="story-api-state__note">
          <Server size={14} aria-hidden />
          Make sure your backend server is running and the <code>VITE_API_BASE</code> URL is correct.
        </div>
        <button type="button" className="primary" style={{ marginTop: 16 }} onClick={props.onClearError}>
          Try again
        </button>
      </div>
    );
  }
  return <StoryPlayer {...props} />;
}

/* ── Story Player (full) ─────────────────────────────────────── */
function StoryPlayer({ story, loading, onGenerate, onRegenerate, cached, cacheBanner, onLoadCachedInline, onOpenReplaceModal, onDismissCacheBanner, audioRef, playing, setPlaying, sceneIndex, setSceneIndex, apiBase, sectionRef, exportEventId }) {
  const [audioProgress, setAudioProgress] = useState(0);
  const [audioDuration, setAudioDuration] = useState(0);
  const [videoCinema, setVideoCinema]     = useState(false);

  // Format selector — 'landscape' | 'reels'
  const [videoFormat, setVideoFormat] = useState('landscape');

  // Modal state — shown when "Create story video" is first clicked
  const [showFormatModal, setShowFormatModal] = useState(false);
  // When a format is chosen before story exists, auto-render once story arrives
  const [autoRenderFormat, setAutoRenderFormat] = useState(null);

  // Separate state per format so both can be cached
  const [videoState, setVideoState] = useState({
    landscape: { status: 'idle', progress: 0, url: null, ext: 'webm' },
    reels:     { status: 'idle', progress: 0, url: null, ext: 'webm' },
  });
  const videoRef = useRef(null);

  const vs = videoState[videoFormat];
  const setVs = (patch) => setVideoState(prev => ({
    ...prev,
    [videoFormat]: { ...prev[videoFormat], ...patch },
  }));

  const videoSupported = isVideoSupported();

  // Load saved videos from IndexedDB when event changes
  useEffect(() => {
    setVideoState({
      landscape: { status: 'idle', progress: 0, url: null, ext: 'webm' },
      reels:     { status: 'idle', progress: 0, url: null, ext: 'webm' },
    });
    if (!exportEventId) return;
    ['landscape', 'reels'].forEach(fmt => {
      loadVideoLocally(exportEventId, fmt).then((rec) => {
        if (rec) {
          setVideoState(prev => ({
            ...prev,
            [fmt]: { status: 'ready', progress: 100, url: rec.url, ext: rec.ext || 'webm' },
          }));
        }
      });
    });
  }, [exportEventId]);

  // Auto-render video when story arrives after a format was pre-selected from the modal
  useEffect(() => {
    if (!story || !autoRenderFormat) return;
    const fmt = autoRenderFormat;
    setAutoRenderFormat(null);
    // Small delay so the story UI can paint first
    setTimeout(() => handleMakeVideo(fmt), 400);
  }, [story, autoRenderFormat]); // eslint-disable-line react-hooks/exhaustive-deps

  // Auto-advance scenes slideshow (always runs so user sees all scenes)
  useEffect(() => {
    if (!story?.scenes?.length) return;
    const dur = story.scenes[sceneIndex]?.durationSec || 7;
    const timer = setTimeout(() => {
      setSceneIndex((i) => (i + 1) % story.scenes.length);
    }, dur * 1000);
    return () => clearTimeout(timer);
  }, [story, sceneIndex, setSceneIndex]);

  const exitCinema = useCallback(() => {
    setVideoCinema(false);
    if (document.fullscreenElement) document.exitFullscreen().catch(() => {});
  }, []);
  const enterCinema = useCallback(() => {
    if (!story && vs.status !== 'ready') return;
    setVideoCinema(true);
    requestAnimationFrame(() => sectionRef?.current?.requestFullscreen?.().catch(() => {}));
  }, [story, vs.status, sectionRef]);

  useEffect(() => {
    if (!videoCinema) return;
    const fn = () => { if (!document.fullscreenElement) setVideoCinema(false); };
    document.addEventListener('fullscreenchange', fn);
    return () => document.removeEventListener('fullscreenchange', fn);
  }, [videoCinema]);

  const resolveUrl = (url) => (!url ? null : (url.startsWith('data:') || url.startsWith('http') ? url : `${apiBase}${url}`));
  const audioSrc = resolveUrl(story?.audioUrl);
  const scene    = story?.scenes?.[sceneIndex];
  const imgSrc   = resolveUrl(scene?.imageUrl);

  const toggleAudio = async () => {
    if (!audioRef.current || !audioSrc) return;
    if (playing) { audioRef.current.pause(); setPlaying(false); }
    else { await audioRef.current.play().catch(() => {}); setPlaying(true); }
  };

  const onAudioTime = (e) => {
    if (!story?.scenes?.length) return;
    const el = e.currentTarget; const d = el.duration;
    if (d && Number.isFinite(d)) { setAudioDuration(d); setAudioProgress((el.currentTime / d) * 100); }
    const rawTotal = story.scenes.reduce((a, s) => a + Number(s.durationSec || 7), 0);
    const scale    = d && Number.isFinite(d) ? d / rawTotal : 1;
    let acc = 0;
    for (let i = 0; i < story.scenes.length; i++) {
      acc += Number(story.scenes[i].durationSec || 7) * scale;
      if (el.currentTime <= acc) { setSceneIndex(i); break; }
    }
  };

  // Generate video in selected format
  const handleMakeVideo = useCallback(async (fmt = videoFormat) => {
    if (!story) return;
    setVideoState(prev => ({ ...prev, [fmt]: { status: 'making', progress: 0, url: null, ext: 'webm' } }));
    try {
      const blob = await makeStoryVideo(story, (p) => {
        setVideoState(prev => ({ ...prev, [fmt]: { ...prev[fmt], progress: Math.round(p * 100) } }));
      }, fmt);
      const url = URL.createObjectURL(blob);
      setVideoState(prev => ({ ...prev, [fmt]: { status: 'ready', progress: 100, url, ext: blob._ext || 'webm' } }));
      await saveVideoLocally(exportEventId || story.eventId, blob, fmt);
    } catch (err) {
      console.error('[video]', err);
      setVideoState(prev => ({ ...prev, [fmt]: { ...prev[fmt], status: 'error' } }));
    }
  }, [story, exportEventId, videoFormat]);

  const handleDownload = () => {
    if (!vs.url) return;
    const suffix = videoFormat === 'reels' ? '-reel' : '-video';
    const name = `${exportEventId || story?.eventId || 'story'}${suffix}.${vs.ext}`;
    const a = Object.assign(document.createElement('a'), { href: vs.url, download: name, rel: 'noopener' });
    document.body.appendChild(a); a.click(); a.remove();
  };

  return (
    <section ref={sectionRef} className={`player panel story-player${videoCinema ? ' story-player--cinema' : ''}`}>
      {videoCinema && (
        <button type="button" className="story-player__cinema-close" onClick={exitCinema} aria-label="Exit fullscreen"><X size={22} /></button>
      )}

      {/* ── TOOLBAR at TOP ── */}
      <div className="player-toolbar player-toolbar--top">
        <div className="player-left">
          <div className="player-icon"><Sparkles size={22} aria-hidden /></div>
          <div>
            <h3>AI Story Video {cached && <span className="story-cached-badge" title="Loaded from Supabase">✓ Saved</span>}</h3>
            <p>Gemini · illustrated scenes + narration</p>
          </div>
        </div>

        {story ? (
          <div className="player-actions">
            {/* Audio play/pause */}
            {audioSrc ? (
              <>
                <button type="button" className="secondary" onClick={toggleAudio}>
                  {playing ? <><Pause size={15} /> Pause</> : <><Play size={15} /> Narration</>}
                </button>
                <audio ref={audioRef} src={audioSrc}
                  onLoadedMetadata={(e) => { const d = e.currentTarget.duration; if (d && isFinite(d)) setAudioDuration(d); }}
                  onTimeUpdate={onAudioTime}
                  onEnded={() => { setPlaying(false); setAudioProgress(0); setSceneIndex(0); }}
                />
              </>
            ) : (
              <span className="story-no-audio" title="TTS narration was not generated — video will be visual-only">
                🔇 No narration
              </span>
            )}

            {/* ── Format badge (shows active format) ── */}
            {(vs.status === 'ready' || vs.status === 'making') && (
              <span className={`active-fmt-badge${videoFormat === 'reels' ? ' active-fmt-badge--reels' : ''}`}>
                {videoFormat === 'reels' ? <Smartphone size={11} /> : <Film size={11} />}
                {videoFormat === 'reels' ? 'Reel 9:16' : 'Video 16:9'}
              </span>
            )}

            {/* ── Create / Download video ── */}
            {!videoSupported ? (
              <span className="story-video-unsupported" title="Use Chrome or Edge for video generation">
                <Film size={15} /> Video: use Chrome/Edge
              </span>
            ) : vs.status === 'idle' || vs.status === 'error' ? (
              <button type="button" className="primary story-make-video-btn"
                onClick={() => setShowFormatModal(true)} disabled={loading}
                title="Choose video format and start rendering">
                <Film size={15} /> Create Video
              </button>
            ) : vs.status === 'making' ? (
              <button type="button" className="primary story-make-video-btn" disabled>
                <Loader2 size={15} className="spin" /> Rendering… {vs.progress}%
              </button>
            ) : (
              <>
                <button type="button" className="primary story-make-video-btn" onClick={handleDownload}>
                  <Download size={15} /> Download {vs.ext.toUpperCase()}
                </button>
                <button type="button" className="secondary story-make-video-btn"
                  onClick={() => setShowFormatModal(true)}
                  title="Render in a different format or re-create">
                  <Film size={15} /> Change Format
                </button>
              </>
            )}

            {/* Scene stepper */}
            {vs.status !== 'ready' && (
              <div className="scene-stepper" role="tablist">
                {story.scenes.map((s, i) => (
                  <button type="button" key={s.title + i} className={i === sceneIndex ? 'active' : ''} onClick={() => setSceneIndex(i)}>{i + 1}</button>
                ))}
              </div>
            )}

            <button type="button" className="secondary story-regenerate" onClick={onRegenerate} disabled={loading}>
              {loading ? 'Working…' : 'New version'}
            </button>
          </div>
        ) : cacheBanner ? (
          <div className="story-cache-inline">
            <div className="story-cache-inline__row">
              <HardDrive size={19} className="story-cache-inline__icon" aria-hidden />
              <div>
                <strong>Saved story on this device</strong>
                <p className="story-cache-inline__meta">
                  {cacheBanner.generatedAt ? new Date(cacheBanner.generatedAt).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' }) : 'Unknown date'} · {cacheBanner.sceneCount} scene{cacheBanner.sceneCount === 1 ? '' : 's'}
                </p>
              </div>
            </div>
            <div className="story-cache-inline__actions">
              <button type="button" className="primary" onClick={onLoadCachedInline} disabled={loading}>{loading ? 'Loading…' : 'Load saved'}</button>
              <button type="button" className="secondary" onClick={onOpenReplaceModal} disabled={loading}><Wand2 size={14} /> New version</button>
              <button type="button" className="story-cache-inline__dismiss" onClick={onDismissCacheBanner}>Hide</button>
            </div>
          </div>
        ) : (
          loading ? (
            <button type="button" className="primary" disabled>
              <Loader2 size={15} className="spin" /> Creating story…
            </button>
          ) : (
            <button type="button" className="primary story-create-btn"
              onClick={() => setShowFormatModal(true)}>
              <Sparkles size={15} /> Create story video
            </button>
          )
        )}
      </div>

      {/* ── Format Selection Modal ── */}
      {showFormatModal && (
        <div className="fmt-modal-backdrop" onClick={() => setShowFormatModal(false)}>
          <div className="fmt-modal" onClick={(e) => e.stopPropagation()}>
            <div className="fmt-modal__header">
              <Sparkles size={18} />
              <h3>Choose your format</h3>
              <p>Pick how you want to share this Bible story</p>
            </div>
            <div className="fmt-modal__cards">
              {/* Normal Video */}
              <button
                type="button"
                className="fmt-card fmt-card--video"
                onClick={() => {
                  setShowFormatModal(false);
                  setVideoFormat('landscape');
                  if (!story) {
                    // generate story with landscape (16:9) images, then auto-render
                    setAutoRenderFormat('landscape');
                    onGenerate('landscape');
                  } else {
                    handleMakeVideo('landscape');
                  }
                }}>
                <div className="fmt-card__icon">
                  <Film size={32} />
                </div>
                <div className="fmt-card__label">Normal Video</div>
                <div className="fmt-card__dim">16 : 9 · 1280 × 720</div>
                <div className="fmt-card__desc">
                  Landscape · YouTube<br />Presentations · TV
                </div>
                {videoState.landscape.status === 'ready' && (
                  <div className="fmt-card__cached">✓ Ready</div>
                )}
              </button>

              {/* Reels */}
              <button
                type="button"
                className="fmt-card fmt-card--reels"
                onClick={() => {
                  setShowFormatModal(false);
                  setVideoFormat('reels');
                  if (!story) {
                    // generate story with portrait (9:16) images, then auto-render reels
                    setAutoRenderFormat('reels');
                    onGenerate('portrait');
                  } else {
                    // story already loaded — render reels using current images
                    // (renderer adapts: full-bleed for portrait, blurred-bg for landscape)
                    handleMakeVideo('reels');
                  }
                }}>
                <div className="fmt-card__icon">
                  <Smartphone size={32} />
                </div>
                <div className="fmt-card__label">Reels</div>
                <div className="fmt-card__dim">9 : 16 · 1080 × 1920</div>
                <div className="fmt-card__desc">
                  Vertical · Instagram<br />TikTok · YouTube Shorts
                </div>
                {videoState.reels.status === 'ready' && (
                  <div className="fmt-card__cached">✓ Ready</div>
                )}
              </button>
            </div>
            <button type="button" className="fmt-modal__close" onClick={() => setShowFormatModal(false)}>
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* ── Rendering progress banner ── */}
      {vs.status === 'making' && (
        <div className="story-video-progress story-video-progress--banner">
          <Loader2 size={16} className="spin" />
          <div style={{ flex: 1 }}>
            <span>
              {videoFormat === 'reels' ? '📱 Rendering Reel (9:16)' : '🎬 Rendering Video (16:9)'}… {vs.progress}%
              {vs.progress < 8 && <span style={{ opacity: 0.65 }}>&nbsp;(~{estimateVideoDuration(story, videoFormat)}s — keep tab visible)</span>}
            </span>
            <div className="story-video-progress__bar"><div style={{ width: `${vs.progress}%` }} /></div>
          </div>
        </div>
      )}
      {vs.status === 'error' && (
        <div className="story-video-progress story-video-progress--error story-video-progress--banner">
          ⚠ {videoFormat === 'reels' ? 'Reel' : 'Video'} creation failed — open DevTools console for details, then try again
        </div>
      )}

      {/* ── Video / Reel player ── */}
      {vs.status === 'ready' && vs.url && (
        <div className={`story-video-player${videoFormat === 'reels' ? ' story-video-player--reels' : ''}`}>
          <video
            ref={videoRef}
            src={vs.url}
            controls
            autoPlay
            loop
            playsInline
            className="story-video-player__video"
            aria-label={`${story?.title || 'Story'} ${videoFormat === 'reels' ? 'reel' : 'video'}`}
          />
          {videoFormat === 'reels' && (
            <div className="reel-format-badge">
              <Smartphone size={12} /> Reel · 9:16
            </div>
          )}
          <div className="story-video-player__overlay-btns">
            <button type="button" className="secondary story-cinema-toggle" onClick={videoCinema ? exitCinema : enterCinema}>
              {videoCinema ? <><Minimize2 size={15} /> Exit</> : <><Maximize2 size={15} /> Fullscreen</>}
            </button>
            <button type="button" className="secondary" onClick={() => setVideoState(prev => ({ ...prev, [videoFormat]: { ...prev[videoFormat], status: 'idle' } }))}>
              <Film size={15} /> Scenes
            </button>
          </div>
        </div>
      )}

      {/* ── Scene slideshow (shown while no video) ── */}
      {vs.status !== 'ready' && story && (
        <figure className={`story-theater${loading ? ' story-theater--busy' : ''}`}>
          <div className="story-theater__frame">
            {imgSrc
              ? <img src={imgSrc} alt={scene?.title || story.title} key={sceneIndex} className="story-theater__scene-img" />
              : <div className="story-theater__placeholder">Preparing scene…</div>}
            <div className="story-theater__shade" aria-hidden />
            <figcaption className="story-theater__caption">
              <span className="story-theater__badge">Scene {sceneIndex + 1} of {story.scenes.length}</span>
              <strong>{scene?.title || `Scene ${sceneIndex + 1}`}</strong>
              {scene?.narration && <p>{scene.narration}</p>}
            </figcaption>
          </div>
          {loading && <div className="story-theater__loading" role="status">Updating story…</div>}
          <div className="story-theater__scenes">
            {story.scenes.map((_, i) => (
              <button key={i} type="button"
                className={`story-theater__tick${i === sceneIndex ? ' active' : ''}${i < sceneIndex ? ' done' : ''}`}
                onClick={() => setSceneIndex(i)} aria-label={`Scene ${i + 1}`} />
            ))}
          </div>
          {audioDuration > 0 && (
            <div className="story-theater__bar" aria-hidden>
              <div className="story-theater__bar-fill" style={{ width: `${audioProgress}%` }} />
            </div>
          )}
        </figure>
      )}
    </section>
  );
}

/* ── Story Cache Modal ───────────────────────────────────────── */
function StoryCacheChoiceModal({ meta, eventLabel, busy, enterConfirm, onCloseNotNow, onLoadSaved, onConfirmReplace }) {
  const [step, setStep] = useState(() => (enterConfirm ? 'confirm' : 'pick'));
  useEffect(() => { setStep(enterConfirm ? 'confirm' : 'pick'); }, [meta?.eventId, enterConfirm]);
  useEffect(() => {
    const fn = (e) => { if (e.key === 'Escape' && !busy) onCloseNotNow(); };
    window.addEventListener('keydown', fn);
    return () => window.removeEventListener('keydown', fn);
  }, [busy, onCloseNotNow]);
  if (!meta) return null;
  const dateStr = meta.generatedAt ? new Date(meta.generatedAt).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' }) : 'Unknown date';
  return (
    <div className="story-cache-modal-root" role="dialog" aria-modal="true" aria-labelledby="story-cache-title">
      <button type="button" className="story-cache-modal-backdrop" aria-label="Close" onClick={() => !busy && onCloseNotNow()} />
      <div className="story-cache-modal">
        <button type="button" className="story-cache-modal__close" aria-label="Close" onClick={() => !busy && onCloseNotNow()}><X size={20} /></button>
        {step === 'pick' ? (
          <>
            <div className="story-cache-modal__icon"><HardDrive size={26} /></div>
            <h2 id="story-cache-title">Saved AI story video</h2>
            <p className="story-cache-modal__lede"><strong>{eventLabel}</strong> already has generated scenes and narration.</p>
            <ul className="story-cache-modal__facts">
              <li>Saved: {dateStr}</li><li>Scenes: {meta.sceneCount}</li>
              <li>Narration: {meta.hasAudio ? 'Yes' : 'No'}</li>
              <li className="story-cache-modal__ref">{meta.reference || meta.title}</li>
            </ul>
            <div className="story-cache-modal__actions">
              <button type="button" className="primary" disabled={busy} onClick={onLoadSaved}>{busy ? 'Loading…' : 'Load saved story'}</button>
              <button type="button" className="secondary" disabled={busy} onClick={() => setStep('confirm')}><Wand2 size={15} /> Create new version</button>
              <button type="button" className="story-cache-modal__ghost" disabled={busy} onClick={onCloseNotNow}>Not now</button>
            </div>
          </>
        ) : (
          <>
            <h2 className="story-cache-modal__warn-title">Replace saved files?</h2>
            <p className="story-cache-modal__lede">A new run will overwrite images and narration for <strong>{eventLabel}</strong>.</p>
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

/* ── Main App ────────────────────────────────────────────────── */
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
  const [storyError, setStoryError] = useState(null);
  const [storyCached, setStoryCached] = useState(false);
  const [mapPopupDismissNonce, setMapPopupDismissNonce] = useState(0);
  const [timelineScrollPulse, setTimelineScrollPulse]   = useState(0);
  const [listSelectSignal, setListSelectSignal]         = useState(0);
  const [spriteDebug, setSpriteDebug]         = useState(false);
  const [workspace, setWorkspace]             = useState('journey');
  const [activeTab, setActiveTab]             = useState('info');

  const audioRef       = useRef(null);
  const storyPlayerRef = useRef(null);

  useEffect(() => {
    if (!import.meta.env.DEV) return;
    setSpriteDebug(new URLSearchParams(window.location.search).get('spriteDebug') === '1');
  }, []);

  const handleSelectFromMap = useCallback((id) => {
    setMapPopupDismissNonce((n) => n + 1); setSelectedId(id);
  }, []);
  const handleSelectFromSidebar = useCallback((id) => {
    setMapPopupDismissNonce((n) => n + 1); setListSelectSignal((n) => n + 1); setSelectedId(id);
  }, []);
  const handleFocusEventInTimeline = useCallback((eventId) => {
    const ev = events.find((e) => e.id === eventId);
    const match = timelineMatchFromEventEra(ev?.era);
    setMapPopupDismissNonce((n) => n + 1); setListSelectSignal((n) => n + 1);
    setSelectedId(eventId); setActiveEra(match ?? 'All'); setTimelineScrollPulse((n) => n + 1);
  }, [events]);
  const handleTimelineOpenMap = useCallback((id) => {
    if (!id) return; setSelectedId(id); setWorkspace('journey');
  }, []);
  const handleTimelineOpenLineage = useCallback((id) => {
    if (!id) return; setSelectedId(id); setLineageTreeEntry('default'); setLineageTreeOpen(true); setWorkspace('journey');
  }, []);

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
    setStoryCacheModal(null); setStoryCacheBanner(null); setStoryError(null);
    setStoryCached(false);

    const ac = new AbortController();
    (async () => {
      try {
        // Check if story is cached in Supabase
        const metaUrl = `${API_BASE}/api/events/${selectedId}/story/meta`;
        const metaRes = await fetch(metaUrl, { signal: ac.signal });
        if (!metaRes.ok || ac.signal.aborted) return;
        const meta = await metaRes.json();
        if (!meta.cached || ac.signal.aborted) return;

        // Auto-load the cached story silently
        setStoryLoading(true);
        const storyRes = await fetch(`${API_BASE}/api/events/${selectedId}/story`, { signal: ac.signal });
        if (!storyRes.ok || ac.signal.aborted) return;
        const data = await storyRes.json();
        if (data.error || ac.signal.aborted) return;
        setStory(data); setSceneIndex(0); setStoryCached(true);
      } catch { /* silent — user can still generate manually */ }
      finally { if (!ac.signal.aborted) setStoryLoading(false); }
    })();
    return () => ac.abort();
  }, [selectedId]);

  const loadCachedStory = async () => {
    setStoryLoading(true); setStoryError(null);
    try {
      const r = await fetch(`${API_BASE}/api/events/${selected.id}/story`);
      if (!r.ok) throw new Error(`Could not load saved story (${r.status}).`);
      const data = await r.json();
      if (data.error) throw new Error(data.error);
      setStory(data); setSceneIndex(0); setStoryCacheModal(null); setStoryCacheBanner(null);
      setStoryCached(true); setActiveTab('story');
    } catch (err) {
      setStoryError(err.message || 'Load failed. Please try again.');
      setActiveTab('story');
    }
    finally { setStoryLoading(false); }
  };

  const handleCloseStoryCacheModal = () => {
    if (storyCacheModal) { const { enterConfirm: _e, ...snap } = storyCacheModal; setStoryCacheBanner({ ...snap, cached: true }); }
    setStoryCacheModal(null);
  };

  const generateContent = async () => {
    setContentLoading(true);
    try {
      const r = await fetch(`${API_BASE}/api/events/${selected.id}/content`, { method: 'POST' });
      const data = await r.json();
      if (data.error) throw new Error(data.error);
      setContent(data);
    } catch {
      setContent({
        teachingSummary: selected.details,
        applicationLesson: selected.lesson,
        mapExplanation: `${selected.title} is mapped around ${selected.mapLocation}.`,
        lineageExplanation: `${selected.title} connects through ${selected.lineageConnection?.join(' → ')}.`
      });
    } finally { setContentLoading(false); }
  };

  // imageFormat: 'landscape' (wide 16:9 images) | 'portrait' (tall 9:16 images for reels)
  const generateStory = async ({ force = false, imageFormat = 'landscape' } = {}) => {
    setStoryLoading(true); setStoryError(null); setStoryCached(false);
    try {
      const r = await fetch(`${API_BASE}/api/events/${selected.id}/story`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sceneCount: 4, force, imageFormat })
      });
      if (!r.ok) {
        const body = await r.json().catch(() => ({}));
        throw new Error(body.error || `Server returned ${r.status}.`);
      }
      const data = await r.json();
      if (data.error) throw new Error(data.error);
      setStory(data); setSceneIndex(0); setStoryCacheModal(null); setStoryCacheBanner(null);
      setStoryCached(Boolean(data._cached)); setActiveTab('story');
    } catch (err) {
      const msg = err.name === 'TypeError'
        ? 'Could not reach the story server. Check your internet connection.'
        : (err.message || 'Story generation failed. Please try again.');
      setStoryError(msg);
      setActiveTab('story');
    }
    finally { setStoryLoading(false); }
  };

  return (
    <div className="bjm-root">
      {/* Global modals */}
      {lineageTreeOpen && (
        <LineageTreeModal open={lineageTreeOpen}
          onClose={() => { setLineageTreeOpen(false); setLineageTreeEntry('default'); }}
          tree={lineageTree} highlightNodeIds={lineageHighlightNodes}
          highlightEdgeIds={lineageHighlightEdges} targetPersonIds={lineageTargetIds}
          eventTitle={selected.title} selectedEventId={selected.id} entryMode={lineageTreeEntry} />
      )}
      {storyCacheModal && (
        <StoryCacheChoiceModal meta={storyCacheModal} enterConfirm={Boolean(storyCacheModal.enterConfirm)}
          eventLabel={selected.title} busy={storyLoading}
          onCloseNotNow={handleCloseStoryCacheModal} onLoadSaved={loadCachedStory}
          onConfirmReplace={() => generateStory({ force: true })} />
      )}

      {/* Top bar */}
      <TopBar />

      {/* Body */}
      <div className="bjm-body">
        {workspace === 'timeline' ? (
          <BibleTimelineExplorer apiBase={API_BASE} mapEvents={events}
            onClose={() => setWorkspace('journey')}
            onOpenMapEvent={handleTimelineOpenMap}
            onOpenLineage={handleTimelineOpenLineage} />
        ) : (
          <>
            {/* Left sidebar: events list */}
            <aside className="bjm-sidebar">
              {import.meta.env.DEV && spriteDebug && <SpriteDebugGrid />}
              <EventList events={events} selected={selected} onSelect={handleSelectFromSidebar}
                query={query} setQuery={setQuery} activeEra={activeEra} />
            </aside>

            {/* Right canvas: small map + tabs + content */}
            <div className="bjm-canvas" data-active-tab={activeTab}>

              {/* Persistent small map */}
              <div className="bjm-map-strip">
                <JourneyMap events={events} selected={selected} activeEra={activeEra}
                  onSelect={handleSelectFromMap} onFocusInTimeline={handleFocusEventInTimeline}
                  listSelectSignal={listSelectSignal} story={story} sceneIndex={sceneIndex}
                  apiBase={API_BASE} mapPopupDismissNonce={mapPopupDismissNonce} />
                <Timeline activeEra={activeEra} setActiveEra={setActiveEra} scrollFocusPulse={timelineScrollPulse} />
              </div>

              {/* Tab bar */}
              <TabBar activeTab={activeTab} setActiveTab={setActiveTab} selected={selected} />

              {/* Info tab */}
              {activeTab === 'info' && (
                <div className="bjm-tab-content bjm-tab-content--scroll">
                  <InfoPanel selected={selected} content={content} loading={contentLoading} onGenerate={generateContent} />
                </div>
              )}

              {/* Family tab */}
              {activeTab === 'family' && (
                <div className="bjm-tab-content bjm-tab-content--scroll">
                  <FamilyPanel selected={selected} content={content}
                    lineageMatchSummary={lineageMatchSummary} lineageFocusLabels={lineageFocusLabels}
                    onOpenLineageTree={() => { setLineageTreeEntry('default'); setLineageTreeOpen(true); }} />
                </div>
              )}

              {/* People tab */}
              {activeTab === 'people' && (
                <div className="bjm-tab-content bjm-tab-content--scroll">
                  <PeoplePanel selected={selected} />
                </div>
              )}

              {/* Story tab */}
              {activeTab === 'story' && (
                <div className="bjm-tab-content bjm-tab-content--scroll">
                  <StoryPanel apiBase={API_BASE} story={story} loading={storyLoading}
                    storyError={storyError} onClearError={() => setStoryError(null)}
                    cached={storyCached}
                    onGenerate={(imgFmt) => generateStory({ imageFormat: imgFmt || 'landscape' })}
                    onRegenerate={(imgFmt) => generateStory({ force: true, imageFormat: imgFmt || 'landscape' })}
                    cacheBanner={!story && !storyError && storyCacheBanner && storyCacheBanner.eventId === selectedId ? storyCacheBanner : null}
                    onLoadCachedInline={loadCachedStory}
                    onOpenReplaceModal={() => { if (storyCacheBanner) { setStoryCacheModal({ ...storyCacheBanner, enterConfirm: true }); setStoryCacheBanner(null); } }}
                    onDismissCacheBanner={() => setStoryCacheBanner(null)}
                    audioRef={audioRef} playing={playing} setPlaying={setPlaying}
                    sceneIndex={sceneIndex} setSceneIndex={setSceneIndex}
                    sectionRef={storyPlayerRef} exportEventId={selected.id} />
                </div>
              )}

              {/* Knowledge Graph tab */}
              {activeTab === 'graph' && (
                <div className="bjm-tab-content bjm-tab-content--graph">
                  <BibleKnowledgeGraph />
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
