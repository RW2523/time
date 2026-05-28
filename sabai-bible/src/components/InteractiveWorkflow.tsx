/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { versesData as defaultVerses } from '../mockData';
import { BibleVerse } from '../types';
import {
  Sparkles, BookOpen, Compass, Clock, Award, Volume2, Video, FileText, ListChecks, HelpCircle,
  ArrowRight, Play, Pause, MapPin
} from 'lucide-react';
import { useTheme } from '../ThemeContext';

interface InteractiveWorkflowProps {
  onNotify: (msg: string) => void;
  verses?: BibleVerse[];
}

type OutputType = 'explanation' | 'map' | 'timeline' | 'quiz' | 'audio' | 'video' | 'sermon' | 'studySession';

export default function InteractiveWorkflow({ onNotify, verses = defaultVerses }: InteractiveWorkflowProps) {
  const [selectedVerseIndex, setSelectedVerseIndex] = useState(0);
  const [selectedOutput, setSelectedOutput] = useState<OutputType>('explanation');
  const [audioPlaying, setAudioPlaying] = useState(false);
  const [userSelectedAnswer, setUserSelectedAnswer] = useState<string | null>(null);
  const { theme } = useTheme();

  const activeVerse: BibleVerse = verses[selectedVerseIndex] ?? verses[0];

  // Elegant, color-harmonized tabs that adapt of the theme
  const outputTabs: { id: OutputType; label: string; icon: any; darkBadge: string; lightBadge: string }[] = [
    { id: 'explanation', label: 'Theological Explanation', icon: BookOpen, darkBadge: 'text-amber-400 bg-amber-400/10 border-amber-400/20', lightBadge: 'text-amber-800 bg-amber-50 border-amber-200' },
    { id: 'map', label: 'Historical Map Journey', icon: Compass, darkBadge: 'text-rose-450 bg-rose-450/10 border-rose-450/20', lightBadge: 'text-rose-800 bg-rose-50 border-rose-200' },
    { id: 'timeline', label: 'Historical Timeline', icon: Clock, darkBadge: 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20', lightBadge: 'text-yellow-800 bg-yellow-50 border-yellow-200' },
    { id: 'quiz', label: 'Interactive Sabbath Quiz', icon: Award, darkBadge: 'text-emerald-450 bg-emerald-450/10 border-emerald-450/20', lightBadge: 'text-emerald-800 bg-emerald-50 border-emerald-200' },
    { id: 'audio', label: 'Narrator Voice Audio', icon: Volume2, darkBadge: 'text-purple-400 bg-purple-400/10 border-purple-400/20', lightBadge: 'text-purple-800 bg-purple-50 border-purple-200' },
    { id: 'video', label: 'Video Cinemagraph Prompt', icon: Video, darkBadge: 'text-pink-400 bg-pink-400/10 border-pink-400/20', lightBadge: 'text-pink-850 bg-pink-50 border-pink-200' },
    { id: 'sermon', label: 'Sermon Outline Draft', icon: FileText, darkBadge: 'text-cyan-400 bg-cyan-400/10 border-cyan-400/20', lightBadge: 'text-cyan-805 bg-cyan-50 border-cyan-200' },
    { id: 'studySession', label: 'Small Group Discussion', icon: ListChecks, darkBadge: 'text-teal-400 bg-teal-400/10 border-teal-400/20', lightBadge: 'text-teal-850 bg-teal-50 border-teal-200' },
  ];

  const handleVerseChange = (idx: number) => {
    setSelectedVerseIndex(idx);
    setUserSelectedAnswer(null);
    setAudioPlaying(false);
    onNotify(`Switched workflow master reference to: ${verses[idx]?.reference}`);
  };

  const handleOutputChange = (type: OutputType) => {
    setSelectedOutput(type);
    setUserSelectedAnswer(null);
    onNotify(`Synthesizing output stream: ${type}`);
  };

  return (
    <div className="w-full relative transition-colors duration-500">
      
      {/* Step 1: Select Bible Passage (Integrated compactly inside Chamber) */}
      <div className="mb-8 text-center animate-fadeIn pt-2">
        <p className={`text-[10px] font-mono tracking-widest font-extrabold mb-3.5 ${
          theme === 'dark' ? 'text-gold-400' : 'text-amber-805'
        }`}>
          STEP 1: CHOOSE A BASE HISTORICAL REFERENCE PASSAGE
        </p>
        <div className={`inline-flex flex-wrap lg:flex-nowrap justify-center gap-3 p-2.5 rounded-2xl border shadow-sm max-w-4xl mx-auto w-full transition-colors ${
          theme === 'dark' ? 'bg-slate-950/40 border-slate-805' : 'bg-white border-stone-200'
        }`}>
          {verses.map((v, idx) => {
            const isSelected = selectedVerseIndex === idx;
            return (
              <button
                key={v.reference}
                onClick={() => handleVerseChange(idx)}
                className={`flex-1 min-w-[200px] text-left p-4 rounded-xl transition-all cursor-pointer ${
                  isSelected
                    ? theme === 'dark'
                      ? 'bg-gradient-to-r from-amber-500 to-gold-550 text-slate-950 font-bold border-gold-500 shadow-md ring-1 ring-gold-400/20'
                      : 'bg-[#b45309] text-white font-bold border-amber-700 shadow-md ring-1 ring-amber-500/20'
                    : theme === 'dark'
                      ? 'bg-slate-900/40 border-transparent hover:border-slate-800 text-slate-300 hover:bg-[#060c1d]'
                      : 'bg-stone-50 border-transparent hover:border-stone-200 text-stone-600 hover:bg-stone-100'
                }`}
              >
                <div className="flex justify-between items-center mb-2">
                  <span className={`text-[9px] font-bold tracking-widest font-mono uppercase ${
                    isSelected 
                      ? isSelected && theme === 'dark' ? 'text-slate-950 font-black' : 'text-amber-50' 
                      : theme === 'dark' ? 'text-slate-500' : 'text-stone-450'
                  }`}>
                    EXAMPLE PASSAGE {idx + 1}
                  </span>
                  <span className={`text-xs font-extrabold font-mono rounded px-2 py-0.5 ${
                    isSelected 
                      ? 'bg-white text-stone-900 shadow-xs' 
                      : theme === 'dark' ? 'bg-slate-800 text-slate-200' : 'bg-stone-100 text-stone-700'
                  }`}>
                    {v.reference}
                  </span>
                </div>
                <p className={`text-xs font-serif font-bold line-clamp-1 italic ${
                  isSelected ? isSelected && theme === 'dark' ? 'text-slate-950' : 'text-white' : theme === 'dark' ? 'text-slate-200' : 'text-stone-800'
                }`}>
                  &ldquo;{v.text}&rdquo;
                </p>
                <p className={`text-[9.5px] mt-1 font-bold ${
                  isSelected 
                    ? isSelected && theme === 'dark' ? 'text-slate-900' : 'text-amber-100' 
                    : theme === 'dark' ? 'text-gold-400' : 'text-amber-800'
                }`}>
                  Theme: {v.theme}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Connected Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch pt-2">
        
        {/* LHS 5 Columns: Output type selection */}
        <div className="lg:col-span-5 flex flex-col justify-start gap-4 text-left">
          <span className={`text-[10px] font-mono font-extrabold uppercase tracking-wider px-1 ${
            theme === 'dark' ? 'text-slate-400' : 'text-stone-500'
          }`}>
            STEP 2: CHOOSE THEOLOGICAL OUTPUT FOCUS
          </span>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-3">
            {outputTabs.map((tab) => {
              const TabIcon = tab.icon;
              const isActive = selectedOutput === tab.id;
              const activeBadgeClasses = theme === 'dark' ? tab.darkBadge : tab.lightBadge;

              return (
                <button
                  key={tab.id}
                  onClick={() => handleOutputChange(tab.id)}
                  className={`group relative flex items-center justify-between p-4 rounded-xl border transition-all text-left w-full cursor-pointer ${
                    isActive
                      ? theme === 'dark'
                        ? 'bg-slate-900/80 border-gold-400/40 shadow-lg ring-1 ring-gold-400/10'
                        : 'bg-white border-amber-600 shadow-md ring-1 ring-amber-500/10'
                      : theme === 'dark'
                        ? 'bg-slate-950/35 border-slate-850 hover:bg-[#060c1d] hover:border-slate-800'
                        : 'bg-white border-stone-200 hover:bg-stone-50 hover:border-stone-250'
                  }`}
                >
                  <div className="flex items-center gap-3.5">
                    <div className={`p-2.5 rounded-lg border transition-all shrink-0 ${
                      isActive
                        ? activeBadgeClasses
                        : theme === 'dark'
                          ? 'bg-slate-900 border-slate-800 text-slate-400 group-hover:text-gold-200 group-hover:bg-slate-850'
                          : 'bg-stone-100 border-stone-200 text-stone-500 group-hover:text-amber-800 group-hover:bg-stone-150'
                    }`}>
                      <TabIcon className="w-5 h-5 stroke-[2]" />
                    </div>
                    <div>
                      <h4 className={`text-xs font-bold tracking-tight uppercase ${
                        isActive 
                          ? theme === 'dark' ? 'text-gold-300' : 'text-amber-900' 
                          : theme === 'dark' ? 'text-slate-200' : 'text-stone-800 group-hover:text-amber-800'
                      }`}>
                        {tab.label}
                      </h4>
                      <p className={`text-[11px] leading-none mt-1 ${
                        theme === 'dark' ? 'text-slate-500' : 'text-stone-450'
                      }`}>
                        {tab.id === 'explanation' && 'Word study & theological background'}
                        {tab.id === 'map' && 'Geographic region & local history'}
                        {tab.id === 'timeline' && 'Chrono historical landmark events'}
                        {tab.id === 'quiz' && 'Adaptive learning evaluation exercises'}
                        {tab.id === 'audio' && 'Hebrew-inspired reverent voice track'}
                        {tab.id === 'video' && 'Generative prompts for media'}
                        {tab.id === 'sermon' && 'Draft homiletical outlines'}
                        {tab.id === 'studySession' && 'Interactive open curriculum questions'}
                      </p>
                    </div>
                  </div>

                  <ArrowRight className={`w-4 h-4 transition-all ${
                    isActive 
                      ? theme === 'dark' ? 'text-gold-400 translate-x-1 opacity-100' : 'text-amber-600 translate-x-1 opacity-100' 
                      : theme === 'dark' ? 'text-slate-600 opacity-0 group-hover:opacity-100' : 'text-stone-300 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5'
                  }`} />
                </button>
              );
            })}
          </div>
        </div>

        {/* RHS 7 Columns: Output Monitor Panel */}
        <div className="lg:col-span-7 flex flex-col text-left">
          <div className={`flex-1 rounded-2xl border pb-6 px-6 pt-5 flex flex-col justify-between relative shadow-lg transition-colors duration-500 ${
            theme === 'dark' ? 'border-slate-805 bg-[#060c1d]' : 'bg-white border-stone-205'
          }`}>
            
            {/* Highlight golden header bar */}
            <div className={`absolute top-0 left-0 right-0 h-1.5 rounded-t-2xl ${
              theme === 'dark' ? 'bg-[#ca8a04]' : 'bg-[#b45309]'
            }`} />
            
            {/* Output Header */}
            <div className={`flex items-center justify-between border-b pb-4 mb-5 transition-colors ${
              theme === 'dark' ? 'border-slate-805' : 'border-stone-105'
            }`}>
              <div className="flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full animate-pulse ${theme === 'dark' ? 'bg-gold-400' : 'bg-amber-500'}`} />
                <span className={`text-[10px] font-mono font-bold uppercase tracking-wider ${
                  theme === 'dark' ? 'text-gold-200' : 'text-amber-850'
                }`}>
                  EXEGETICAL SYNTHESIS MODULE
                </span>
              </div>
              <div className={`flex items-center gap-2 text-xs border px-2.5 py-1 rounded-lg ${
                theme === 'dark' ? 'bg-[#030712] border-slate-800 text-slate-300' : 'bg-stone-50 border-stone-200 text-stone-700'
              }`}>
                <span className={`font-mono font-extrabold ${theme === 'dark' ? 'text-gold-300' : 'text-[#b45309]'}`}>{activeVerse.reference}</span>
                <span className={theme === 'dark' ? 'text-slate-800' : 'text-stone-305'}>|</span>
                <span className={`text-[9.5px] uppercase font-bold font-mono ${theme === 'dark' ? 'text-slate-500' : 'text-stone-450'}`}>{selectedOutput}</span>
              </div>
            </div>

            {/* Dynamic Screens */}
            <div className="flex-1 flex flex-col justify-start">
              
              {/* 1. Explanation */}
              {selectedOutput === 'explanation' && (
                <div className="space-y-4 animate-fadeIn">
                  <div className={`p-4 rounded-xl border transition-colors ${
                    theme === 'dark' ? 'bg-slate-950/60 border-slate-800' : 'bg-stone-50 border-stone-200'
                  }`}>
                    <h5 className={`text-[9px] font-mono font-bold uppercase tracking-widest mb-1.5 ${
                      theme === 'dark' ? 'text-gold-400' : 'text-amber-800'
                    }`}>
                      PASSAGE IN FOCUS
                    </h5>
                    <p className={`text-md font-serif font-bold leading-relaxed italic transition-colors ${
                      theme === 'dark' ? 'text-slate-200' : 'text-stone-850'
                    }`}>
                      &ldquo;{activeVerse.text}&rdquo;
                    </p>
                  </div>

                  <div className={`p-4 rounded-xl border space-y-3 shadow-2xs transition-colors ${
                    theme === 'dark' ? 'bg-slate-900/35 border-slate-800' : 'bg-white border-stone-200'
                  }`}>
                    <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide">
                      <Sparkles className={`w-4 h-4 animate-spin-slow ${theme === 'dark' ? 'text-gold-400' : 'text-amber-700'}`} />
                      <span className={theme === 'dark' ? 'text-slate-200' : 'text-[#78350f]'}>Theological Exegesis Breakdown</span>
                    </div>
                    <p className={`text-sm leading-relaxed font-normal transition-colors ${
                      theme === 'dark' ? 'text-slate-350' : 'text-stone-605'
                    }`}>
                      {activeVerse.outputs.explanation}
                    </p>
                    <div className={`pt-2.5 border-t flex items-center justify-between text-[11px] font-semibold transition-colors ${
                      theme === 'dark' ? 'border-slate-800 text-slate-550' : 'border-stone-105 text-stone-500'
                    }`}>
                      <span>Source: Original Manuscripts Grid</span>
                      <span className={`cursor-pointer hover:underline ${
                        theme === 'dark' ? 'text-gold-400' : 'text-amber-800'
                      }`} onClick={() => onNotify("Loading strong concordance metrics...")}>
                        Strong concordance numbers list →
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* 2. Map Journey */}
              {selectedOutput === 'map' && (
                <div className="space-y-4 animate-fadeIn">
                  <div className={`rounded-xl p-4 border relative min-h-[220px] flex flex-col justify-between overflow-hidden transition-colors ${
                    theme === 'dark' ? 'bg-[#030712] border-slate-800' : 'bg-stone-50 border-stone-200'
                  }`}>
                    <div className="absolute inset-0 opacity-[0.08] pointer-events-none">
                      <svg className="w-full h-full" viewBox="0 0 100 60">
                        <circle cx="20" cy="15" r="12" fill="none" stroke="#ca8a04" strokeWidth="0.5" strokeDasharray="2 2" />
                        <circle cx="70" cy="45" r="18" fill="none" stroke="#ca8a04" strokeWidth="0.5" strokeDasharray="3 1" />
                        <path d="M 5,50 Q 30,30 65,45 T 95,20" fill="none" stroke="#ca8a04" strokeWidth="0.5" />
                      </svg>
                    </div>

                    <div className="z-10 flex justify-between items-start">
                      <div>
                        <span className={`text-[9px] font-mono font-bold uppercase tracking-widest block mb-1 ${
                          theme === 'dark' ? 'text-gold-400' : 'text-amber-805'
                        }`}>
                          GEOGRAPHIC LANDMARK REGISTERED
                        </span>
                        <h4 className={`text-md sm:text-lg font-bold flex items-center gap-2 ${
                          theme === 'dark' ? 'text-slate-100' : 'text-stone-900'
                        }`}>
                          <MapPin className="text-amber-500 w-5 h-5" />
                          {activeVerse.outputs.map.locationName}
                        </h4>
                        <p className={`text-xs font-mono mt-1 ${theme === 'dark' ? 'text-slate-500' : 'text-stone-450'}`}>
                          Ancient Coordinates: {activeVerse.outputs.map.coordinates}
                        </p>
                      </div>
                      <span className={`border text-[9px] font-mono font-bold px-2 py-0.5 rounded ${
                        theme === 'dark' ? 'bg-[#0a1224] border-slate-800 text-gold-300' : 'bg-white border-stone-250 text-[#b45309]'
                      }`}>
                        SECULAR RECORDED SITE
                      </span>
                    </div>

                    <div className={`z-10 p-4.5 rounded-xl border mt-4 shadow-3xs transition-colors ${
                      theme === 'dark' ? 'bg-slate-900/35 border-slate-800' : 'bg-white border-stone-200'
                    }`}>
                      <p className={`text-xs leading-relaxed ${theme === 'dark' ? 'text-slate-300' : 'text-stone-655'}`}>
                        <strong className={`block mb-1 text-xs ${theme === 'dark' ? 'text-gold-200' : 'text-stone-850'}`}>Local Map Story & Biblical Journey Context:</strong>
                        {activeVerse.outputs.map.story}
                      </p>
                      <p className={`text-[10px] font-mono mt-2.5 flex items-center gap-1 font-bold ${
                        theme === 'dark' ? 'text-gold-400' : 'text-[#b45309]'
                      }`}>
                        💡 Visual Map Scene Prompt: {activeVerse.outputs.map.visualHint}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* 3. Timeline */}
              {selectedOutput === 'timeline' && (
                <div className="space-y-4 animate-fadeIn">
                  <span className={`text-[9px] font-mono font-bold uppercase tracking-widest block ${
                    theme === 'dark' ? 'text-gold-400' : 'text-amber-800'
                  }`}>
                    CHRONO HISTORICAL TIMELINE PROGRESSION
                  </span>
                  <div className="relative pl-6 space-y-4 pt-2">
                    <div className={`absolute left-[7px] top-0 bottom-0 w-[2px] ${theme === 'dark' ? 'bg-slate-850' : 'bg-stone-200'}`} />
                    
                    {activeVerse.outputs.timeline.map((node, i) => (
                      <div key={i} className="relative group">
                        {/* Circle anchor */}
                        <div className={`absolute -left-[23px] top-1.5 w-4 h-4 rounded-full bg-white border-2 flex items-center justify-center transition-colors ${
                          theme === 'dark' ? 'border-gold-400' : 'border-[#b45309]'
                        }`}>
                          <div className={`w-1.5 h-1.5 rounded-full ${theme === 'dark' ? 'bg-gold-400' : 'bg-[#b45309]'}`} />
                        </div>

                        <div className={`p-4 rounded-xl border transition-all duration-300 ${
                          theme === 'dark' 
                            ? 'bg-slate-950/70 border-slate-850 group-hover:border-gold-400/20' 
                            : 'bg-stone-50 border-stone-200 group-hover:border-amber-300 shadow-2xs'
                        }`}>
                          <div className="flex justify-between items-center mb-1">
                            <span className={`text-xs font-bold font-mono ${
                              theme === 'dark' ? 'text-gold-300' : 'text-amber-805 font-extrabold'
                            }`}>
                              {node.era}
                            </span>
                            <span className={`text-[10px] font-extrabold ${theme === 'dark' ? 'text-slate-500' : 'text-stone-450'}`}>
                              Epoch Milestone {i + 1}
                            </span>
                          </div>
                          <h4 className={`text-sm font-extrabold ${theme === 'dark' ? 'text-slate-200' : 'text-stone-850'}`}>
                            {node.event}
                          </h4>
                          <p className={`text-xs leading-relaxed mt-1.5 ${theme === 'dark' ? 'text-slate-400' : 'text-stone-600'}`}>
                            {node.significance}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 4. Quiz */}
              {selectedOutput === 'quiz' && (
                <div className="space-y-4 animate-fadeIn">
                  <span className={`text-[9px] font-mono font-bold uppercase tracking-widest block ${
                    theme === 'dark' ? 'text-gold-400' : 'text-amber-800'
                  }`}>
                    ADAPTIVE EXCLUSION QUIZ GENERATION
                  </span>

                  {activeVerse.outputs.quiz.map((q, qIdx) => (
                    <div key={qIdx} className="space-y-3">
                      <div className={`p-4 rounded-xl border text-left transition-colors ${
                        theme === 'dark' ? 'bg-slate-950/60 border-slate-805' : 'bg-stone-50 border-stone-200'
                      }`}>
                        <div className={`flex items-center gap-1.5 text-xs mb-2 font-bold uppercase tracking-wider ${
                          theme === 'dark' ? 'text-gold-300' : 'text-amber-800'
                        }`}>
                          <HelpCircle className="w-4 h-4 text-amber-505 animate-pulse" />
                          Sabbath evaluation questions
                        </div>
                        <h4 className={`text-md font-extrabold leading-relaxed ${
                          theme === 'dark' ? 'text-slate-205' : 'text-stone-850'
                        }`}>
                          {q.question}
                        </h4>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {q.options.map((opt, oIdx) => {
                          const isCorrect = opt === q.answer;
                          const isSelected = userSelectedAnswer === opt;
                          return (
                            <button
                              key={opt}
                              onClick={() => {
                                setUserSelectedAnswer(opt);
                                onNotify(`Interactive Quiz: You answered '${opt}' - ${isCorrect ? 'Correct!' : 'Try again.'}`);
                              }}
                              className={`p-3.5 rounded-xl border text-left text-xs transition-all cursor-pointer ${
                                isSelected
                                  ? isCorrect
                                    ? theme === 'dark'
                                      ? 'bg-emerald-400/20 border-emerald-400/50 text-emerald-300 font-bold'
                                      : 'bg-emerald-50 border-emerald-300 text-emerald-800 font-bold'
                                    : theme === 'dark'
                                      ? 'bg-red-400/10 border-red-400/40 text-red-300'
                                      : 'bg-rose-50 border-rose-250 text-rose-800'
                                  : theme === 'dark'
                                    ? 'bg-slate-900 border-slate-800 hover:bg-slate-850 text-slate-300 font-medium'
                                    : 'bg-white border-stone-200 hover:bg-stone-50 text-stone-700 font-medium shadow-2xs'
                              }`}
                            >
                              <span className={`font-mono font-extrabold text-[10px] mr-1.5 ${
                                isSelected ? 'text-current' : 'text-slate-400'
                              }`}>
                                {String.fromCharCode(65 + oIdx)}.
                              </span>
                              {opt}
                            </button>
                          );
                        })}
                      </div>

                      {userSelectedAnswer && (
                        <div className={`p-4 rounded-xl border animate-fadeIn transition-colors ${
                          userSelectedAnswer === q.answer
                            ? theme === 'dark' ? 'bg-emerald-900/10 border-emerald-800/40 text-emerald-250' : 'bg-emerald-55/40 border-emerald-200 text-slate-700'
                            : theme === 'dark' ? 'bg-amber-900/10 border-amber-800/40 text-amber-250' : 'bg-amber-50 border-amber-150 text-slate-705'
                        }`}>
                          <p className="text-xs">
                            <strong className={`block mb-1 text-sm ${
                              userSelectedAnswer === q.answer 
                                ? theme === 'dark' ? 'text-emerald-400' : 'text-emerald-800' 
                                : theme === 'dark' ? 'text-amber-400' : 'text-amber-800'
                            }`}>
                              {userSelectedAnswer === q.answer ? '✓ Excellent, that is correct!' : '✗ Not quite correct, keep reviewing text!'}
                            </strong>
                            {q.explanation}
                          </p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* 5. Narrator Audio */}
              {selectedOutput === 'audio' && (
                <div className="space-y-4 animate-fadeIn">
                  <span className={`text-[9px] font-mono font-bold uppercase tracking-widest block ${
                    theme === 'dark' ? 'text-gold-400' : 'text-amber-800'
                  }`}>
                    NARRATOR AUDIO SPEECH GENERATION
                  </span>

                  <div className={`rounded-xl p-5 border text-center space-y-4 transition-colors ${
                    theme === 'dark' ? 'bg-slate-900/35 border-slate-800' : 'bg-stone-50 border-stone-200'
                  }`}>
                    <div className={`inline-flex items-center justify-center w-14 h-14 rounded-full shadow-2xs ${
                      theme === 'dark' ? 'bg-gold-400/10 text-gold-300 border border-gold-400/20' : 'bg-amber-100 text-amber-802'
                    }`}>
                      <Volume2 className="w-6 h-6 animate-pulse" />
                    </div>
                    <div>
                      <h4 className={`text-md sm:text-lg font-bold ${theme === 'dark' ? 'text-slate-100' : 'text-stone-850'}`}>
                        {activeVerse.outputs.audio.title}
                      </h4>
                      <p className={`text-xs mt-1 ${theme === 'dark' ? 'text-slate-505' : 'text-stone-500'}`}>
                        Narrator: {activeVerse.outputs.audio.narrator} | Track duration: {activeVerse.outputs.audio.duration}
                      </p>
                    </div>

                    <div className={`border p-3 rounded-xl flex items-center gap-4 transition-colors ${
                      theme === 'dark' ? 'bg-[#030712] border-slate-800' : 'bg-white border-stone-200 shadow-3xs'
                    }`}>
                      <button
                        onClick={() => {
                          setAudioPlaying(!audioPlaying);
                          onNotify(audioPlaying ? 'Paused narrator playback.' : 'Playing demo voice narrator standard audio stream...');
                        }}
                        className={`w-10 h-10 rounded-full flex items-center justify-center transition-all hover:scale-105 cursor-pointer shadow-sm ${
                          theme === 'dark' ? 'bg-gold-550 text-slate-950 hover:bg-gold-600' : 'bg-[#b45309] text-white hover:bg-amber-800'
                        }`}
                      >
                        {audioPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current ml-0.5" />}
                      </button>

                      <div className="flex-1 space-y-1 text-left">
                        <div className={`h-1.5 rounded-full overflow-hidden relative ${
                          theme === 'dark' ? 'bg-slate-800' : 'bg-stone-150'
                        }`}>
                          <div
                            style={{ width: audioPlaying ? '40%' : '10%' }}
                            className={`h-full rounded-full transition-all duration-1000 ${
                              theme === 'dark' ? 'bg-gold-400' : 'bg-amber-600'
                            }`}
                          />
                        </div>
                        <div className="flex justify-between items-center text-[10px] font-mono">
                          <span className={theme === 'dark' ? 'text-slate-450' : 'text-stone-500'}>{audioPlaying ? '0:20 PLAYED' : 'READY TO STREAM'}</span>
                          <span className={theme === 'dark' ? 'text-slate-450' : 'text-stone-500'}>{activeVerse.outputs.audio.duration} remaining</span>
                        </div>
                      </div>
                    </div>

                    {/* Wave visuals */}
                    <div className="flex justify-center items-center gap-[3px] h-8 pt-1">
                      {[10, 40, 20, 60, 30, 80, 40, 90, 50, 70, 30, 60, 20, 40, 10].map((h, i) => (
                        <div
                          key={i}
                          style={{ height: audioPlaying ? `${h}%` : '4px' }}
                          className={`w-[3px] rounded-full transition-all duration-350 ${
                            isPlayingSelected(i, audioPlaying, theme)
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* 6. Video prompt scene */}
              {selectedOutput === 'video' && (
                <div className="space-y-4 animate-fadeIn">
                  <span className={`text-[9px] font-mono font-bold uppercase tracking-widest block ${
                    theme === 'dark' ? 'text-gold-400' : 'text-amber-850'
                  }`}>
                    HYPER-CINEMATIC GRAPH DESIGN FORMULATION
                  </span>

                  <div className={`p-4 rounded-xl border space-y-3 transition-colors ${
                    theme === 'dark' ? 'bg-[#030712] border-slate-800' : 'bg-stone-50 border-stone-200'
                  }`}>
                    <div className={`flex justify-between items-center py-1.5 px-3 rounded-lg border shadow-3xs transition-colors ${
                      theme === 'dark' ? 'bg-slate-900/40 border-slate-800' : 'bg-white border-stone-150'
                    }`}>
                      <span className={`text-[9px] font-mono ${theme === 'dark' ? 'text-slate-450' : 'text-stone-500'}`}>CAMERA BEHAVIOR & SHADING FRAME</span>
                      <span className={`font-mono text-[9px] font-bold uppercase tracking-wider ${
                        theme === 'dark' ? 'text-gold-300' : 'text-amber-800'
                      }`}>{activeVerse.outputs.video.style}</span>
                    </div>
                    
                    <div className={`p-4 rounded-lg border text-xs leading-relaxed font-mono italic shadow-3xs text-left transition-colors ${
                      theme === 'dark' ? 'bg-slate-950/80 border-slate-805 text-slate-300' : 'bg-white border-stone-200 text-stone-850'
                    }`}>
                      &ldquo;{activeVerse.outputs.video.scenePrompt}&rdquo;
                    </div>

                    <div className={`flex justify-between items-center text-[10.5px] font-semibold pt-1 ${
                      theme === 'dark' ? 'text-slate-500' : 'text-stone-500'
                    }`}>
                      <span>Passage duration: {activeVerse.outputs.video.duration}</span>
                      <span>Aspect ratio: 16:9 widescreen format</span>
                    </div>
                  </div>

                  <button
                    onClick={() => onNotify("Opening video generator sandbox mockup...")}
                    className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 shadow-sm cursor-pointer"
                  >
                    <Video className="w-4 h-4" /> Generate Scene Cinemagraph Outline
                  </button>
                </div>
              )}

              {/* 7. Sermon Blueprint */}
              {selectedOutput === 'sermon' && (
                <div className="space-y-4 animate-fadeIn max-h-[320px] overflow-y-auto pr-1">
                  <span className={`text-[9px] font-mono font-bold uppercase tracking-widest block ${
                    theme === 'dark' ? 'text-gold-400' : 'text-amber-800'
                  }`}>
                    HOMILETICS DRAFT BLUEPRINTS
                  </span>

                  <div className={`p-4.5 rounded-xl border space-y-4 transition-colors ${
                    theme === 'dark' ? 'bg-slate-900/35 border-slate-800' : 'bg-stone-50 border-stone-200'
                  }`}>
                    <div className={`pb-2 border-b ${theme === 'dark' ? 'border-slate-800' : 'border-stone-150'}`}>
                      <span className={`text-[9px] uppercase font-bold font-mono block mb-1 ${
                        theme === 'dark' ? 'text-slate-505' : 'text-stone-450'
                      }`}>WORKING PULPIT TITLE</span>
                      <h4 className={`text-md sm:text-lg font-bold ${theme === 'dark' ? 'text-gold-300' : 'text-[#b45309]'}`}>{activeVerse.outputs.sermon.title}</h4>
                    </div>

                    <div>
                      <span className={`text-[9px] uppercase font-bold font-mono block ${
                        theme === 'dark' ? 'text-slate-501' : 'text-stone-450'
                      }`}>SUGGESTED EXORDIUM (INTRO)</span>
                      <p className={`text-xs leading-relaxed italic mt-1 font-serif ${
                        theme === 'dark' ? 'text-slate-300' : 'text-stone-800'
                      }`}>&ldquo;{activeVerse.outputs.sermon.intro}&rdquo;</p>
                    </div>

                    <div>
                      <span className={`text-[9px] uppercase font-bold font-mono block mb-1.5 ${
                        theme === 'dark' ? 'text-slate-501' : 'text-stone-450'
                      }`}>HOMILETICAL BODY DIVISIONS</span>
                      <ul className="space-y-1.5">
                        {activeVerse.outputs.sermon.points.map((pt, i) => (
                          <li key={i} className={`text-xs flex items-start gap-2 px-2.5 py-1.5 rounded border transition-colors ${
                            theme === 'dark' ? 'bg-slate-950/80 border-slate-805 text-slate-300' : 'bg-white border-stone-150 text-stone-705'
                          }`}>
                            <span className={`font-mono font-bold text-[11px] ${
                              theme === 'dark' ? 'text-gold-400' : 'text-amber-800'
                            }`}>{i + 1}.</span>
                            <span className="font-medium">{pt}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className={`pt-2 border-t ${theme === 'dark' ? 'border-slate-800' : 'border-stone-150'}`}>
                      <span className={`text-[9px] uppercase font-bold font-mono block ${
                        theme === 'dark' ? 'text-gold-400' : 'text-amber-802 font-extrabold'
                      }`}>SERMONIC ILLUSTRATION POINT</span>
                      <p className={`text-xs leading-relaxed mt-1 ${theme === 'dark' ? 'text-slate-400' : 'text-stone-655'}`}>{activeVerse.outputs.sermon.illustration}</p>
                    </div>

                    <div className={`pt-2 border-t ${theme === 'dark' ? 'border-slate-800' : 'border-stone-150'}`}>
                      <span className={`text-[9px] uppercase font-bold font-mono block ${
                        theme === 'dark' ? 'text-slate-500' : 'text-stone-450'
                      }`}>PULPIT CONCLUSION SUGGESTION</span>
                      <p className={`text-xs leading-relaxed mt-1 ${theme === 'dark' ? 'text-slate-400' : 'text-stone-655'}`}>{activeVerse.outputs.sermon.conclusion}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* 8. Study Session Discussion Questions */}
              {selectedOutput === 'studySession' && (
                <div className="space-y-4 animate-fadeIn">
                  <span className={`text-[9px] font-mono font-bold uppercase tracking-widest block ${
                    theme === 'dark' ? 'text-gold-400' : 'text-amber-850'
                  }`}>
                    SMALL GROUP DISCUSSION STUDY OUTLINE
                  </span>

                  <div className={`p-4.5 rounded-xl border space-y-4 text-left transition-colors ${
                    theme === 'dark' ? 'bg-slate-900/35 border-slate-800' : 'bg-stone-50 border-stone-200'
                  }`}>
                    <div>
                      <h4 className={`text-sm font-bold ${theme === 'dark' ? 'text-slate-250' : 'text-stone-850'}`}>
                        Curriculum: {activeVerse.outputs.studySession.title}
                      </h4>
                      <p className={`text-[11px] font-mono mt-1 font-bold ${
                        theme === 'dark' ? 'text-gold-300' : 'text-amber-800'
                      }`}>
                        Assigned chapter files for reading: {activeVerse.outputs.studySession.reading}
                      </p>
                    </div>

                    <div className="space-y-2">
                      <span className={`text-[9px] uppercase font-bold font-mono block ${
                        theme === 'dark' ? 'text-slate-400' : 'text-stone-500'
                      }`}>
                        Interactive Discussion starters:
                      </span>
                      <ul className="space-y-2">
                        {activeVerse.outputs.studySession.discussionQuestions.map((q, i) => (
                          <li key={i} className={`text-xs font-medium flex gap-2.5 p-2.5 border rounded-lg shadow-3xs transition-colors ${
                            theme === 'dark' ? 'bg-slate-950 border-slate-850 text-slate-300' : 'bg-white border-stone-200 text-stone-705'
                          }`}>
                            <span className={`w-5 h-5 rounded-full flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5 ${
                              theme === 'dark' ? 'bg-gold-400/10 text-gold-300 border border-gold-400/20' : 'bg-amber-100 text-amber-805'
                            }`}>
                              {i + 1}
                            </span>
                            <span className="flex-1 leading-relaxed">{q}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className={`pt-2.5 border-t ${theme === 'dark' ? 'border-slate-800' : 'border-stone-150'}`}>
                      <p className={`text-xs ${theme === 'dark' ? 'text-slate-400' : 'text-stone-655'}`}>
                        <strong className={`text-[10px] uppercase tracking-wide block mb-1 ${
                          theme === 'dark' ? 'text-[#ca8a04]' : 'text-[#cc781d]'
                        }`}>Weekly personal application assignment:</strong>
                        {activeVerse.outputs.studySession.actionStep}
                      </p>
                    </div>
                  </div>
                </div>
              )}

            </div>

            {/* Action Box */}
            <div className={`mt-5 pt-4 border-t flex items-center justify-between transition-colors ${
              theme === 'dark' ? 'border-slate-800' : 'border-stone-105'
            }`}>
              <span className={`text-[11px] leading-snug font-medium ${theme === 'dark' ? 'text-slate-500' : 'text-stone-450'}`}>
                Ready to transmit, print, or copy to congregation channels?
              </span>
              <button
                onClick={() => onNotify(`Exporting compiled ${selectedOutput} format as printable PDF congregation material...`)}
                className={`flex items-center gap-1.5 text-xs font-bold px-4 py-2 rounded-xl border transition-all cursor-pointer ${
                  theme === 'dark'
                    ? 'bg-slate-900 border-slate-850 text-gold-300 hover:bg-slate-850 hover:text-gold-250'
                    : 'bg-white border-stone-250 text-amber-805 hover:bg-stone-50 hover:text-amber-900'
                }`}
              >
                Export PDF Handout
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}

// Quiet local formatting functions
function isPlayingSelected(idx: number, isPlaying: boolean, theme: string) {
  if (!isPlaying) {
    return theme === 'dark' ? 'bg-slate-800' : 'bg-stone-200';
  }
  if (idx % 2 === 0) return 'bg-[#ca8a04]';
  return theme === 'dark' ? 'bg-[#fde047]' : 'bg-amber-600';
}
