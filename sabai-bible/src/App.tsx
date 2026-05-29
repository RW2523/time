/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { lazy, Suspense, useEffect, useState } from 'react';
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
import { Map, X } from 'lucide-react';

import { ThemeProvider, useTheme } from './ThemeContext';

const BibleJourneyApp = lazy(() => import('./explore/BibleJourneyApp.jsx'));

export default function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}

/* ─── Full-screen map modal ────────────────────────────────────────────── */
function MapModal({ onClose }: { onClose: () => void }) {
  // Close on Escape key
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    // Prevent body scroll while modal is open
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-[9000] flex flex-col"
      style={{ background: '#0B192C' }}
    >
      {/* Close bar */}
      <div
        className="flex items-center justify-between px-4 py-2.5 border-b shrink-0"
        style={{ background: '#0a1628', borderColor: 'rgba(51,65,85,0.6)' }}
      >
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
            <Map className="w-3.5 h-3.5 text-emerald-400" />
          </div>
          <div>
            <span className="text-white text-xs font-extrabold font-display tracking-tight">Bible Journey Map</span>
            <span className="text-slate-500 text-[9px] font-mono ml-2 uppercase tracking-wider">Interactive Atlas</span>
          </div>
        </div>
        <button
          onClick={onClose}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-700 bg-slate-800/60 text-slate-300 hover:text-white hover:border-slate-500 text-xs font-bold transition-all cursor-pointer"
          aria-label="Close map"
        >
          <X className="w-3.5 h-3.5" />
          Close
        </button>
      </div>

      {/* Map fills the rest */}
      <div className="flex-1 min-h-0 overflow-auto">
        <Suspense fallback={
          <div className="w-full h-full flex flex-col items-center justify-center gap-4 min-h-[400px]"
               style={{ background: '#0B192C' }}>
            <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 flex items-center justify-center">
              <Map className="w-7 h-7 text-emerald-400" />
            </div>
            <div className="text-center">
              <p className="text-sm font-bold text-slate-300 mb-2">Loading Bible Journey Map…</p>
              <div className="flex items-center justify-center gap-1.5">
                {[0, 150, 300].map(d => (
                  <span key={d} className="w-2 h-2 rounded-full bg-emerald-500 animate-bounce"
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
  );
}

/* ─── Main app ─────────────────────────────────────────────────────────── */
function AppContent() {
  const { theme } = useTheme();
  const [mapOpen, setMapOpen] = useState(false);

  const triggerToast = (_msg: string) => {};
  const handleLaunchMap = () => setMapOpen(true);

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
      </main>

      <Footer onNotify={triggerToast} onLaunchMap={handleLaunchMap} />

      {/* Full-screen Bible Journey Map modal */}
      {mapOpen && <MapModal onClose={() => setMapOpen(false)} />}
    </div>
  );
}
