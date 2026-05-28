/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useTheme } from '../ThemeContext';
import { ShieldCheck, BookOpen, UserCheck, ShieldAlert } from 'lucide-react';

export default function TrustResponsibility() {
  const { theme } = useTheme();

  const pillars = [
    {
      title: 'Scripture-Grounded Responses',
      desc: 'Every AI response reconstruction traces directly to reliable, established Bible translations, preventing hallucinations and protecting core text.',
      icon: ShieldCheck,
      color: 'text-blue-500 bg-blue-505 bg-blue-500/10'
    },
    {
      title: 'Historical and Theological Context',
      desc: 'Explore original Greek manuscripts, Hebrew roots, ancient cultural events, and diverse traditional commentaries neutrally and contextually.',
      icon: BookOpen,
      color: 'text-amber-500 bg-amber-500/10'
    },
    {
      title: 'Pastor and Faith Verified',
      desc: 'Formulated and actively refined under extensive reviews from theologians, scholars, and ministers to ensure theological safety and deep respect.',
      icon: UserCheck,
      color: 'text-emerald-500 bg-emerald-500/10'
    }
  ];

  return (
    <section id="trust-section" className={`py-24 relative overflow-hidden transition-colors duration-500 border-b ${
      theme === 'dark' 
        ? 'bg-[#0B192C] text-slate-100 border-slate-800' 
        : 'bg-white text-stone-900 border-stone-150'
    }`}>
      
      {/* Absolute faint background lights */}
      <div className="absolute top-1/3 left-10 w-96 h-96 bg-blue-500/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Module Header */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          <span className={`text-[10px] font-extrabold font-mono tracking-[3px] uppercase block mb-3 ${
            theme === 'dark' ? 'text-blue-400' : 'text-blue-600'
          }`}>
            THEOLOGICAL INTEGRITY
          </span>
          <h2 className={`font-display font-black text-3xl sm:text-4xl leading-tight ${
            theme === 'dark' ? 'text-white' : 'text-[#0B192C]'
          }`}>
            Theological safety, integrity and <br className="hidden sm:inline" />
            responsible AI parameters.
          </h2>
          <p className={`mt-4 text-xs sm:text-sm max-w-xl mx-auto leading-relaxed ${
            theme === 'dark' ? 'text-slate-400' : 'text-slate-500'
          }`}>
            Technology is a useful helper, but Truth is sacred. SabAI Bible respects the history and sanctity of Scripture by establishing strict academic validation models.
          </p>
        </div>

        {/* Theological Sovereignty Statement Highlight Banner */}
        <div className={`max-w-4xl mx-auto border p-5 rounded-2xl mb-12 flex flex-col md:flex-row items-center gap-5 text-left transition-colors ${
          theme === 'dark' ? 'bg-[#0A192C]/50 border-slate-850' : 'bg-slate-50 border-blue-50/40 shadow-3xs'
        }`}>
          <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 text-amber-500 bg-amber-500/10`}>
            <ShieldAlert className="w-5 h-5 stroke-[2]" />
          </div>
          <div>
            <h4 className={`text-xs font-mono font-extrabold uppercase tracking-wider text-amber-500`}>
              Theological Stewardship Statement
            </h4>
            <p className={`text-[11px] leading-relaxed mt-1 font-semibold ${
              theme === 'dark' ? 'text-slate-400' : 'text-slate-600'
            }`}>
              SabAI Bible is strictly calibrated to support personal devotion, academic Scripture translation cross-referencing, and teaching outline crafting. Our companion models do not replace Shepherd guidance, local church fellowship, or direct scriptural accountability.
            </p>
          </div>
        </div>

        {/* Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {pillars.map((pil, idx) => {
            const Icon = pil.icon;
            return (
              <div
                key={idx}
                className={`p-6 rounded-2xl border transition-all text-left space-y-4 flex flex-col justify-between ${
                  theme === 'dark'
                    ? 'bg-slate-900/40 border-slate-850 hover:border-slate-800'
                    : 'bg-white border-[#E2E8F0] hover:border-blue-150 hover:shadow-xs'
                }`}
              >
                <div>
                  {/* Icon Frame */}
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-4 ${pil.color}`}>
                    <Icon className="w-5 h-5 stroke-[2]" />
                  </div>
                  
                  {/* Title */}
                  <h4 className={`font-display font-black text-sm transition-colors ${
                    theme === 'dark' ? 'text-white' : 'text-slate-905'
                  }`}>
                    {pil.title}
                  </h4>

                  {/* Description */}
                  <p className={`text-[11.5px] leading-relaxed mt-2.5 font-medium ${
                    theme === 'dark' ? 'text-slate-400' : 'text-slate-500'
                  }`}>
                    {pil.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
