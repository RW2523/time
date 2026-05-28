/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useTheme } from '../ThemeContext';
import { Calendar, Play, FileText, HelpCircle, Volume2, CheckCircle2, ArrowRight } from 'lucide-react';

interface StudyPlansSectionProps {
  onNotify: (msg: string) => void;
}

export default function StudyPlansSection({ onNotify }: StudyPlansSectionProps) {
  const { theme } = useTheme();

  const plans = [
    {
      id: 'jesus-journey',
      title: 'Jesus Journey',
      subtitle: 'Understanding Life of Jesus',
      duration: '5 days',
      progress: 35,
      desc: 'Follow the earthly ministry, teachings, and miracles of Christ in chronological order.',
      activities: ['Read Matthew 1-4', 'Listen to Sermon on Mount Summary', 'Watch Historic Jordan Video', 'Complete Life of Jesus Quiz']
    },
    {
      id: 'poetry-praise',
      title: 'Poetry & Praise',
      subtitle: 'Echoes of the Psalms',
      duration: '14 days',
      progress: 60,
      desc: 'A daily spiritual walk exploring comfort, lament, and adoration inside Hebrews songs.',
      activities: ['Read Psalms 23-25', 'Listen Meditative Harp Audio Feed', 'Watch Shepherding Visuals Reel', 'Complete Literary Devices Quiz']
    },
    {
      id: 'divine-walk',
      title: 'Divine Walk',
      subtitle: 'Character of the Patriarchs',
      duration: '8 days',
      progress: 12,
      desc: 'Diving deep into Genesis to study faith, loyalty, covenant and failures of early leaders.',
      activities: ['Read Genesis 12-15', 'Listen to Abraham Call Devotional', 'Watch Covenant Sacrifice Video', 'Complete Patriarch Family Tree Quiz']
    }
  ];

  const [activePlanIdx, setActivePlanIdx] = useState(0);
  const activePlan = plans[activePlanIdx];

  const handlePlanSelect = (idx: number) => {
    setActivePlanIdx(idx);
    onNotify(`Selected plan layout preview: ${plans[idx].title}`);
  };

  return (
    <section id="plans-section" className={`py-24 relative overflow-hidden transition-colors duration-500 border-b ${
      theme === 'dark' 
        ? 'bg-[#0B192C] text-slate-105 border-slate-800' 
        : 'bg-[#F4F7FB]/50 text-stone-900 border-stone-200'
    }`}>
      
      {/* Delicate background circles */}
      <div className="absolute top-[20%] left-[-10%] w-[500px] h-[500px] bg-indigo-500/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Module Header */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          <span className={`text-[10px] font-extrabold font-mono tracking-[3px] uppercase block mb-3 ${
            theme === 'dark' ? 'text-blue-400' : 'text-blue-600'
          }`}>
            GUIDED STUDY PLANS
          </span>
          <h2 className={`font-display font-black text-3xl sm:text-4xl leading-tight ${
            theme === 'dark' ? 'text-white' : 'text-[#0B192C]'
          }`}>
            Build consistency with guided Bible plans.
          </h2>
          <p className={`mt-4 text-xs sm:text-sm max-w-xl mx-auto leading-relaxed ${
            theme === 'dark' ? 'text-slate-400' : 'text-slate-500'
          }`}>
            Follow daily sessions with reading, audio, video, quizzes, reminders, and progress tracking.
          </p>
        </div>

        {/* Content Structure */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch max-w-5xl mx-auto">
          
          {/* Left Column: 3 plan choices */}
          <div className="lg:col-span-5 flex flex-col gap-4">
            <span className="text-[10px] font-mono tracking-wider font-extrabold text-slate-400 text-left">
              AVAILABLE STUDY PLANS
            </span>
            {plans.map((p, idx) => (
              <div
                key={p.id}
                onClick={() => handlePlanSelect(idx)}
                className={`p-4 rounded-xl border text-left cursor-pointer transition-all duration-300 ${
                  activePlanIdx === idx
                    ? theme === 'dark'
                      ? 'bg-blue-605 bg-blue-600/10 border-blue-500 text-white shadow-md'
                      : 'bg-white border-blue-550 border-blue-200 ring-2 ring-blue-500/10 text-[#0B192C]'
                    : theme === 'dark'
                      ? 'bg-slate-900/60 border-slate-850 text-slate-400 hover:border-slate-800'
                      : 'bg-white border-stone-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                <div className="flex justify-between items-center mb-1.5">
                  <span className={`text-[9px] font-mono font-bold uppercase transition-colors ${
                    activePlanIdx === idx ? 'text-blue-500' : 'text-slate-400'
                  }`}>
                    {p.duration} duration
                  </span>
                  <span className="text-xs font-bold">{p.progress}% Complete</span>
                </div>
                <h4 className={`text-sm font-extrabold ${theme === 'dark' ? 'text-white' : 'text-slate-905'}`}>
                  {p.title}
                </h4>
                <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">{p.desc}</p>
              </div>
            ))}
          </div>

          {/* Right Column: Live Plan Preview block */}
          <div className="lg:col-span-7">
            <div className={`rounded-2xl border p-6 flex flex-col justify-between h-full text-left transition-all ${
              theme === 'dark' ? 'bg-[#0A192C]/70 border-slate-850' : 'bg-white border-blue-50/60 shadow-md'
            }`}>
              
              {/* Header */}
              <div className="border-b border-light border-slate-200/25 pb-4 mb-4">
                <span className="text-[9.5px] font-mono font-extrabold text-[#ca8a04] block uppercase mb-1">
                  PLAN WORKING PREVIEW
                </span>
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className={`text-base font-black tracking-tight ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                      {activePlan.subtitle}
                    </h3>
                    <p className="text-[10px] text-slate-500 mt-0.5">Active plan details &bull; {activePlan.duration}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] font-mono text-slate-400 font-bold block mb-1">PROGRESS BAR</span>
                    <div className="flex items-center gap-2">
                      <div className="w-24 bg-slate-200 dark:bg-slate-950 h-1.5 rounded-full relative overflow-hidden">
                        <div 
                          className="bg-blue-600 h-1.5 rounded-full transition-all duration-500" 
                          style={{ width: `${activePlan.progress}%` }} 
                        />
                      </div>
                      <span className="text-xs font-mono font-bold leading-none">{activePlan.progress}%</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Today's Activities */}
              <div className="flex-1 py-2">
                <h4 className={`text-[11px] font-mono font-bold tracking-wide text-slate-500 uppercase mb-3`}>
                  TODAY'S ACTIVITIES & ACTIVE EXERCISES
                </h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {/* Activity 1: Read */}
                  <div className={`p-3 rounded-xl border flex items-center gap-3 ${
                    theme === 'dark' ? 'bg-[#0B192C]/40 border-slate-800' : 'bg-slate-50 border-slate-150'
                  }`}>
                    <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-500 flex items-center justify-center shrink-0">
                      <FileText className="w-4 h-4" />
                    </div>
                    <div className="text-left">
                      <span className="text-[9px] font-mono text-slate-500 uppercase font-bold block leading-none mb-0.5">MEMBER READING</span>
                      <span className={`text-[11px] font-bold ${theme === 'dark' ? 'text-slate-200' : 'text-stone-800'}`}>
                        {activePlan.activities[0]}
                      </span>
                    </div>
                  </div>

                  {/* Activity 2: Audio */}
                  <div className={`p-3 rounded-xl border flex items-center gap-3 ${
                    theme === 'dark' ? 'bg-[#0B192C]/40 border-slate-800' : 'bg-slate-50 border-slate-150'
                  }`}>
                    <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-500 flex items-center justify-center shrink-0">
                      <Volume2 className="w-4 h-4" />
                    </div>
                    <div className="text-left">
                      <span className="text-[9px] font-mono text-slate-500 uppercase font-bold block leading-none mb-0.5">HEBREW AUDIO</span>
                      <span className={`text-[11px] font-bold ${theme === 'dark' ? 'text-slate-200' : 'text-stone-800'}`}>
                        {activePlan.activities[1]}
                      </span>
                    </div>
                  </div>

                  {/* Activity 3: Video */}
                  <div className={`p-3 rounded-xl border flex items-center gap-3 ${
                    theme === 'dark' ? 'bg-[#0B192C]/40 border-slate-800' : 'bg-slate-50 border-slate-150'
                  }`}>
                    <div className="w-8 h-8 rounded-lg bg-rose-500/10 text-rose-550 flex items-center justify-center shrink-0">
                      <Play className="w-4 h-4 text-rose-500 ml-0.5" />
                    </div>
                    <div className="text-left">
                      <span className="text-[9px] font-mono text-slate-500 uppercase font-bold block leading-none mb-0.5">SCENERY VIDEO</span>
                      <span className={`text-[11px] font-bold ${theme === 'dark' ? 'text-slate-205' : 'text-stone-800'}`}>
                        {activePlan.activities[2]}
                      </span>
                    </div>
                  </div>

                  {/* Activity 4: Quiz */}
                  <div className={`p-3 rounded-xl border flex items-center gap-3 ${
                    theme === 'dark' ? 'bg-[#0B192C]/40 border-slate-800' : 'bg-slate-50 border-slate-150'
                  }`}>
                    <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-600 flex items-center justify-center shrink-0">
                      <HelpCircle className="w-4 h-4" />
                    </div>
                    <div className="text-left">
                      <span className="text-[9px] font-mono text-slate-505 uppercase font-bold block leading-none mb-0.5">LEARNING QUIZ</span>
                      <span className={`text-[11px] font-bold ${theme === 'dark' ? 'text-slate-205' : 'text-stone-800'}`}>
                        {activePlan.activities[3]}
                      </span>
                    </div>
                  </div>
                </div>

              </div>

              {/* CTA */}
              <div className="border-t border-light border-slate-200/25 pt-4 mt-4 flex items-center justify-between">
                <span className="text-[10px] text-slate-450 font-mono italic">Daily Reminders & Notifications sync configured</span>
                <button
                  onClick={() => onNotify(`Redirecting to complete study plans library...`)}
                  className={`py-2 px-4 rounded-lg text-xs font-bold transition-all duration-300 flex items-center gap-1.5 cursor-pointer ${
                    theme === 'dark'
                      ? 'bg-slate-900 border border-slate-800 text-[#ca8a04] hover:bg-slate-800'
                      : 'bg-[#0B192C] hover:bg-slate-950 text-white'
                  }`}
                >
                  View Study Plans
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
