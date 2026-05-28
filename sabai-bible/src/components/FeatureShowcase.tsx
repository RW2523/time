/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useTheme } from '../ThemeContext';
import { BookOpen, MessageSquare, Compass, Calendar, Users, Eye, Music, Play, CheckCircle } from 'lucide-react';

interface FeatureShowcaseProps {
  onNotify: (msg: string) => void;
}

export default function FeatureShowcase({ onNotify }: FeatureShowcaseProps) {
  const { theme } = useTheme();
  
  // States for interactive previews
  const [activeFormat, setActiveFormat] = useState<'Report' | 'Audio' | 'Video' | 'Quiz'>('Report');
  const [checkedActivities, setCheckedActivities] = useState<Record<string, boolean>>({
    'Read Scripture': true,
    'Listen Premium Audio': false,
    'Watch Summary Video': false,
    'Complete Daily Quiz': false
  });

  const toggleActivity = (activity: string) => {
    setCheckedActivities(prev => ({
      ...prev,
      [activity]: !prev[activity]
    }));
    onNotify(`Toggled activity checklist: ${activity}`);
  };

  const selectFormat = (format: 'Report' | 'Audio' | 'Video' | 'Quiz') => {
    setActiveFormat(format);
    onNotify(`Previewing layout generator for format: ${format}`);
  };

  const features = [
    {
      id: 'read-focus',
      title: 'Read with Focus',
      icon: BookOpen,
      desc: 'Choose books, chapters, and verses with a clean Bible reading experience, context, notes, and cross references.',
      preview: (
        <div className={`p-4 rounded-xl border text-left flex flex-col gap-2 transition-colors ${
          theme === 'dark' ? 'bg-[#0B192C] border-slate-800' : 'bg-white border-blue-50'
        }`}>
          <div className="flex justify-between items-center text-[9px] font-mono tracking-wider font-bold">
            <span className={theme === 'dark' ? 'text-amber-400' : 'text-blue-600'}>READING EXPERIENCE</span>
            <span className={theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}>PSALM 119:105</span>
          </div>
          <p className={`font-serif text-[11.5px] italic leading-relaxed ${
            theme === 'dark' ? 'text-slate-200' : 'text-slate-800'
          }`}>
            &ldquo;Your word is a lamp to my feet and a light to my path.&rdquo;
          </p>
          <div className="flex gap-2 mt-2">
            <span className="text-[8px] font-mono font-bold bg-blue-500/10 text-blue-500 px-1.5 py-0.5 rounded">Context</span>
            <span className="text-[8px] font-mono font-bold bg-[#ca8a04]/10 text-[#ca8a04] px-1.5 py-0.5 rounded">Cross Ref</span>
            <span className="text-[8px] font-mono font-bold bg-emerald-500/10 text-emerald-600 px-1.5 py-0.5 rounded">Notes</span>
          </div>
        </div>
      )
    },
    {
      id: 'ask-bible',
      title: 'Ask the Bible',
      icon: MessageSquare,
      desc: 'Use AI chat to ask questions about verses, people, places, themes, and teachings.',
      preview: (
        <div className={`p-4 rounded-xl border text-left flex flex-col gap-2.5 transition-colors ${
          theme === 'dark' ? 'bg-[#0B192C] border-slate-800' : 'bg-white border-blue-50'
        }`}>
          <div className="flex items-center gap-1.5 text-[9px] font-mono tracking-wider font-bold text-amber-500">
            <MessageSquare className="w-3 h-3" />
            <span>AI INTERACTIVITY</span>
          </div>
          <div className="flex flex-col gap-2">
            <div className={`p-1.5 rounded-lg text-[9px] max-w-[90%] self-end font-semibold ${
              theme === 'dark' ? 'bg-[#1e3a8a]/20 text-blue-300' : 'bg-blue-50 text-blue-800'
            }`}>
              What is the promise of Psalm 119:105?
            </div>
            <div className={`p-2 rounded-lg text-[9px] leading-relaxed max-w-[90%] self-start ${
              theme === 'dark' ? 'bg-slate-900 border border-slate-850 text-slate-350' : 'bg-slate-50 border border-slate-100 text-slate-650'
            }`}>
              It declares that God's truth serves as custom direction, lighting up the dark steps immediately ahead...
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'visualize-scripture',
      title: 'Visualize Scripture',
      icon: Eye,
      desc: 'Generate reports, audio, videos, and quizzes from selected Bible passages.',
      preview: (
        <div className={`p-4 rounded-xl border text-left flex flex-col gap-3 transition-colors ${
          theme === 'dark' ? 'bg-[#0B192C] border-slate-800' : 'bg-white border-blue-50'
        }`}>
          <div className="flex justify-between items-center text-[9px] font-mono tracking-wider font-bold">
            <span className={theme === 'dark' ? 'text-amber-400' : 'text-blue-600'}>CONTENT CO-PILOT</span>
            <span className={theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}>GENERATE OUTCOME</span>
          </div>
          {/* Format selector inside card */}
          <div className="grid grid-cols-4 gap-1 p-0.5 rounded-lg bg-slate-100/50 dark:bg-slate-950/80">
            {(['Report', 'Audio', 'Video', 'Quiz'] as const).map((fmt) => (
              <button
                key={fmt}
                onClick={(e) => {
                  e.stopPropagation();
                  selectFormat(fmt);
                }}
                className={`py-1 rounded text-[8px] font-mono font-bold transition-all ${
                  activeFormat === fmt
                    ? 'bg-blue-600 text-white'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                {fmt}
              </button>
            ))}
          </div>
          {/* Simulated format render */}
          <div className="flex items-center gap-1.5">
            {activeFormat === 'Report' && <span className="text-[10px] font-mono text-slate-500">📄 Generate Exegesis Report</span>}
            {activeFormat === 'Audio' && <span className="text-[10px] font-mono text-slate-500 flex items-center gap-1"><Music className="w-3.5 h-3.5 text-amber-500" /> Synthesize Hebrew Audio</span>}
            {activeFormat === 'Video' && <span className="text-[10px] font-mono text-slate-500 flex items-center gap-1"><Play className="w-3.5 h-3.5 text-indigo-505" /> Render HD Visual Scene</span>}
            {activeFormat === 'Quiz' && <span className="text-[10px] font-mono text-slate-500">🏆 Formulate Bible Trivia Questions</span>}
          </div>
        </div>
      )
    },
    {
      id: 'follow-plans',
      title: 'Follow Study Plans',
      icon: Calendar,
      desc: 'Discover guided Bible plans with daily activities, reminders, progress, reading, audio, video, and quizzes.',
      preview: (
        <div className={`p-4 rounded-xl border text-left flex flex-col gap-2.5 transition-colors ${
          theme === 'dark' ? 'bg-[#0B192C] border-slate-800' : 'bg-white border-blue-50'
        }`}>
          <div className="flex justify-between items-center text-[9px] font-mono tracking-wider font-bold">
            <span className={theme === 'dark' ? 'text-amber-400' : 'text-blue-600'}>STUDY SCHEDULES</span>
            <span className="text-emerald-500">35%</span>
          </div>
          {/* Simple Checklist */}
          <div className="flex flex-col gap-1.5">
            {Object.entries(checkedActivities).map(([activity, checked]) => (
              <div 
                key={activity} 
                className="flex items-center gap-2 cursor-pointer"
                onClick={(e) => {
                  e.stopPropagation();
                  toggleActivity(activity);
                }}
              >
                <div className={`w-3.5 h-3.5 rounded border flex items-center justify-center transition-colors ${
                  checked ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-slate-350 bg-transparent'
                }`}>
                  {checked && <svg className="w-2.5 h-2.5 fill-current" viewBox="0 0 20 20"><path d="M0 11l2-2 5 5L18 3l2 2L7 18z"/></svg>}
                </div>
                <span className={`text-[9.5px] font-medium leading-none ${
                  checked ? 'line-through text-slate-400' : 'text-slate-650'
                }`}>
                  {activity}
                </span>
              </div>
            ))}
          </div>
        </div>
      )
    },
    {
      id: 'grow-community',
      title: 'Grow with Community',
      icon: Users,
      desc: 'Share prayers, verses, reflections, images, videos, audio, and PDFs with your faith community.',
      preview: (
        <div className={`p-4 rounded-xl border text-left flex flex-col gap-2.5 transition-colors ${
          theme === 'dark' ? 'bg-[#0B192C] border-slate-800' : 'bg-white border-blue-50'
        }`}>
          <div className="flex justify-between items-center text-[9px] font-mono tracking-wider font-bold">
            <span className="text-rose-500">COMMUNITY FEED</span>
            <span className="text-slate-400">12m ago</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center font-bold text-[8.5px] text-white">
              JD
            </div>
            <div>
              <p className={`text-[9.5px] font-extrabold ${theme === 'dark' ? 'text-white' : 'text-slate-850'}`}>Pastor Jonathan</p>
              <p className="text-[8px] text-slate-500 font-mono">Shared "Psalm 23 Meditations"</p>
            </div>
          </div>
          <p className="text-[10px] text-slate-400 line-clamp-1 italic leading-relaxed">
            "We finished our group study plan on the Psalms! Highly recommend."
          </p>
        </div>
      )
    }
  ];

  return (
    <section id="features" className={`py-24 relative overflow-hidden transition-colors duration-500 border-b ${
      theme === 'dark' 
        ? 'bg-[#0B192C] text-slate-105 border-slate-800/60' 
        : 'bg-slate-50/40 text-stone-900 border-stone-200'
    }`}>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          <span className={`text-[10px] font-extrabold font-mono tracking-[3px] uppercase block mb-3 ${
            theme === 'dark' ? 'text-blue-400' : 'text-blue-600'
          }`}>
            PLATFORM CAPABILITIES
          </span>
          <h2 className={`font-display font-black text-3xl sm:text-4xl tracking-tight ${
            theme === 'dark' ? 'text-white' : 'text-[#0B192C]'
          }`}>
            Five core pillars of modern Bible study.
          </h2>
          <p className={`mt-4 text-xs sm:text-sm max-w-xl mx-auto leading-relaxed ${
            theme === 'dark' ? 'text-slate-400' : 'text-slate-500'
          }`}>
            We don't bundle features for the sake of volume. Every component of SabAI Bible has been optimized around thoughtful learning, accessibility, and personal consistency.
          </p>
        </div>

        {/* Feature Grid: 2-3 layout for clean whitespace */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 justify-center">
          {features.slice(0, 3).map((feat) => (
            <div
              key={feat.id}
              onClick={() => onNotify(`Selected features: ${feat.title}`)}
              className={`group flex flex-col justify-between p-6 rounded-2xl border transition-all duration-300 transform hover:-translate-y-1 cursor-pointer ${
                theme === 'dark'
                  ? 'bg-slate-900/40 hover:bg-slate-900 border-slate-850 hover:border-slate-800 shadow-sm'
                  : 'bg-white hover:border-[#BFDBFE] border-stone-200/60 shadow-xs'
              }`}
            >
              <div className="text-left mb-6">
                <div className={`w-11 h-11 rounded-xl flex items-center justify-center mb-4 text-blue-500 bg-blue-500/10`}>
                  <feat.icon className="w-5 h-5 stroke-[2]" />
                </div>
                <h3 className={`font-display font-extrabold text-sm mb-2 transition-colors ${
                  theme === 'dark' ? 'text-white' : 'text-slate-900 font-black'
                }`}>
                  {feat.title}
                </h3>
                <p className={`text-[11.5px] leading-relaxed ${
                  theme === 'dark' ? 'text-slate-400' : 'text-slate-500'
                }`}>
                  {feat.desc}
                </p>
              </div>

              {/* Render dynamic inline mockup */}
              <div className="w-full">
                {feat.preview}
              </div>
            </div>
          ))}
        </div>

        {/* Bottom row of 2 centered cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto mt-8 justify-center">
          {features.slice(3, 5).map((feat) => (
            <div
              key={feat.id}
              onClick={() => onNotify(`Selected features: ${feat.title}`)}
              className={`group flex flex-col justify-between p-6 rounded-2xl border transition-all duration-300 transform hover:-translate-y-1 cursor-pointer ${
                theme === 'dark'
                  ? 'bg-slate-900/40 hover:bg-slate-900 border-slate-850 hover:border-slate-800 shadow-sm'
                  : 'bg-white hover:border-[#BFDBFE] border-stone-200/60 shadow-xs'
              }`}
            >
              <div className="text-left mb-6">
                <div className={`w-11 h-11 rounded-xl flex items-center justify-center mb-4 text-amber-500 bg-amber-500/10`}>
                  <feat.icon className="w-5 h-5 stroke-[2]" />
                </div>
                <h3 className={`font-display font-extrabold text-sm mb-2 transition-colors ${
                  theme === 'dark' ? 'text-white' : 'text-slate-900 font-black'
                }`}>
                  {feat.title}
                </h3>
                <p className={`text-[11.5px] leading-relaxed ${
                  theme === 'dark' ? 'text-slate-400' : 'text-slate-500'
                }`}>
                  {feat.desc}
                </p>
              </div>

              {/* Render dynamic inline mockup */}
              <div className="w-full">
                {feat.preview}
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
