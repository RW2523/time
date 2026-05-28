/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useTheme } from '../ThemeContext';
import { BookOpen, HelpCircle, Eye, FileSpreadsheet, Share2 } from 'lucide-react';

interface ProductPromiseProps {
  onNotify: (msg: string) => void;
}

export default function ProductPromise({ onNotify }: ProductPromiseProps) {
  const { theme } = useTheme();

  const steps = [
    {
      num: '01',
      title: 'Read',
      icon: BookOpen,
      desc: 'Read Scripture in a focused Bible experience.',
      accent: 'text-blue-500 bg-blue-500/10'
    },
    {
      num: '02',
      title: 'Ask',
      icon: HelpCircle,
      desc: 'Ask AI-guided questions with Bible references.',
      accent: 'text-amber-500 bg-amber-500/10'
    },
    {
      num: '03',
      title: 'Visualize',
      icon: Eye,
      desc: 'Visualize places, stories, and timelines.',
      accent: 'text-indigo-500 bg-indigo-500/10'
    },
    {
      num: '04',
      title: 'Create',
      icon: FileSpreadsheet,
      desc: 'Create quizzes, audio, video, and reports.',
      accent: 'text-rose-500 bg-rose-500/10'
    },
    {
      num: '05',
      title: 'Share',
      icon: Share2,
      desc: 'Share insights with your community.',
      accent: 'text-emerald-500 bg-emerald-500/10'
    }
  ];

  return (
    <section className={`py-20 relative overflow-hidden transition-colors duration-500 border-b ${
      theme === 'dark' 
        ? 'bg-[#0B192C] text-slate-100 border-slate-800' 
        : 'bg-white text-stone-900 border-stone-150'
    }`}>
      
      {/* Decorative Blur Accent */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[150px] bg-sky-500/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
        
        {/* Module Header */}
        <div className="max-w-3xl mx-auto mb-16">
          <span className={`text-[10px] font-extrabold uppercase font-mono tracking-[3px] block mb-3 ${
            theme === 'dark' ? 'text-blue-400' : 'text-blue-600'
          }`}>
            THE PRODUCT PROMISE
          </span>
          <h2 className={`font-display font-black text-3xl sm:text-4xl md:text-5xl leading-tight ${
            theme === 'dark' ? 'text-white' : 'text-[#0B192C]'
          }`}>
            One verse can become a <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 via-indigo-600 to-amber-500">
              complete learning experience.
            </span>
          </h2>
          <p className={`mt-4 text-xs sm:text-sm max-w-xl mx-auto leading-relaxed ${
            theme === 'dark' ? 'text-slate-400' : 'text-slate-500'
          }`}>
            SabAI Bible seamlessly connects scripture text to interactive prompts, maps, audio, quizzes, and community feeds so your theological study is unified.
          </p>
        </div>

        {/* 5-Step Journey: Connected Layout */}
        <div className="relative mt-8 max-w-5xl mx-auto">
          
          {/* Connector Line (Desktop Horizontal) */}
          <div className={`absolute top-1/2 left-[10%] right-[10%] h-[2px] -translate-y-12 hidden lg:block ${
            theme === 'dark' 
              ? 'bg-gradient-to-r from-blue-500/20 via-indigo-400/20 to-emerald-450/20' 
              : 'bg-gradient-to-r from-blue-100 via-indigo-100 to-emerald-100'
          }`} />

          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6 lg:gap-4 relative z-20">
            {steps.map((step, idx) => {
              const Icon = step.icon;
              return (
                <div 
                  key={step.title}
                  onClick={() => onNotify(`Selected journey phase: ${step.title}`)}
                  className={`relative p-5 rounded-2xl border transition-all duration-300 transform hover:-translate-y-1 cursor-pointer flex flex-col items-center select-none ${
                    theme === 'dark'
                      ? 'bg-slate-900/60 border-slate-800 hover:border-slate-700 hover:bg-slate-900 shadow-sm'
                      : 'bg-slate-50/50 border-slate-100 hover:bg-white hover:border-blue-150 shadow-xs'
                  }`}
                >
                  {/* Step Code */}
                  <span className={`text-[10px] font-mono font-black tracking-widest uppercase mb-3 ${
                    theme === 'dark' ? 'text-slate-500' : 'text-slate-400'
                  }`}>
                    PHASE {step.num}
                  </span>

                  {/* Icon Capsule */}
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-all ${step.accent}`}>
                    <Icon className="w-5 h-5 stroke-[2]" />
                  </div>

                  {/* Step Title */}
                  <h4 className={`font-display font-extrabold text-sm mb-2 transition-colors ${
                    theme === 'dark' ? 'text-white' : 'text-[#0B192C]'
                  }`}>
                    {step.title}
                  </h4>

                  {/* Explanation */}
                  <p className={`text-[11.5px] leading-relaxed text-center ${
                    theme === 'dark' ? 'text-slate-400' : 'text-slate-500'
                  }`}>
                    {step.desc}
                  </p>
                </div>
              );
            })}
          </div>

        </div>

      </div>
    </section>
  );
}
