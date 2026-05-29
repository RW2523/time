/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { lazy, Suspense, useState } from 'react';
import { ThemeProvider, useTheme } from './ThemeContext';
import { useSupabaseData } from './hooks/useSupabaseData';
import Header from './components/Header';
import InteractiveWorkflow from './components/InteractiveWorkflow';
import VisualizeScripture from './components/VisualizeScripture';
import Footer from './components/Footer';
import {
  BookOpen, Compass, Map, CalendarDays, GitBranch,
  Sparkles, Play, MapPin, ChevronRight, ArrowRight,
} from 'lucide-react';

const BibleJourneyApp = lazy(() => import('./explore/BibleJourneyApp.jsx'));

export default function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}

// ─────────────────────────────────────────────────────────────────────────────

function AppContent() {
  const { theme, toggleTheme } = useTheme();
  const { journeys, verses, loading } = useSupabaseData();
  const [exploreTab, setExploreTab] = useState<'study' | 'maps' | 'live'>('study');

  const noop = (_: string) => {};

  const handleLaunchMap = () => {
    setExploreTab('live');
    setTimeout(() => {
      document.getElementById('explore-section')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 50);
  };

  const dk = theme === 'dark';

  // ── feature cards data ──────────────────────────────────────────────────
  const features = [
    {
      icon: Map,
      color: 'amber',
      title: 'Live Journey Map',
      desc: 'Real Leaflet tiles overlaid with 100+ Bible events, journey routes, and era markers — fully interactive.',
    },
    {
      icon: CalendarDays,
      color: 'blue',
      title: 'Historical Timeline',
      desc: 'Navigate 8 biblical eras from Primeval creation through the ministry of Jesus — click any era to filter the map.',
    },
    {
      icon: BookOpen,
      color: 'indigo',
      title: 'Verse Theology',
      desc: 'Pick any passage and generate theological explanations, quizzes, sermon outlines, timelines, and audio.',
    },
    {
      icon: GitBranch,
      color: 'rose',
      title: 'Family Lineage',
      desc: 'Follow the messianic line from Adam through David to Jesus — nodes light up for every Bible event.',
    },
    {
      icon: Sparkles,
      color: 'emerald',
      title: 'AI Story Player',
      desc: 'Connect a backend to generate AI illustrated scenes and narration for each event in the Bible.',
    },
    {
      icon: Compass,
      color: 'orange',
      title: 'SVG Cartography',
      desc: 'Schematic vector maps trace Paul\'s missions, the Exodus route, and the conquest journeys stop-by-stop.',
    },
  ] as const;

  const colorMap = {
    amber:   dk ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'   : 'bg-amber-50 text-amber-700 border-amber-200',
    blue:    dk ? 'bg-blue-500/10 text-blue-400 border-blue-500/20'       : 'bg-blue-50 text-blue-700 border-blue-200',
    indigo:  dk ? 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20' : 'bg-indigo-50 text-indigo-700 border-indigo-200',
    rose:    dk ? 'bg-rose-500/10 text-rose-400 border-rose-500/20'       : 'bg-rose-50 text-rose-700 border-rose-200',
    emerald: dk ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-emerald-50 text-emerald-700 border-emerald-200',
    orange:  dk ? 'bg-orange-500/10 text-orange-400 border-orange-500/20' : 'bg-orange-50 text-orange-700 border-orange-200',
  };

  // ── explore tabs ─────────────────────────────────────────────────────────
  const tabs: { id: 'study' | 'maps' | 'live'; label: string; sub: string; icon: typeof Map }[] = [
    { id: 'study', label: 'Theological Study',  sub: 'Verses · timelines · quizzes', icon: BookOpen },
    { id: 'maps',  label: 'Journey Maps',        sub: 'SVG cartography · stops',     icon: Compass  },
    { id: 'live',  label: 'Live Bible Map',      sub: '100+ events · era filters',   icon: Map      },
  ];

  return (
    <div className={`relative min-h-screen transition-colors duration-500 overflow-x-hidden ${
      dk ? 'bg-[#0B192C] text-[#F1F6F9]' : 'bg-white text-slate-900'
    }`}>

      {/* ── HEADER ────────────────────────────────────────────────────────── */}
      <Header onNotify={noop} onLaunchMap={handleLaunchMap} />

      <main>

        {/* ══ 1. HERO ══════════════════════════════════════════════════════ */}
        <section className={`relative pt-32 pb-24 md:pt-44 md:pb-32 overflow-hidden border-b transition-colors ${
          dk ? 'bg-[#0B192C] border-slate-800' : 'bg-gradient-to-b from-white via-slate-50 to-[#F4F7FB] border-slate-200'
        }`}>
          {/* ambient glows */}
          <div className="pointer-events-none absolute top-1/3 left-1/2 -translate-x-1/2 w-[700px] h-[350px] rounded-full blur-[130px] opacity-25"
               style={{ background: 'radial-gradient(ellipse,#3b82f6 0%,transparent 70%)' }} />
          <div className="pointer-events-none absolute top-1/4 right-0 w-96 h-96 rounded-full blur-[100px] opacity-15"
               style={{ background: 'radial-gradient(ellipse,#f59e0b 0%,transparent 70%)' }} />

          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
            {/* badge */}
            <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border mb-8 text-[10px] font-mono font-extrabold uppercase tracking-wider ${
              dk ? 'bg-slate-900 border-slate-800 text-amber-400' : 'bg-blue-50 border-blue-100 text-blue-700'
            }`}>
              <Sparkles className="w-3 h-3 animate-pulse" />
              Interactive Bible Research Platform
            </div>

            {/* headline */}
            <h1 className={`font-display font-black text-4xl sm:text-6xl md:text-7xl leading-[1.05] tracking-tight mb-6 ${
              dk ? 'text-white' : 'text-[#0B192C]'
            }`}>
              Study the Bible with<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 via-indigo-500 to-amber-500">
                maps, timelines &amp; AI.
              </span>
            </h1>

            <p className={`text-base sm:text-lg leading-relaxed mb-10 max-w-2xl mx-auto ${
              dk ? 'text-slate-400' : 'text-slate-500'
            }`}>
              SabAI Bible puts an interactive journey map, historical timeline, theological study tools,
              and family lineage explorer all in one place — completely free to explore.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
              <button
                onClick={handleLaunchMap}
                className={`flex items-center gap-2 px-8 py-4 rounded-xl text-sm font-extrabold uppercase tracking-widest shadow-lg hover:shadow-xl transition-all hover:-translate-y-0.5 cursor-pointer ${
                  dk
                    ? 'bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950'
                    : 'bg-[#0B192C] text-white hover:bg-slate-900'
                }`}
              >
                <MapPin className="w-4 h-4" />
                Launch Bible Journey Map
              </button>
              <button
                onClick={() => document.getElementById('explore-section')?.scrollIntoView({ behavior: 'smooth' })}
                className={`flex items-center gap-2 px-8 py-4 rounded-xl text-sm font-bold border transition-all cursor-pointer ${
                  dk
                    ? 'border-slate-700 text-slate-300 hover:bg-slate-900'
                    : 'border-stone-200 text-slate-600 hover:bg-stone-50'
                }`}
              >
                <Play className="w-4 h-4" />
                Explore Features
              </button>
            </div>

            {/* social proof strip */}
            <div className={`inline-flex flex-wrap justify-center gap-6 text-xs font-mono font-bold uppercase tracking-wider ${
              dk ? 'text-slate-500' : 'text-stone-400'
            }`}>
              {['100+ Bible Events', '8 Historical Eras', 'Family Lineage Tree', 'No account needed'].map((t) => (
                <span key={t} className="flex items-center gap-1.5">
                  <span className="w-1 h-1 rounded-full bg-amber-500" />{t}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* ══ 2. FEATURES GRID ══════════════════════════════════════════════ */}
        <section id="features" className={`py-20 px-4 sm:px-6 lg:px-8 transition-colors ${
          dk ? 'bg-[#060d1f]' : 'bg-stone-50'
        }`}>
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className={`text-2xl sm:text-4xl font-display font-black tracking-tight mb-3 ${dk ? 'text-white' : 'text-stone-900'}`}>
                Everything in one place
              </h2>
              <p className={`text-sm max-w-xl mx-auto ${dk ? 'text-slate-400' : 'text-stone-500'}`}>
                Six powerful tools for studying Scripture — all available live in the sandbox below.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {features.map(({ icon: Icon, color, title, desc }) => (
                <div
                  key={title}
                  className={`group p-6 rounded-2xl border transition-all duration-300 hover:-translate-y-1 ${
                    dk
                      ? 'bg-[#0B192C] border-slate-800 hover:border-slate-700'
                      : 'bg-white border-stone-200 hover:border-stone-300 shadow-sm hover:shadow-md'
                  }`}
                >
                  <div className={`inline-flex items-center justify-center w-10 h-10 rounded-xl border mb-4 ${colorMap[color]}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className={`text-sm font-extrabold mb-2 ${dk ? 'text-white' : 'text-stone-900'}`}>{title}</h3>
                  <p className={`text-xs leading-relaxed ${dk ? 'text-slate-400' : 'text-stone-500'}`}>{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ══ 3. EXPLORE SECTION ════════════════════════════════════════════ */}
        <section
          id="explore-section"
          className={`relative py-20 px-4 sm:px-6 lg:px-8 overflow-hidden transition-colors ${
            dk ? 'bg-[#0B192C]' : 'bg-white'
          }`}
        >
          {/* glow */}
          <div className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[200px] rounded-full blur-[100px] opacity-20"
               style={{ background: 'radial-gradient(ellipse,#ca8a04 0%,transparent 70%)' }} />

          <div className="max-w-7xl mx-auto relative z-10">
            {/* section header */}
            <div className="text-center mb-10">
              <span className={`inline-flex items-center gap-1.5 text-[10px] font-mono font-extrabold uppercase tracking-[0.2em] px-3 py-1.5 rounded-full border mb-5 ${
                dk ? 'bg-amber-500/10 border-amber-500/20 text-amber-400' : 'bg-amber-50 border-amber-200 text-amber-800'
              }`}>
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                Live Interactive Sandbox
              </span>
              <h2 className={`text-3xl sm:text-4xl font-display font-black tracking-tight mb-3 ${
                dk ? 'text-white' : 'text-stone-900'
              }`}>
                Journey Maps &amp; Historical Timelines
              </h2>
              <p className={`text-sm max-w-xl mx-auto mb-8 ${dk ? 'text-slate-400' : 'text-stone-500'}`}>
                Trace biblical journeys on a live map, study verse theology, and explore the complete Bible era timeline — no login required.
              </p>

              {/* tab bar */}
              <div className={`inline-flex gap-1 p-1.5 rounded-2xl border ${
                dk ? 'bg-slate-950/80 border-slate-800' : 'bg-stone-100 border-stone-200'
              }`}>
                {tabs.map(({ id, label, sub, icon: Icon }) => {
                  const active = exploreTab === id;
                  return (
                    <button
                      key={id}
                      onClick={() => setExploreTab(id)}
                      className={`flex items-center gap-2.5 px-4 py-2.5 rounded-xl transition-all cursor-pointer ${
                        active
                          ? dk
                            ? 'bg-amber-500 text-slate-950 shadow-md'
                            : 'bg-[#0B192C] text-white shadow-md'
                          : dk
                            ? 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
                            : 'text-stone-500 hover:text-stone-800 hover:bg-white'
                      }`}
                    >
                      <Icon className="w-4 h-4 shrink-0" />
                      <div className="text-left">
                        <div className="text-xs font-extrabold leading-none">{label}</div>
                        <div className={`text-[9px] font-mono mt-0.5 leading-none hidden sm:block ${
                          active ? 'opacity-60' : dk ? 'text-slate-600' : 'text-stone-400'
                        }`}>{sub}</div>
                      </div>
                    </button>
                  );
                })}
              </div>

              {loading && (
                <div className={`mt-3 flex justify-center items-center gap-2 text-[11px] font-mono ${
                  dk ? 'text-slate-500' : 'text-stone-400'
                }`}>
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                  Loading live data…
                </div>
              )}
            </div>

            {/* ── Tab: Theological Study ── */}
            {exploreTab === 'study' && (
              <div className="animate-fadeIn">
                <div className={`rounded-3xl border overflow-hidden ${
                  dk ? 'border-slate-800 bg-[#030a18]' : 'border-stone-200 bg-stone-50 shadow-sm'
                }`}>
                  <div className={`flex items-center gap-3 px-6 py-4 border-b ${
                    dk ? 'border-slate-800 bg-[#060d1f]' : 'border-stone-200 bg-white'
                  }`}>
                    <span className={`flex items-center justify-center w-7 h-7 rounded-lg border ${
                      dk ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' : 'bg-amber-100 text-amber-700 border-amber-200'
                    }`}><BookOpen className="w-4 h-4" /></span>
                    <div>
                      <p className={`text-xs font-extrabold ${dk ? 'text-white' : 'text-stone-900'}`}>Verse Explorer</p>
                      <p className={`text-[10px] font-mono ${dk ? 'text-slate-500' : 'text-stone-400'}`}>
                        Pick a passage → select an output type → study in depth
                      </p>
                    </div>
                  </div>
                  <div className="p-5 sm:p-8">
                    <InteractiveWorkflow onNotify={noop} verses={verses} />
                  </div>
                </div>
              </div>
            )}

            {/* ── Tab: Journey Maps ── */}
            {exploreTab === 'maps' && (
              <div className="animate-fadeIn">
                <div className={`rounded-3xl border overflow-hidden ${
                  dk ? 'border-slate-800 bg-[#030a18]' : 'border-stone-200 bg-stone-50 shadow-sm'
                }`}>
                  <div className={`flex items-center gap-3 px-6 py-4 border-b ${
                    dk ? 'border-slate-800 bg-[#060d1f]' : 'border-stone-200 bg-white'
                  }`}>
                    <span className={`flex items-center justify-center w-7 h-7 rounded-lg border ${
                      dk ? 'bg-rose-500/10 text-rose-400 border-rose-500/20' : 'bg-rose-100 text-rose-700 border-rose-200'
                    }`}><Compass className="w-4 h-4" /></span>
                    <div>
                      <p className={`text-xs font-extrabold ${dk ? 'text-white' : 'text-stone-900'}`}>Interactive SVG Journey Maps</p>
                      <p className={`text-[10px] font-mono ${dk ? 'text-slate-500' : 'text-stone-400'}`}>
                        Click waypoints to trace journeys stop-by-stop with historical detail
                      </p>
                    </div>
                  </div>
                  <div className="p-5 sm:p-8">
                    <VisualizeScripture onNotify={noop} journeys={journeys} />
                  </div>
                </div>
              </div>
            )}

            {/* ── Tab: Live Bible Map ── */}
            {exploreTab === 'live' && (
              <div className="animate-fadeIn">
                {/* info bar */}
                <div className={`flex flex-wrap items-center justify-between gap-4 px-5 py-3.5 rounded-2xl border mb-4 ${
                  dk ? 'bg-slate-950/80 border-slate-800' : 'bg-white border-stone-200 shadow-sm'
                }`}>
                  <div className="flex items-center gap-3">
                    <span className={`flex items-center justify-center w-8 h-8 rounded-lg border ${
                      dk ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-emerald-100 text-emerald-700 border-emerald-200'
                    }`}><Map className="w-4 h-4" /></span>
                    <div>
                      <p className={`text-xs font-extrabold ${dk ? 'text-white' : 'text-stone-900'}`}>Full Bible Journey Map</p>
                      <p className={`text-[10px] font-mono ${dk ? 'text-slate-500' : 'text-stone-400'}`}>
                        100+ events · era timeline · family lineage · story player
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span className={`text-[10px] font-mono font-bold ${dk ? 'text-emerald-400' : 'text-emerald-700'}`}>
                      LIVE · FULLY INTERACTIVE
                    </span>
                  </div>
                </div>
                {/* map container */}
                <div className={`rounded-3xl border overflow-hidden ${
                  dk ? 'border-slate-800' : 'border-stone-200 shadow-sm'
                }`} style={{ height: '82vh', minHeight: 560 }}>
                  <Suspense fallback={
                    <div className={`w-full h-full flex flex-col items-center justify-center gap-4 ${
                      dk ? 'bg-[#030a18] text-slate-400' : 'bg-stone-50 text-stone-400'
                    }`}>
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center border ${
                        dk ? 'bg-amber-500/10 border-amber-500/20' : 'bg-amber-100 border-amber-200'
                      }`}>
                        <Map className={`w-6 h-6 ${dk ? 'text-amber-400' : 'text-amber-600'}`} />
                      </div>
                      <div className="text-center">
                        <p className={`text-sm font-bold mb-2 ${dk ? 'text-slate-300' : 'text-stone-600'}`}>
                          Loading Bible Journey Map
                        </p>
                        <div className="flex items-center justify-center gap-1.5">
                          {[0, 150, 300].map((d) => (
                            <span key={d} className="w-2 h-2 rounded-full bg-amber-500 animate-bounce"
                                  style={{ animationDelay: `${d}ms` }} />
                          ))}
                        </div>
                      </div>
                    </div>
                  }>
                    <BibleJourneyApp />
                  </Suspense>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* ══ 4. CTA BANNER ═════════════════════════════════════════════════ */}
        <section className={`py-20 px-4 sm:px-6 lg:px-8 transition-colors border-t ${
          dk ? 'bg-[#060d1f] border-slate-800' : 'bg-stone-50 border-stone-200'
        }`}>
          <div className="max-w-4xl mx-auto text-center">
            <h2 className={`text-2xl sm:text-4xl font-display font-black tracking-tight mb-4 ${dk ? 'text-white' : 'text-stone-900'}`}>
              Ready to explore Scripture<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-amber-500">in a whole new way?</span>
            </h2>
            <p className={`text-sm mb-8 max-w-xl mx-auto ${dk ? 'text-slate-400' : 'text-stone-500'}`}>
              The full Bible Journey Map is live above — no sign-up, no paywall. Jump in and start exploring.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={handleLaunchMap}
                className={`flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl text-sm font-extrabold uppercase tracking-widest shadow-md hover:shadow-lg transition-all hover:-translate-y-0.5 cursor-pointer ${
                  dk
                    ? 'bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950'
                    : 'bg-[#0B192C] text-white hover:bg-slate-900'
                }`}
              >
                <MapPin className="w-4 h-4" />
                Open the Map Now
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
            {/* trust pills */}
            <div className={`mt-10 flex flex-wrap justify-center gap-3 text-[10px] font-mono font-bold uppercase tracking-wider ${
              dk ? 'text-slate-600' : 'text-stone-400'
            }`}>
              {['Open source data', 'No account required', 'Works offline after load', 'Dark & light mode'].map((t) => (
                <span key={t} className={`px-3 py-1 rounded-full border ${
                  dk ? 'border-slate-800' : 'border-stone-200 bg-white'
                }`}>{t}</span>
              ))}
            </div>
          </div>
        </section>

      </main>

      {/* ── FOOTER ──────────────────────────────────────────────────────── */}
      <Footer onNotify={noop} />

    </div>
  );
}
