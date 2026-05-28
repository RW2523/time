/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  Plus, Send, CheckCircle, Flame,
  BookMarked, Clipboard
} from 'lucide-react';
import { useTheme } from '../ThemeContext';

interface StudyPlanBuilderProps {
  onNotify: (msg: string) => void;
}

export default function StudyPlanBuilder({ onNotify }: StudyPlanBuilderProps) {
  const [planTitle, setPlanTitle] = useState('7-Day Walk in the Wilderness');
  const [ageGroup, setAgeGroup] = useState('Adult Ministry');
  const [bibleVersion, setBibleVersion] = useState('ESV');
  const [selectedTheme, setSelectedTheme] = useState('Sovereignty & Faith');
  const [daysCount, setDaysCount] = useState(7);
  const { theme } = useTheme();

  // Verse Basket
  const [verseBasket, setVerseBasket] = useState<string[]>([
    'Genesis 12:1', 'Hebrews 11:8', 'Exodus 14:14'
  ]);
  const [newVerse, setNewVerse] = useState('');

  // Sessional planners toggles
  const [selectedSessionResource, setSelectedSessionResource] = useState<{
    audio: boolean;
    quiz: boolean;
    video: boolean;
    report: boolean;
  }>({
    audio: true,
    quiz: true,
    video: false,
    report: true
  });

  // Invitation
  const [inviteEmail, setInviteEmail] = useState('');
  const [invitedEmailsList, setInvitedEmailsList] = useState<string[]>([
    'pastor.jared@faithfellowship.org', 'clara.m@sundayschool.net'
  ]);

  const recommendedVersesOptions = [
    'James 1:5 (Wisdom)',
    'Romans 8:28 (Purpose)',
    'Isaiah 40:31 (Strength)',
    'Proverbs 3:5 (Trust)',
    'Joshua 1:9 (Courage)'
  ];

  const handleAddVerseToBasket = (v: string) => {
    if (verseBasket.includes(v)) {
      setVerseBasket(verseBasket.filter((x) => x !== v));
      onNotify(`Removed '${v}' from Verse Basket.`);
    } else {
      setVerseBasket([...verseBasket, v]);
      onNotify(`Added '${v}' to Verse Basket.`);
    }
  };

  const handleCustomVerseAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newVerse.trim()) return;
    if (verseBasket.includes(newVerse.trim())) {
      onNotify('Verse already in basket.');
      return;
    }
    setVerseBasket([...verseBasket, newVerse.trim()]);
    onNotify(`Added custom verse '${newVerse.trim()}' to verse basket.`);
    setNewVerse('');
  };

  const handleSendInvite = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteEmail.trim() || !inviteEmail.includes('@')) {
      onNotify('Please enter a valid email address.');
      return;
    }
    setInvitedEmailsList([...invitedEmailsList, inviteEmail.trim()]);
    onNotify(`Sent study plan session invitation code to: ${inviteEmail.trim()}`);
    setInviteEmail('');
  };

  const handleGenerateFullPlan = () => {
    onNotify(`Successfully compiled study program! "${planTitle}" (${daysCount} Days) is deployed completely with ${verseBasket.length} verses.`);
  };

  return (
    <div className="w-full relative transition-colors duration-500 text-left">
      
      {/* Builder Content */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start pt-2">
        
        {/* LHS Config Panel */}
        <div className={`lg:col-span-5 border rounded-2xl p-5 sm:p-6 space-y-6 shadow-sm transition-colors duration-500 ${
          theme === 'dark' ? 'bg-[#030712] border-slate-850' : 'bg-white border-stone-202'
        }`}>
          <div className={`flex items-center gap-2.5 border-b pb-3 transition-colors ${
            theme === 'dark' ? 'border-slate-805' : 'border-stone-150'
          }`}>
            <Clipboard className={`w-5 h-5 ${theme === 'dark' ? 'text-gold-400' : 'text-[#b45309]'}`} />
            <h3 className={`font-display font-bold text-xs uppercase tracking-wider ${
              theme === 'dark' ? 'text-slate-205' : 'text-stone-800'
            }`}>
              Plan Setup Console
            </h3>
          </div>

          {/* Inputs */}
          <div className="space-y-4">
            <div>
              <label className={`block text-[10px] font-bold uppercase tracking-wider mb-1.5 ${
                theme === 'dark' ? 'text-slate-400' : 'text-stone-500'
              }`}>
                Study Campaign Name
              </label>
              <input
                type="text"
                value={planTitle}
                onChange={(e) => setPlanTitle(e.target.value)}
                className={`w-full border rounded-xl px-3.5 py-2.5 text-xs focus:outline-none transition-colors font-bold ${
                  theme === 'dark'
                    ? 'bg-slate-900 border-slate-800 text-white focus:border-gold-400'
                    : 'bg-stone-50 border-stone-200 text-stone-850 focus:border-amber-500'
                }`}
                placeholder="e.g. Walking in Obedience"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={`block text-[10px] font-bold uppercase tracking-wider mb-1.5 ${
                  theme === 'dark' ? 'text-slate-400' : 'text-stone-500'
                }`}>
                  Demographic Focus
                </label>
                <select
                  value={ageGroup}
                  onChange={(e) => setAgeGroup(e.target.value)}
                  className={`w-full border rounded-xl px-3 py-2.5 text-xs font-bold focus:outline-none transition-colors ${
                    theme === 'dark'
                      ? 'bg-slate-900 border-slate-800 text-slate-200 focus:border-gold-400'
                      : 'bg-white border-stone-200 text-stone-800 focus:border-amber-500'
                  }`}
                >
                  <option value="Adult Ministry" className={theme === 'dark' ? 'bg-slate-950 text-white' : 'bg-white text-stone-900'}>Adult Ministry</option>
                  <option value="Youth Fellowship" className={theme === 'dark' ? 'bg-slate-950 text-white' : 'bg-white text-stone-900'}>Youth Fellowship</option>
                  <option value="Young Professionals" className={theme === 'dark' ? 'bg-slate-950 text-white' : 'bg-white text-stone-900'}>Young Professionals</option>
                  <option value="Sunday School Kids" className={theme === 'dark' ? 'bg-slate-950 text-white' : 'bg-white text-stone-900'}>Sunday School Kids</option>
                </select>
              </div>

              <div>
                <label className={`block text-[10px] font-bold uppercase tracking-wider mb-1.5 ${
                  theme === 'dark' ? 'text-slate-400' : 'text-stone-500'
                }`}>
                  Translation
                </label>
                <select
                  value={bibleVersion}
                  onChange={(e) => setBibleVersion(e.target.value)}
                  className={`w-full border rounded-xl px-3 py-2.5 text-xs font-bold focus:outline-none transition-colors ${
                    theme === 'dark'
                      ? 'bg-slate-900 border-slate-800 text-slate-200 focus:border-gold-400'
                      : 'bg-white border-stone-200 text-stone-800 focus:border-amber-500'
                  }`}
                >
                  <option value="ESV" className={theme === 'dark' ? 'bg-slate-950 text-white' : 'bg-white text-stone-900'}>ESV (Standard English)</option>
                  <option value="NIV" className={theme === 'dark' ? 'bg-slate-950 text-white' : 'bg-white text-stone-900'}>NIV (New International)</option>
                  <option value="KJV" className={theme === 'dark' ? 'bg-slate-950 text-white' : 'bg-white text-stone-900'}>KJV (King James Version)</option>
                  <option value="NASB" className={theme === 'dark' ? 'bg-slate-950 text-white' : 'bg-white text-stone-900'}>NASB (New American)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Themes / Duration */}
          <div className="grid grid-cols-12 gap-4">
            <div className="col-span-8">
              <label className={`block text-[10px] font-bold uppercase tracking-wider mb-1.5 ${
                theme === 'dark' ? 'text-slate-400' : 'text-stone-500'
              }`}>
                Core Spiritual Theme Focus
              </label>
              <select
                value={selectedTheme}
                onChange={(e) => {
                  setSelectedTheme(e.target.value);
                  onNotify(`Updated study theme focus to: ${e.target.value}`);
                }}
                className={`w-full border rounded-xl px-3 py-2.5 text-xs font-bold focus:outline-none transition-colors ${
                  theme === 'dark'
                    ? 'bg-slate-900 border-slate-800 text-slate-200 focus:border-gold-400'
                    : 'bg-white border-stone-200 text-stone-800 focus:border-amber-500'
                }`}
              >
                <option value="Sovereignty & Faith" className={theme === 'dark' ? 'bg-slate-950 text-white' : 'bg-white text-stone-900'}>Sovereignty & Faith</option>
                <option value="Wisdom & Discernment" className={theme === 'dark' ? 'bg-slate-950 text-white' : 'bg-white text-stone-900'}>Wisdom & Discernment</option>
                <option value="Overcoming Spiritual Trials" className={theme === 'dark' ? 'bg-slate-950 text-white' : 'bg-white text-stone-900'}>Overcoming Trials</option>
                <option value="The Covenants of God" className={theme === 'dark' ? 'bg-slate-950 text-white' : 'bg-white text-stone-900'}>Covenants of God</option>
              </select>
            </div>

            <div className="col-span-4">
              <label className={`block text-[10px] font-bold uppercase tracking-wider mb-1.5 ${
                theme === 'dark' ? 'text-slate-400' : 'text-stone-500'
              }`}>
                Duration
              </label>
              <div className={`flex items-center border rounded-xl text-xs overflow-hidden h-[38px] transition-colors shadow-3xs ${
                theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-stone-200'
              }`}>
                <button
                  onClick={() => setDaysCount(Math.max(3, daysCount - 1))}
                  className={`flex-1 text-center py-2 font-extrabold transition cursor-pointer ${
                    theme === 'dark' ? 'hover:bg-slate-850 text-slate-350' : 'hover:bg-stone-100 text-stone-500'
                  }`}
                >
                  -
                </button>
                <span className={`w-10 text-center font-extrabold text-xs transition-colors ${
                  theme === 'dark' ? 'text-white' : 'text-stone-900'
                }`}>{daysCount}d</span>
                <button
                  onClick={() => setDaysCount(Math.min(30, daysCount + 1))}
                  className={`flex-1 text-center py-2 font-extrabold transition cursor-pointer ${
                    theme === 'dark' ? 'hover:bg-slate-850 text-slate-350' : 'hover:bg-stone-100 text-stone-500'
                  }`}
                >
                  +
                </button>
              </div>
            </div>
          </div>

          {/* Recommended Verses list */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className={`block text-[10px] font-bold uppercase tracking-wider ${
                theme === 'dark' ? 'text-slate-400' : 'text-stone-500'
              }`}>
                Select Pinned Passages
              </label>
              <span className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded border transition-colors ${
                theme === 'dark' 
                  ? 'bg-gold-400/10 text-gold-300 border-gold-400/20' 
                  : 'bg-amber-50 text-amber-802 border-amber-205'
              }`}>
                {verseBasket.length} IN BASKET
              </span>
            </div>
            
            <div className={`border rounded-xl p-3 max-h-36 overflow-y-auto space-y-1.5 shadow-3xs transition-colors ${
              theme === 'dark' ? 'bg-[#030712] border-slate-850' : 'bg-white border-stone-202'
            }`}>
              {recommendedVersesOptions.map((vOpt) => {
                const ref = vOpt.split(' (')[0];
                const isInBasket = verseBasket.includes(ref);
                return (
                  <div
                    key={vOpt}
                    onClick={() => handleAddVerseToBasket(ref)}
                    className={`flex items-center justify-between p-2 rounded-lg cursor-pointer text-xs transition-colors ${
                      isInBasket
                        ? theme === 'dark'
                          ? 'bg-gold-500/15 text-gold-300 border border-gold-400/30'
                          : 'bg-amber-100 text-amber-900 border border-amber-205'
                        : theme === 'dark'
                          ? 'bg-slate-900/40 hover:bg-[#060c1d] border border-slate-805 text-slate-300'
                          : 'bg-stone-50 hover:bg-stone-100 border border-stone-200 text-stone-700'
                    }`}
                  >
                    <span className="font-semibold">{vOpt}</span>
                    <span className={`text-[8px] font-extrabold px-1.5 py-0.5 rounded ${
                      isInBasket 
                        ? theme === 'dark' ? 'bg-gold-500 text-slate-950 font-black' : 'bg-amber-600 text-white' 
                        : theme === 'dark' ? 'bg-slate-800 text-slate-300' : 'bg-stone-200 text-stone-600'
                    }`}>
                      {isInBasket ? 'ADDED' : 'SELECT'}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Add Custom verse input */}
            <form onSubmit={handleCustomVerseAdd} className="mt-2.5 flex gap-2">
              <input
                type="text"
                value={newVerse}
                onChange={(e) => setNewVerse(e.target.value)}
                className={`flex-1 border rounded-xl px-3 py-2 text-xs focus:outline-none transition-colors ${
                  theme === 'dark'
                    ? 'bg-slate-900 border-slate-800 text-white focus:border-gold-400'
                    : 'bg-white border-stone-205 text-stone-900 focus:border-amber-500'
                }`}
                placeholder="e.g. Luke 11:1, Proverbs 4:23"
              />
              <button
                type="submit"
                className={`px-4 py-2 font-bold text-xs rounded-xl transition-colors shrink-0 cursor-pointer ${
                  theme === 'dark' ? 'bg-gold-550 text-slate-950 hover:bg-gold-600' : 'bg-stone-850 text-white hover:bg-stone-900'
                }`}
              >
                <Plus className="w-3.5 h-3.5 inline mr-1" /> Custom Verse
              </button>
            </form>
          </div>

          {/* Session Resources to Generate checkboxes */}
          <div>
            <label className={`block text-[10px] font-bold uppercase tracking-wider mb-2.5 ${
              theme === 'dark' ? 'text-slate-400' : 'text-stone-500'
              }`}>
              Generate Interactive Resources
            </label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { key: 'audio', label: 'AI Voice Meditations' },
                { key: 'quiz', label: 'Checkpoint Quiz' },
                { key: 'video', label: 'Visual Scene Cards' },
                { key: 'report', label: 'Assemblies Progress Log' }
              ].map((item) => {
                const check = selectedSessionResource[item.key as keyof typeof selectedSessionResource];
                return (
                  <button
                    key={item.key}
                    onClick={() => {
                      setSelectedSessionResource((prev) => ({
                        ...prev,
                        [item.key]: !prev[item.key as keyof typeof selectedSessionResource]
                      }));
                      onNotify(`Toggled ${item.label} resource generator.`);
                    }}
                    className={`flex items-center gap-2.5 p-2.5 rounded-lg border text-left text-xs transition cursor-pointer ${
                      check
                        ? theme === 'dark'
                          ? 'bg-gold-550/10 border-gold-400/40 text-gold-300 font-bold'
                          : 'bg-amber-100 border-amber-250 text-amber-850 font-bold'
                        : theme === 'dark'
                          ? 'bg-[#030712] border-slate-850 text-slate-455'
                          : 'bg-white border-stone-200 text-stone-500'
                    }`}
                  >
                    <div className={`w-3.5 h-3.5 rounded border flex items-center justify-center shrink-0 ${
                      check 
                        ? theme === 'dark' ? 'bg-gold-500 border-gold-500 text-slate-950' : 'bg-[#b45309] border-amber-800 text-white' 
                        : theme === 'dark' ? 'border-slate-700' : 'border-stone-300'
                    }`}>
                      {check && <div className={`w-1.5 h-1.5 rounded-full ${theme === 'dark' ? 'bg-slate-950' : 'bg-white'}`} />}
                    </div>
                    {item.label}
                  </button>
                );
              })}
            </div>
          </div>

          <button
            onClick={handleGenerateFullPlan}
            className={`w-full py-3.5 rounded-xl font-extrabold text-xs uppercase tracking-wider transition-all cursor-pointer shadow-sm ${
              theme === 'dark'
                ? 'bg-gradient-to-r from-amber-500 to-gold-550 hover:from-amber-600 hover:to-gold-600 text-slate-950'
                : 'bg-slate-900 hover:bg-slate-950 text-white'
            }`}
          >
            Compile study Program with AI
          </button>
        </div>

        {/* RHS SaaS Preview Output Dashboard Screen */}
        <div className={`lg:col-span-7 border rounded-2xl p-5 sm:p-6 space-y-6 shadow-md relative min-h-[500px] transition-colors duration-500 ${
          theme === 'dark' ? 'bg-[#060c1d] border-slate-805' : 'bg-white border-stone-202'
        }`}>
          
          {/* Header info bar */}
          <div className={`flex items-center justify-between border-b pb-4 transition-colors ${
            theme === 'dark' ? 'border-slate-805' : 'border-stone-105'
          }`}>
            <span className={`text-[10px] uppercase tracking-widest font-bold font-mono ${
              theme === 'dark' ? 'text-slate-400' : 'text-stone-450'
            }`}>
              GENERATION SCHEDULER MONITOR
            </span>
            <span className={`text-xs font-bold border px-3 py-1 rounded-lg font-mono transition-colors ${
              theme === 'dark' ? 'bg-slate-900 border-slate-800 text-gold-300' : 'bg-stone-50 border-stone-200 text-stone-800'
            }`}>
              {daysCount} Days Assigned • {ageGroup}
            </span>
          </div>

          {/* Generated results container */}
          <div className="space-y-4">
            <div className={`p-4 rounded-xl border transition-colors ${
              theme === 'dark' ? 'bg-slate-950/60 border-slate-805' : 'bg-stone-50 border-stone-200'
            }`}>
              <div className="flex justify-between items-start mb-2 leading-none">
                <span className={`text-[9px] font-mono font-bold border px-2 py-1 rounded transition-colors ${
                  theme === 'dark' 
                    ? 'bg-gold-500/10 text-gold-300 border-gold-505/20' 
                    : 'bg-amber-50 text-amber-850 border-amber-205'
                }`}>
                  THEMATIC STUDY SERIES
                </span>
                <span className={`text-[10px] font-mono font-bold uppercase ${
                  theme === 'dark' ? 'text-slate-500' : 'text-stone-405'
                }`}>{bibleVersion} TRANSLATION</span>
              </div>
              <h4 className={`text-lg font-display font-extrabold transition-colors ${
                theme === 'dark' ? 'text-white' : 'text-stone-900'
              }`}>
                {planTitle}
              </h4>
              <p className={`text-xs mt-1 transition-colors ${theme === 'dark' ? 'text-slate-400' : 'text-stone-500'}`}>
                Primary Study Objective: Exploring <span className={`font-bold ${theme === 'dark' ? 'text-gold-300' : 'text-stone-800'}`}>{selectedTheme}</span> contexts.
              </p>
            </div>

            {/* Day Schedules list */}
            <div className="space-y-3">
              <span className={`text-[9.5px] font-bold block uppercase tracking-wider mb-1 ${
                theme === 'dark' ? 'text-slate-500' : 'text-stone-450'
              }`}>
                PRESCRIBED DAILY CURRICULUM FILE
              </span>

              <div className={`p-4 rounded-xl border shadow-3xs transition-colors ${
                theme === 'dark' ? 'bg-slate-900/35 border-slate-805' : 'bg-stone-50 border-stone-200'
              }`}>
                <div className="flex justify-between items-center mb-2 leading-none">
                  <span className={`text-xs font-extrabold flex items-center gap-1.5 ${
                    theme === 'dark' ? 'text-white' : 'text-stone-850'
                  }`}>
                    <Flame className="w-4 h-4 text-amber-500 fill-amber-500" />
                    Day 1: Initiating Covenant Steps
                  </span>
                  <span className={`text-[9.5px] font-mono font-extrabold border px-2 py-0.5 rounded transition-colors ${
                    theme === 'dark' 
                      ? 'bg-emerald-950/40 text-emerald-305 border-emerald-900/20' 
                      : 'bg-emerald-50 text-emerald-800 border-emerald-100'
                  }`}>
                    DEPLOYED LIVE
                  </span>
                </div>
                
                {/* Selected Verses preview */}
                <div className="space-y-2 mt-3 text-left">
                  <div className={`p-3 rounded-lg border text-xs transition-colors ${
                    theme === 'dark' ? 'bg-[#030712] border-slate-805' : 'bg-white border-stone-200'
                  }`}>
                    <p className={`font-serif leading-relaxed italic ${theme === 'dark' ? 'text-slate-205' : 'text-stone-800'}`}>
                      &ldquo;Go from your country... to the land that I will show you.&rdquo;
                    </p>
                    <div className={`flex justify-between items-center mt-2 text-[9px] font-mono font-bold ${
                      theme === 'dark' ? 'text-slate-500' : 'text-stone-450'
                    }`}>
                      <span>ANCHOR CHAPTER: GENESIS 12:1</span>
                      <span>VERSION: {bibleVersion}</span>
                    </div>
                  </div>
                </div>

                {/* Generated resources pills */}
                <div className="mt-3 flex flex-wrap gap-2">
                  {selectedSessionResource.audio && (
                    <span className={`p-1 px-2 text-[8.5px] font-bold font-mono rounded border uppercase transition-colors ${
                      theme === 'dark' 
                        ? 'bg-purple-950/40 border-purple-900/30 text-purple-300' 
                        : 'bg-purple-50 border-purple-200 text-purple-800'
                    }`}>
                      🎧 Audio meditations configured
                    </span>
                  )}
                  {selectedSessionResource.quiz && (
                    <span className={`p-1 px-2 text-[8.5px] font-bold font-mono rounded border uppercase transition-colors ${
                      theme === 'dark' 
                        ? 'bg-emerald-950/40 border-emerald-900/30 text-emerald-300' 
                        : 'bg-emerald-50 border-emerald-200 text-emerald-850'
                    }`}>
                      ✏️ Quiz checklist generated
                    </span>
                  )}
                  {selectedSessionResource.video && (
                    <span className={`p-1 px-2 text-[8.5px] font-bold font-mono rounded border uppercase transition-colors ${
                      theme === 'dark' 
                        ? 'bg-pink-950/40 border-pink-900/30 text-pink-300' 
                        : 'bg-pink-50 border-pink-200 text-pink-850'
                    }`}>
                      🎬 Visual media configured
                    </span>
                  )}
                  {selectedSessionResource.report && (
                    <span className={`p-1 px-2 text-[8.5px] font-bold font-mono rounded border uppercase transition-colors ${
                      theme === 'dark' 
                        ? 'bg-blue-950/40 border-blue-900/30 text-blue-305' 
                        : 'bg-blue-50 border-blue-200 text-blue-802'
                    }`}>
                      📈 Progress tracking enables
                    </span>
                  )}
                </div>
              </div>

              {/* Simulated future days */}
              <div className={`p-3 border rounded-xl flex items-center justify-between text-xs transition-colors ${
                theme === 'dark' ? 'bg-[#030712]/60 border-slate-805 text-slate-300' : 'bg-stone-50 border-stone-200 text-stone-605'
              }`}>
                <span className="font-bold flex items-center gap-2">
                  <BookMarked className="w-3.5 h-3.5 text-stone-400" />
                  Day 2: Values evaluation (Passage: {verseBasket[1] || 'Hebrews 11:8'})
                </span>
                <span className={`text-[9.5px] font-mono font-bold ${theme === 'dark' ? 'text-slate-500' : 'text-stone-500'}`}>Checkpoints active</span>
              </div>

              <div className={`p-3 border rounded-xl flex items-center justify-between text-xs transition-colors ${
                theme === 'dark' ? 'bg-[#030712]/60 border-slate-805 text-slate-300' : 'bg-stone-50 border-stone-200 text-stone-605'
              }`}>
                <span className="font-bold flex items-center gap-2">
                  <BookMarked className="w-3.5 h-3.5 text-stone-400" />
                  Day 3: Crossing Bitter Springs (Passage: {verseBasket[2] || 'Exodus 14:14'})
                </span>
                <span className={`text-[9.5px] font-mono font-bold ${theme === 'dark' ? 'text-slate-500' : 'text-stone-500'}`}>Discussion template locked</span>
              </div>
            </div>
          </div>

          {/* Social Sharing Invite Module below */}
          <div className={`pt-4 border-t space-y-3.5 transition-colors ${theme === 'dark' ? 'border-slate-805' : 'border-stone-105'}`}>
            <span className={`text-[9.5px] font-bold block uppercase tracking-wider text-left ${
              theme === 'dark' ? 'text-slate-500' : 'text-stone-450'
            }`}>
              DISTRIBUTE STUDY MANIFESTS & INVITATION CODES
            </span>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Invite form */}
              <form onSubmit={handleSendInvite} className={`p-3 rounded-xl border flex flex-col justify-between transition-colors ${
                theme === 'dark' ? 'bg-slate-[#030712] border-slate-805' : 'bg-stone-50 border-stone-200'
              }`}>
                <p className={`text-[10px] leading-relaxed mb-2.5 text-left ${theme === 'dark' ? 'text-slate-400' : 'text-stone-500'}`}>
                  Transmit secure program invitations and codes directly to your cell group leader emails.
                </p>
                <div className="flex gap-1.5">
                  <input
                    type="text"
                    value={inviteEmail}
                    onChange={(e) => setInviteEmail(e.target.value)}
                    className={`flex-1 border rounded-lg px-2.5 py-1.5 text-xs focus:outline-none transition-colors ${
                      theme === 'dark'
                        ? 'bg-slate-900 border-slate-800 text-white focus:border-gold-400'
                        : 'bg-white border-stone-205 text-stone-900 focus:border-amber-500'
                    }`}
                    placeholder="pastor@example.com"
                  />
                  <button
                    type="submit"
                    className={`px-3.5 py-1.5 font-bold rounded-lg text-xs flex items-center justify-center transition-colors cursor-pointer ${
                      theme === 'dark' ? 'bg-gold-550 text-slate-950 hover:bg-gold-600' : 'bg-stone-850 text-white hover:bg-stone-900'
                    }`}
                  >
                    <Send className="w-3 h-3" />
                  </button>
                </div>
              </form>

              {/* Invited cohorts listed */}
              <div className={`p-3 rounded-xl border space-y-2 transition-colors ${
                theme === 'dark' ? 'bg-[#030712] border-slate-805' : 'bg-[#faf9f5] border-stone-200'
              }`}>
                <div className={`flex justify-between items-center text-[9px] font-mono font-bold leading-none ${
                  theme === 'dark' ? 'text-slate-405' : 'text-stone-455'
                }`}>
                  <span>COHORT INVITATIONS SENT</span>
                  <span className={theme === 'dark' ? 'text-gold-400' : 'text-[#b45309]'}>AWAITING CODES</span>
                </div>
                <div className="space-y-1.5 max-h-16 overflow-y-auto text-left whitespace-nowrap">
                  {invitedEmailsList.map((email) => (
                    <div key={email} className={`flex justify-between items-center text-[10px] px-2 py-1 rounded border transition-colors ${
                      theme === 'dark' 
                        ? 'bg-slate-900 border-slate-800 text-slate-205' 
                        : 'bg-white border-stone-150 text-stone-705 shadow-3xs'
                    }`}>
                      <span className="truncate mr-2 font-semibold">{email}</span>
                      <CheckCircle className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                    </div>
                  ))}
                </div>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
