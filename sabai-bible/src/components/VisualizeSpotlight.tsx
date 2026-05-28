/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useTheme } from '../ThemeContext';
import { BookOpen, FileText, Play, HelpCircle, Volume2, ArrowRight } from 'lucide-react';

interface VisualizeSpotlightProps {
  onNotify: (msg: string) => void;
}

type OutputType = 'Report' | 'Audio' | 'Video' | 'Quiz';

export default function VisualizeSpotlight({ onNotify }: VisualizeSpotlightProps) {
  const { theme } = useTheme();
  
  // Interactive marketing selectors
  const [activeFormat, setActiveFormat] = useState<OutputType>('Report');
  const [selectedBook, setSelectedBook] = useState('Philippians');
  const [selectedChapter, setSelectedChapter] = useState('4');
  const [verseRange, setVerseRange] = useState('11-13');
  const [quizAnswered, setQuizAnswered] = useState<number | null>(null);

  const formatData = {
    Report: {
      title: 'Theological Exegesis Report',
      meta: 'Document & Research • 4 Pages',
      body: 'Detailed historical-grammatical analysis of Philippians 4:13. Examining Paul’s context in Roman imprisonment, the linguistic nuances of "strengthens" (endunamoo in Greek), and the systematic integration of divine grace as a fuel for missionary expansion.'
    },
    Audio: {
      title: 'Scripture Audio Story',
      meta: 'Warm Resonant Voice • 3:45 min',
      body: 'Ambient, deep dramatic voice reading of scripture with ancient acoustic harp echoes in the background. Tailored for private meditation and serene devotion.'
    },
    Video: {
      title: 'Cinematic Video Summary',
      meta: '1080P Ultra Definition • 1:15 min',
      body: 'Immersive cinematic presentation depicting an ancient stone cell lit by golden oil lamps, transitioning to a wide drone zoom over modern landscapes.'
    },
    Quiz: {
      title: 'Adaptive Learning Quiz',
      meta: 'Interactive Assessment • 5 Questions',
      body: 'Check understanding with contextual questions about Ephesus, Philippi, the Roman judicial systems, and Davidic covenant models.'
    }
  };

  const books = ['Philippians', 'Genesis', 'John', 'Psalm', 'Isaiah'];

  const clickFormat = (fmt: OutputType) => {
    setActiveFormat(fmt);
    onNotify(`Preview outcome format updated to: ${fmt}`);
  };

  return (
    <section id="visualize-section" className={`py-24 relative overflow-hidden transition-colors duration-500 border-b ${
      theme === 'dark' 
        ? 'bg-[#0B192C] text-slate-105 border-slate-800' 
        : 'bg-[#F4F7FB]/50 text-stone-900 border-stone-200'
    }`}>
      
      {/* Background soft ambient lights */}
      <div className="absolute top-[20%] right-[10%] w-96 h-96 bg-blue-500/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[10%] left-[5%] w-80 h-80 bg-indigo-505/5 rounded-full blur-[90px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Component Title and Subheadline */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          <span className={`text-[10px] font-extrabold font-mono tracking-[3px] uppercase block mb-3 ${
            theme === 'dark' ? 'text-blue-400' : 'text-blue-600'
          }`}>
            VISUALIZE FEATURE SPOTLIGHT
          </span>
          <h2 className={`font-display font-black text-3xl sm:text-4xl leading-tight ${
            theme === 'dark' ? 'text-white' : 'text-[#0B192C]'
          }`}>
            Turn Scripture into visual learning.
          </h2>
          <p className={`mt-4 text-xs sm:text-sm max-w-xl mx-auto leading-relaxed ${
            theme === 'dark' ? 'text-slate-400' : 'text-slate-500'
          }`}>
            Select a Bible passage and create reports, audio stories, videos, or quizzes that make Scripture easier to understand and remember.
          </p>
        </div>

        {/* Marketing UI Spotlight Builder Mockup */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch max-w-5xl mx-auto">
          
          {/* Left Column: Selector Controls (Bible passage / format selectors) */}
          <div className={`lg:col-span-5 rounded-2xl border p-6 flex flex-col justify-between text-left transition-colors ${
            theme === 'dark' ? 'bg-[#0A192C]/70 border-slate-850' : 'bg-white border-blue-50/60 shadow-sm'
          }`}>
            <div>
              <h3 className={`text-xs font-bold font-mono uppercase tracking-widest text-[#ca8a04] mb-4`}>
                1. Select Passage & Format
              </h3>
              
              <div className="flex flex-col gap-4">
                
                {/* Book Selector */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                    BIBLE BOOK
                  </label>
                  <select
                    value={selectedBook}
                    onChange={(e) => {
                      setSelectedBook(e.target.value);
                      onNotify(`Selected book: ${e.target.value}`);
                    }}
                    className={`w-full p-2.5 rounded-lg border text-xs font-bold outline-none cursor-pointer ${
                      theme === 'dark'
                        ? 'bg-[#0B192C] border-slate-800 text-white'
                        : 'bg-slate-50 border-stone-200 text-slate-850'
                    }`}
                  >
                    {books.map((b) => (
                      <option key={b} value={b}>{b}</option>
                    ))}
                  </select>
                </div>

                {/* Chapter & Verses Grid */}
                <div className="grid grid-cols-2 gap-4">
                  {/* Chapter */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                      CHAPTER
                    </label>
                    <input
                      type="text"
                      value={selectedChapter}
                      onChange={(e) => setSelectedChapter(e.target.value)}
                      className={`p-2.5 rounded-lg border text-xs font-mono font-bold outline-none ${
                        theme === 'dark'
                          ? 'bg-[#0B192C] border-slate-800 text-white'
                          : 'bg-slate-50 border-stone-200 text-slate-850'
                      }`}
                    />
                  </div>
                  {/* Verse range */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                      VERSE RANGE
                    </label>
                    <input
                      type="text"
                      value={verseRange}
                      onChange={(e) => setVerseRange(e.target.value)}
                      className={`p-2.5 rounded-lg border text-xs font-mono font-bold outline-none ${
                        theme === 'dark'
                          ? 'bg-[#0B192C] border-slate-800 text-white'
                          : 'bg-slate-50 border-stone-200 text-[#0B192C]'
                      }`}
                    />
                  </div>
                </div>

                {/* Output Format Picker Buttons */}
                <div className="flex flex-col gap-1.5 mt-2">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block mb-1">
                    CHOOSE OUTPUT FORMAT
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {([
                      { id: 'Report', icon: FileText, desc: 'Detailed research' },
                      { id: 'Audio', icon: Volume2, desc: 'Meditative Harps' },
                      { id: 'Video', icon: Play, desc: 'Cinematic Reels' },
                      { id: 'Quiz', icon: HelpCircle, desc: 'Concept trivias' }
                    ] as const).map((fmt) => {
                      const Icon = fmt.icon;
                      const isActive = activeFormat === fmt.id;
                      return (
                        <button
                          key={fmt.id}
                          onClick={() => clickFormat(fmt.id)}
                          className={`p-2.5 rounded-xl border text-left flex items-start gap-2.5 transition-all outline-none cursor-pointer ${
                            isActive
                              ? 'bg-blue-600 border-blue-600/50 text-white shadow-sm shadow-blue-500/20'
                              : theme === 'dark'
                                ? 'bg-[#0B192C] border-slate-800 hover:border-slate-700 text-slate-300'
                                : 'bg-slate-50/50 border-stone-200 hover:bg-slate-50 text-slate-700 shadow-3xs'
                          }`}
                        >
                          <div className={`mt-0.5 p-1.5 rounded-lg shrink-0 ${
                            isActive ? 'bg-white/10 text-white' : 'bg-slate-100 text-slate-600 dark:bg-slate-950 dark:text-slate-400'
                          }`}>
                            <Icon className="w-4 h-4" />
                          </div>
                          <div>
                            <span className="text-[10.5px] font-extrabold block tracking-wide">{fmt.id}</span>
                            <span className={`text-[8px] block opacity-80 font-mono`}>{fmt.desc}</span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

              </div>
            </div>

            {/* Bottom action bar */}
            <button
              onClick={() => onNotify(`Redirecting with ${selectedBook} ${selectedChapter}:${verseRange} in format: ${activeFormat}`)}
              className={`w-full py-3.5 rounded-xl text-xs font-extrabold uppercase mt-6 tracking-widest transition-all duration-300 transform hover:-translate-y-0.5 cursor-pointer flex items-center justify-center gap-2 ${
                theme === 'dark'
                  ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-md hover:shadow-lg'
                  : 'bg-[#0B192C] hover:bg-slate-900 text-white shadow-md'
              }`}
            >
              Explore Visualize
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Right Column: Generated preview depends on active format */}
          <div className="lg:col-span-7 flex flex-col justify-between">
            <div className={`rounded-2xl border p-6 flex flex-col justify-between h-full text-left transition-colors relative overflow-hidden ${
              theme === 'dark' ? 'bg-[#0A192C]/70 border-slate-850' : 'bg-white border-blue-50/60 shadow-sm'
            }`}>
              
              {/* Outcome Header HUD */}
              <div className={`flex items-center justify-between border-b pb-4 mb-4 transition-colors ${
                theme === 'dark' ? 'border-slate-800' : 'border-slate-100'
              }`}>
                <div className="flex items-center gap-2">
                  <span className={`w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse`} />
                  <span className={`text-[9px] font-mono tracking-widest font-extrabold uppercase ${
                    theme === 'dark' ? 'text-amber-400' : 'text-blue-600'
                  }`}>
                    GENERATOR OUTCOME OUTLINE
                  </span>
                </div>
                <span className={`text-[9px] font-mono font-bold bg-slate-105 px-2 py-0.5 rounded border dark:bg-slate-950 dark:border-slate-850`}>
                  {selectedBook} {selectedChapter}:{verseRange}
                </span>
              </div>

              {/* Dynamic Presentation Body */}
              <div className="flex-1 flex flex-col justify-center py-4">
                
                {activeFormat === 'Report' && (
                  <div className="animate-fadeIn space-y-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 bg-blue-500/10 text-blue-500 rounded-lg flex items-center justify-center">
                        <FileText className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className={`text-xs font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                          {formatData.Report.title}
                        </h4>
                        <p className="text-[10px] text-slate-500 font-mono">{formatData.Report.meta}</p>
                      </div>
                    </div>
                    {/* Simulated paragraph outline */}
                    <div className={`p-4 rounded-xl border font-sans text-xs leading-relaxed ${
                      theme === 'dark' ? 'bg-[#0B192C]/50 border-slate-800' : 'bg-slate-50 border-slate-150'
                    }`}>
                      {formatData.Report.body}
                    </div>
                    <div className="flex items-center gap-1.5 text-[10px] font-mono text-blue-605">
                      <span>✓ Key Reference parsed: Philip. 4:13 (LXX)</span>
                      <span>• Historical Context integrated</span>
                    </div>
                  </div>
                )}

                {activeFormat === 'Audio' && (
                  <div className="animate-fadeIn space-y-4">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 bg-amber-500/10 text-amber-500 rounded-lg flex items-center justify-center">
                        <Volume2 className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className={`text-xs font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                          {formatData.Audio.title}
                        </h4>
                        <p className="text-[10px] text-slate-500 font-mono">{formatData.Audio.meta}</p>
                      </div>
                    </div>
                    
                    {/* Harps soundwave / player mock */}
                    <div className={`p-4 rounded-xl border ${
                      theme === 'dark' ? 'bg-[#0B192C]/40 border-slate-800' : 'bg-slate-50 border-slate-150'
                    }`}>
                      <p className="text-xs text-slate-650 italic mb-3">
                        &ldquo;{formatData.Audio.body}&rdquo;
                      </p>
                      <div className="flex items-center gap-2 justify-center">
                        <button 
                          onClick={() => onNotify("Playing audio preview...")}
                          className="w-10 h-10 rounded-full bg-amber-500 text-slate-950 flex items-center justify-center shadow-lg cursor-pointer"
                        >
                          <Play className="w-4 h-4 fill-current ml-0.5" />
                        </button>
                        <div className="flex-1 flex gap-[2.5px] items-end h-8">
                          {[20, 40, 15, 60, 80, 45, 30, 75, 40, 15, 50, 70, 25, 45, 65, 35, 10, 40, 50, 20].map((h, i) => (
                            <div key={i} style={{ height: `${h}%` }} className="flex-1 bg-amber-500/40 rounded-full" />
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeFormat === 'Video' && (
                  <div className="animate-fadeIn space-y-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 bg-rose-500/10 text-rose-500 rounded-lg flex items-center justify-center">
                        <Play className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className={`text-xs font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                          {formatData.Video.title}
                        </h4>
                        <p className="text-[10px] text-slate-500 font-mono">{formatData.Video.meta}</p>
                      </div>
                    </div>

                    {/* Simulated video thumbnail mockup */}
                    <div className="relative aspect-video rounded-xl overflow-hidden bg-slate-950 border border-slate-800 flex items-center justify-center">
                      {/* Abstract spiritual gradient canvas */}
                      <div className="absolute inset-0 bg-gradient-to-tr from-blue-900/60 via-indigo-900/50 to-amber-900/60 opacity-[0.8]" />
                      <div className="relative z-10 text-center flex flex-col items-center gap-1">
                        <div className="w-10 h-10 rounded-full bg-white/25 backdrop-blur-md text-white flex items-center justify-center hover:scale-110 active:scale-95 transition-transform cursor-pointer">
                          <Play className="w-4 h-4 fill-current ml-0.5" />
                        </div>
                        <span className="text-[9px] font-mono text-white/80 font-bold uppercase tracking-wider mt-1.5">
                          RENDER TIMELINE SCENE PREVIEW
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {activeFormat === 'Quiz' && (
                  <div className="animate-fadeIn space-y-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 bg-emerald-500/10 text-emerald-600 rounded-lg flex items-center justify-center">
                        <HelpCircle className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className={`text-xs font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                          {formatData.Quiz.title}
                        </h4>
                        <p className="text-[10px] text-slate-500 font-mono">{formatData.Quiz.meta}</p>
                      </div>
                    </div>

                    <div className={`p-4 rounded-xl border text-left ${
                      theme === 'dark' ? 'bg-[#0B192C]/40 border-slate-800' : 'bg-slate-50 border-slate-150'
                    }`}>
                      <p className={`text-[11.5px] font-extrabold mb-3 ${theme === 'dark' ? 'text-slate-105' : 'text-slate-850'}`}>
                        Q: What does the Greek term 'endunamoo' refer to in Philippians 4:13?
                      </p>
                      <div className="space-y-1.5">
                        {[
                          'Human spiritual pride',
                          'An inward, divine infused strength',
                          'A political liberation effort',
                          'An assembly temple tax'
                        ].map((choice, idx) => {
                          const isCorrect = idx === 1;
                          const hasSelected = quizAnswered !== null;
                          const isSelected = quizAnswered === idx;
                          return (
                            <button
                              key={idx}
                              onClick={() => {
                                setQuizAnswered(idx);
                                if (isCorrect) onNotify("Correct quiz response!");
                              }}
                              className={`w-full p-2 rounded-lg text-left text-[10.5px] border cursor-pointer transition-all ${
                                isSelected
                                  ? isCorrect
                                    ? 'bg-emerald-500/15 border-emerald-500 text-emerald-650'
                                    : 'bg-red-500/15 border-red-500 text-red-500'
                                  : hasSelected && isCorrect
                                    ? 'bg-emerald-500/15 border-emerald-500 text-emerald-650 font-bold'
                                    : theme === 'dark'
                                      ? 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                                      : 'bg-white border-stone-200 text-slate-650 hover:bg-slate-100 shadow-2xs'
                              }`}
                            >
                              {String.fromCharCode(65 + idx)}. {choice}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                )}

              </div>

            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
