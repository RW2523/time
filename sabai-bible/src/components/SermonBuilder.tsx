/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { sermonOptions } from '../mockData';
import { SermonThemeOption } from '../types';
import {
  Mic, FileText, Download, Sparkles, RefreshCw,
  Image as ImageIcon, CheckCircle, Quote
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useTheme } from '../ThemeContext';

interface SermonBuilderProps {
  onNotify: (msg: string) => void;
}

export default function SermonBuilder({ onNotify }: SermonBuilderProps) {
  const [selectedPromptId, setSelectedPromptId] = useState('grace-truth');
  const [userNotesText, setUserNotesText] = useState(sermonOptions[0].roughNotes);
  const [customTitle, setCustomTitle] = useState(sermonOptions[0].title);
  const [customVerse, setCustomVerse] = useState(sermonOptions[0].suggestedVerses.join(', '));
  const [isCompiling, setIsCompiling] = useState(false);
  const [isListeningDictation, setIsListeningDictation] = useState(false);
  const { theme } = useTheme();

  // Active compiled item
  const [compiledSermon, setCompiledSermon] = useState<SermonThemeOption & {
    intro: string;
    points: string[];
    illustration: string;
    conclusion: string;
    application: string;
    suggestedImagePrompt: string;
  }>({
    id: 'grace-truth',
    title: 'Bridging Grace & Truth',
    roughNotes: sermonOptions[0].roughNotes,
    suggestedVerses: ['John 1:14', 'Ephesians 4:15', 'Romans 5:20'],
    reference: 'Ephesians & John',
    intro: 'In a world divided by polar extremes, we are continuously challenged to hold high values without alienating people. Grace and Truth are often modeled as opposing forces, but in Scripture they find perfect harmony.',
    points: [
      "The Pitfall of Compromise: Speaking Grace without Truth leads to sentimentality and spiritual compromise.",
      "The Pitfall of Condemnation: Speaking Truth without Grace turns holy words into an offensive weapon.",
      "The Divine Synthesis: Jesus Christ was declared 'full of grace and truth' (John 1:14). He neither compromised nor crushed."
    ],
    illustration: "An ancient stone archway has two distinct pillars standing on opposing sides of a creek. One is Grace; the other is Truth. Alone they fall inward. But once they join together with Christ as the cornerstone, each element works in mutual support to carry massive loads.",
    conclusion: "Let our communication never sacrifice holiness for acceptance, nor safety for correctness. Live at the intersection.",
    application: "Identify one difficult conversation you must hold this week. Spend 10 minutes plotting equal ratios of complete honesty (Truth) and total relational support (Grace).",
    suggestedImagePrompt: "A majestic marble archway uniting glowing pillars of light and soft amber over a calm historical brook, cinematic volumetric rays."
  });

  const handleSelectPresetPrompt = (preset: SermonThemeOption) => {
    setSelectedPromptId(preset.id);
    setUserNotesText(preset.roughNotes);
    setCustomTitle(preset.title);
    setCustomVerse(preset.suggestedVerses.join(', '));
    setIsCompiling(true);

    // Simulate exegesis compile delays
    setTimeout(() => {
      setIsCompiling(false);
      onNotify(`Finished compiling raw material: ${preset.title}`);
      
      if (preset.id === 'grace-truth') {
        setCompiledSermon({
          ...preset,
          intro: 'In a world divided by polar extremes, we are continuously challenged to hold high values without alienating people. Grace and Truth are often modeled as opposing forces, but in Scripture they find perfect harmony.',
          points: [
            "The Pitfall of Compromise: Speaking Grace without Truth leads to sentimentality and spiritual compromise.",
            "The Pitfall of Condemnation: Speaking Truth without Grace turns holy words into an offensive weapon.",
            "The Divine Synthesis: Jesus Christ was declared 'full of grace and truth' (John 1:14). He neither compromised nor crushed."
          ],
          illustration: "An ancient stone archway has two distinct pillars standing on opposing sides of a creek. One is Grace; the other is Truth. Alone they fall inward. But once they join together with Christ as the cornerstone, each element works in mutual support to carry massive loads.",
          conclusion: "Let our communication never sacrifice holiness for acceptance, nor safety for correctness. Live at the intersection.",
          application: "Identify one difficult conversation you must hold this week. Spend 10 minutes plotting equal ratios of complete honesty (Truth) and total relational support (Grace).",
          suggestedImagePrompt: "A majestic marble archway uniting glowing pillars of light and soft amber over a calm historical brook, cinematic volumetric rays."
        });
      } else if (preset.id === 'overcoming-fear') {
        setCompiledSermon({
          ...preset,
          intro: 'We are bombarded with continuous modern stressors: screens comparison, economic struggles, and private anxiety. Yet David stood before Goliath with absolute internal peace. Let us understand why.',
          points: [
            "Discarding Saul's Armor: Never fight spiritual battles with worldly formulas. Trying to play a character you are not will only restrict your movement.",
            "Selecting Smooth Stones: David selected stones from the brook—humble, raw elements shaped slowly by water and time. Trust quiet daily disciplines.",
            "Targeting the Forehead: The giant's armor left only one square inch exposed. God guides physical stones to precise coordinates when His glory is the motive."
          ],
          illustration: "Saul's heavy brass armor represents trying to act like someone you aren't. David has the courage to walk out in local garments because his actual armor is invisible yet supreme.",
          conclusion: "The giant before you is loud, but the Sovereign Lord behind you controls the orbits of the stars.",
          application: "Discard one worldly stress solution you have been trying to force. Pray for five minutes using King David's posture of total dependence.",
          suggestedImagePrompt: "A small smooth slate pebble resting on clean river reeds, with a massive shadow of a historical helmet falling silently over the scene."
        });
      } else {
        setCompiledSermon({
          ...preset,
          intro: 'Leaving comfortable regions is painful. God called Abraham out of prosperous Ur to wander into complete mystery. True faith is always active obedience, not stationary safety.',
          points: [
            "Giving Up the Known: To gain the Promise, we must sacrifice the safety of the past. Ur was secure, but dead in paganism.",
            "Traveling Without Sight: Hebrews 11 says Abraham left 'without knowing where he was going.' Faith trusts the Navigator, not the destination layout.",
            "Aligning the Footsteps: Faith is checked in daily kilometers walked, not theoretical map charts studied. Walk your daily trials obedience-by-obedience."
          ],
          illustration: "A ship captain sailing into a deep bank of morning fog doesn't turn back. Instead, they look strictly at the compass dial, making minor modifications hour-by-hour corresponding to proven coordinates.",
          conclusion: "Every great covenant begins with a terrifying step into an uncharted country. Walk with confidence.",
          application: "Write out what your personal 'comfortable Ur' represents today. Commit to taking one practical step toward God's calling outside it this weekend.",
          suggestedImagePrompt: "An ancient shepherd pointing a wooden staff toward a glowing golden path crossing high mountain ridges blanketed by morning fog."
        });
      }
    }, 1200);
  };

  const handleSimulateDictation = () => {
    setIsListeningDictation(true);
    onNotify("Simulating audio dictation... Speak your thoughts clearly.");
    
    setTimeout(() => {
      setIsListeningDictation(false);
      setUserNotesText((prev) => prev + "\n[Dictated thought]: Remember to emphasize that pastors must live what they preach first. Genuine character.");
      onNotify("Transcribed audio notes successfully!");
    }, 3000);
  };

  return (
    <div className="w-full relative transition-colors duration-500 text-left">
      
      {/* Preset Selections */}
      <div className="flex flex-wrap items-center justify-center gap-2.5 mb-8 text-center pt-2">
        <span className={`text-[10px] font-mono font-extrabold uppercase tracking-widest ${
          theme === 'dark' ? 'text-gold-450' : 'text-stone-500'
        }`}>
          WORKSPACE PRESETS:
        </span>
        {sermonOptions.map((opt) => (
          <button
            key={opt.id}
            onClick={() => handleSelectPresetPrompt(opt)}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer border ${
              selectedPromptId === opt.id
                ? theme === 'dark'
                  ? 'bg-gradient-to-r from-amber-500 to-gold-500 text-slate-950 border-gold-450 shadow-md scale-[1.01]'
                  : 'bg-[#b45309] text-white border-amber-800 shadow-md scale-[1.01]'
                : theme === 'dark'
                  ? 'bg-slate-900 border-slate-800 hover:bg-slate-850 text-slate-300'
                  : 'bg-white hover:bg-stone-50 border-stone-200 text-stone-700'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            {opt.title}
          </button>
        ))}
      </div>

      {/* Workspace Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        
        {/* LHS Input controls */}
        <div className={`lg:col-span-5 border rounded-2xl p-5 sm:p-6 space-y-5 flex flex-col justify-between shadow-sm transition-colors duration-500 ${
          theme === 'dark' ? 'bg-[#030712] border-slate-850' : 'bg-white border-stone-200'
        }`}>
          <div className="space-y-4">
            <div className={`flex justify-between items-center border-b pb-3 transition-colors ${
              theme === 'dark' ? 'border-slate-805' : 'border-stone-150'
            }`}>
              <div className="flex items-center gap-2">
                <Sparkles className={`w-4.5 h-4.5 ${theme === 'dark' ? 'text-gold-400' : 'text-amber-800'}`} />
                <h3 className={`font-display font-bold text-xs uppercase tracking-widest ${
                  theme === 'dark' ? 'text-slate-205' : 'text-stone-800'
                }`}>
                  INPUT COMPILATION CARDS
                </h3>
              </div>
              <span className={`text-[10px] font-mono font-bold ${theme === 'dark' ? 'text-slate-5005' : 'text-stone-450'}`}>
                DRAFT EDITOR ACTIVE
              </span>
            </div>

            {/* Title Input */}
            <div>
              <label className={`block text-[10px] font-bold uppercase tracking-wider mb-1.5 ${
                theme === 'dark' ? 'text-slate-400' : 'text-stone-500'
              }`}>
                Sermon Outline or Target Topic
              </label>
              <input
                type="text"
                value={customTitle}
                onChange={(e) => setCustomTitle(e.target.value)}
                className={`w-full border rounded-xl px-3.5 py-2.5 text-xs focus:outline-none transition-colors ${
                  theme === 'dark'
                    ? 'bg-slate-900 border-slate-800 text-white focus:border-gold-400'
                    : 'bg-stone-50 border-stone-200 text-stone-850 focus:border-amber-500'
                }`}
              />
            </div>

            {/* Anchor Scriptures */}
            <div>
              <label className={`block text-[10px] font-bold uppercase tracking-wider mb-1.5 ${
                theme === 'dark' ? 'text-slate-400' : 'text-stone-500'
              }`}>
                Suggested Anchor Scriptures
              </label>
              <input
                type="text"
                value={customVerse}
                onChange={(e) => setCustomVerse(e.target.value)}
                className={`w-full border rounded-xl px-3.5 py-2.5 text-xs focus:outline-none transition-colors ${
                  theme === 'dark'
                    ? 'bg-slate-900 border-slate-800 text-white focus:border-gold-400'
                    : 'bg-stone-50 border-stone-200 text-stone-850 focus:border-amber-500'
                }`}
                placeholder="e.g. Genesis 12:1, Hebrews 11:8"
              />
            </div>

            {/* Dictation notes */}
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className={`block text-[10px] font-bold uppercase tracking-wider ${
                  theme === 'dark' ? 'text-slate-400' : 'text-stone-500'
                }`}>
                  Rough Thoughts & Dictated Outlines
                </label>
                <button
                  onClick={handleSimulateDictation}
                  className={`flex items-center gap-1.5 text-[10px] font-bold px-2.5 py-1 rounded-lg transition-colors border cursor-pointer ${
                    isListeningDictation
                      ? 'bg-red-500 hover:bg-red-600 text-white border-red-500 animate-pulse'
                      : theme === 'dark'
                        ? 'bg-slate-900 hover:bg-slate-850 text-gold-300 border-slate-800'
                        : 'bg-stone-100 hover:bg-stone-200 text-stone-705 border-stone-200'
                  }`}
                >
                  <Mic className="w-3.5 h-3.5" />
                  {isListeningDictation ? 'Listening...' : 'Simulate Mic Dictate'}
                </button>
              </div>
              <textarea
                rows={6}
                value={userNotesText}
                onChange={(e) => setUserNotesText(e.target.value)}
                className={`w-full border rounded-xl p-3.5 text-xs leading-relaxed focus:outline-none font-sans font-semibold transition-colors ${
                  theme === 'dark'
                    ? 'bg-slate-900 border-slate-800 text-slate-205 focus:border-gold-400'
                    : 'bg-stone-50 border-stone-200 text-stone-700 focus:border-amber-500'
                }`}
                placeholder="Type or dictate your stream-of-consciousness sermon ideas..."
              />
            </div>
          </div>

          {/* Actions button */}
          <div className={`pt-4 border-t transition-colors ${theme === 'dark' ? 'border-slate-805' : 'border-stone-150'}`}>
            <button
              onClick={() => {
                setIsCompiling(true);
                setTimeout(() => {
                  setIsCompiling(false);
                  setCompiledSermon((prev) => ({
                    ...prev,
                    title: customTitle,
                    roughNotes: userNotesText,
                    suggestedVerses: customVerse.split(', ')
                  }));
                  onNotify(`AI compiled local custom notes: "${customTitle}"`);
                }, 1500);
              }}
              disabled={isCompiling}
              className={`w-full py-3 rounded-xl transition-all flex items-center justify-center gap-2 font-bold text-xs uppercase tracking-wider shadow-sm cursor-pointer ${
                theme === 'dark'
                  ? 'bg-gradient-to-r from-amber-500 to-gold-550 hover:from-amber-600 hover:to-gold-600 text-slate-950'
                  : 'bg-slate-900 hover:bg-slate-955 text-white'
              }`}
            >
              {isCompiling ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-current" />
                  AI Organizing sermon plans...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  Compile & Refine Sermon Blueprint
                </>
              )}
            </button>
          </div>
        </div>

        {/* RHS Outlines Preview */}
        <div className={`lg:col-span-7 border rounded-2xl p-5 sm:p-6 space-y-5 flex flex-col justify-between shadow-sm relative min-h-[500px] transition-colors duration-500 ${
          theme === 'dark' ? 'bg-[#060c1d] border-slate-805' : 'bg-white border-stone-202'
        }`}>
          {isCompiling && (
            <div className={`absolute inset-0 backdrop-blur-sm rounded-2xl z-30 flex flex-col items-center justify-center gap-3 transition-colors ${
              theme === 'dark' ? 'bg-[#060c1d]/95' : 'bg-white/95'
            }`}>
              <RefreshCw className={`w-10 h-10 animate-spin ${theme === 'dark' ? 'text-gold-400' : 'text-amber-802'}`} />
              <p className={`text-xs font-mono font-bold uppercase tracking-widest ${theme === 'dark' ? 'text-slate-100' : 'text-stone-850'}`}>
                AI Compiling sermon outlines...
              </p>
              <p className={`text-xs ${theme === 'dark' ? 'text-slate-450' : 'text-stone-550'}`}>
                Aligning theological exegesis and illustration.
              </p>
            </div>
          )}

          {/* Header info */}
          <div className={`flex justify-between items-center border-b pb-4 transition-colors ${
            theme === 'dark' ? 'border-slate-805' : 'border-stone-105'
          }`}>
            <div className="flex items-center gap-2">
              <FileText className={`w-4.5 h-4.5 ${theme === 'dark' ? 'text-gold-400' : 'text-amber-850'}`} />
              <span className={`text-[10px] font-mono font-bold uppercase tracking-widest ${
                theme === 'dark' ? 'text-slate-400' : 'text-stone-450'
              }`}>
                AI HOMILETICAL OUTPUT OUTLINE
              </span>
            </div>
            <span className={`text-[9.5px] px-2.5 py-0.5 rounded border font-mono font-extrabold ${
              theme === 'dark' 
                ? 'bg-emerald-950/40 text-emerald-350 border-emerald-900/30' 
                : 'bg-emerald-50 text-emerald-800 border-emerald-100'
            }`}>
              HOMILETICAL PLAN COMPILED
            </span>
          </div>

          {/* Content box */}
          <div className="flex-1 space-y-4 text-left max-h-[380px] overflow-y-auto pr-1">
            <div>
              <span className={`block text-[9.5px] font-mono font-bold ${theme === 'dark' ? 'text-slate-500' : 'text-stone-450'}`}>
                SERMON WORKING THEME TITLE
              </span>
              <h4 className={`text-xl font-display font-extrabold mt-1 transition-colors ${
                theme === 'dark' ? 'text-white' : 'text-stone-900'
              }`}>
                {compiledSermon.title}
              </h4>
              <div className="flex flex-wrap gap-1.5 mt-2.5">
                {compiledSermon.suggestedVerses.map((v) => (
                  <span key={v} className={`text-[9.5px] font-extrabold font-mono px-2 py-0.5 rounded border transition-colors ${
                    theme === 'dark' 
                      ? 'bg-gold-500/10 text-gold-300 border-gold-500/25' 
                      : 'bg-amber-50 text-amber-850 border-amber-205'
                  }`}>
                    📖 {v}
                  </span>
                ))}
                <span className={`text-[9.5px] font-extrabold font-mono px-2 py-0.5 rounded border uppercase transition-colors ${
                  theme === 'dark' ? 'bg-slate-900 text-slate-350 border-slate-800' : 'bg-stone-50 text-stone-700 border-stone-200'
                }`}>
                  Theme Context: {compiledSermon.reference}
                </span>
              </div>
            </div>

            {/* Introduction overview */}
            <div className={`p-4 rounded-xl border transition-colors ${
              theme === 'dark' ? 'bg-slate-950/60 border-slate-805' : 'bg-[#faf9f5] border-stone-200'
            }`}>
              <span className={`text-[9px] uppercase font-mono font-bold flex items-center gap-1.5 mb-1.5 ${
                theme === 'dark' ? 'text-gold-400' : 'text-amber-802'
              }`}>
                <Quote className="w-3.5 h-3.5" /> Exordium (Introduction) Outline
              </span>
              <p className={`text-xs leading-relaxed font-serif italic font-medium transition-colors ${
                theme === 'dark' ? 'text-slate-300' : 'text-stone-800'
              }`}>
                &ldquo;{compiledSermon.intro}&rdquo;
              </p>
            </div>

            {/* Body points */}
            <div className="space-y-2">
              <span className={`text-[9.5px] uppercase font-mono font-bold block ${
                theme === 'dark' ? 'text-slate-500' : 'text-stone-450'
              }`}>
                COHERENT HOMILETICAL DIVISIONS
              </span>
              {compiledSermon.points.map((pt, idx) => (
                <div key={idx} className={`p-3.5 border rounded-xl text-xs space-y-1 transition-colors ${
                  theme === 'dark' ? 'bg-slate-900/35 border-slate-805' : 'bg-stone-50 border-stone-202'
                }`}>
                  <div className={`flex items-center gap-1.5 font-bold ${theme === 'dark' ? 'text-gold-300' : 'text-amber-850'}`}>
                    <CheckCircle className={`w-3.5 h-3.5 ${theme === 'dark' ? 'text-gold-400' : 'text-[#b45309]'}`} />
                    <span>Pulpit Division {idx + 1}</span>
                  </div>
                  <p className={`leading-relaxed font-semibold ${theme === 'dark' ? 'text-slate-300' : 'text-stone-750'}`}>{pt}</p>
                </div>
              ))}
            </div>

            {/* Sermonic illustration */}
            <div className={`border p-4 rounded-xl transition-colors ${
              theme === 'dark' ? 'border-amber-400/20 bg-amber-400/5 text-gold-300' : 'bg-amber-50/50 border-amber-205 text-stone-850'
            }`}>
              <span className={`text-[10px] uppercase font-mono font-bold block mb-1 ${
                theme === 'dark' ? 'text-gold-400' : 'text-amber-850'
              }`}>
                PULPIT SERMET ILLUSTRATION EXAMPLE
              </span>
              <p className={`text-xs leading-relaxed font-semibold ${theme === 'dark' ? 'text-slate-305' : 'text-stone-655'}`}>
                {compiledSermon.illustration}
              </p>
            </div>

            {/* Slideshow screen suggestion */}
            <div className={`p-4 rounded-xl border flex items-start gap-3 transition-colors ${
              theme === 'dark' ? 'bg-slate-950/60 border-slate-805' : 'bg-[#faf9f5] border-stone-200'
            }`}>
              <div className={`w-10 h-10 rounded-lg border flex items-center justify-center shrink-0 mt-0.5 transition-colors ${
                theme === 'dark' ? 'bg-[#030712] border-slate-800 text-gold-400' : 'bg-white border-stone-200 text-[#b45309]'
              }`}>
                <ImageIcon className="w-4.5 h-4.5" />
              </div>
              <div>
                <span className={`text-[9px] font-mono font-bold uppercase tracking-wider block ${
                  theme === 'dark' ? 'text-slate-500' : 'text-stone-450'
                }`}>
                  SCREEN GRAPH SLIDE SUGGESTED LAYOUT
                </span>
                <p className={`text-[11px] font-mono italic mt-1 leading-relaxed ${
                  theme === 'dark' ? 'text-slate-300' : 'text-stone-705'
                }`}>
                  &ldquo;{compiledSermon.suggestedImagePrompt}&rdquo;
                </p>
                <button
                  onClick={() => onNotify("Generated custom slide illustration mockup canvas on system thread...")}
                  className={`text-[10px] font-bold flex items-center gap-1 mt-2 hover:underline cursor-pointer ${
                    theme === 'dark' ? 'text-gold-400' : 'text-amber-802'
                  }`}
                >
                  Retrieve Suggested Slide Image →
                </button>
              </div>
            </div>

            {/* Believers application */}
            <div className={`p-4 rounded-xl border transition-colors ${
              theme === 'dark' ? 'bg-emerald-950/10 border-emerald-800/20' : 'bg-emerald-50/50 border-emerald-105'
            }`}>
              <span className={`text-[10px] uppercase font-mono font-bold block mb-1 ${
                theme === 'dark' ? 'text-emerald-400' : 'text-emerald-800'
              }`}>
                CALL TO ACTION APPLICATION
              </span>
              <p className={`text-xs font-semibold leading-relaxed ${theme === 'dark' ? 'text-slate-305' : 'text-stone-655'}`}>
                {compiledSermon.application}
              </p>
            </div>
          </div>

          {/* Footers */}
          <div className={`pt-4 border-t flex flex-wrap items-center justify-between gap-3 transition-colors ${
            theme === 'dark' ? 'border-slate-805' : 'border-stone-150'
          }`}>
            <span className={`text-[11px] font-semibold ${theme === 'dark' ? 'text-slate-501' : 'text-stone-455'}`}>
              Draft structured safely. Select export options:
            </span>
            <div className="flex gap-2">
              <button
                onClick={() => onNotify(`Exporting "${compiledSermon.title}" as standard PPT Slideshow deck.`)}
                className={`px-4 py-2 border font-bold text-xs rounded-xl flex items-center gap-1.5 transition cursor-pointer ${
                  theme === 'dark'
                    ? 'bg-slate-900 hover:bg-slate-850 text-slate-300 border-slate-800'
                    : 'bg-white hover:bg-stone-50 text-stone-705 border-stone-202 shadow-2xs'
                }`}
              >
                Download Slides Deck
              </button>
              <button
                onClick={() => onNotify(`Compiling PDF pulpit manual layout for "${compiledSermon.title}".`)}
                className={`px-4 py-2 font-bold text-xs rounded-xl flex items-center gap-1.5 transition cursor-pointer shadow-sm ${
                  theme === 'dark'
                    ? 'bg-gold-550 hover:bg-gold-600 text-slate-950'
                    : 'bg-[#b45309] hover:bg-amber-800 text-white'
                }`}
              >
                Export PDF Handout
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
