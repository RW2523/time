/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { lazy, Suspense, useState } from 'react';
import Header from './components/Header';
import HeroSection from './components/HeroSection';
import ProductPromise from './components/ProductPromise';
import FeatureShowcase from './components/FeatureShowcase';
import VisualizeSpotlight from './components/VisualizeSpotlight';
import VisualizeScripture from './components/VisualizeScripture';
import InteractiveWorkflow from './components/InteractiveWorkflow';
import AIChatSection from './components/AIChatSection';
import StudyPlansSection from './components/StudyPlansSection';
import CommunitySection from './components/CommunitySection';
import UserPersonas from './components/UserPersonas';
import AppPreview from './components/AppPreview';
import TrustResponsibility from './components/TrustResponsibility';
import Footer from './components/Footer';

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
  const [exploreTab, setExploreTab] = useState<'verse' | 'journey'>('verse');

  const triggerToast = (_msg: string) => {
    // Silent - do not trigger any popups
  };

  // Called by Hero / Header "Launch Bible Journey Map" buttons
  const handleLaunchMap = () => {
    setExploreTab('journey');
    setTimeout(() => {
      const el = document.getElementById('explore-section');
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 50);
  };

  const tabClass = (active: boolean) =>
    `px-5 py-2.5 rounded-xl text-xs font-extrabold border transition-all cursor-pointer ${
      active
        ? theme === 'dark'
          ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-md'
          : 'bg-[#b45309] text-white border-amber-700 shadow-md'
        : theme === 'dark'
          ? 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-850'
          : 'bg-white border-stone-200 text-stone-600 hover:bg-stone-50'
    }`;

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

        {/* 2. Product Promise */}
        <ProductPromise onNotify={triggerToast} />

        {/* 3. Feature Showcase */}
        <FeatureShowcase onNotify={triggerToast} />

        {/* 4. Visualize Spotlight */}
        <VisualizeSpotlight onNotify={triggerToast} />

        {/* 5. ── LIVE EXPLORE ─────────────────────────────────────────────── */}
        <section
          id="explore-section"
          className={`py-20 px-4 sm:px-6 lg:px-8 transition-colors duration-500 ${
            theme === 'dark' ? 'bg-[#060d1f]' : 'bg-stone-50'
          }`}
        >
          <div className="max-w-7xl mx-auto">

            {/* Heading */}
            <div className="mb-10 text-center">
              <span className={`inline-block text-[10px] font-mono font-extrabold uppercase tracking-[0.2em] px-3 py-1 rounded border mb-4 ${
                theme === 'dark' ? 'bg-amber-500/10 border-amber-500/20 text-amber-400' : 'bg-amber-50 border-amber-200 text-amber-800'
              }`}>
                Explore Interactive Features
              </span>
              <h2 className={`text-3xl sm:text-4xl font-display font-extrabold tracking-tight mb-3 ${
                theme === 'dark' ? 'text-white' : 'text-stone-900'
              }`}>
                Journey Maps &amp; Historical Timelines
              </h2>
              <p className={`text-sm max-w-2xl mx-auto leading-relaxed mb-6 ${
                theme === 'dark' ? 'text-slate-400' : 'text-stone-600'
              }`}>
                Trace Bible journeys on a live interactive Leaflet map, explore verse-level
                theological insights, and navigate the full historical timeline — all in one place.
              </p>

              {/* Tab switcher */}
              <div className={`inline-flex gap-2 p-1.5 rounded-2xl border ${
                theme === 'dark' ? 'bg-slate-950/50 border-slate-800' : 'bg-white border-stone-200 shadow-sm'
              }`}>
                <button className={tabClass(exploreTab === 'verse')}   onClick={() => setExploreTab('verse')}>
                  Verse Explorer &amp; Timeline
                </button>
                <button className={tabClass(exploreTab === 'journey')} onClick={() => setExploreTab('journey')}>
                  Full Bible Journey Map
                </button>
              </div>

              {loading && (
                <div className={`mt-4 flex justify-center items-center gap-2 text-xs font-mono ${
                  theme === 'dark' ? 'text-slate-500' : 'text-stone-400'
                }`}>
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                  Loading live data from Supabase…
                </div>
              )}
            </div>

            {/* ── Tab A: Verse Explorer (InteractiveWorkflow + VisualizeScripture) ── */}
            {exploreTab === 'verse' && (
              <div className="space-y-8 animate-fadeIn">
                <div className={`rounded-3xl border p-6 sm:p-8 transition-colors ${
                  theme === 'dark' ? 'bg-[#030a18] border-slate-800' : 'bg-white border-stone-200 shadow-sm'
                }`}>
                  <div className="mb-6 flex items-center gap-3">
                    <span className={`text-[9px] font-mono font-bold uppercase tracking-widest px-2.5 py-1 rounded border ${
                      theme === 'dark' ? 'bg-amber-500/10 border-amber-500/20 text-amber-400' : 'bg-amber-50 border-amber-200 text-amber-800'
                    }`}>Module A</span>
                    <h3 className={`text-lg font-display font-extrabold ${theme === 'dark' ? 'text-white' : 'text-stone-900'}`}>
                      Verse Explorer — Timeline, Map &amp; Insights
                    </h3>
                  </div>
                  <InteractiveWorkflow onNotify={triggerToast} verses={verses} />
                </div>

                <div className={`rounded-3xl border p-6 sm:p-8 transition-colors ${
                  theme === 'dark' ? 'bg-[#030a18] border-slate-800' : 'bg-white border-stone-200 shadow-sm'
                }`}>
                  <div className="mb-6 flex items-center gap-3">
                    <span className={`text-[9px] font-mono font-bold uppercase tracking-widest px-2.5 py-1 rounded border ${
                      theme === 'dark' ? 'bg-rose-500/10 border-rose-500/20 text-rose-400' : 'bg-rose-50 border-rose-200 text-rose-800'
                    }`}>Module B</span>
                    <h3 className={`text-lg font-display font-extrabold ${theme === 'dark' ? 'text-white' : 'text-stone-900'}`}>
                      Interactive Biblical Journey Map
                    </h3>
                  </div>
                  <VisualizeScripture onNotify={triggerToast} journeys={journeys} />
                </div>
              </div>
            )}

            {/* ── Tab B: Full Bible Journey Map App ── */}
            {exploreTab === 'journey' && (
              <div className={`rounded-3xl border overflow-hidden transition-colors ${
                theme === 'dark' ? 'border-slate-800' : 'border-stone-200 shadow-sm'
              }`} style={{ height: '85vh', minHeight: 640 }}>
                <Suspense fallback={
                  <div className={`w-full h-full flex flex-col items-center justify-center gap-3 ${
                    theme === 'dark' ? 'bg-[#030a18] text-slate-400' : 'bg-stone-50 text-stone-500'
                  }`}>
                    <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping" />
                    <span className="text-xs font-mono font-bold uppercase tracking-widest">Loading Bible Journey Map…</span>
                  </div>
                }>
                  <BibleJourneyApp />
                </Suspense>
              </div>
            )}

          </div>
        </section>

        {/* 6. AI Chat */}
        <AIChatSection onNotify={triggerToast} />

        {/* 7. Study Plans */}
        <StudyPlansSection onNotify={triggerToast} />

        {/* 8. Community Feed */}
        <CommunitySection onNotify={triggerToast} />

        {/* 9. Personas */}
        <UserPersonas onNotify={triggerToast} />

        {/* 10. App Preview */}
        <AppPreview onNotify={triggerToast} />

        {/* 11. Trust */}
        <TrustResponsibility />

      </main>

      {/* 12. Footer */}
      <Footer onNotify={triggerToast} />
    </div>
  );
}
