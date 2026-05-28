/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
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

  const triggerToast = (_msg: string) => {
    // Silent - do not trigger any popups
  };

  return (
    <div className={`relative min-h-screen transition-colors duration-500 overflow-x-hidden ${
      theme === 'dark'
        ? 'bg-[#0B192C] text-[#F1F6F9] selection:bg-blue-600/20 selection:text-blue-300'
        : 'bg-white text-slate-900 selection:bg-blue-50 selection:text-blue-700'
    }`}>
      
      {/* Sticky Header */}
      <Header onNotify={triggerToast} />

      {/* Structured SaaS Marketing Pitch Page Modules */}
      <main>
        
        {/* 1. Hero Section Section */}
        <HeroSection onNotify={triggerToast} />

        {/* 2. Product Promise Section */}
        <ProductPromise onNotify={triggerToast} />

        {/* 3. Main Feature Section (5 Cards of Capabilities) */}
        <FeatureShowcase onNotify={triggerToast} />

        {/* 4. Visualize Scripture Spotlight Module */}
        <VisualizeSpotlight onNotify={triggerToast} />

        {/* 5. ─── LIVE EXPLORE: Timeline Journey & Biblical Map ─── */}
        <section
          id="explore-section"
          className={`py-20 px-4 sm:px-6 lg:px-8 transition-colors duration-500 ${
            theme === 'dark' ? 'bg-[#060d1f]' : 'bg-stone-50'
          }`}
        >
          <div className="max-w-7xl mx-auto">

            {/* Section heading */}
            <div className="mb-12 text-center">
              <span className={`inline-block text-[10px] font-mono font-extrabold uppercase tracking-[0.2em] px-3 py-1 rounded border mb-4 ${
                theme === 'dark'
                  ? 'bg-amber-500/10 border-amber-500/20 text-amber-400'
                  : 'bg-amber-50 border-amber-200 text-amber-800'
              }`}>
                Explore Interactive Features
              </span>
              <h2 className={`text-3xl sm:text-4xl font-display font-extrabold tracking-tight mb-3 ${
                theme === 'dark' ? 'text-white' : 'text-stone-900'
              }`}>
                Journey Maps &amp; Historical Timelines
              </h2>
              <p className={`text-sm max-w-2xl mx-auto leading-relaxed ${
                theme === 'dark' ? 'text-slate-400' : 'text-stone-600'
              }`}>
                Trace Bible journeys on an interactive SVG map or explore verse-level theological
                insights — from geographic landmarks to chronological timeline milestones.
              </p>

              {loading && (
                <div className={`mt-4 inline-flex items-center gap-2 text-xs font-mono ${
                  theme === 'dark' ? 'text-slate-500' : 'text-stone-400'
                }`}>
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                  Loading live data from Supabase…
                </div>
              )}
            </div>

            {/* ── A. Verse Timeline & Map Workflow ── */}
            <div className={`rounded-3xl border p-6 sm:p-8 mb-10 transition-colors ${
              theme === 'dark' ? 'bg-[#030a18] border-slate-800' : 'bg-white border-stone-200 shadow-sm'
            }`}>
              <div className="mb-6 flex items-center gap-3">
                <span className={`text-[9px] font-mono font-bold uppercase tracking-widest px-2.5 py-1 rounded border ${
                  theme === 'dark'
                    ? 'bg-amber-500/10 border-amber-500/20 text-amber-400'
                    : 'bg-amber-50 border-amber-200 text-amber-800'
                }`}>
                  Module A
                </span>
                <h3 className={`text-lg font-display font-extrabold ${
                  theme === 'dark' ? 'text-white' : 'text-stone-900'
                }`}>
                  Verse Explorer — Timeline, Map &amp; Insights
                </h3>
              </div>
              <InteractiveWorkflow onNotify={triggerToast} verses={verses} />
            </div>

            {/* ── B. Biblical Journey Map ── */}
            <div className={`rounded-3xl border p-6 sm:p-8 transition-colors ${
              theme === 'dark' ? 'bg-[#030a18] border-slate-800' : 'bg-white border-stone-200 shadow-sm'
            }`}>
              <div className="mb-6 flex items-center gap-3">
                <span className={`text-[9px] font-mono font-bold uppercase tracking-widest px-2.5 py-1 rounded border ${
                  theme === 'dark'
                    ? 'bg-rose-500/10 border-rose-500/20 text-rose-400'
                    : 'bg-rose-50 border-rose-200 text-rose-800'
                }`}>
                  Module B
                </span>
                <h3 className={`text-lg font-display font-extrabold ${
                  theme === 'dark' ? 'text-white' : 'text-stone-900'
                }`}>
                  Interactive Biblical Journey Map
                </h3>
              </div>
              <VisualizeScripture onNotify={triggerToast} journeys={journeys} />
            </div>

          </div>
        </section>

        {/* 6. AI Bible Chat Section */}
        <AIChatSection onNotify={triggerToast} />

        {/* 7. Study Plans Section */}
        <StudyPlansSection onNotify={triggerToast} />

        {/* 8. Active Fellowship Community Feed Section */}
        <CommunitySection onNotify={triggerToast} />

        {/* 9. Who It Is For Persona Section */}
        <UserPersonas onNotify={triggerToast} />

        {/* 10. Stylized Screen Mockup Preview Strip */}
        <AppPreview onNotify={triggerToast} />

        {/* 11. Safety & Responsible AI Trust Section */}
        <TrustResponsibility />

      </main>

      {/* 12. Final CTA Section and Multi-Column Directory Footer */}
      <Footer onNotify={triggerToast} />
    </div>
  );
}
