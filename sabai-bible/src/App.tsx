/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { lazy, Suspense } from 'react';
import Header from './components/Header';
import HeroSection from './components/HeroSection';
import ProductFeatures from './components/ProductFeatures';
import AIChatSection from './components/AIChatSection';
import StudyPlansSection from './components/StudyPlansSection';
import CommunitySection from './components/CommunitySection';
import UserPersonas from './components/UserPersonas';
import TrustResponsibility from './components/TrustResponsibility';
import ContactSection from './components/ContactSection';
import Footer from './components/Footer';
import { Map } from 'lucide-react';

import { ThemeProvider, useTheme } from './ThemeContext';

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

  const triggerToast = (_msg: string) => {};

  const handleLaunchMap = () => {
    setTimeout(() => {
      const el = document.getElementById('map-section');
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 50);
  };

  return (
    <div className={`relative min-h-screen transition-colors duration-500 overflow-x-hidden ${
      theme === 'dark'
        ? 'bg-[#0B192C] text-[#F1F6F9] selection:bg-blue-600/20 selection:text-blue-300'
        : 'bg-white text-slate-900 selection:bg-blue-50 selection:text-blue-700'
    }`}>

      <Header onNotify={triggerToast} onLaunchMap={handleLaunchMap} />

      <main>

        {/* 1. Hero */}
        <HeroSection onNotify={triggerToast} onLaunchMap={handleLaunchMap} />

        {/* 2. Expandable Product Promise + Feature Pillars */}
        <ProductFeatures onNotify={triggerToast} />

        {/* 3. AI Chat */}
        <AIChatSection onNotify={triggerToast} />

        {/* 4. Guided Study Plans */}
        <StudyPlansSection onNotify={triggerToast} />

        {/* 5. Community Feed */}
        <CommunitySection onNotify={triggerToast} />

        {/* 6. User Personas interactive sandbox */}
        <UserPersonas onNotify={triggerToast} />

        {/* 7. Trust */}
        <TrustResponsibility />

        {/* 8. Contact / Early Access */}
        <ContactSection />

        {/* 9. Live Bible Journey Map — explore the app */}
        <section
          id="map-section"
          className={`relative py-20 px-4 sm:px-6 lg:px-8 transition-colors duration-500 border-t ${
            theme === 'dark' ? 'bg-[#060d1f] border-slate-800' : 'bg-stone-50 border-stone-200'
          }`}
        >
          <div className="max-w-7xl mx-auto">

            <div className="text-center mb-10">
              <span className={`inline-flex items-center gap-1.5 text-[10px] font-mono font-extrabold uppercase tracking-[0.2em] px-3 py-1.5 rounded-full border mb-4 ${
                theme === 'dark'
                  ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
                  : 'bg-emerald-50 border-emerald-200 text-emerald-700'
              }`}>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Live — Fully Interactive
              </span>
              <h2 className={`text-3xl sm:text-4xl font-display font-black tracking-tight mb-3 ${
                theme === 'dark' ? 'text-white' : 'text-stone-900'
              }`}>
                Explore the Bible Journey Map
              </h2>
              <p className={`text-sm max-w-xl mx-auto leading-relaxed ${
                theme === 'dark' ? 'text-slate-400' : 'text-stone-500'
              }`}>
                A preview of what awaits you in the app. Trace 100+ biblical events on a live map —
                filter by era, explore family lineages, and play story narrations for each event.
              </p>

              <div className={`inline-flex flex-wrap justify-center gap-0 divide-x rounded-2xl border overflow-hidden mt-6 ${
                theme === 'dark'
                  ? 'border-slate-800 divide-slate-800 bg-slate-950/60'
                  : 'border-stone-200 divide-stone-200 bg-white shadow-sm'
              }`}>
                {[
                  { v: '100+', l: 'Bible Events' },
                  { v: '4',    l: 'Journey Routes' },
                  { v: '6',    l: 'Biblical Eras' },
                  { v: '∞',   l: 'Lineages' },
                ].map(s => (
                  <div key={s.l} className="px-5 py-3 text-center min-w-[80px]">
                    <div className={`text-base font-black font-display ${
                      theme === 'dark' ? 'text-emerald-400' : 'text-emerald-700'
                    }`}>{s.v}</div>
                    <div className={`text-[9px] font-mono font-bold uppercase tracking-wider ${
                      theme === 'dark' ? 'text-slate-500' : 'text-stone-500'
                    }`}>{s.l}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className={`rounded-3xl border overflow-hidden ${
              theme === 'dark' ? 'border-slate-800' : 'border-stone-200 shadow-sm'
            }`} style={{ height: '80vh', minHeight: 540 }}>
              <Suspense fallback={
                <div className={`w-full h-full flex flex-col items-center justify-center gap-4 ${
                  theme === 'dark' ? 'bg-[#030a18]' : 'bg-stone-100'
                }`}>
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${
                    theme === 'dark' ? 'bg-emerald-500/10' : 'bg-emerald-100'
                  }`}>
                    <Map className={`w-7 h-7 ${theme === 'dark' ? 'text-emerald-400' : 'text-emerald-600'}`} />
                  </div>
                  <div className="text-center">
                    <div className={`text-sm font-bold mb-2 ${
                      theme === 'dark' ? 'text-slate-300' : 'text-stone-600'
                    }`}>
                      Loading Bible Journey Map
                    </div>
                    <div className="flex items-center justify-center gap-1.5">
                      {[0, 150, 300].map(d => (
                        <span key={d}
                              className="w-2 h-2 rounded-full bg-emerald-500 animate-bounce"
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
        </section>

      </main>

      <Footer onNotify={triggerToast} onLaunchMap={handleLaunchMap} />
    </div>
  );
}
