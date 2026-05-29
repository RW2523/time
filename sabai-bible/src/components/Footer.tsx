/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useTheme } from '../ThemeContext';
import { Book, ChevronRight, Mail, Globe, MapPin } from 'lucide-react';

interface FooterProps {
  onNotify: (msg: string) => void;
  onLaunchMap: () => void;
}

export default function Footer({ onNotify, onLaunchMap }: FooterProps) {
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
        
        {/* UPPER CALL TO ACTION FINAL SECTION (Premium Gradient Panel) */}
        <div className={`p-8 sm:p-12 rounded-[24px] mb-16 flex flex-col lg:flex-row justify-between items-center gap-8 text-left shadow-xl border relative overflow-hidden ${
          theme === 'dark'
            ? 'bg-gradient-to-br from-[#122A42] via-[#0B192C] to-[#15344C] border-slate-800 text-white shadow-blue-950/20'
            : 'bg-gradient-to-br from-[#EBF3FC] via-white to-[#FDF8EC] border-blue-50 text-slate-900 shadow-slate-200/50'
        }`}>
          {/* Decorative glowing dots in CTA card */}
          <div className="absolute -right-12 -top-12 w-48 h-48 bg-blue-500/10 rounded-full blur-[60px] pointer-events-none" />
          <div className="absolute -left-12 -bottom-12 w-48 h-48 bg-amber-500/10 rounded-full blur-[60px] pointer-events-none" />

          <div className="relative z-10 max-w-2xl">
            <span className={`text-[10px] font-extrabold font-mono tracking-[3px] uppercase block mb-3.5 ${
              theme === 'dark' ? 'text-amber-400' : 'text-blue-600'
            }`}>
              GET STARTED TODAY
            </span>
            <h3 className={`font-display font-black text-2xl sm:text-3xl md:text-4xl tracking-tight leading-tight ${
              theme === 'dark' ? 'text-white' : 'text-[#0B192C]'
            }`}>
              Experience Scripture like <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-amber-500 select-none">
                never before.
              </span>
            </h3>
            <p className={`text-xs sm:text-sm mt-3 leading-relaxed max-w-xl ${
              theme === 'dark' ? 'text-slate-300' : 'text-slate-600'
            }`}>
              Equip your study, coordinate small cell programs, compile rapid pulpit guides, and make ancient Biblical history come alive with SabAI Bible.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3.5 shrink-0 relative z-10">
            <button
              onClick={onLaunchMap}
              className={`px-5 py-3.5 font-extrabold rounded-xl text-[10.5px] uppercase tracking-wider transition cursor-pointer border flex items-center gap-1.5 ${
                theme === 'dark'
                  ? 'bg-slate-900 hover:bg-slate-850 text-slate-300 border-slate-800'
                  : 'bg-white hover:bg-stone-50 text-slate-700 border-slate-200/60 shadow-2xs'
              }`}
            >
              <MapPin className="w-3.5 h-3.5" />
              Explore Bible Maps
            </button>
            <button
              onClick={onLaunchMap}
              className={`px-6 py-3.5 font-extrabold rounded-xl text-[10.5px] uppercase tracking-widest shadow-md hover:shadow-lg transition flex items-center gap-1 cursor-pointer ${
                theme === 'dark'
                  ? 'bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-450 hover:to-indigo-500 text-white'
                  : 'bg-[#0B192C] hover:bg-slate-900 text-white'
              }`}
            >
              Launch Bible Journey Map
              <ChevronRight className="w-3.5 h-3.5 stroke-[2.5]" />
            </button>
          </div>
        </div>

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
