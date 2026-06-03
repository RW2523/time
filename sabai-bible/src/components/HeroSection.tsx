/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion } from 'motion/react';
import { useTheme } from '../ThemeContext';
import { MessageSquare, Sparkles, Map, BookOpen, MapPin } from 'lucide-react';

interface HeroSectionProps {
  onNotify: (msg: string) => void;
  onLaunchMap: () => void;
}

export default function HeroSection({ onNotify, onLaunchMap }: HeroSectionProps) {
  const { theme } = useTheme();

  const scrollToFeatures = () => {
    const el = document.getElementById('features');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className={`relative pt-32 pb-20 md:pt-44 md:pb-28 transition-colors duration-500 overflow-hidden border-b ${
      theme === 'dark' 
        ? 'bg-[#0B192C] text-[#F1F6F9] border-slate-800' 
        : 'bg-gradient-to-b from-white via-slate-50 to-[#F4F7FB] text-[#0B192C] border-slate-200'
    }`}>
      
      {/* Premium Ambient Light Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-blue-500/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-1/3 right-10 w-96 h-96 bg-indigo-500/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute top-12 left-10 w-80 h-80 bg-amber-450/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Side: Copywriting and CTAs */}
          <motion.div 
            className="lg:col-span-5 flex flex-col items-start text-left"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {/* Soft Premium Pill Badge */}
            <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border shadow-xs mb-6 select-none ${
              theme === 'dark' 
                ? 'bg-slate-900 border-slate-800 text-amber-400' 
                : 'bg-blue-50 border-blue-100 text-blue-700'
            }`}>
              <Sparkles className="w-3.5 h-3.5 animate-pulse" />
              <span className="text-[10px] font-extrabold font-mono tracking-wider uppercase">
                AI-Powered Bible Exploration
              </span>
            </div>

            {/* Headline */}
            <h1 className={`font-display font-black text-4xl sm:text-5xl md:text-5xl lg:text-5xl leading-tight tracking-tight mb-4 ${
              theme === 'dark' ? 'text-white' : 'text-[#0B192C]'
            }`}>
              Map Every Bible Journey. <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 via-indigo-600 to-amber-500">
                Understand Scripture Deeply.
              </span>
            </h1>

            {/* Supporting subheadline */}
            <p className={`text-sm sm:text-base leading-relaxed mb-8 max-w-lg ${
              theme === 'dark' ? 'text-slate-300' : 'text-slate-600'
            }`}>
              SabAI Bible brings Scripture to life through interactive journey maps, historical timelines, and AI-powered study. Explore biblical events, ask questions, and visualize the stories behind every verse.
            </p>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row items-center gap-3.5 w-full sm:w-auto">
              {/* PRIMARY: Launch the map app */}
              <button
                onClick={onLaunchMap}
                className={`w-full sm:w-auto flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl text-xs font-extrabold uppercase tracking-widest shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5 cursor-pointer ${
                  theme === 'dark'
                    ? 'bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-350 hover:to-amber-450 text-slate-950'
                    : 'bg-[#0B192C] hover:bg-slate-900 text-white'
                }`}
              >
                <MapPin className="w-3.5 h-3.5" />
                Launch Bible Journey Map
              </button>
              {/* SECONDARY: scroll to features */}
              <button
                onClick={scrollToFeatures}
                className={`w-full sm:w-auto px-7 py-3.5 rounded-xl text-xs font-bold uppercase tracking-wide border transition-all cursor-pointer ${
                  theme === 'dark'
                    ? 'bg-slate-900/40 hover:bg-slate-850/60 text-slate-350 border-slate-800'
                    : 'bg-white hover:bg-stone-50 text-slate-700 border-stone-200 shadow-xs'
                }`}
              >
                See Features
              </button>
            </div>

            {/* Brand Promise Mini Tag */}
            <div className="mt-8 flex items-center gap-2 opacity-80">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span className={`text-[11px] font-mono font-bold uppercase tracking-wider ${
                theme === 'dark' ? 'text-slate-400' : 'text-slate-500'
              }`}>
                Interactive maps · AI chat · Video stories — live now
              </span>
            </div>
          </motion.div>

          {/* Right Side: Creative Floating Product Preview */}
          <div className="lg:col-span-7 relative h-[480px] sm:h-[540px] flex items-center justify-center">
            
            {/* Background ambient radial glow */}
            <div className="absolute inset-0 bg-[#0B192C]/5 rounded-3xl blur-2xl pointer-events-none" />

            {/* Central Phone/Tablet Mockup Frame */}
            <div className={`relative w-[230px] h-[450px] rounded-[36px] p-2.5 shadow-2xl z-10 transition-all border-[6px] ${
              theme === 'dark'
                ? 'bg-gradient-to-b from-[#0F2027] to-[#203A43] border-slate-850'
                : 'bg-gradient-to-b from-slate-50 to-slate-100 border-slate-300'
            }`}>
              {/* Inner screen content */}
              <div className={`w-full h-full rounded-[28px] overflow-hidden relative flex flex-col items-center justify-between p-4 ${
                theme === 'dark' ? 'bg-[#0B192C]' : 'bg-white'
              }`}>
                {/* Phone Speaker Notch */}
                <div className="w-[80px] h-3 bg-[#0B192C]/80 border-slate-800 border rounded-full relative z-20" />

                {/* Simulated Screen Body - Ambient layout */}
                <div className="w-full flex-1 flex flex-col justify-center items-center mt-4">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-3 ${
                    theme === 'dark' ? 'bg-amber-400/10 text-amber-500' : 'bg-blue-50 text-blue-600'
                  }`}>
                    <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
                      <path d="M11 2h2v7h5v2h-5v11h-2v-11h-5v-2h5V2z" />
                    </svg>
                  </div>
                  <p className={`font-display font-black text-sm tracking-tight mb-1 ${
                    theme === 'dark' ? 'text-white' : 'text-[#0B192C]'
                  }`}>
                    SabAI Bible
                  </p>
                  <p className={`text-[9px] font-bold uppercase tracking-widest text-[#ca8a04]`}>
                    Read, Ask, Visualize
                  </p>

                  <div className={`mt-6 w-full p-2.5 rounded-lg border text-left flex flex-col gap-1 ${
                    theme === 'dark' ? 'bg-[#0A192C] border-slate-800' : 'bg-slate-50 border-slate-150'
                  }`}>
                    <div className="w-4 h-1 rounded-sm bg-blue-500 mb-1" />
                    <span className={`text-[8px] font-mono leading-relaxed block ${
                      theme === 'dark' ? 'text-slate-400' : 'text-slate-500'
                    }`}>
                      "One verse can become an interactive learning journey."
                    </span>
                  </div>
                </div>

                {/* Simulated Tab Bar inside mockup */}
                <div className={`w-full flex items-center justify-around py-2 border-t mt-4 text-[9px] font-bold ${
                  theme === 'dark' ? 'border-slate-800 text-slate-400' : 'border-slate-100 text-slate-500'
                }`}>
                  <span className="text-blue-500">Home</span>
                  <span>Read</span>
                  <span>Chat</span>
                  <span>Visualize</span>
                </div>
              </div>
            </div>

            {/* CARD 1: AI Bible Chat (Top-Left) */}
            <motion.div 
              className={`absolute top-4 left-0 sm:-left-3 z-20 w-[180px] sm:w-[210px] p-3 rounded-2xl shadow-xl text-left border ${
                theme === 'dark'
                  ? 'bg-[#153051] border-slate-800 text-white'
                  : 'bg-white border-blue-100 text-slate-800'
              }`}
              initial={{ x: -40, y: -20, opacity: 0 }}
              animate={{ x: 0, y: 0, opacity: 1 }}
              transition={{ delay: 0.1, duration: 0.6 }}
            >
              <div className="flex items-center gap-1.5 mb-1.5 text-blue-500">
                <MessageSquare className="w-3.5 h-3.5" />
                <span className="text-[9px] font-bold uppercase tracking-wider font-mono">
                  AI Bible Chat
                </span>
              </div>
              <p className={`text-[10px] font-extrabold mb-1.5 ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                &ldquo;Explain Philippians 4:13&rdquo;
              </p>
              <div className={`p-1.5 rounded-lg text-[9px] leading-relaxed transition-colors ${
                theme === 'dark' ? 'bg-slate-950/40 text-slate-300' : 'bg-slate-50 text-slate-650'
              }`}>
                This verse speaks of resilience through divine empowerment, not ego-driven conquest. Under the grace...
              </div>
            </motion.div>

            {/* CARD 2: Daily Verse (Top-Right) */}
            <motion.div 
              className={`absolute top-8 right-0 sm:-right-4 z-20 w-[170px] sm:w-[200px] p-3 rounded-2xl shadow-xl text-left border ${
                theme === 'dark'
                  ? 'bg-[#15354F] border-slate-800 text-white'
                  : 'bg-white border-amber-100 text-slate-800'
              }`}
              initial={{ x: 40, y: -25, opacity: 0 }}
              animate={{ x: 0, y: 0, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.6 }}
            >
              <div className="flex items-center gap-1.5 mb-1.5 text-amber-500">
                <Sparkles className="w-3.5 h-3.5" />
                <span className="text-[9px] font-bold uppercase tracking-wider font-mono">
                  Verse of the Day
                </span>
              </div>
              <p className={`text-[10px] font-serif italic font-extrabold mb-1.5 leading-relaxed ${
                theme === 'dark' ? 'text-amber-150' : 'text-slate-850'
              }`}>
                &ldquo;I can do all things through Christ who strengthens me.&rdquo;
              </p>
              <span className="text-[8px] font-bold font-mono uppercase bg-amber-500/10 text-[#ca8a04] px-1.5 py-0.5 rounded">
                Philippians 4:13
              </span>
            </motion.div>

            {/* CARD 3: Visualize (Bottom-Left) */}
            <motion.div 
              className={`absolute bottom-6 left-0 sm:-left-6 z-20 w-[170px] sm:w-[190px] p-3 rounded-2xl shadow-xl text-left border ${
                theme === 'dark'
                  ? 'bg-[#122A42] border-slate-805 text-white'
                  : 'bg-white border-indigo-100 text-slate-800'
              }`}
              initial={{ x: -45, y: 30, opacity: 0 }}
              animate={{ x: 0, y: 0, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.6 }}
            >
              <div className="flex items-center gap-1.5 mb-1.5 text-indigo-500">
                <Map className="w-3.5 h-3.5" />
                <span className="text-[9px] font-bold uppercase tracking-wider font-mono">
                  Visualize Passages
                </span>
              </div>
              {/* Timeline Style preview */}
              <div className="flex items-center gap-1.5 my-2">
                <div className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                <div className="h-0.5 w-6 bg-indigo-200" />
                <div className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                <div className="h-0.5 w-6 bg-indigo-200" />
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              </div>
              <p className={`text-[10px] font-bold mb-0.5 ${theme === 'dark' ? 'text-slate-100' : 'text-slate-800'}`}>
                Turn Scripture into visual learning
              </p>
            </motion.div>

            {/* CARD 4: Study Plan (Bottom-Right) */}
            <motion.div 
              className={`absolute bottom-8 right-0 sm:-right-8 z-20 w-[180px] sm:w-[210px] p-3 rounded-2xl shadow-xl text-left border ${
                theme === 'dark'
                  ? 'bg-[#15344C] border-slate-800 text-white'
                  : 'bg-white border-blue-100'
              }`}
              initial={{ x: 45, y: 35, opacity: 0 }}
              animate={{ x: 0, y: 0, opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.6 }}
            >
              <div className="flex items-center gap-1.5 mb-1 text-slate-500">
                <BookOpen className="w-3.5 h-3.5" />
                <span className="text-[9px] font-bold uppercase tracking-wider font-mono text-blue-500">
                  Study Plan
                </span>
              </div>
              <h4 className={`text-[10px] font-extrabold ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                Understanding the Life of Jesus
              </h4>
              
              {/* Progress Bar and text */}
              <div className="mt-2 text-left">
                <div className="flex justify-between text-[8px] font-bold font-mono text-slate-500 mb-0.5">
                  <span>PROGRESS</span>
                  <span>35%</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-1 relative overflow-hidden">
                  <div className="bg-amber-500 h-1 rounded-full text-left" style={{ width: '35%' }} />
                </div>
              </div>
            </motion.div>

          </div>

        </div>
      </div>
    </section>
  );
}
