/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useTheme } from '../ThemeContext';
import { MessageSquare, Sparkles, Upload, FileText, CheckCircle } from 'lucide-react';

interface AIChatSectionProps {
  onNotify: (msg: string) => void;
}

export default function AIChatSection({ onNotify }: AIChatSectionProps) {
  const { theme } = useTheme();

  const examples = [
    {
      q: "What does Philippians 4:13 mean?",
      a: "In Philippians 4:13 ('I can do all things through Christ...'), Apostle Paul is discussing contentment during heavy adversity and imprisonment. The 'all things' refers specifically to enduring both hunger and abundance by resting on divine energy, rather than universal wish-fulfillment.",
      ref: "Philippians 4:11-13"
    },
    {
      q: "Explain the story of Moses simply.",
      a: "Moses' narrative centers on deliverance: born in Hebrew oppression, raised in Pharaoh's courts, fleeing to Midian, and returning to lead the Exodus from Egypt under God's power. He receives the Ten Commandments at Mount Sinai, acting as a mediator of the Old Covenant.",
      ref: "Exodus 2-20"
    },
    {
      q: "Give me verses about courage.",
      a: "Here are core scriptures regarding courage and fortitude:\n\n• Joshua 1:9 — 'Be strong and courageous, do not be dismayed...'\n• 2 Timothy 1:7 — 'God has not given us a spirit of fear, but of power...'\n• Psalm 27:1 — 'The Lord is my light and my salvation; whom shall I fear?'",
      ref: "Joshua, 2 Timothy & Psalms"
    }
  ];

  const [activeIdx, setActiveIdx] = useState(0);

  const handleExampleSelect = (idx: number) => {
    setActiveIdx(idx);
    onNotify(`Simulated Bible AI Chat query updated: ${examples[idx].q}`);
  };

  return (
    <section id="chat-section" className={`py-24 relative overflow-hidden transition-colors duration-500 border-b ${
      theme === 'dark' 
        ? 'bg-[#0B192C] text-slate-100 border-slate-800' 
        : 'bg-white text-stone-900 border-stone-150'
    }`}>
      
      {/* Visual Ambient Elements */}
      <div className="absolute top-[30%] left-[5%] w-80 h-80 bg-blue-500/5 rounded-full blur-[110px] pointer-events-none" />
      <div className="absolute bottom-[20%] right-[5%] w-[400px] h-[200px] bg-indigo-500/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center max-w-5xl mx-auto">
          
          {/* Left Column: Copywriting and Interactive triggers */}
          <div className="lg:col-span-5 text-left flex flex-col justify-center">
            <span className={`text-[10px] font-extrabold font-mono tracking-[3px] uppercase block mb-3 ${
              theme === 'dark' ? 'text-blue-400' : 'text-blue-600'
            }`}>
              AI BIBLE CHAT CONNECTOR
            </span>
            <h2 className={`font-display font-black text-3xl sm:text-4xl leading-tight ${
              theme === 'dark' ? 'text-white' : 'text-[#0B192C]'
            }`}>
              Ask better questions.<br />Understand Scripture deeper.
            </h2>
            <p className={`mt-4 mb-8 text-xs sm:text-sm leading-relaxed ${
              theme === 'dark' ? 'text-slate-400' : 'text-slate-500'
            }`}>
              Use AI Bible Chat to explore meaning, context, themes, and references while keeping your study focused.
            </p>

            {/* Clickable prompt examples */}
            <div className="flex flex-col gap-3">
              <span className="text-[10px] font-mono tracking-wider font-extrabold text-slate-400">
                CLICK TO SIMULATE QUERY
              </span>
              {examples.map((item, idx) => (
                <button
                  key={idx}
                  onClick={() => handleExampleSelect(idx)}
                  className={`p-3.5 rounded-xl border text-left text-xs font-bold transition-all duration-200 outline-none cursor-pointer ${
                    activeIdx === idx
                      ? theme === 'dark'
                        ? 'bg-blue-600 border-blue-600 text-white shadow-md'
                        : 'bg-[#0B192C] border-slate-900 text-white shadow-md'
                      : theme === 'dark'
                        ? 'bg-slate-900/60 border-slate-850 text-slate-300 hover:border-slate-800'
                        : 'bg-slate-50 border-stone-200 text-slate-700 hover:bg-slate-100 shadow-2xs'
                  }`}
                >
                  &ldquo;{item.q}&rdquo;
                </button>
              ))}
            </div>
          </div>

          {/* Right Column: Chat screen mockup + resource upload widget */}
          <div className="lg:col-span-7 flex flex-col gap-5 text-left">
            
            {/* The Live Chat Simulator Card */}
            <div className={`p-5 rounded-2xl border shadow-xl transition-colors relative ${
              theme === 'dark' 
                ? 'bg-slate-900/90 border-slate-850' 
                : 'bg-white border-blue-100/75'
            }`}>
              
              {/* Card Chat Header */}
              <div className="flex justify-between items-center pb-3 border-b border-light border-slate-200/25 mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                  <span className={`text-[9.5px] font-mono font-extrabold tracking-wider ${
                    theme === 'dark' ? 'text-slate-300' : 'text-slate-800'
                  }`}>
                    THEOLOGY INSIGHTS RESPONDER
                  </span>
                </div>
                <div className="flex items-center gap-1.5 bg-blue-500/10 text-blue-500 px-2 py-0.5 rounded-md text-[9px] font-mono font-bold">
                  <Sparkles className="w-3 h-3 animate-spin-slow" />
                  Scripture-grounded
                </div>
              </div>

              {/* Chat Conversation Stream with Active State */}
              <div className="space-y-4 min-h-[160px] flex flex-col justify-end">
                
                {/* User Prompt Bubble */}
                <div className="flex flex-col items-end animate-fadeIn">
                  <div className="bg-blue-600 text-white p-3 rounded-2xl rounded-tr-none text-xs leading-relaxed max-w-[85%] font-bold">
                    {examples[activeIdx].q}
                  </div>
                </div>

                {/* AI Responder Box */}
                <div className={`flex flex-col items-start animate-fadeIn transition-all duration-300`}>
                  <div className={`p-3 rounded-2xl rounded-tl-none text-xs leading-relaxed max-w-[90%] border ${
                    theme === 'dark'
                      ? 'bg-[#0B192C] border-slate-800 text-slate-200'
                      : 'bg-slate-55 text-slate-800 bg-slate-50 border-slate-100'
                  }`}>
                    
                    {/* Header line with Bible reference chip */}
                    <div className="flex items-center justify-between mb-2">
                      <span className={`text-[8.5px] font-mono font-extrabold tracking-wide text-amber-500`}>
                        SABAI ENGINE
                      </span>
                      <span className={`text-[8.5px] font-mono font-bold bg-[#ca8a04]/10 text-[#ca8a04] px-1.5 py-0.5 rounded border border-[#ca8a04]/10`}>
                        {examples[activeIdx].ref}
                      </span>
                    </div>

                    <p className="whitespace-pre-line font-medium">{examples[activeIdx].a}</p>
                  </div>
                </div>

              </div>
            </div>

            {/* Resources Integration Widget (Specify files/notes upload) */}
            <div className={`p-4 rounded-xl border flex items-center justify-between transition-colors shadow-2xs ${
              theme === 'dark' ? 'bg-[#0A192C]/50 border-slate-800' : 'bg-slate-50 border-blue-50/50'
            }`}>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-blue-500/10 text-blue-600 flex items-center justify-center">
                  <FileText className="w-4 h-4" />
                </div>
                <div>
                  <h4 className={`text-xs font-bold leading-tight ${theme === 'dark' ? 'text-white' : 'text-[#0B192C]'}`}>
                    Contextual Resource Panel
                  </h4>
                  <p className="text-[10px] text-slate-500 mt-0.5">
                    Ask questions using your notes, PDFs, or study materials.
                  </p>
                </div>
              </div>
              
              <button
                onClick={() => onNotify("Opening resource file explorer...")}
                className={`py-2 px-3 rounded-lg text-[9px] uppercase tracking-wider font-extrabold border transition-all cursor-pointer flex items-center gap-1 bg-white hover:bg-slate-50 text-slate-700 dark:bg-slate-900 dark:border-slate-800 dark:text-slate-300`}
              >
                <Upload className="w-3 h-3" />
                Upload PDF / Note
              </button>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
