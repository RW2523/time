/**
 * FILE 05 — sabai-bible/src/explore/BibleJourneyApp.jsx
 *           (video-generation relevant sections only)
 * ─────────────────────────────────────────────────────────────
 * PURPOSE:  The React glue between the API and the video renderer.
 *
 *           Two things extracted here:
 *
 *           A. generateStory()   — async function that calls
 *              POST /api/events/:id/story and stores the manifest
 *              in React state.
 *
 *           B. StoryPlayer component — shows the toolbar, scene
 *              slideshow, rendering progress bar, <video> element,
 *              and all video-related buttons.
 *
 * IMPORTS USED (from the full component):
 *   makeStoryVideo, downloadBlob, saveVideoLocally, loadVideoLocally,
 *   isVideoSupported, estimateVideoDuration   ← from 04_client_makeStoryVideo.js
 *
 * STATE (parent):
 *   story, setStory          — the manifest JSON from the API
 *   storyLoading, setStoryLoading
 *   storyError, setStoryError
 *   storyCached, setStoryCached
 *   sceneIndex, setSceneIndex
 *   playing, setPlaying
 *   activeTab, setActiveTab
 */

import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  Download, Film, HardDrive, Loader2, Maximize2, Minimize2,
  Pause, Play, Sparkles, Wand2, X
} from 'lucide-react';
import {
  makeStoryVideo, downloadBlob, saveVideoLocally, loadVideoLocally,
  isVideoSupported, estimateVideoDuration
} from './utils/makeStoryVideo.js';

// ─────────────────────────────────────────────────────────────────────────────
// A.  generateStory — calls the backend and updates React state
// ─────────────────────────────────────────────────────────────────────────────
// Paste this inside your main App component (the one that holds `selected`
// event state).

/*
  const generateStory = async ({ force = false } = {}) => {
    setStoryLoading(true); setStoryError(null); setStoryCached(false);
    try {
      const r = await fetch(`${API_BASE}/api/events/${selected.id}/story`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sceneCount: 4, force })
      });
      if (!r.ok) {
        const body = await r.json().catch(() => ({}));
        throw new Error(body.error || `Server returned ${r.status}.`);
      }
      const data = await r.json();
      if (data.error) throw new Error(data.error);
      setStory(data);
      setSceneIndex(0);
      setStoryCacheBanner(null);
      setStoryCached(Boolean(data._cached));
      setActiveTab('story');
    } catch (err) {
      const msg = err.name === 'TypeError'
        ? 'Could not reach the story server. Check your internet connection.'
        : (err.message || 'Story generation failed. Please try again.');
      setStoryError(msg);
      setActiveTab('story');
    } finally {
      setStoryLoading(false);
    }
  };
*/

// ─────────────────────────────────────────────────────────────────────────────
// B.  StoryPanel — error boundary wrapper
// ─────────────────────────────────────────────────────────────────────────────
export function StoryPanel(props) {
  if (props.storyError) {
    return (
      <div className="story-api-state">
        <div className="story-api-state__icon" aria-hidden>⚠️</div>
        <h3>Story generation failed</h3>
        <p>{props.storyError}</p>
        <div className="story-api-state__note">
          Make sure your backend server is running and the{' '}
          <code>VITE_API_BASE</code> URL is correct.
        </div>
        <button type="button" className="primary" style={{ marginTop: 16 }} onClick={props.onClearError}>
          Try again
        </button>
      </div>
    );
  }
  return <StoryPlayer {...props} />;
}

// ─────────────────────────────────────────────────────────────────────────────
// B.  StoryPlayer — the full video player + generation UI
// ─────────────────────────────────────────────────────────────────────────────
/**
 * Props:
 *   story          — manifest JSON | null
 *   loading        — boolean (API call in flight)
 *   onGenerate()   — triggers generateStory()
 *   onRegenerate() — triggers generateStory({ force: true })
 *   cached         — boolean (story was served from Supabase cache)
 *   cacheBanner    — meta object | null (from /story/meta)
 *   onLoadCachedInline()
 *   onOpenReplaceModal()
 *   onDismissCacheBanner()
 *   audioRef       — React ref for the <audio> element
 *   playing, setPlaying
 *   sceneIndex, setSceneIndex
 *   apiBase        — '' in production, 'http://localhost:8787' in dev
 *   sectionRef     — ref to the <section> (for fullscreen)
 *   exportEventId  — event.id (for IndexedDB key)
 */
export function StoryPlayer({
  story, loading, onGenerate, onRegenerate,
  cached, cacheBanner, onLoadCachedInline, onOpenReplaceModal, onDismissCacheBanner,
  audioRef, playing, setPlaying, sceneIndex, setSceneIndex,
  apiBase, sectionRef, exportEventId
}) {
  const [audioProgress, setAudioProgress] = useState(0);
  const [audioDuration, setAudioDuration] = useState(0);
  const [videoCinema,   setVideoCinema]   = useState(false);

  // videoStatus: 'idle' | 'making' | 'ready' | 'error'
  const [videoStatus,   setVideoStatus]   = useState('idle');
  const [videoProgress, setVideoProgress] = useState(0);
  const [videoUrl,      setVideoUrl]      = useState(null);
  const [videoExt,      setVideoExt]      = useState('webm');
  const videoRef = useRef(null);

  const videoSupported = isVideoSupported();

  // On event change: clear video state, check IndexedDB for saved video
  useEffect(() => {
    setVideoUrl(null); setVideoStatus('idle'); setVideoProgress(0);
    if (!exportEventId) return;
    loadVideoLocally(exportEventId).then((rec) => {
      if (rec) { setVideoUrl(rec.url); setVideoExt(rec.ext || 'webm'); setVideoStatus('ready'); }
    });
  }, [exportEventId]);

  // Auto-advance scenes in slideshow view
  useEffect(() => {
    if (!story?.scenes?.length) return;
    const dur = story.scenes[sceneIndex]?.durationSec || 7;
    const timer = setTimeout(() => {
      setSceneIndex((i) => (i + 1) % story.scenes.length);
    }, dur * 1000);
    return () => clearTimeout(timer);
  }, [story, sceneIndex, setSceneIndex]);

  const exitCinema  = useCallback(() => {
    setVideoCinema(false);
    if (document.fullscreenElement) document.exitFullscreen().catch(() => {});
  }, []);
  const enterCinema = useCallback(() => {
    if (!story && videoStatus !== 'ready') return;
    setVideoCinema(true);
    requestAnimationFrame(() => sectionRef?.current?.requestFullscreen?.().catch(() => {}));
  }, [story, videoStatus, sectionRef]);

  useEffect(() => {
    if (!videoCinema) return;
    const fn = () => { if (!document.fullscreenElement) setVideoCinema(false); };
    document.addEventListener('fullscreenchange', fn);
    return () => document.removeEventListener('fullscreenchange', fn);
  }, [videoCinema]);

  const resolveUrl = (url) =>
    (!url ? null : (url.startsWith('data:') || url.startsWith('http') ? url : `${apiBase}${url}`));

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

  // ── Video generation (the key action) ─────────────────────────────────────
  const handleMakeVideo = useCallback(async () => {
    if (!story) return;
    setVideoStatus('making'); setVideoProgress(0); setVideoUrl(null);
    try {
      // makeStoryVideo is called here — the AudioContext is created inside
      // this callback which IS the user-gesture handler (button click).
      const blob = await makeStoryVideo(story, (p) => setVideoProgress(Math.round(p * 100)));
      const url  = URL.createObjectURL(blob);
      setVideoUrl(url); setVideoExt(blob._ext || 'webm'); setVideoStatus('ready');
      await saveVideoLocally(exportEventId || story.eventId, blob);
    } catch (err) {
      console.error('[video]', err);
      setVideoStatus('error');
    }
  }, [story, exportEventId]);

  const handleDownload = () => {
    if (!videoUrl) return;
    const name = `${exportEventId || story?.eventId || 'story'}-video.${videoExt}`;
    const a = Object.assign(document.createElement('a'), { href: videoUrl, download: name, rel: 'noopener' });
    document.body.appendChild(a); a.click(); a.remove();
  };

  return (
    <section ref={sectionRef} className={`player panel story-player${videoCinema ? ' story-player--cinema' : ''}`}>
      {videoCinema && (
        <button type="button" className="story-player__cinema-close" onClick={exitCinema}>
          <X size={22} />
        </button>
      )}

      {/* ── TOOLBAR ── */}
      <div className="player-toolbar player-toolbar--top">
        <div className="player-left">
          <div className="player-icon"><Sparkles size={22} /></div>
          <div>
            <h3>AI Story Video {cached && <span className="story-cached-badge">✓ Saved</span>}</h3>
            <p>Gemini · illustrated scenes + narration</p>
          </div>
        </div>

        {story ? (
          <div className="player-actions">
            {/* Narration audio button */}
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
              <span className="story-no-audio">🔇 No narration</span>
            )}

            {/* Create / Download video button */}
            {!videoSupported ? (
              <span className="story-video-unsupported">
                <Film size={15} /> Video: use Chrome/Edge
              </span>
            ) : videoStatus === 'idle' || videoStatus === 'error' ? (
              <button type="button" className="primary story-make-video-btn"
                onClick={handleMakeVideo} disabled={loading}
                title={`~${estimateVideoDuration(story)}s — keep tab visible`}>
                <Film size={15} /> Create Video
              </button>
            ) : videoStatus === 'making' ? (
              <button type="button" className="primary story-make-video-btn" disabled>
                <Loader2 size={15} className="spin" /> Rendering… {videoProgress}%
              </button>
            ) : (
              <>
                <button type="button" className="primary story-make-video-btn" onClick={handleDownload}>
                  <Download size={15} /> Download {videoExt.toUpperCase()}
                </button>
                <button type="button" className="secondary story-make-video-btn"
                  onClick={() => { setVideoStatus('idle'); handleMakeVideo(); }}>
                  <Film size={15} /> Re-create
                </button>
              </>
            )}

            {/* Scene dots (slideshow only) */}
            {videoStatus !== 'ready' && (
              <div className="scene-stepper" role="tablist">
                {story.scenes.map((s, i) => (
                  <button type="button" key={s.title + i} className={i === sceneIndex ? 'active' : ''}
                    onClick={() => setSceneIndex(i)}>{i + 1}
                  </button>
                ))}
              </div>
            )}

            <button type="button" className="secondary story-regenerate" onClick={onRegenerate} disabled={loading}>
              {loading ? 'Working…' : 'New version'}
            </button>
          </div>
        ) : cacheBanner ? (
          /* Cache banner — show before first generation */
          <div className="story-cache-inline">
            <div className="story-cache-inline__row">
              <HardDrive size={19} className="story-cache-inline__icon" />
              <div>
                <strong>Saved story on this device</strong>
                <p className="story-cache-inline__meta">
                  {cacheBanner.generatedAt
                    ? new Date(cacheBanner.generatedAt).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' })
                    : 'Unknown date'} · {cacheBanner.sceneCount} scene{cacheBanner.sceneCount === 1 ? '' : 's'}
                </p>
              </div>
            </div>
            <div className="story-cache-inline__actions">
              <button type="button" className="primary" onClick={onLoadCachedInline} disabled={loading}>
                {loading ? 'Loading…' : 'Load saved'}
              </button>
              <button type="button" className="secondary" onClick={onOpenReplaceModal} disabled={loading}>
                <Wand2 size={14} /> New version
              </button>
              <button type="button" className="story-cache-inline__dismiss" onClick={onDismissCacheBanner}>Hide</button>
            </div>
          </div>
        ) : (
          /* Initial CTA — no story yet */
          <button type="button" className="primary" onClick={onGenerate} disabled={loading}>
            {loading
              ? <><Loader2 size={15} className="spin" /> Creating story…</>
              : <><Sparkles size={15} /> Create story video</>}
          </button>
        )}
      </div>

      {/* ── Rendering progress (full-width banner) ── */}
      {videoStatus === 'making' && (
        <div className="story-video-progress story-video-progress--banner">
          <Loader2 size={16} className="spin" />
          <div style={{ flex: 1 }}>
            <span>Rendering video with transitions… {videoProgress}%
              {videoProgress < 8 && (
                <span style={{ opacity: 0.65 }}>&nbsp;(~{estimateVideoDuration(story)}s — keep tab visible)</span>
              )}
            </span>
            <div className="story-video-progress__bar"><div style={{ width: `${videoProgress}%` }} /></div>
          </div>
        </div>
      )}
      {videoStatus === 'error' && (
        <div className="story-video-progress story-video-progress--error story-video-progress--banner">
          ⚠ Video creation failed — open DevTools console for details, then try again
        </div>
      )}

      {/* ── Video player (replaces slideshow once ready) ── */}
      {videoStatus === 'ready' && videoUrl && (
        <div className="story-video-player">
          <video ref={videoRef} src={videoUrl} controls autoPlay loop playsInline
            className="story-video-player__video" aria-label={`${story?.title || 'Story'} video`}
          />
          <div className="story-video-player__overlay-btns">
            <button type="button" className="secondary story-cinema-toggle"
              onClick={videoCinema ? exitCinema : enterCinema}>
              {videoCinema ? <><Minimize2 size={15} /> Exit</> : <><Maximize2 size={15} /> Fullscreen</>}
            </button>
            <button type="button" className="secondary" onClick={() => setVideoStatus('idle')}>
              <Film size={15} /> Scenes
            </button>
          </div>
        </div>
      )}

      {/* ── Scene slideshow (while no video / video not ready) ── */}
      {videoStatus !== 'ready' && story && (
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
          {loading && <div className="story-theater__loading">Updating story…</div>}
          <div className="story-theater__scenes">
            {story.scenes.map((_, i) => (
              <button key={i} type="button"
                className={`story-theater__tick${i === sceneIndex ? ' active' : ''}${i < sceneIndex ? ' done' : ''}`}
                onClick={() => setSceneIndex(i)} aria-label={`Scene ${i + 1}`}
              />
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
