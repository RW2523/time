import React, { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import L from 'leaflet';
import { MapContainer, Marker, Pane, Polygon, Polyline, Popup, Tooltip, TileLayer, useMap } from 'react-leaflet';
import { ChevronDown, ChevronUp, Layers, X } from 'lucide-react';
import { boundsFromMarkerDisplay, getEventMarkerPosition, getEventLatLng, getRouteLatLngs } from '../geo/journeyGeo';
import { CLASSIC_JOURNEYS } from '../geo/classicJourneys';
import { BIBLICAL_REGIONS, WATER_BODIES } from '../geo/biblicalRegions';
import EventArtIcon from './EventArtIcon.jsx';
import { getStoryMarkerIcon } from '../lib/storyMarkerIcon.js';
import { eventMatchesTimelineFilter } from '../lib/timelineEra.js';

const BASEMAPS = {
  streets: {
    url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
  },
  terrain: {
    url: 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png',
    attribution:
      '&copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
  },
  satellite: {
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    attribution: 'Tiles &copy; Esri &mdash; Source: Esri, Maxar, Earthstar Geographics'
  }
};

function MapResize() {
  const map = useMap();
  useEffect(() => {
    const id = requestAnimationFrame(() => map.invalidateSize());
    return () => cancelAnimationFrame(id);
  }, [map]);
  return null;
}

/** Fit map to all markers, or to the era subset when a timeline chip is active */
function MapEraBounds({ events, activeEra }) {
  const map = useMap();
  useEffect(() => {
    if (!events.length) return;
    const subset =
      activeEra && activeEra !== 'All' ? events.filter((e) => eventMatchesTimelineFilter(e, activeEra)) : events;
    if (!subset.length) return;
    const b = boundsFromMarkerDisplay(subset);
    if (!b) return;
    map.fitBounds(b, {
      padding: [56, 56],
      maxZoom: activeEra && activeEra !== 'All' ? 10 : 8,
      animate: true
    });
  }, [map, events, activeEra]);
  return null;
}

/** After the user picks a different event, center the map on that pin */
function MapFlyToSelection({ events, selectedId, selectedEvent }) {
  const map = useMap();
  const prevSelRef = useRef(selectedId);

  useEffect(() => {
    if (!selectedEvent || !events.length) return;
    if (prevSelRef.current === selectedId) return;
    prevSelRef.current = selectedId;
    const p = getEventMarkerPosition(selectedEvent, events);
    const pad = 0.045;
    const bounds = L.latLngBounds([p.lat - pad, p.lng - pad], [p.lat + pad, p.lng + pad]);
    map.invalidateSize();
    requestAnimationFrame(() => {
      map.fitBounds(bounds, { padding: [110, 110], maxZoom: 11, animate: true });
    });
  }, [map, events, selectedId, selectedEvent]);

  return null;
}

function ZoomButtons() {
  const map = useMap();
  return (
    <div className="leaflet-top leaflet-left map-zoom-stack">
      <div className="leaflet-control leaflet-bar">
        <button type="button" aria-label="Zoom in" onClick={() => map.zoomIn()}>
          +
        </button>
        <button type="button" aria-label="Zoom out" onClick={() => map.zoomOut()}>
          −
        </button>
        <button
          type="button"
          aria-label="Wide overview — Egypt through Mesopotamia"
          onClick={() => map.flyTo({ lat: 31.2, lng: 41.5 }, 5, { animate: true })}
        >
          ⌖
        </button>
      </div>
    </div>
  );
}

function DismissMapPopupsOnListAction({ dismissNonce }) {
  const map = useMap();
  useEffect(() => {
    if (!dismissNonce) return;
    map.closePopup();
  }, [dismissNonce, map]);
  return null;
}

const EventMarker = memo(function EventMarker({ event, allEvents, selectedId, activeEra, onSelect, onFocusInTimeline }) {
  const isSelected = event.id === selectedId;
  const isMuted = Boolean(activeEra && activeEra !== 'All' && !eventMatchesTimelineFilter(event, activeEra));
  const pos = useMemo(() => getEventMarkerPosition(event, allEvents), [event.id, allEvents]);
  const icon = useMemo(
    () => getStoryMarkerIcon(event, isSelected, isMuted),
    [event.id, event.mapIcon, event.order, event.title, isSelected, isMuted]
  );

  const onClick = useCallback(() => onSelect(event.id), [event.id, onSelect]);

  const onOpenInTimeline = useCallback(
    (e) => {
      e.preventDefault();
      e.stopPropagation();
      if (onFocusInTimeline) onFocusInTimeline(event.id);
      else onSelect(event.id);
    },
    [event.id, onFocusInTimeline, onSelect]
  );

  return (
    <Marker position={[pos.lat, pos.lng]} icon={icon} eventHandlers={{ click: onClick }}>
      <Popup className="bible-popup" closeOnClick autoPan keepInView={false}>
        <div className="bible-popup__inner">
          <strong className="bible-popup__title">{event.title}</strong>
          <p className="bible-popup__meta">{event.mapLocation}</p>
          {event.references?.[0] && <p className="bible-popup__ref">{event.references[0]}</p>}
          <button
            type="button"
            className="bible-popup__cta"
            onClick={onOpenInTimeline}
            onMouseDown={(e) => e.stopPropagation()}
          >
            Open in timeline
          </button>
        </div>
      </Popup>
    </Marker>
  );
});

function MapLayersPanel({
  basemap, setBasemap,
  showAtlasRoutes, setShowAtlasRoutes,
  showRegions, setShowRegions,
  showWater, setShowWater,
  showJourneyLabels, setShowJourneyLabels,
  journeyFilter, setJourneyFilter,
  warmOverlay, setWarmOverlay,
  onClose
}) {
  return (
    <div id="map-layers-panel" className="map-layers-panel" role="region" aria-label="Map display options">
      <div className="map-layers-panel__head">
        <span className="map-layers-panel__title">Map Layers</span>
        <button type="button" className="map-layers-panel__close" onClick={onClose} aria-label="Close">
          <X size={16} />
        </button>
      </div>

      {/* Basemap */}
      <p className="map-layers-panel__section-label">Basemap</p>
      <div className="map-layers-panel__segment" role="group">
        <button type="button" className={basemap === 'streets'   ? 'active' : ''} onClick={() => setBasemap('streets')}>Streets</button>
        <button type="button" className={basemap === 'terrain'   ? 'active' : ''} onClick={() => setBasemap('terrain')}>Terrain</button>
        <button type="button" className={basemap === 'satellite' ? 'active' : ''} onClick={() => setBasemap('satellite')}>Satellite</button>
      </div>

      {/* Overlays */}
      <p className="map-layers-panel__section-label">Overlays</p>
      <label className="map-layers-panel__check">
        <input type="checkbox" checked={showRegions} onChange={(e) => setShowRegions(e.target.checked)} />
        <span className="map-layers-panel__check-dot" style={{ background: '#c9a84c' }} />
        Ancient kingdoms & borders
      </label>
      <label className="map-layers-panel__check">
        <input type="checkbox" checked={showWater} onChange={(e) => setShowWater(e.target.checked)} />
        <span className="map-layers-panel__check-dot" style={{ background: '#3b82f6' }} />
        Rivers & water bodies
      </label>
      <label className="map-layers-panel__check">
        <input type="checkbox" checked={showAtlasRoutes} onChange={(e) => setShowAtlasRoutes(e.target.checked)} />
        <span className="map-layers-panel__check-dot" style={{ background: '#1f6f54' }} />
        Journey routes
      </label>
      <label className="map-layers-panel__check">
        <input type="checkbox" checked={showJourneyLabels} onChange={(e) => setShowJourneyLabels(e.target.checked)} />
        <span className="map-layers-panel__check-dot" style={{ background: '#94a3b8' }} />
        Route labels on hover
      </label>

      {/* Journey filter */}
      {showAtlasRoutes && (
        <>
          <p className="map-layers-panel__section-label">Filter routes</p>
          <div className="map-layers-panel__segment map-layers-panel__segment--3" role="group">
            <button type="button" className={journeyFilter === 'ALL' ? 'active' : ''} onClick={() => setJourneyFilter('ALL')}>All</button>
            <button type="button" className={journeyFilter === 'OT'  ? 'active' : ''} onClick={() => setJourneyFilter('OT')}>OT</button>
            <button type="button" className={journeyFilter === 'NT'  ? 'active' : ''} onClick={() => setJourneyFilter('NT')}>NT</button>
          </div>
        </>
      )}

      <label className="map-layers-panel__check">
        <input type="checkbox" checked={warmOverlay} onChange={(e) => setWarmOverlay(e.target.checked)} />
        <span className="map-layers-panel__check-dot" style={{ background: '#f59e0b' }} />
        Warm atlas tone
      </label>

      <p className="map-layers-panel__hint">Hover over a route for its name. Click a region to learn more.</p>
    </div>
  );
}

export default function JourneyMap({
  events,
  selected,
  activeEra = 'All',
  onSelect,
  onFocusInTimeline,
  listSelectSignal = 0,
  story,
  sceneIndex,
  apiBase,
  mapPopupDismissNonce = 0
}) {
  const [basemap, setBasemap] = useState('satellite');
  const [showAtlasRoutes, setShowAtlasRoutes] = useState(true);
  const [showRegions, setShowRegions] = useState(true);
  const [showWater, setShowWater] = useState(true);
  const [showJourneyLabels, setShowJourneyLabels] = useState(true);
  const [journeyFilter, setJourneyFilter] = useState('ALL'); // 'ALL' | 'OT' | 'NT'
  const [warmOverlay, setWarmOverlay] = useState(true);
  const [layersPanelOpen, setLayersPanelOpen] = useState(false);
  const [eventDetailsOpen, setEventDetailsOpen] = useState(false);
  const [eventCardUrl, setEventCardUrl] = useState(null);
  const [eventCardLoading, setEventCardLoading] = useState(false);
  const listSignalRef = useRef(0);

  useEffect(() => {
    if (listSelectSignal > listSignalRef.current) {
      listSignalRef.current = listSelectSignal;
      setEventDetailsOpen(true);
      return;
    }
    listSignalRef.current = listSelectSignal;
    setEventDetailsOpen(false);
  }, [selected.id, listSelectSignal]);

  useEffect(() => {
    let cancelled = false;
    let t = null;
    setEventCardUrl(null);
    setEventCardLoading(false);

    const run = async () => {
      try {
        const meta = await fetch(`${apiBase}/api/events/${selected.id}/event-card`).then((r) => r.json());
        if (cancelled) return;
        if (meta.imageUrl) {
          setEventCardUrl(`${apiBase}${meta.imageUrl}`);
          return;
        }
        setEventCardLoading(true);
        const created = await fetch(`${apiBase}/api/events/${selected.id}/event-card`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: '{}'
        }).then((r) => r.json());
        if (!cancelled && created.imageUrl) setEventCardUrl(`${apiBase}${created.imageUrl}`);
        else if (!cancelled && created.error) setEventCardUrl(null);
      } catch {
        if (!cancelled) setEventCardUrl(null);
      } finally {
        if (!cancelled) setEventCardLoading(false);
      }
    };

    t = window.setTimeout(run, 280);
    return () => {
      cancelled = true;
      if (t) window.clearTimeout(t);
    };
  }, [selected.id, apiBase]);

  const tile = BASEMAPS[basemap] || BASEMAPS.streets;

  const mapEvents = useMemo(() => [...events].sort((a, b) => (a.order ?? 0) - (b.order ?? 0)), [events]);

  const routePts = useMemo(() => getRouteLatLngs(selected), [selected]);

  const filteredJourneys = useMemo(() =>
    CLASSIC_JOURNEYS.filter((j) =>
      journeyFilter === 'ALL' || j.testament === journeyFilter
    ), [journeyFilter]);

  const selectedPos = useMemo(() => getEventLatLng(selected), [selected.id]);
  const initialCenter = useRef([selectedPos.lat, selectedPos.lng]);

  const onSelectStable = useCallback((id) => onSelect(id), [onSelect]);

  const markerCount = mapEvents.length;

  return (
    <main className={`map-card panel journey-map-card${story ? ' journey-map-card--has-story' : ''}`}>
      <div className={`leaflet-map-shell${warmOverlay ? ' leaflet-map-shell--warm' : ''}`}>
        <MapContainer
          center={initialCenter.current}
          zoom={6}
          className="leaflet-map-instance"
          scrollWheelZoom
          worldCopyJump
          zoomControl={false}
        >
          <TileLayer key={basemap} attribution={tile.attribution} url={tile.url} />
          <MapResize />
          <DismissMapPopupsOnListAction dismissNonce={mapPopupDismissNonce} />
          <MapEraBounds events={mapEvents} activeEra={activeEra} />
          <MapFlyToSelection events={mapEvents} selectedId={selected.id} selectedEvent={selected} />
          <ZoomButtons />

          {/* ── Ancient kingdoms & borders ── */}
          <Pane name="bible-regions" style={{ zIndex: 350 }}>
            {showRegions && BIBLICAL_REGIONS.map((r) => (
              <Polygon
                key={r.id}
                positions={r.coords}
                pathOptions={{
                  color: r.color,
                  weight: r.weight ?? 1.5,
                  opacity: 0.65,
                  fillColor: r.color,
                  fillOpacity: r.fillOpacity ?? 0.08,
                  dashArray: '5 6',
                  lineCap: 'round',
                }}
              >
                {showJourneyLabels && (
                  <Tooltip
                    direction="center"
                    permanent
                    className="region-label-tooltip"
                    offset={[0, 0]}
                  >
                    <span className="region-label-name">{r.name}</span>
                  </Tooltip>
                )}
                <Popup className="bible-popup">
                  <div className="bible-popup__inner">
                    <strong className="bible-popup__title" style={{ color: r.color }}>{r.name}</strong>
                    <p className="bible-popup__meta">{r.subtext}</p>
                  </div>
                </Popup>
              </Polygon>
            ))}
          </Pane>

          {/* ── Water bodies ── */}
          <Pane name="water-bodies" style={{ zIndex: 360 }}>
            {showWater && WATER_BODIES.map((w) =>
              w.id === 'jordan_river' ? (
                <Polyline
                  key={w.id}
                  positions={w.coords}
                  pathOptions={{ color: '#3b82f6', weight: 2.5, opacity: 0.7 }}
                >
                  {showJourneyLabels && (
                    <Tooltip sticky className="water-label-tooltip">{w.name}</Tooltip>
                  )}
                </Polyline>
              ) : (
                <Polygon
                  key={w.id}
                  positions={w.coords}
                  pathOptions={{
                    color: '#1d4ed8',
                    weight: 1,
                    opacity: 0.6,
                    fillColor: '#3b82f6',
                    fillOpacity: w.fillOpacity,
                  }}
                >
                  {showJourneyLabels && (
                    <Tooltip direction="center" permanent className="water-label-tooltip">
                      {w.name}
                    </Tooltip>
                  )}
                </Polygon>
              )
            )}
          </Pane>

          {/* ── Classic journey routes ── */}
          <Pane name="classic-routes" style={{ zIndex: 399 }}>
            {showAtlasRoutes && filteredJourneys.map((j) => (
              <Polyline
                key={j.id}
                positions={j.path}
                pathOptions={{
                  color: j.color,
                  weight: j.weight ?? 3,
                  opacity: j.opacity ?? 0.75,
                  dashArray: j.dashArray ?? '8 12',
                  lineCap: 'round',
                  lineJoin: 'round'
                }}
              >
                {showJourneyLabels && (
                  <Tooltip sticky className="journey-label-tooltip">
                    <span style={{ color: j.color }}>●</span>&nbsp;{j.label}
                  </Tooltip>
                )}
              </Polyline>
            ))}
          </Pane>

          {/* ── Selected event route ── */}
          <Pane name="event-routes" style={{ zIndex: 400 }}>
            {routePts.length >= 2 && (
              <Polyline
                positions={routePts}
                pathOptions={{
                  color: '#c5972f',
                  weight: 4,
                  opacity: 0.9,
                  dashArray: '14 10',
                  lineCap: 'round',
                  lineJoin: 'round'
                }}
              />
            )}
          </Pane>

          <Pane name="story-markers" style={{ zIndex: 650 }}>
            {mapEvents.map((event) => (
              <EventMarker
                key={event.id}
                event={event}
                allEvents={mapEvents}
                selectedId={selected.id}
                activeEra={activeEra}
                onSelect={onSelectStable}
                onFocusInTimeline={onFocusInTimeline}
              />
            ))}
          </Pane>
        </MapContainer>
        {!layersPanelOpen && (
          <button
            type="button"
            className="map-layers-fab"
            onClick={() => setLayersPanelOpen(true)}
            aria-expanded={false}
            aria-controls="map-layers-panel"
            title="Basemap & layers"
          >
            <Layers size={18} aria-hidden />
          </button>
        )}
        {layersPanelOpen && (
          <MapLayersPanel
            basemap={basemap} setBasemap={setBasemap}
            showAtlasRoutes={showAtlasRoutes} setShowAtlasRoutes={setShowAtlasRoutes}
            showRegions={showRegions} setShowRegions={setShowRegions}
            showWater={showWater} setShowWater={setShowWater}
            showJourneyLabels={showJourneyLabels} setShowJourneyLabels={setShowJourneyLabels}
            journeyFilter={journeyFilter} setJourneyFilter={setJourneyFilter}
            warmOverlay={warmOverlay} setWarmOverlay={setWarmOverlay}
            onClose={() => setLayersPanelOpen(false)}
          />
        )}
      </div>

      {eventDetailsOpen ? (
        <div className="event-popover event-popover--expanded" id="event-map-sheet">
          {eventCardUrl ? (
            <div className="event-popover__bg" style={{ backgroundImage: `url(${eventCardUrl})` }} aria-hidden />
          ) : null}
          <div className="event-popover__scrim" aria-hidden />
          <button type="button" className="event-popover__collapse" onClick={() => setEventDetailsOpen(false)} aria-label="Hide event details">
            <ChevronDown size={20} />
          </button>
          <div className="event-popover__body">
            <EventArtIcon order={selected.order} mapIcon={selected.mapIcon} variant="popover" />
            <div>
              <h3>{selected.title}</h3>
              <p>{selected.references?.join(', ')}</p>
              <span>{selected.summary}</span>
              {eventCardLoading ? <p className="event-popover__card-status">Preparing scene art…</p> : null}
            </div>
          </div>
        </div>
      ) : (
        <button type="button" className="event-popover-strip" onClick={() => setEventDetailsOpen(true)} aria-expanded={false} aria-controls="event-map-sheet">
          {eventCardUrl ? <span className="event-popover-strip__bg" style={{ backgroundImage: `url(${eventCardUrl})` }} aria-hidden /> : null}
          <span className="event-popover-strip__scrim" aria-hidden />
          <EventArtIcon order={selected.order} mapIcon={selected.mapIcon} variant="strip" />
          <span className="event-popover-strip__text">
            <strong>{selected.title}</strong>
            <small>
              {markerCount} markers · {eventCardLoading ? 'Art loading…' : 'Tap for details'}
            </small>
          </span>
          <ChevronUp size={18} className="event-popover-strip__chev" aria-hidden />
        </button>
      )}

      {story && (
        <div className="story-card">
          <div className="story-image-wrap">
            <img src={`${apiBase}${story.scenes[sceneIndex]?.imageUrl}`} alt={story.scenes[sceneIndex]?.title || story.title} />
            <div className="story-image-caption">
              Scene {sceneIndex + 1}: {story.scenes[sceneIndex]?.title}
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
