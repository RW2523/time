/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useTheme } from '../ThemeContext';
import {
  BookOpen, MessageSquare, Eye, FileSpreadsheet, Share2,
  Calendar, Users, Volume2, Play, HelpCircle, FileText,
  CheckCircle, Music, ArrowRight, ChevronDown,
} from 'lucide-react';

interface ProductFeaturesProps {
  onNotify: (msg: string) => void;
}

type StepId = 'read' | 'ask' | 'visualize' | 'create' | 'share';

export default function ProductFeatures({ onNotify }: ProductFeaturesProps) {
  const { theme } = useTheme();
  const [active, setActive] = useState<StepId>('read');
  const [activeFormat, setActiveFormat] = useState<'Report' | 'Audio' | 'Video' | 'Quiz'>('Report');
  const [checkedActivities, setCheckedActivities] = useState<Record<string, boolean>>({
    'Read Scripture': true, 'Listen Premium Audio': false,
    'Watch Summary Video': false, 'Complete Daily Quiz': false,
  });

  const toggleActivity = (a: string) =>
    setCheckedActivities(prev => ({ ...prev, [a]: !prev[a] }));

  const steps: {
    id: StepId; num: string; title: string; icon: React.ElementType;
    stepDesc: string; accent: string; dotColor: string;
    featureTitle: string; featureDesc: string;
    preview: React.ReactNode;
  }[] = [
    {
      id: 'read', num: '01', title: 'Read', icon: BookOpen,
      stepDesc: 'Focused Bible reading experience.',
      accent: 'text-blue-500 bg-blue-500/10', dotColor: 'bg-blue-500',
      featureTitle: 'Read with Focus',
      featureDesc: 'Choose books, chapters, and verses with a clean Bible reading experience — context notes, cross references, and original language highlights included.',
      preview: (
        <div className={`p-4 rounded-2xl border text-left flex flex-col gap-3`}>
          <div className="flex justify-between items-center text-[9px] font-mono tracking-wider font-bold">
            <span className="text-blue-500">READING EXPERIENCE</span>
            <span className="text-slate-400">PSALM 119:105</span>
          </div>
          <p className="font-serif text-sm italic leading-relaxed text-slate-700 dark:text-slate-200">
            &ldquo;Your word is a lamp to my feet and a light to my path.&rdquo;
          </p>
          <div className="flex gap-2 pt-1">
            {['Context', 'Cross Ref', 'Notes'].map((t, i) => (
              <span key={t} className={`text-[8px] font-mono font-bold px-1.5 py-0.5 rounded ${
                i === 0 ? 'bg-blue-500/10 text-blue-500' :
                i === 1 ? 'bg-amber-500/10 text-amber-600' :
                'bg-emerald-500/10 text-emerald-600'
              }`}>{t}</span>
            ))}
          </div>
        </div>
      ),
    },
    {
      id: 'ask', num: '02', title: 'Ask', icon: MessageSquare,
      stepDesc: 'AI-guided questions with Bible references.',
      accent: 'text-amber-500 bg-amber-500/10', dotColor: 'bg-amber-500',
      featureTitle: 'Ask the Bible',
      featureDesc: 'Use AI chat to ask questions about verses, people, places, themes, and teachings — grounded in real Bible text, not hallucinations.',
      preview: (
        <div className="p-4 rounded-2xl border text-left flex flex-col gap-2.5">
          <div className="flex items-center gap-1.5 text-[9px] font-mono tracking-wider font-bold text-amber-500">
            <MessageSquare className="w-3 h-3" />
            <span>AI INTERACTIVITY</span>
          </div>
          <div className="flex flex-col gap-2">
            <div className="p-1.5 rounded-lg text-[9px] max-w-[90%] self-end font-semibold bg-blue-50 dark:bg-blue-900/20 text-blue-800 dark:text-blue-300">
              What is the promise of Psalm 119:105?
            </div>
            <div className="p-2 rounded-lg text-[9px] leading-relaxed max-w-[90%] self-start bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 text-slate-600 dark:text-slate-300">
              It declares that God's truth serves as custom direction, lighting up the dark steps immediately ahead…
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 'visualize', num: '03', title: 'Visualize', icon: Eye,
      stepDesc: 'Places, stories, maps and timelines.',
      accent: 'text-indigo-500 bg-indigo-500/10', dotColor: 'bg-indigo-500',
      featureTitle: 'Visualize Scripture',
      featureDesc: 'Generate theological reports, audio stories, cinematic videos, or adaptive quizzes from any selected Bible passage — in seconds.',
      preview: (
        <div className="p-4 rounded-2xl border text-left flex flex-col gap-3">
          <div className="flex justify-between items-center text-[9px] font-mono tracking-wider font-bold">
            <span className="text-indigo-500">CONTENT CO-PILOT</span>
            <span className="text-slate-400">GENERATE OUTCOME</span>
          </div>
          <div className="grid grid-cols-4 gap-1 p-0.5 rounded-lg bg-slate-100 dark:bg-slate-950">
            {(['Report', 'Audio', 'Video', 'Quiz'] as const).map(fmt => (
              <button key={fmt} onClick={() => setActiveFormat(fmt)}
                className={`py-1 rounded text-[8px] font-mono font-bold transition-all ${
                  activeFormat === fmt ? 'bg-indigo-600 text-white' : 'text-slate-500 hover:text-slate-900'
                }`}
              >{fmt}</button>
            ))}
          </div>
          <div className="flex items-center gap-1.5 text-[10px] font-mono text-slate-500">
            {activeFormat === 'Report' && <span>📄 Generate Exegesis Report</span>}
            {activeFormat === 'Audio' && <><Music className="w-3.5 h-3.5 text-amber-500" /> Synthesize Hebrew Audio</>}
            {activeFormat === 'Video' && <><Play className="w-3.5 h-3.5 text-indigo-500" /> Render Cinematic Scene</>}
            {activeFormat === 'Quiz' && <span>🏆 Formulate Trivia Questions</span>}
          </div>
        </div>
      ),
    },
    {
      id: 'create', num: '04', title: 'Create', icon: FileSpreadsheet,
      stepDesc: 'Quizzes, audio, video, reports.',
      accent: 'text-rose-500 bg-rose-500/10', dotColor: 'bg-rose-500',
      featureTitle: 'Follow Study Plans',
      featureDesc: 'Discover guided Bible plans with daily reading, audio, video, and quizzes — with progress tracking and personal reminders built in.',
      preview: (
        <div className="p-4 rounded-2xl border text-left flex flex-col gap-2.5">
          <div className="flex justify-between items-center text-[9px] font-mono tracking-wider font-bold">
            <span className="text-rose-500">STUDY SCHEDULES</span>
            <span className="text-emerald-500">35%</span>
          </div>
          <div className="flex flex-col gap-1.5">
            {Object.entries(checkedActivities).map(([activity, checked]) => (
              <div key={activity} className="flex items-center gap-2 cursor-pointer" onClick={() => toggleActivity(activity)}>
                <div className={`w-3.5 h-3.5 rounded border flex items-center justify-center transition-colors ${
                  checked ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-slate-300 bg-transparent'
                }`}>
                  {checked && <svg className="w-2.5 h-2.5 fill-current" viewBox="0 0 20 20"><path d="M0 11l2-2 5 5L18 3l2 2L7 18z"/></svg>}
                </div>
                <span className={`text-[9.5px] font-medium ${checked ? 'line-through text-slate-400' : 'text-slate-600 dark:text-slate-300'}`}>
                  {activity}
                </span>
              </div>
            ))}
          </div>
        </div>
      ),
    },
    {
      id: 'share', num: '05', title: 'Share', icon: Share2,
      stepDesc: 'Insights with your community.',
      accent: 'text-emerald-500 bg-emerald-500/10', dotColor: 'bg-emerald-500',
      featureTitle: 'Grow with Community',
      featureDesc: 'Share prayers, reflections, Bible insights, media, and study resources with your faith community — all in a safe, moderated fellowship feed.',
      preview: (
        <div className="p-4 rounded-2xl border text-left flex flex-col gap-2.5">
          <div className="flex justify-between items-center text-[9px] font-mono tracking-wider font-bold">
            <span className="text-rose-500">COMMUNITY FEED</span>
            <span className="text-slate-400">12m ago</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center font-bold text-[8.5px] text-white shrink-0">JD</div>
            <div>
              <p className="text-[9.5px] font-extrabold text-slate-900 dark:text-white">Pastor Jonathan</p>
              <p className="text-[8px] text-slate-500 font-mono">Shared "Psalm 23 Meditations"</p>
            </div>
          </div>
          <p className="text-[10px] text-slate-400 line-clamp-2 italic leading-relaxed">
            "We finished our group study plan on the Psalms! Highly recommend this series to any small group."
          </p>
        </div>
      ),
    },
  ];

  const activeStep = steps.find(s => s.id === active)!;

  return (
    <section className={`py-20 relative overflow-hidden transition-colors duration-500 border-b ${
      theme === 'dark' ? 'bg-[#0B192C] border-slate-800' : 'bg-white border-stone-150'
    }`}>
      {/* Ambient */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[180px] bg-sky-500/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* Header */}
        <div className="max-w-3xl mx-auto text-center mb-14">
          <span className={`text-[10px] font-extrabold uppercase font-mono tracking-[3px] block mb-3 ${
            theme === 'dark' ? 'text-blue-400' : 'text-blue-600'
          }`}>
            THE PRODUCT PROMISE
          </span>
          <h2 className={`font-display font-black text-3xl sm:text-4xl md:text-5xl leading-tight ${
            theme === 'dark' ? 'text-white' : 'text-[#0B192C]'
          }`}>
            One verse can become a<br className="hidden sm:inline" />{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 via-indigo-600 to-amber-500">
              complete learning experience.
            </span>
          </h2>
          <p className={`mt-4 text-xs sm:text-sm max-w-xl mx-auto leading-relaxed ${
            theme === 'dark' ? 'text-slate-400' : 'text-slate-500'
          }`}>
            Click any phase below to explore the full capability behind it.
          </p>
        </div>

        {/* Connector + 5-step pills */}
        <div className="relative max-w-4xl mx-auto mb-0">
          {/* Horizontal connector line */}
          <div className={`absolute top-[30px] left-[10%] right-[10%] h-[2px] hidden lg:block ${
            theme === 'dark'
              ? 'bg-gradient-to-r from-blue-500/20 via-indigo-400/20 to-emerald-400/20'
              : 'bg-gradient-to-r from-blue-100 via-indigo-100 to-emerald-100'
          }`} />

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 relative z-10">
            {steps.map(step => {
              const Icon = step.icon;
              const isActive = active === step.id;
              return (
                <button
                  key={step.id}
                  onClick={() => setActive(step.id)}
                  className={`group relative p-4 rounded-2xl border transition-all duration-300 transform cursor-pointer flex flex-col items-center text-center select-none ${
                    isActive
                      ? theme === 'dark'
                        ? 'bg-slate-900 border-blue-500/40 shadow-lg ring-1 ring-blue-500/10 -translate-y-1'
                        : 'bg-white border-blue-300 shadow-md -translate-y-1'
                      : theme === 'dark'
                        ? 'bg-slate-900/40 border-slate-800 hover:bg-slate-900 hover:border-slate-700 hover:-translate-y-0.5'
                        : 'bg-slate-50 border-slate-100 hover:bg-white hover:border-blue-100 hover:-translate-y-0.5'
                  }`}
                >
                  <span className={`text-[9px] font-mono font-black tracking-widest uppercase mb-2.5 ${
                    isActive ? (theme === 'dark' ? 'text-blue-400' : 'text-blue-600') : 'text-slate-400'
                  }`}>
                    PHASE {step.num}
                  </span>
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 transition-all ${
                    isActive ? step.accent : 'bg-slate-100 dark:bg-slate-800 text-slate-400'
                  }`}>
                    <Icon className={`w-4.5 h-4.5 stroke-[2] ${isActive ? '' : ''}`} />
                  </div>
                  <h4 className={`font-display font-extrabold text-sm mb-1 ${
                    isActive
                      ? theme === 'dark' ? 'text-white' : 'text-[#0B192C]'
                      : theme === 'dark' ? 'text-slate-300' : 'text-slate-600'
                  }`}>
                    {step.title}
                  </h4>
                  <p className={`text-[10px] leading-relaxed ${
                    isActive
                      ? theme === 'dark' ? 'text-slate-400' : 'text-slate-500'
                      : 'text-slate-400'
                  }`}>
                    {step.stepDesc}
                  </p>

                  {/* Active indicator arrow */}
                  {isActive && (
                    <div className="absolute -bottom-3 left-1/2 -translate-x-1/2">
                      <ChevronDown className={`w-5 h-5 ${theme === 'dark' ? 'text-blue-400' : 'text-blue-500'}`} />
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Expanded feature detail panel */}
        <div className="max-w-4xl mx-auto mt-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={active}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.22 }}
              className={`rounded-3xl border overflow-hidden ${
                theme === 'dark' ? 'bg-[#060c1d] border-slate-800' : 'bg-white border-stone-200 shadow-sm'
              }`}
            >
              {/* Card top bar */}
              <div className={`flex items-center gap-3 px-6 py-4 border-b ${
                theme === 'dark' ? 'border-slate-800 bg-slate-950/50' : 'border-stone-100 bg-stone-50'
              }`}>
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${activeStep.accent}`}>
                  <activeStep.icon className="w-4 h-4 stroke-[2]" />
                </div>
                <div>
                  <span className={`text-sm font-extrabold font-display ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                    {activeStep.featureTitle}
                  </span>
                  <span className={`block text-[10px] font-mono mt-0.5 ${theme === 'dark' ? 'text-slate-500' : 'text-stone-400'}`}>
                    Phase {activeStep.num} of 5 — {activeStep.title}
                  </span>
                </div>
                <div className="ml-auto hidden sm:flex items-center gap-1.5">
                  <span className={`w-1.5 h-1.5 rounded-full ${activeStep.dotColor}`} />
                  <span className="text-[9px] font-mono font-bold text-slate-400 uppercase tracking-wider">Interactive Preview</span>
                </div>
              </div>

              {/* Content */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 divide-y lg:divide-y-0 lg:divide-x divide-stone-100 dark:divide-slate-800">
                {/* Left — description */}
                <div className="p-6 sm:p-8 flex flex-col justify-between gap-6">
                  <div>
                    <p className={`text-sm leading-relaxed ${theme === 'dark' ? 'text-slate-300' : 'text-slate-600'}`}>
                      {activeStep.featureDesc}
                    </p>

                    {/* 5 pillars description row */}
                    <div className={`mt-6 p-4 rounded-2xl border text-left ${
                      theme === 'dark' ? 'bg-slate-900/60 border-slate-800' : 'bg-stone-50 border-stone-200'
                    }`}>
                      <span className={`text-[9px] font-mono font-bold uppercase tracking-widest block mb-3 ${
                        theme === 'dark' ? 'text-slate-500' : 'text-stone-400'
                      }`}>
                        Five core pillars of modern Bible study
                      </span>
                      <div className="space-y-2">
                        {steps.map(s => (
                          <button
                            key={s.id}
                            onClick={() => setActive(s.id)}
                            className={`w-full flex items-center gap-2.5 p-2 rounded-xl text-left transition-all ${
                              active === s.id
                                ? theme === 'dark' ? 'bg-slate-800 text-white' : 'bg-white shadow-sm text-slate-900'
                                : theme === 'dark' ? 'text-slate-400 hover:text-slate-200' : 'text-stone-500 hover:text-stone-800'
                            }`}
                          >
                            <div className={`w-5 h-5 rounded-lg flex items-center justify-center shrink-0 ${
                              active === s.id ? s.accent : 'bg-slate-100 dark:bg-slate-900 text-slate-400'
                            }`}>
                              <s.icon className="w-3 h-3 stroke-[2]" />
                            </div>
                            <span className="text-[11px] font-bold">{s.featureTitle}</span>
                            {active === s.id && (
                              <CheckCircle className="w-3.5 h-3.5 ml-auto text-emerald-500" />
                            )}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => onNotify(`Exploring ${activeStep.featureTitle}…`)}
                    className={`self-start flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider transition-all hover:translate-x-0.5 ${
                      theme === 'dark' ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-800'
                    }`}
                  >
                    Learn more about {activeStep.title}
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Right — interactive preview */}
                <div className={`p-6 sm:p-8 flex flex-col justify-center ${
                  theme === 'dark' ? 'bg-[#030a18]' : 'bg-stone-50/50'
                }`}>
                  <span className={`text-[9px] font-mono font-bold uppercase tracking-widest block mb-4 ${
                    theme === 'dark' ? 'text-slate-500' : 'text-stone-400'
                  }`}>
                    Live Feature Preview
                  </span>
                  {activeStep.preview}
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

      </div>
    </section>
  );
}
