/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import Header from './components/Header';
import HeroSection from './components/HeroSection';
import ProductPromise from './components/ProductPromise';
import FeatureShowcase from './components/FeatureShowcase';
import VisualizeSpotlight from './components/VisualizeSpotlight';
import AIChatSection from './components/AIChatSection';
import StudyPlansSection from './components/StudyPlansSection';
import CommunitySection from './components/CommunitySection';
import UserPersonas from './components/UserPersonas';
import AppPreview from './components/AppPreview';
import TrustResponsibility from './components/TrustResponsibility';
import Footer from './components/Footer';

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
  const [iframeLoaded, setIframeLoaded] = useState(false);

  const triggerToast = (_msg: string) => {
    // Silent - do not trigger any popups
  };

  // Set VITE_BIBLE_MAP_URL in Vercel env vars after deploying the Bible Journey Map app
  const bibleMapUrl = (import.meta.env.VITE_BIBLE_MAP_URL as string) || '';

  return (
    <div className={`relative min-h-screen transition-colors duration-500 overflow-x-hidden ${
      theme === 'dark'
        ? 'bg-[#0B192C] text-[#F1F6F9] selection:bg-blue-600/20 selection:text-blue-300'
        : 'bg-white text-slate-900 selection:bg-blue-50 selection:text-blue-700'
    }`}>

      <Header onNotify={triggerToast} />

      <main>

        {/* 1. Hero */}
        <HeroSection onNotify={triggerToast} />

        {/* 2. Product Promise */}
        <ProductPromise onNotify={triggerToast} />

        {/* 3. Features */}
        <FeatureShowcase onNotify={triggerToast} />

        {/* 4. Visualize Spotlight */}
        <VisualizeSpotlight onNotify={triggerToast} />

        {/* 5. ── Interactive Explorer (Bible Journey Map iframe) ── */}
        <section
          id="explore-section"
          className={`py-20 px-4 sm:px-6 lg:px-8 transition-colors duration-500 ${
            theme === 'dark' ? 'bg-[#060d1f]' : 'bg-stone-50'
          }`}
        >
          <div className="max-w-7xl mx-auto">

            <div className="mb-10 text-center">
              <span className={`inline-block text-[10px] font-mono font-extrabold uppercase tracking-[0.2em] px-3 py-1 rounded border mb-4 ${
                theme === 'dark'
                  ? 'bg-amber-500/10 border-amber-500/20 text-amber-400'
                  : 'bg-amber-50 border-amber-200 text-amber-800'
              }`}>
                Interactive Explorer
              </span>
              <h2 className={`text-3xl sm:text-4xl font-display font-extrabold tracking-tight mb-3 ${
                theme === 'dark' ? 'text-white' : 'text-stone-900'
              }`}>
                Journey Maps &amp; Bible Timelines
              </h2>
              <p className={`text-sm max-w-2xl mx-auto leading-relaxed ${
                theme === 'dark' ? 'text-slate-400' : 'text-stone-600'
              }`}>
                Explore the full interactive Bible Journey Map — real geographic tiles, event timelines,
                family lineage trees, and AI-generated story scenes.
              </p>
            </div>

            {/* iframe container */}
            <div className={`relative rounded-3xl overflow-hidden border shadow-2xl ${
              theme === 'dark' ? 'border-slate-800' : 'border-stone-200'
            }`}>

              {/* Loading spinner overlay */}
              {!iframeLoaded && bibleMapUrl && (
                <div className={`absolute inset-0 flex flex-col items-center justify-center gap-4 z-10 ${
                  theme === 'dark' ? 'bg-[#060d1f]' : 'bg-stone-50'
                }`}>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-amber-500 animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-2 h-2 rounded-full bg-amber-500 animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-2 h-2 rounded-full bg-amber-500 animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                  <p className={`text-xs font-mono font-bold ${
                    theme === 'dark' ? 'text-slate-500' : 'text-stone-400'
                  }`}>
                    Loading Bible Journey Map…
                  </p>
                </div>
              )}

              {bibleMapUrl ? (
                <iframe
                  src={bibleMapUrl}
                  title="Bible Journey Map — Interactive Explorer"
                  className="w-full border-0"
                  style={{ height: '780px' }}
                  onLoad={() => setIframeLoaded(true)}
                  allow="fullscreen"
                  loading="lazy"
                />
              ) : (
                /* Placeholder shown until VITE_BIBLE_MAP_URL is configured */
                <div className={`flex flex-col items-center justify-center gap-5 py-24 px-8 ${
                  theme === 'dark' ? 'bg-[#030a18]' : 'bg-stone-100'
                }`}>
                  <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-3xl border ${
                    theme === 'dark'
                      ? 'bg-amber-500/10 border-amber-500/20'
                      : 'bg-amber-50 border-amber-200'
                  }`}>
                    🗺️
                  </div>
                  <div className="text-center max-w-md">
                    <h3 className={`text-lg font-bold mb-2 ${
                      theme === 'dark' ? 'text-white' : 'text-stone-900'
                    }`}>
                      Bible Journey Map
                    </h3>
                    <p className={`text-sm leading-relaxed mb-4 ${
                      theme === 'dark' ? 'text-slate-400' : 'text-stone-600'
                    }`}>
                      The interactive map explorer is deploying. Once the Bible Journey Map app
                      is live on Vercel, add{' '}
                      <code className={`font-mono text-xs px-1 py-0.5 rounded ${
                        theme === 'dark' ? 'bg-slate-800 text-amber-400' : 'bg-stone-200 text-amber-800'
                      }`}>
                        VITE_BIBLE_MAP_URL
                      </code>{' '}
                      to the Vercel environment variables and redeploy.
                    </p>
                    <span className={`text-[10px] font-mono font-bold uppercase tracking-widest px-3 py-1 rounded border ${
                      theme === 'dark'
                        ? 'bg-amber-500/10 border-amber-500/20 text-amber-400'
                        : 'bg-amber-50 border-amber-200 text-amber-800'
                    }`}>
                      Coming Soon
                    </span>
                  </div>
                </div>
              )}
            </div>

            {bibleMapUrl && (
              <div className="mt-4 text-center">
                <a
                  href={bibleMapUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`inline-flex items-center gap-1.5 text-xs font-bold transition-colors ${
                    theme === 'dark'
                      ? 'text-amber-400 hover:text-amber-300'
                      : 'text-amber-800 hover:text-amber-900'
                  }`}
                >
                  Open full-screen in new tab →
                </a>
              </div>
            )}

          </div>
        </section>

        {/* 6. AI Chat */}
        <AIChatSection onNotify={triggerToast} />

        {/* 7. Study Plans */}
        <StudyPlansSection onNotify={triggerToast} />

        {/* 8. Community */}
        <CommunitySection onNotify={triggerToast} />

        {/* 9. Personas */}
        <UserPersonas onNotify={triggerToast} />

        {/* 10. App Preview */}
        <AppPreview onNotify={triggerToast} />

        {/* 11. Trust */}
        <TrustResponsibility />

      </main>

      <Footer onNotify={triggerToast} />
    </div>
  );
}
