/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useTheme } from '../ThemeContext';
import { Sparkles, MessageSquare, BookOpen, Map, Home } from 'lucide-react';

interface AppPreviewProps {
  onNotify: (msg: string) => void;
}

export default function AppPreview({ onNotify }: AppPreviewProps) {
  const { theme } = useTheme();

  const mockups = [
    {
      id: 'mock-home',
      label: 'Home Workspace',
      icon: Home,
      accent: 'border-blue-500/25',
      content: (
        <div className="space-y-3 text-left">
          <div className="flex justify-between items-center text-[8px] font-mono text-slate-500 font-bold">
            <span>SABAI BIBLE LABS</span>
            <span>TODAY</span>
          </div>
          <h4 className="text-xs font-black tracking-tight dark:text-white text-slate-900 leading-snug">Daily Scripture Ref</h4>
          <div className="p-2 border rounded-lg bg-slate-50/50 dark:bg-slate-950/40 text-[9.5px] italic font-serif leading-relaxed text-slate-650 dark:text-slate-300">
            &ldquo;Do not be anxious about anything, but in everything...&rdquo; (Phil 4:6)
          </div>
          <div className="grid grid-cols-2 gap-1.5 pt-1">
            <span className="p-1 text-[8px] font-mono text-center border border-dashed rounded bg-[#ca8a04]/10 text-[#ca8a04] font-bold">Exegesis Active</span>
            <span className="p-1 text-[8px] font-mono text-center border border-dashed rounded bg-emerald-500/10 text-emerald-600 font-bold">Plan Sync</span>
          </div>
        </div>
      )
    },
    {
      id: 'mock-read',
      label: 'Read Scripture',
      icon: BookOpen,
      accent: 'border-amber-500/25',
      content: (
        <div className="space-y-3 text-left">
          <div className="flex justify-between items-center text-[8px] font-mono text-slate-500 font-bold">
            <span>ESV VERSION</span>
            <span>PHILIPPIANS 4:6</span>
          </div>
          <p className="text-[10px] leading-relaxed font-serif text-slate-700 dark:text-slate-200">
            &ldquo;do not be anxious about anything, but in everything by prayer and supplication with thanksgiving let your requests be made known to God.&rdquo;
          </p>
          <div className="flex gap-1.5 border-t border-slate-105 pt-2 text-[8px] font-mono font-bold text-slate-400">
            <span>• Cross Refs (+4)</span>
            <span>• Context Summary</span>
          </div>
        </div>
      )
    },
    {
      id: 'mock-chat',
      label: 'AI Bible Chat',
      icon: MessageSquare,
      accent: 'border-indigo-505 border-indigo-500/25',
      content: (
        <div className="space-y-3.5 text-left">
          <div className="flex justify-between items-center text-[8px] font-mono text-indigo-500 font-bold">
            <span>THEOLOGY GPT</span>
            <span>SECURE</span>
          </div>
          <div className="space-y-2">
            <div className="p-1 rounded bg-blue-500/15 text-blue-650 self-end text-[8.5px] font-semibold text-right max-w-[90%] ml-auto">
              What does anxietas mean here?
            </div>
            <div className="p-1.5 border rounded bg-slate-50/50 dark:bg-slate-950/40 text-[8.5px] leading-relaxed text-slate-600 dark:text-slate-350">
              The Greek verb is merimnao (μεριμνάω), meaning dividing or distracting the mind with worries.
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'mock-visualize',
      label: 'Visualize Board',
      icon: Map,
      accent: 'border-rose-500/25',
      content: (
        <div className="space-y-3 text-left">
          <div className="flex justify-between items-center text-[8px] font-mono text-rose-500 font-bold">
            <span>CARTOGRAPHY MAP</span>
            <span>EXPEDITIONS</span>
          </div>
          <div className="h-16 rounded border bg-slate-200/25 dark:bg-slate-950/40 relative flex items-center justify-center">
            <div className="absolute top-1 left-1 bg-amber-500/10 text-amber-600 text-[7px] font-mono px-1 rounded font-bold">Rome Prison</div>
            <svg className="w-2/3 h-2/3" viewBox="0 0 100 50">
              <path d="M 10,40 C 40,5 60,45 90,15" fill="none" stroke="#6366f1" strokeWidth="1.5" strokeDasharray="3 1.5" />
              <circle cx="10" cy="40" r="3" fill="#ef4444" />
              <circle cx="90" cy="15" r="3" fill="#10b981" />
            </svg>
            <div className="absolute bottom-1 right-1 bg-blue-500/10 text-blue-500 text-[7px] font-mono px-1 rounded font-bold">Philippi</div>
          </div>
          <p className="text-[10px] text-slate-500 font-mono leading-none">Generative route modeled dynamically</p>
        </div>
      )
    }
  ];

  return (
    <section id="preview-strip" className={`py-24 relative overflow-hidden transition-colors duration-500 border-b ${
      theme === 'dark' 
        ? 'bg-[#0B192C] text-slate-105 border-slate-800' 
        : 'bg-[#F4F7FB]/50 text-stone-900 border-stone-200'
    }`}>
      
      {/* Soft background light sphere */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-blue-500/5 rounded-full blur-[110px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
        
        {/* Module Header */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          <span className={`text-[10px] font-extrabold font-mono tracking-[3px] uppercase block mb-3 ${
            theme === 'dark' ? 'text-blue-400' : 'text-blue-600'
          }`}>
            SABAI BIBLE PREVIEW STRIP
          </span>
          <h2 className={`font-display font-black text-3xl sm:text-4xl leading-tight ${
            theme === 'dark' ? 'text-white' : 'text-[#0B192C]'
          }`}>
            Visual proof of a premium experience.
          </h2>
          <p className={`mt-4 text-xs sm:text-sm max-w-xl mx-auto leading-relaxed ${
            theme === 'dark' ? 'text-slate-400' : 'text-slate-500'
          }`}>
            No clunky wireframes or mock illustrations. Discover the detailed real-time layouts of our core application interfaces.
          </p>
        </div>

        {/* Horizontal Card Stream Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {mockups.map((mock) => {
            const Icon = mock.icon;
            return (
              <div
                key={mock.id}
                onClick={() => onNotify(`Presenting design layout specifications for: ${mock.label}`)}
                className={`p-5 rounded-2xl border transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg cursor-pointer ${
                  theme === 'dark'
                    ? 'bg-slate-900/60 border-slate-850 hover:border-slate-800'
                    : 'bg-white border-stone-200 shadow-3xs'
                }`}
              >
                {/* Simulated Phone Top header notch layout */}
                <div className="flex items-center justify-between border-b border-dashed border-slate-200/25 pb-3 mb-4">
                  <div className="flex items-center gap-1.5">
                    <Icon className="w-3.5 h-3.5 text-blue-500" />
                    <span className={`text-[9px] font-mono font-bold uppercase transition-colors`}>
                      {mock.label}
                    </span>
                  </div>
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                </div>

                {/* Mock Content Chassis */}
                <div className="w-full">
                  {mock.content}
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
