/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
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
import { X, Map, Maximize2, Minimize2 } from 'lucide-react';

import { ThemeProvider, useTheme } from './ThemeContext';

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

  const [mapOpen,   setMapOpen]   = useState(false);
  const [mapLoaded, setMapLoaded] = useState(false);

  const openMap  = useCallback(() => { setMapOpen(true); setMapLoaded(false); }, []);
  const closeMap = useCallback(() => { setMapOpen(false); }, []);

  /* Lock body scroll while modal is open */
  useEffect(() => {
    document.body.style.overflow = mapOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mapOpen]);

  /* Escape key closes modal */
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') closeMap(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [closeMap]);

  return (
    <div className={`relative min-h-screen transition-colors duration-500 overflow-x-hidden ${
      theme === 'dark'
        ? 'bg-[#0B192C] text-[#F1F6F9] selection:bg-blue-600/20 selection:text-blue-300'
        : 'bg-white text-slate-900 selection:bg-blue-50 selection:text-blue-700'
    }`}>

      <Header onNotify={triggerToast} onLaunchMap={openMap} />

      <main>
        {/* 1. Hero */}
        <HeroSection onNotify={triggerToast} onLaunchMap={openMap} />

        {/* 2. Product Features */}
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
      </main>

      <Footer onNotify={triggerToast} onLaunchMap={openMap} />

      {/* ── Full-screen Bible Journey Map modal ─────────────────────────── */}
      <AnimatePresence>
        {mapOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="fixed inset-0 z-[9000] bg-black/70 backdrop-blur-sm"
              onClick={closeMap}
            />

            {/* Modal panel */}
            <motion.div
              key="modal"
              initial={{ opacity: 0, scale: 0.96, y: 24 }}
              animate={{ opacity: 1, scale: 1,    y: 0  }}
              exit={{   opacity: 0, scale: 0.96, y: 16  }}
              transition={{ type: 'spring', stiffness: 340, damping: 30 }}
              className="fixed inset-4 sm:inset-6 lg:inset-8 z-[9001] flex flex-col rounded-3xl overflow-hidden shadow-2xl"
              style={{ maxHeight: 'calc(100vh - 2rem)' }}
            >
              {/* Chrome bar */}
              <div className={`flex items-center justify-between px-5 py-3 shrink-0 ${
                theme === 'dark'
                  ? 'bg-[#0B192C] border-b border-slate-800'
                  : 'bg-white border-b border-stone-200'
              }`}>
                {/* Left: title + live pill */}
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                    theme === 'dark' ? 'bg-emerald-500/10' : 'bg-emerald-50'
                  }`}>
                    <Map className={`w-4 h-4 ${theme === 'dark' ? 'text-emerald-400' : 'text-emerald-600'}`} />
                  </div>
                  <div>
                    <p className={`text-sm font-extrabold font-display leading-none ${
                      theme === 'dark' ? 'text-white' : 'text-stone-900'
                    }`}>Bible Journey Map</p>
                    <span className={`inline-flex items-center gap-1 text-[9px] font-mono font-bold uppercase tracking-wider mt-0.5 ${
                      theme === 'dark' ? 'text-emerald-400' : 'text-emerald-600'
                    }`}>
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      Live — Fully Interactive
                    </span>
                  </div>
                </div>

                {/* Right: stats + close */}
                <div className="flex items-center gap-4">
                  <div className={`hidden sm:flex divide-x rounded-xl border overflow-hidden ${
                    theme === 'dark' ? 'border-slate-800 divide-slate-800 bg-slate-950/60' : 'border-stone-200 divide-stone-200 bg-stone-50'
                  }`}>
                    {[
                      { v: '100+', l: 'Events' },
                      { v: '4',   l: 'Routes' },
                      { v: '6',   l: 'Eras' },
                      { v: '∞',  l: 'Lineages' },
                    ].map(s => (
                      <div key={s.l} className="px-3 py-1.5 text-center min-w-[52px]">
                        <div className={`text-xs font-black font-display ${
                          theme === 'dark' ? 'text-emerald-400' : 'text-emerald-700'
                        }`}>{s.v}</div>
                        <div className={`text-[8px] font-mono font-bold uppercase tracking-wide ${
                          theme === 'dark' ? 'text-slate-600' : 'text-stone-400'
                        }`}>{s.l}</div>
                      </div>
                    ))}
                  </div>

                  <button
                    onClick={closeMap}
                    className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl border text-[10px] font-extrabold uppercase tracking-wider transition-all cursor-pointer hover:scale-105 ${
                      theme === 'dark'
                        ? 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-600 hover:text-white'
                        : 'bg-stone-100 border-stone-200 text-stone-700 hover:bg-stone-200'
                    }`}
                  >
                    <X className="w-3.5 h-3.5 stroke-[2.5]" />
                    Close
                  </button>
                </div>
              </div>

              {/* iframe area */}
              <div className={`relative flex-1 min-h-0 ${
                theme === 'dark' ? 'bg-[#030a18]' : 'bg-stone-100'
              }`}>
                {/* Loading overlay */}
                <AnimatePresence>
                  {!mapLoaded && (
                    <motion.div
                      key="loader"
                      initial={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.4 }}
                      className={`absolute inset-0 z-10 flex flex-col items-center justify-center gap-5 ${
                        theme === 'dark' ? 'bg-[#030a18]' : 'bg-stone-100'
                      }`}
                    >
                      <div className={`w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg ${
                        theme === 'dark' ? 'bg-emerald-500/10 ring-1 ring-emerald-500/20' : 'bg-emerald-50 ring-1 ring-emerald-200'
                      }`}>
                        <Map className={`w-8 h-8 ${theme === 'dark' ? 'text-emerald-400' : 'text-emerald-600'}`} />
                      </div>
                      <div className="text-center">
                        <p className={`text-sm font-bold mb-3 ${
                          theme === 'dark' ? 'text-slate-300' : 'text-stone-600'
                        }`}>Loading Bible Journey Map…</p>
                        <div className="flex items-center justify-center gap-2">
                          {[0, 120, 240].map(d => (
                            <span key={d}
                                  className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-bounce"
                                  style={{ animationDelay: `${d}ms` }} />
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <iframe
                  src="/map"
                  title="Bible Journey Map"
                  onLoad={() => setMapLoaded(true)}
                  className="w-full h-full border-0"
                  allow="fullscreen"
                />
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
