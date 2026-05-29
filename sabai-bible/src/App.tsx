/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { lazy, Suspense, useState } from 'react';
import Header from './components/Header';
import HeroSection from './components/HeroSection';
import ProductPromise from './components/ProductPromise';
import FeatureShowcase from './components/FeatureShowcase';
import VisualizeScripture from './components/VisualizeScripture';
import InteractiveWorkflow from './components/InteractiveWorkflow';
import AIChatSection from './components/AIChatSection';
import StudyPlansSection from './components/StudyPlansSection';
import CommunitySection from './components/CommunitySection';
import UserPersonas from './components/UserPersonas';
import TrustResponsibility from './components/TrustResponsibility';
import Footer from './components/Footer';
import { BookOpen, Compass, Map } from 'lucide-react';

import { ThemeProvider, useTheme } from './ThemeContext';
import { useSupabaseData } from './hooks/useSupabaseData';

// Lazy-load the full Bible Journey Map to keep initial bundle small
const BibleJourneyApp = lazy(() => import('./explore/BibleJourneyApp.jsx'));

export default function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}

function AppContent() {
  const { theme } = useTheme();
  const { journeys, verses, loading } = useSupabaseData();
  const [exploreTab, setExploreTab] = useState<'study' | 'maps' | 'live'>('study');

  const triggerToast = (_msg: string) => {};

  const handleLaunchMap = () => {
    setExploreTab('live');
    setTimeout(() => {
      const el = document.getElementById('explore-section');
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 50);
  };

  const tabs: { id: 'study' | 'maps' | 'live'; label: string; sub: string; icon: React.ElementType }[] = [
    { id: 'study', label: 'Theological Study',  sub: 'Verse explanations, timelines & quizzes', icon: BookOpen },
    { id: 'maps',  label: 'Journey Maps',        sub: 'Interactive SVG cartography & stops',    icon: Compass  },
    { id: 'live',  label: 'Live Bible Map',      sub: 'Full Leaflet map with 100+ events',      icon: Map      },
  ];

  return (
    <div className={`relative min-h-screen transition-colors duration-500 overflow-x-hidden ${
      theme === 'dark'
        ? 'bg-[#0B192C] text-[#F1F6F9] selection:bg-blue-600/20 selection:text-blue-300'
        : 'bg-white text-slate-900 selection:bg-blue-50 selection:text-blue-700'
    }`}>

      {/* Sticky Header */}
      <Header onNotify={triggerToast} onLaunchMap={handleLaunchMap} />

      <main>

        {/* 1. Hero */}
        <HeroSection onNotify={triggerToast} onLaunchMap={handleLaunchMap} />

        {/* 2. Product Promise — the 5-step journey */}
        <ProductPromise onNotify={triggerToast} />

        {/* 3. Feature pillars */}
        <FeatureShowcase onNotify={triggerToast} />

        {/* 4. ── LIVE EXPLORE ─────────────────────────────────────────────── */}
        <section
          id="explore-section"
          className={`relative py-24 px-4 sm:px-6 lg:px-8 transition-colors duration-500 overflow-hidden ${
            theme === 'dark' ? 'bg-[#060d1f]' : 'bg-gradient-to-b from-stone-50 to-white'
          }`}
        >
          {/* Ambient glow */}
          <div className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[300px] rounded-full blur-[120px] opacity-30"
               style={{ background: theme === 'dark'
                 ? 'radial-gradient(ellipse,#ca8a04 0%,transparent 70%)'
                 : 'radial-gradient(ellipse,#fde68a 0%,transparent 70%)' }} />

          <div className="max-w-7xl mx-auto relative z-10">

            {/* Section hero header */}
            <div className="text-center mb-14">
              <span className={`inline-flex items-center gap-1.5 text-[10px] font-mono font-extrabold uppercase tracking-[0.2em] px-3 py-1.5 rounded-full border mb-5 ${
                theme === 'dark' ? 'bg-amber-500/10 border-amber-500/20 text-amber-400' : 'bg-amber-50 border-amber-200 text-amber-800'
              }`}>
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                Interactive Sandbox — Live Features
              </span>
              <h2 className={`text-3xl sm:text-5xl font-display font-black tracking-tight mb-4 leading-tight ${
                theme === 'dark' ? 'text-white' : 'text-stone-900'
              }`}>
                Journey Maps &amp;<br className="hidden sm:block" />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500"> Historical Timelines</span>
              </h2>
              <p className={`text-sm sm:text-base max-w-2xl mx-auto leading-relaxed mb-10 ${
                theme === 'dark' ? 'text-slate-400' : 'text-stone-500'
              }`}>
                Explore Scripture the way scholars do — trace ancient journeys on interactive maps,
                study verse-level theology, and navigate a full historical Leaflet map of Bible events.
              </p>

              {/* Stats strip */}
              <div className={`inline-flex flex-wrap justify-center gap-0 divide-x rounded-2xl border overflow-hidden mb-10 ${
                theme === 'dark' ? 'border-slate-800 divide-slate-800 bg-slate-950/60' : 'border-stone-200 divide-stone-200 bg-white shadow-sm'
              }`}>
                {[
                  { v: '100+', l: 'Bible Events' },
                  { v: '4',    l: 'Journey Routes' },
                  { v: '8',    l: 'Study Outputs' },
                  { v: '3',    l: 'Eras Mapped' },
                ].map((s) => (
                  <div key={s.l} className="px-5 py-3 text-center min-w-[90px]">
                    <div className={`text-lg font-black font-display ${theme === 'dark' ? 'text-amber-400' : 'text-amber-700'}`}>{s.v}</div>
                    <div className={`text-[9px] font-mono font-bold uppercase tracking-wider ${theme === 'dark' ? 'text-slate-500' : 'text-stone-500'}`}>{s.l}</div>
                  </div>
                ))}
              </div>

              {/* Tab bar */}
              <div className={`inline-flex gap-1 p-1.5 rounded-2xl border ${
                theme === 'dark' ? 'bg-slate-950/80 border-slate-800' : 'bg-white border-stone-200 shadow-sm'
              }`}>
                {tabs.map(({ id, label, sub, icon: Icon }) => {
                  const active = exploreTab === id;
                  return (
                    <button
                      key={id}
                      onClick={() => setExploreTab(id)}
                      className={`flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-left transition-all cursor-pointer ${
                        active
                          ? theme === 'dark'
                            ? 'bg-amber-500 text-slate-950 shadow-md'
                            : 'bg-[#0B192C] text-white shadow-md'
                          : theme === 'dark'
                            ? 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
                            : 'text-stone-500 hover:text-stone-800 hover:bg-stone-50'
                      }`}
                    >
                      <Icon className={`w-4 h-4 shrink-0 ${active ? '' : theme === 'dark' ? 'text-slate-500' : 'text-stone-400'}`} />
                      <div>
                        <div className="text-xs font-extrabold leading-none">{label}</div>
                        <div className={`text-[9px] font-mono mt-0.5 leading-none hidden sm:block ${
                          active ? 'opacity-70' : theme === 'dark' ? 'text-slate-600' : 'text-stone-400'
                        }`}>{sub}</div>
                      </div>
                    </button>
                  );
                })}
              </div>

              {loading && (
                <div className={`mt-4 flex justify-center items-center gap-2 text-xs font-mono ${
                  theme === 'dark' ? 'text-slate-500' : 'text-stone-400'
                }`}>
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                  Loading live data…
                </div>
              )}
            </div>

            {/* ── Tab A: Theological Study ── */}
            {exploreTab === 'study' && (
              <div className="animate-fadeIn">
                <div className={`rounded-3xl border overflow-hidden ${
                  theme === 'dark' ? 'border-slate-800 bg-[#030a18]' : 'border-stone-200 bg-white shadow-sm'
                }`}>
                  <div className={`flex items-center gap-3 px-6 py-4 border-b ${
                    theme === 'dark' ? 'border-slate-800 bg-[#060d1f]' : 'border-stone-100 bg-stone-50'
                  }`}>
                    <span className={`flex items-center justify-center w-7 h-7 rounded-lg ${
                      theme === 'dark' ? 'bg-amber-500/10 text-amber-400' : 'bg-amber-100 text-amber-700'
                    }`}><BookOpen className="w-4 h-4" /></span>
                    <div>
                      <span className={`text-xs font-extrabold ${theme === 'dark' ? 'text-white' : 'text-stone-900'}`}>
                        Verse Explorer — Theology, Timeline &amp; Quizzes
                      </span>
                      <span className={`text-[10px] font-mono block ${theme === 'dark' ? 'text-slate-500' : 'text-stone-400'}`}>
                        Select a passage → pick an output type → study deep
                      </span>
                    </div>
                  </div>
                  <div className="p-6 sm:p-8">
                    <InteractiveWorkflow onNotify={triggerToast} verses={verses} />
                  </div>
                </div>
              </div>
            )}

            {/* ── Tab B: Journey Maps ── */}
            {exploreTab === 'maps' && (
              <div className="animate-fadeIn">
                <div className={`rounded-3xl border overflow-hidden ${
                  theme === 'dark' ? 'border-slate-800 bg-[#030a18]' : 'border-stone-200 bg-white shadow-sm'
                }`}>
                  <div className={`flex items-center gap-3 px-6 py-4 border-b ${
                    theme === 'dark' ? 'border-slate-800 bg-[#060d1f]' : 'border-stone-100 bg-stone-50'
                  }`}>
                    <span className={`flex items-center justify-center w-7 h-7 rounded-lg ${
                      theme === 'dark' ? 'bg-rose-500/10 text-rose-400' : 'bg-rose-100 text-rose-700'
                    }`}><Compass className="w-4 h-4" /></span>
                    <div>
                      <span className={`text-xs font-extrabold ${theme === 'dark' ? 'text-white' : 'text-stone-900'}`}>
                        Interactive Biblical Journey Maps
                      </span>
                      <span className={`text-[10px] font-mono block ${theme === 'dark' ? 'text-slate-500' : 'text-stone-400'}`}>
                        Click waypoints on the SVG map to trace biblical journeys stop-by-stop
                      </span>
                    </div>
                  </div>
                  <div className="p-6 sm:p-8">
                    <VisualizeScripture onNotify={triggerToast} journeys={journeys} />
                  </div>
                </div>
              </div>
            )}

            {/* ── Tab C: Live Bible Map ── */}
            {exploreTab === 'live' && (
              <div className="animate-fadeIn">
                {/* teaser bar */}
                <div className={`flex flex-wrap items-center justify-between gap-4 px-5 py-3.5 rounded-2xl border mb-4 ${
                  theme === 'dark' ? 'bg-slate-950/80 border-slate-800' : 'bg-white border-stone-200 shadow-sm'
                }`}>
                  <div className="flex items-center gap-3">
                    <span className={`flex items-center justify-center w-8 h-8 rounded-lg ${
                      theme === 'dark' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-emerald-100 text-emerald-700'
                    }`}><Map className="w-4 h-4" /></span>
                    <div>
                      <span className={`text-xs font-extrabold block ${theme === 'dark' ? 'text-white' : 'text-stone-900'}`}>
                        Full Bible Journey Map
                      </span>
                      <span className={`text-[10px] font-mono ${theme === 'dark' ? 'text-slate-500' : 'text-stone-400'}`}>
                        100+ events · era filters · family lineage · story player
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span className={`text-[10px] font-mono font-bold ${theme === 'dark' ? 'text-emerald-400' : 'text-emerald-700'}`}>
                      LIVE MAP — FULLY INTERACTIVE
                    </span>
                  </div>
                </div>

                {/* map frame */}
                <div className={`rounded-3xl border overflow-hidden ${
                  theme === 'dark' ? 'border-slate-800' : 'border-stone-200 shadow-sm'
                }`} style={{ height: '82vh', minHeight: 560 }}>
                  <Suspense fallback={
                    <div className={`w-full h-full flex flex-col items-center justify-center gap-4 ${
                      theme === 'dark' ? 'bg-[#030a18] text-slate-400' : 'bg-stone-50 text-stone-400'
                    }`}>
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                        theme === 'dark' ? 'bg-amber-500/10' : 'bg-amber-100'
                      }`}>
                        <Map className={`w-6 h-6 ${theme === 'dark' ? 'text-amber-400' : 'text-amber-600'}`} />
                      </div>
                      <div className="text-center">
                        <div className={`text-sm font-bold mb-1 ${theme === 'dark' ? 'text-slate-300' : 'text-stone-600'}`}>
                          Loading Bible Journey Map
                        </div>
                        <div className="flex items-center justify-center gap-1">
                          {[0, 150, 300].map((d) => (
                            <span key={d} className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-bounce"
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

        {/* 5. AI Chat */}
        <AIChatSection onNotify={triggerToast} />

        {/* 6. Guided Study Plans */}
        <StudyPlansSection onNotify={triggerToast} />

        {/* 7. Community Feed */}
        <CommunitySection onNotify={triggerToast} />

        {/* 8. User Personas interactive sandbox */}
        <UserPersonas onNotify={triggerToast} />

        {/* 9. Trust & Responsibility */}
        <TrustResponsibility />

      </main>

      {/* 10. Footer */}
      <Footer onNotify={triggerToast} onLaunchMap={handleLaunchMap} />
    </div>
  );
}
