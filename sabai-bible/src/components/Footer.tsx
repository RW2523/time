/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useTheme } from '../ThemeContext';
import { Book, Mail, Globe, Smartphone, Clock } from 'lucide-react';

interface FooterProps {
  onNotify: (msg: string) => void;
  onLaunchMap?: () => void;
}

function ComingSoonBanner({ theme, onNotify }: { theme: string; onNotify: (m: string) => void }) {
  const [notified, setNotified] = useState(false);
  const [email, setEmail] = useState('');

  const handleNotify = () => {
    if (!email.trim()) return;
    setNotified(true);
    onNotify('You will be notified at launch!');
  };

  return (
    <div className={`p-8 sm:p-12 rounded-[24px] mb-16 relative overflow-hidden border shadow-xl ${
      theme === 'dark'
        ? 'bg-gradient-to-br from-[#0d1f38] via-[#0B192C] to-[#101e32] border-slate-800 shadow-blue-950/20'
        : 'bg-gradient-to-br from-[#EBF3FC] via-white to-[#FDF8EC] border-blue-100 shadow-slate-200/50'
    }`}>
      {/* Glow accents */}
      <div className="absolute -right-16 -top-16 w-56 h-56 bg-blue-500/10 rounded-full blur-[80px] pointer-events-none" />
      <div className="absolute -left-16 -bottom-16 w-56 h-56 bg-amber-500/8 rounded-full blur-[80px] pointer-events-none" />

      <div className="relative z-10 flex flex-col lg:flex-row justify-between items-center gap-10">

        {/* Left: copy + store badges */}
        <div className="max-w-xl text-center lg:text-left">
          {/* Eye-catching label */}
          <span className={`inline-flex items-center gap-2 text-[9px] font-mono font-extrabold tracking-[4px] uppercase px-3 py-1.5 rounded-full border mb-5 ${
            theme === 'dark' ? 'bg-amber-500/10 border-amber-500/20 text-amber-400' : 'bg-blue-50 border-blue-200 text-blue-600'
          }`}>
            <Clock className="w-3 h-3" />
            Coming Soon
          </span>

          <h3 className={`font-display font-black text-2xl sm:text-3xl md:text-4xl tracking-tight leading-tight mb-4 ${
            theme === 'dark' ? 'text-white' : 'text-[#0B192C]'
          }`}>
            SabAI Bible is heading{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-amber-500 select-none">
              to your pocket.
            </span>
          </h3>

          <p className={`text-xs sm:text-sm leading-relaxed mb-6 ${
            theme === 'dark' ? 'text-slate-300' : 'text-slate-600'
          }`}>
            We are launching on the App Store and Google Play — bringing the full power of
            SabAI Bible to iOS and Android. Carry Scripture, maps, and AI theology in your hand, every day.
          </p>

          {/* Verse */}
          <blockquote className={`border-l-2 pl-4 mb-7 text-left ${
            theme === 'dark' ? 'border-amber-500/40' : 'border-blue-400/40'
          }`}>
            <p className={`text-xs italic leading-relaxed font-serif ${
              theme === 'dark' ? 'text-slate-300' : 'text-slate-600'
            }`}>
              "For the word of God is alive and active. Sharper than any double-edged sword,
              it penetrates even to dividing soul and spirit."
            </p>
            <cite className={`mt-1.5 block text-[10px] font-mono font-bold not-italic ${
              theme === 'dark' ? 'text-amber-400' : 'text-blue-600'
            }`}>
              — Hebrews 4:12 (NIV)
            </cite>
          </blockquote>

          {/* Store badge buttons */}
          <div className="flex flex-wrap gap-3 justify-center lg:justify-start">
            <button
              onClick={() => onNotify('App Store launch coming soon!')}
              className={`flex items-center gap-2.5 px-5 py-3 rounded-2xl border font-bold text-xs transition-all hover:scale-105 cursor-pointer ${
                theme === 'dark'
                  ? 'bg-slate-900 border-slate-700 text-white hover:border-slate-600'
                  : 'bg-white border-stone-300 text-stone-900 shadow-sm hover:shadow-md'
              }`}
            >
              {/* Apple icon */}
              <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
              </svg>
              <div className="text-left leading-none">
                <span className={`block text-[8px] font-mono uppercase tracking-widest ${theme === 'dark' ? 'text-slate-400' : 'text-stone-500'}`}>Download on the</span>
                <span className="text-sm font-black font-display">App Store</span>
              </div>
            </button>

            <button
              onClick={() => onNotify('Google Play launch coming soon!')}
              className={`flex items-center gap-2.5 px-5 py-3 rounded-2xl border font-bold text-xs transition-all hover:scale-105 cursor-pointer ${
                theme === 'dark'
                  ? 'bg-slate-900 border-slate-700 text-white hover:border-slate-600'
                  : 'bg-white border-stone-300 text-stone-900 shadow-sm hover:shadow-md'
              }`}
            >
              <Smartphone className="w-5 h-5 text-emerald-500 shrink-0" />
              <div className="text-left leading-none">
                <span className={`block text-[8px] font-mono uppercase tracking-widest ${theme === 'dark' ? 'text-slate-400' : 'text-stone-500'}`}>Get it on</span>
                <span className="text-sm font-black font-display">Google Play</span>
              </div>
            </button>
          </div>
        </div>

        {/* Right: notify me form */}
        <div className={`w-full lg:w-72 shrink-0 p-6 rounded-2xl border ${
          theme === 'dark' ? 'bg-slate-900/60 border-slate-800' : 'bg-white/80 border-stone-200 shadow-sm'
        }`}>
          {notified ? (
            <div className="text-center py-4">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-3 ${
                theme === 'dark' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-emerald-50 text-emerald-600'
              }`}>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/></svg>
              </div>
              <p className={`text-xs font-extrabold font-display mb-1 ${theme === 'dark' ? 'text-white' : 'text-stone-900'}`}>You are on the list!</p>
              <p className={`text-[10px] font-mono ${theme === 'dark' ? 'text-slate-500' : 'text-stone-400'}`}>We will notify you the moment we launch.</p>
            </div>
          ) : (
            <>
              <p className={`text-sm font-extrabold font-display mb-1 ${theme === 'dark' ? 'text-white' : 'text-stone-900'}`}>
                Be the first to know.
              </p>
              <p className={`text-[10.5px] leading-relaxed mb-4 ${theme === 'dark' ? 'text-slate-400' : 'text-stone-500'}`}>
                Drop your email and we will notify you the moment SabAI Bible lands in the stores.
              </p>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="your@email.com"
                className={`w-full border rounded-xl px-3 py-2.5 text-xs mb-2.5 focus:outline-none transition-colors ${
                  theme === 'dark' ? 'bg-slate-950 border-slate-800 text-white placeholder:text-slate-600' : 'bg-stone-50 border-stone-200 text-stone-900 placeholder:text-stone-400'
                }`}
              />
              <button
                onClick={handleNotify}
                className={`w-full py-2.5 rounded-xl text-[10.5px] font-extrabold uppercase tracking-widest transition cursor-pointer ${
                  theme === 'dark'
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white'
                    : 'bg-[#0B192C] hover:bg-slate-800 text-white'
                }`}
              >
                Notify Me at Launch
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default function Footer({ onNotify }: FooterProps) {
  const currentYear = new Date().getFullYear();
  const { theme } = useTheme();

  const handleLinkClick = (name: string) => {
    onNotify(`Navigating to: ${name}`);
  };

  return (
    <footer className={`border-t pt-20 pb-10 relative overflow-hidden transition-colors duration-501 text-left ${
      theme === 'dark' ? 'bg-[#0B192C] border-slate-800' : 'bg-[#F4F7FB]/70 border-stone-200'
    }`}>
      
      {/* Subtle backing glow */}
      <div className="absolute bottom-[-100px] left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-blue-500/10 rounded-full blur-[120px] pointer-events-none" />

      <div id="try-experience" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* COMING SOON — App Store & Play Store Launch Panel */}
        <ComingSoonBanner theme={theme} onNotify={onNotify} />

        {/* Footer directories links list */}
        <div className={`grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 border-b pb-12 mb-12 text-left transition-colors ${
          theme === 'dark' ? 'border-slate-800/60' : 'border-stone-200/70'
        }`}>
          
          {/* Brand details */}
          <div className="col-span-2 lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-lg border flex items-center justify-center shrink-0 shadow-3xs transition-colors bg-blue-500/10 border-blue-500/20 text-blue-500Color text-blue-505`}>
                <Book className="w-4.5 h-4.5 stroke-[2]" />
              </div>
              <span className={`font-display font-extrabold text-[#0B192C] dark:text-white text-lg`}>
                SabAI Bible
              </span>
            </div>
            <p className={`text-xs leading-relaxed max-w-xs ${
              theme === 'dark' ? 'text-slate-400' : 'text-slate-500'
            }`}>
              A premium theological exegesis, sermon preparation, and small group study suite designed for modern assemblies and devout scriptural meditations.
            </p>
            <div className="space-y-1.5 pt-1 text-slate-505 font-medium">
              <div className="text-[10px] flex items-center gap-1.5 font-mono uppercase text-slate-500">
                <Mail className="w-3.5 h-3.5 opacity-60" />
                <span>support@sabaibible.com</span>
              </div>
              <div className="text-[10px] flex items-center gap-1.5 font-mono uppercase text-slate-500">
                <Globe className="w-3.5 h-3.5 opacity-60" />
                <span>www.sabaibible.com</span>
              </div>
            </div>
          </div>

          {/* Column Products */}
          <div>
            <h4 className={`text-[10px] font-bold uppercase tracking-wider mb-4 font-mono text-slate-450`}>
              App Features
            </h4>
            <ul className={`space-y-2.5 text-xs font-semibold ${
              theme === 'dark' ? 'text-slate-400' : 'text-slate-600'
            }`}>
              <li>
                <button onClick={() => handleLinkClick('AI Chat')} className="hover:text-blue-500 transition-colors cursor-pointer outline-none">
                  Theology Chat
                </button>
              </li>
              <li>
                <button onClick={() => handleLinkClick('Reading Workspace')} className="hover:text-blue-500 transition-colors cursor-pointer outline-none">
                  Reading Mode
                </button>
              </li>
              <li>
                <button onClick={() => handleLinkClick('Audio Synthesis')} className="hover:text-blue-500 transition-colors cursor-pointer outline-none">
                  Devotional Speech
                </button>
              </li>
              <li>
                <button onClick={() => handleLinkClick('Sermon outlines')} className="hover:text-blue-500 transition-colors cursor-pointer outline-none">
                  Sermon Outline Drafts
                </button>
              </li>
              <li>
                <button onClick={() => handleLinkClick('Quiz Studio')} className="hover:text-blue-500 transition-colors cursor-pointer outline-none">
                  Trivia Quiz Studio
                </button>
              </li>
            </ul>
          </div>

          {/* Column Custom platforms */}
          <div>
            <h4 className={`text-[10px] font-bold uppercase tracking-wider mb-4 font-mono text-slate-450`}>
              Geographic Visuals
            </h4>
            <ul className={`space-y-2.5 text-xs font-semibold ${
              theme === 'dark' ? 'text-slate-400' : 'text-slate-600'
            }`}>
              <li>
                <button onClick={() => handleLinkClick('Historical Maps Overlay')} className="hover:text-blue-500 transition-colors cursor-pointer outline-none">
                  Missionary Journeys
                </button>
              </li>
              <li>
                <button onClick={() => handleLinkClick('Genealogy graphs')} className="hover:text-blue-500 transition-colors cursor-pointer outline-none">
                  Family Lineages
                </button>
              </li>
              <li>
                <button onClick={() => handleLinkClick('Timeline nodes')} className="hover:text-blue-500 transition-colors cursor-pointer outline-none">
                  Bible Era Timelines
                </button>
              </li>
              <li>
                <button onClick={() => handleLinkClick('Solomons temple blueprints')} className="hover:text-blue-500 transition-colors cursor-pointer outline-none">
                  Architecture 3D
                </button>
              </li>
            </ul>
          </div>

          {/* Column Platform guidelines */}
          <div>
            <h4 className={`text-[10px] font-bold uppercase tracking-wider mb-4 font-mono text-slate-450`}>
              Responsibility
            </h4>
            <ul className={`space-y-2.5 text-xs font-semibold ${
              theme === 'dark' ? 'text-slate-400' : 'text-slate-600'
            }`}>
              <li>
                <button onClick={() => handleLinkClick('Safety Guide')} className="hover:text-blue-500 transition-colors cursor-pointer outline-none">
                  Theology Guardrails
                </button>
              </li>
              <li>
                <button onClick={() => handleLinkClick('Citation references')} className="hover:text-blue-500 transition-colors cursor-pointer outline-none">
                  Citations Reference
                </button>
              </li>
              <li>
                <button onClick={() => handleLinkClick('Human-in-the-loop Preaching')} className="hover:text-blue-500 transition-colors cursor-pointer outline-none">
                  Pastoral Stewardship
                </button>
              </li>
              <li>
                <button onClick={() => handleLinkClick('Terms of Service')} className="hover:text-blue-500 transition-colors cursor-pointer outline-none">
                  Terms of Service
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom copyright list */}
        <div className={`flex flex-col sm:flex-row justify-between items-center gap-4 text-[10px] font-mono font-bold uppercase tracking-wide transition-colors ${
          theme === 'dark' ? 'text-slate-500' : 'text-slate-400'
        }`}>
          <span>
            © {currentYear} SabAI Bible Platform. Developed in mutual service to the Word.
          </span>
          <div className="flex gap-4">
            <button onClick={() => handleLinkClick('Licensing')} className="hover:text-blue-500 transition-colors cursor-pointer outline-none">
              Licensing Policy
            </button>
            <span>•</span>
            <button onClick={() => handleLinkClick('Security Statement')} className="hover:text-blue-500 transition-colors cursor-pointer outline-none">
              Data Security
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
