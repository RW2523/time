/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useTheme } from '../ThemeContext';
import { 
  ScrollText, GraduationCap, Gamepad2, Heart, Sparkles,
  CheckCircle2, Flame, Star, Trash2, Plus, Volume2, ArrowRight,
} from 'lucide-react';

interface UserPersonasProps {
  onNotify: (msg: string) => void;
}

type PersonaId = 'pastor' | 'teacher' | 'student' | 'believer' | 'shared';

const personas: Record<PersonaId, {
  name: string; icon: React.ElementType; color: string; ringColor: string;
  tagline: string; features: string[];
}> = {
    pastor: {
    name: 'Pastor',
    icon: ScrollText,
    color: 'text-blue-500 bg-blue-500/10 border-blue-500/20',
    ringColor: 'border-blue-500',
    tagline: 'Compose sermons, scaffold outlines, and export pastoral handouts in minutes.',
    features: [
      'Sermon drafting workspace with rich outline compiler',
        'One-click "Structure My Sermon" template engine',
      'Resource cloud libraries (Drive, YouTube, PDF)',
      'Multi-format export — slide decks & PDF handouts',
    ],
    },
    teacher: {
      name: 'Teaching Mentor',
    icon: GraduationCap,
    color: 'text-amber-500 bg-amber-500/10 border-amber-500/20',
    ringColor: 'border-amber-500',
    tagline: 'Build structured syllabi, manage classrooms, and track group progress.',
    features: [
      'Study Plan Builder — 5-day / 10-session / custom models',
      'Safe group classrooms with secure join codes',
      'Student progress indicators & insights dashboard',
      'Curated teaching asset library for mentoring events',
    ],
    },
    student: {
      name: 'Student',
    icon: Gamepad2,
    color: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20',
    ringColor: 'border-emerald-500',
    tagline: 'Gamified Bible learning with quizzes, illustrated stories, and safe sharing.',
    features: [
      'Daily roadmap with custom learning goals',
      'Interactive Biblical trivia quiz games',
      'Kid-friendly illustrated narrative summaries',
      'Teacher-moderated safe peer discussion',
    ],
    },
    believer: {
    name: 'Believer',
    icon: Heart,
    color: 'text-purple-500 bg-purple-500/10 border-purple-500/20',
    ringColor: 'border-purple-500',
    tagline: 'Personal quiet time, chronological timelines, and devotional audio narration.',
    features: [
      'Chronological timeline maps & family lineage graphs',
      'Real-time community highlights with safe reactions',
      'Professional narration text-to-speech audio player',
    ],
    },
    shared: {
    name: 'Shared Core',
    icon: Sparkles,
    color: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20',
    ringColor: 'border-indigo-500',
    tagline: 'Universal modules accessible across every account type.',
    features: [
      'Secure passwordless auth & privacy protection',
      'Advanced Bible Reader — AI search, cross-refs, notebooks',
      'Companion Theology Chat powered by scholars',
      'Geographic route maps & history visualizations',
      'Fellowship reading plans with motivation streaks',
    ],
  },
};

export default function UserPersonas({ onNotify }: UserPersonasProps) {
  const { theme } = useTheme();
  const [active, setActive] = useState<PersonaId>('shared');

  // Pastor sandbox state
  const [sermonTopic, setSermonTopic] = useState('Hope in the Storm (Mark 4:35-41)');
  const [draftedSermon, setDraftedSermon] = useState<{ heading: string; points: string[] }[] | null>([
    { heading: 'I. The Unexpected Tempest', points: ['Storms occur even when we obey', 'Jesus tests relational dependency'] },
    { heading: 'II. Sovereign Peace Revealed', points: ['"Peace, be still!" — divine command', 'Faith over fear: character over comfort'] },
  ]);
  const [isBuilding, setIsBuilding] = useState(false);

  const buildSermon = () => {
    setIsBuilding(true); setDraftedSermon(null);
    onNotify(`Structuring sermon: "${sermonTopic}"`);
    setTimeout(() => {
      setIsBuilding(false);
      setDraftedSermon([
        { heading: 'I. Context of the Proclamation', points: [`Unpacking the theme: "${sermonTopic}"`, 'Historical & relational setting'] },
        { heading: 'II. Heart Call & Application', points: ['Surrendering anxiety to faith', 'Weekly application for home & work'] },
      ]);
      onNotify('Sermon outline ready.');
    }, 1200);
  };

  // Teacher sandbox state
  const [syllabusName, setSyllabusName] = useState('Davidic Leadership');
  const [days, setDays] = useState<5 | 10>(5);
  const [roster, setRoster] = useState(['Noah S.', 'Emma W.', 'Sophia K.', 'Lucas M.']);
  const [newMember, setNewMember] = useState('');
  const [syllabus, setSyllabus] = useState([
    { day: 'Day 1', topic: 'The Humble Shepherd (1 Sam 16:7)' },
    { day: 'Day 2', topic: 'Smooth Stones (1 Sam 17:40)' },
    { day: 'Day 3', topic: 'Courage of Conviction (1 Sam 17:45)' },
    { day: 'Day 4', topic: 'Faithful Friendship (1 Sam 18:3)' },
    { day: 'Day 5', topic: 'The Ascending King (2 Sam 5:4)' },
  ]);

  const rebuildSyllabus = () => {
    setSyllabus(Array.from({ length: days }, (_, i) => ({
      day: `Day ${i + 1}`,
      topic: `Unit ${i + 1}: ${syllabusName}`,
    })));
    onNotify('Syllabus rebuilt.');
  };

  // Student sandbox state
  const questions = [
    { q: 'How many stones did David pick from the stream?', opts: ['1', '3', '5', '12'], correct: 2, exp: '1 Samuel 17:40 — five smooth stones.' },
    { q: 'Where was Solomon\'s Temple built?', opts: ['Bethlehem', 'Jerusalem', 'Nazareth', 'Hebron'], correct: 1, exp: 'On Mount Moriah in Jerusalem.' },
  ];
  const [qIdx, setQIdx] = useState(0);
  const [chosen, setChosen] = useState<number | null>(null);
  const [score, setScore] = useState(0);

  const pick = (i: number) => {
    if (chosen !== null) return;
    setChosen(i);
    if (i === questions[qIdx].correct) setScore(s => s + 1);
    onNotify(i === questions[qIdx].correct ? 'Correct!' : 'Incorrect — see explanation.');
  };

  const nextQ = () => {
    setChosen(null);
    setQIdx(qi => (qi + 1) % questions.length);
  };

  // Believer sandbox state
  const milestones = [
    { era: '2000 BC', title: 'Abrahamic Covenant', ref: 'Gen 15:5', summary: 'Offspring like stars — Covenant of Grace initiated.' },
    { era: '1000 BC', title: 'Davidic Kingdom', ref: '2 Sam 7:16', summary: 'Eternal royal throne established under King David.' },
    { era: '60 AD', title: 'Pauline Epistles', ref: 'Phil 4:6', summary: 'Paul writes letters of joy from a Roman prison cell.' },
    { era: '95 AD', title: 'Patmos Revelation', ref: 'Rev 21:3', summary: 'John catalogs God dwelling physically among men.' },
  ];
  const [milestone, setMilestone] = useState(0);

  // Shared sandbox state
  const [lexiconVisible, setLexiconVisible] = useState(false);

  const sandbox: Record<PersonaId, React.ReactNode> = {
    pastor: (
      <div className="space-y-3">
        <div>
          <label className={`block text-[9px] font-bold uppercase tracking-wider mb-1 ${theme === 'dark' ? 'text-slate-500' : 'text-stone-400'}`}>
            Sermon Topic
          </label>
          <select
            value={sermonTopic}
            onChange={e => { setSermonTopic(e.target.value); setDraftedSermon(null); }}
            className={`w-full border rounded-xl px-3 py-2 text-xs focus:outline-none transition-colors ${
              theme === 'dark' ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-stone-200 text-stone-900'
            }`}
          >
            {['Hope in the Storm (Mark 4:35-41)', 'Living by Faith (Gen 12:1-4)', 'Smooth Stones (1 Sam 17:40)', 'Fellowship Unity (Acts 2:42-47)'].map(t => (
              <option key={t}>{t}</option>
            ))}
          </select>
        </div>
        <button
          onClick={buildSermon}
          disabled={isBuilding}
          className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-xs font-extrabold uppercase tracking-wider flex items-center justify-center gap-2 transition cursor-pointer"
        >
          {isBuilding ? <><span className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" /> Building…</> : <><Sparkles className="w-3.5 h-3.5" /> Structure My Sermon</>}
        </button>
        <div className={`rounded-xl border min-h-[100px] p-3 text-[11px] transition-colors ${
          theme === 'dark' ? 'bg-slate-950 border-slate-850' : 'bg-stone-50 border-stone-200'
        }`}>
          {draftedSermon ? draftedSermon.map((s, i) => (
            <div key={i} className="mb-2">
              <span className={`font-bold text-[10px] block ${theme === 'dark' ? 'text-blue-400' : 'text-blue-600'}`}>{s.heading}</span>
              {s.points.map((p, j) => <p key={j} className="text-slate-500 pl-2">· {p}</p>)}
            </div>
          )) : <p className="text-slate-500 text-center pt-6 text-[10px]">Awaiting scaffold…</p>}
        </div>
      </div>
    ),

    teacher: (
      <div className="space-y-3">
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className={`block text-[9px] font-bold uppercase tracking-wider mb-1 ${theme === 'dark' ? 'text-slate-500' : 'text-stone-400'}`}>Class Name</label>
            <input value={syllabusName} onChange={e => setSyllabusName(e.target.value)}
              className={`w-full border rounded-xl px-3 py-2 text-xs focus:outline-none transition-colors ${
                theme === 'dark' ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-stone-200 text-stone-900'
              }`} />
          </div>
          <div>
            <label className={`block text-[9px] font-bold uppercase tracking-wider mb-1 ${theme === 'dark' ? 'text-slate-500' : 'text-stone-400'}`}>Duration</label>
            <div className="flex gap-1.5">
              {([5, 10] as const).map(d => (
                <button key={d} onClick={() => setDays(d)}
                  className={`flex-1 py-2 rounded-xl text-xs font-bold border transition cursor-pointer ${
                    days === d ? 'bg-amber-500/10 text-amber-500 border-amber-500/40' : 'bg-transparent border-slate-300 dark:border-slate-700 text-slate-400'
                  }`}>
                  {d}-Day
                </button>
              ))}
            </div>
          </div>
        </div>
        <button onClick={rebuildSyllabus}
          className="w-full py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-[10px] font-extrabold uppercase tracking-wider transition cursor-pointer">
          Rebuild Plan
        </button>
        <div className="grid grid-cols-2 gap-2">
          <div className={`rounded-xl border p-2 max-h-[120px] overflow-y-auto space-y-1 ${
            theme === 'dark' ? 'border-slate-800' : 'border-stone-200'
          }`}>
            {syllabus.map((s, i) => (
              <div key={i} className={`text-[9.5px] px-2 py-1 rounded-lg ${
                theme === 'dark' ? 'bg-slate-900 text-slate-300' : 'bg-stone-50 text-stone-700'
              }`}>
                <span className="text-amber-500 font-bold">{s.day}</span> — {s.topic}
              </div>
            ))}
          </div>
          <div className={`rounded-xl border p-2 ${theme === 'dark' ? 'border-slate-800' : 'border-stone-200'}`}>
            <p className={`text-[9px] font-bold uppercase tracking-wider mb-1.5 ${theme === 'dark' ? 'text-slate-500' : 'text-stone-400'}`}>Roster ({roster.length})</p>
            <div className="space-y-1 max-h-[72px] overflow-y-auto mb-1.5">
              {roster.map((m, i) => (
                <div key={i} className="flex justify-between items-center text-[10px]">
                  <span className={theme === 'dark' ? 'text-slate-300' : 'text-stone-600'}>{m}</span>
                  <button onClick={() => setRoster(r => r.filter((_, j) => j !== i))} className="text-red-400 hover:text-red-600 cursor-pointer"><Trash2 className="w-2.5 h-2.5" /></button>
                </div>
              ))}
            </div>
            <div className="flex gap-1">
              <input value={newMember} onChange={e => setNewMember(e.target.value)} placeholder="Add name"
                className={`flex-1 border rounded-lg px-2 py-1 text-[9px] focus:outline-none ${
                  theme === 'dark' ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-stone-200 text-stone-900'
                }`} />
              <button onClick={() => { if (newMember.trim()) { setRoster(r => [...r, newMember.trim()]); setNewMember(''); } }}
                className="px-2 py-1 rounded-lg bg-slate-500/10 border border-slate-400/20 cursor-pointer">
                <Plus className="w-3 h-3 text-slate-400" />
              </button>
            </div>
          </div>
        </div>
      </div>
    ),

    student: (
      <div className="space-y-3">
        <div className={`flex justify-between items-center text-[9px] font-mono ${theme === 'dark' ? 'text-slate-500' : 'text-stone-400'}`}>
          <span>Question {qIdx + 1} of {questions.length}</span>
          <span className="text-emerald-500 font-extrabold flex items-center gap-1"><Flame className="w-3 h-3 fill-current" /> Score: {score}</span>
        </div>
        <p className={`text-sm font-extrabold leading-snug ${theme === 'dark' ? 'text-white' : 'text-stone-900'}`}>
          {questions[qIdx].q}
        </p>
        <div className="grid grid-cols-2 gap-2">
          {questions[qIdx].opts.map((opt, i) => {
            const isCorrect = i === questions[qIdx].correct;
            const isChosen = chosen === i;
            let cls = theme === 'dark'
              ? 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-850'
              : 'bg-white border-stone-200 text-stone-700 hover:bg-stone-50';
            if (chosen !== null) {
              if (isCorrect) cls = 'bg-emerald-500/10 border-emerald-500 text-emerald-600 font-bold';
              else if (isChosen) cls = 'bg-red-500/10 border-red-500 text-red-500';
              else cls = 'opacity-30 border-transparent text-slate-400';
            }
            return (
              <button key={i} onClick={() => pick(i)} disabled={chosen !== null}
                className={`p-2.5 rounded-xl border text-left text-xs transition-all cursor-pointer ${cls}`}>
                {opt}
              </button>
            );
          })}
        </div>
        {chosen !== null && (
          <div className={`rounded-xl p-3 text-[10.5px] leading-relaxed border ${
            chosen === questions[qIdx].correct
              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-600'
              : 'bg-amber-500/10 border-amber-500/30 text-amber-600'
          }`}>
            {questions[qIdx].exp}
            <button onClick={nextQ} className="block mt-2 font-extrabold text-[10px] uppercase tracking-wider cursor-pointer">
              Next →
            </button>
          </div>
        )}
      </div>
    ),

    believer: (
      <div className="space-y-2">
        {milestones.map((m, i) => (
          <button key={i} onClick={() => setMilestone(i)}
            className={`w-full flex items-center gap-3 p-3 rounded-xl border text-left transition-all cursor-pointer ${
              milestone === i
                ? 'border-purple-500 bg-purple-500/10'
                : theme === 'dark' ? 'border-slate-800 bg-slate-900/40 hover:border-slate-700' : 'border-stone-200 bg-stone-50 hover:bg-white'
            }`}>
            <span className={`text-[8px] font-mono font-bold px-2 py-0.5 rounded border shrink-0 ${
              milestone === i ? 'bg-purple-500 text-white border-purple-400' : theme === 'dark' ? 'bg-slate-800 text-slate-400 border-transparent' : 'bg-stone-100 text-stone-400 border-transparent'
            }`}>{m.era}</span>
            <div className="flex-1 min-w-0">
              <p className={`text-[11px] font-extrabold truncate ${milestone === i ? 'text-purple-400' : theme === 'dark' ? 'text-slate-300' : 'text-stone-700'}`}>{m.title}</p>
              {milestone === i && <p className="text-[10px] text-slate-500 mt-0.5 leading-snug">{m.summary}</p>}
            </div>
            <span className="text-[9px] font-mono text-slate-500 shrink-0">{m.ref}</span>
          </button>
        ))}
        <div className={`flex items-center justify-between mt-1 px-1 py-2`}>
          <span className={`text-[9px] font-mono ${theme === 'dark' ? 'text-slate-500' : 'text-stone-400'}`}>Selected: {milestones[milestone].title}</span>
          <button onClick={() => onNotify(`Narrating: ${milestones[milestone].title}`)}
            className="flex items-center gap-1.5 text-[9px] font-mono font-bold text-purple-400 hover:text-purple-300 cursor-pointer">
            <Volume2 className="w-3 h-3" /> Listen
          </button>
        </div>
      </div>
    ),

    shared: (
      <div className="space-y-3">
        <div className="grid grid-cols-2 gap-2">
          {(['ESV', 'KJV'] as const).map(version => (
            <div key={version} className={`p-3 rounded-xl border text-left ${
              theme === 'dark' ? 'bg-slate-950 border-slate-800' : 'bg-white border-stone-200'
            }`}>
              <div className={`flex justify-between items-center border-b pb-1.5 mb-2 text-[8px] font-mono font-bold ${
                theme === 'dark' ? 'border-slate-800 text-slate-500' : 'border-stone-100 text-stone-400'
              }`}>
                <span>{version}</span><span>Phil 4:6</span>
              </div>
              <p className={`text-[10.5px] leading-relaxed font-serif ${theme === 'dark' ? 'text-slate-200' : 'text-stone-800'}`}>
                {version === 'ESV'
                  ? <>do not be{' '}<button onClick={() => setLexiconVisible(v => !v)} className="bg-indigo-500/10 text-indigo-400 px-1 rounded underline decoration-dashed font-bold cursor-pointer">anxious</button>{' '}about anything…</>
                  : <>Be{' '}<button onClick={() => setLexiconVisible(v => !v)} className="bg-indigo-500/10 text-indigo-400 px-1 rounded underline decoration-dashed font-bold cursor-pointer">careful</button>{' '}for nothing…</>}
              </p>
            </div>
          ))}
        </div>
        <AnimatePresence>
          {lexiconVisible && (
            <motion.div
              initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 8 }}
              className={`p-3 rounded-xl border ${
                theme === 'dark' ? 'bg-indigo-500/5 border-indigo-500/20' : 'bg-indigo-50 border-indigo-200'
              }`}>
              <div className="flex justify-between items-start mb-1">
                <span className={`text-[9px] font-mono font-black ${theme === 'dark' ? 'text-indigo-400' : 'text-indigo-600'}`}>
                  μεριμνάω (merimnao)
                </span>
                <button onClick={() => setLexiconVisible(false)} className="text-[8px] font-mono text-slate-400 hover:text-slate-200 cursor-pointer">✕ close</button>
              </div>
              <p className={`text-[10px] leading-relaxed ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
                From <em>merizo</em> — to divide or pull in different directions. Captures an anxious state that splits attention and paralyzes trust in Providence.
              </p>
            </motion.div>
          )}
        </AnimatePresence>
        <p className={`text-[9px] font-mono ${theme === 'dark' ? 'text-slate-600' : 'text-stone-400'}`}>
          Click the highlighted word to open the Greek lexicon.
        </p>
      </div>
    ),
  };

  const persona = personas[active];

  return (
    <section id="persona-universe" className={`py-20 relative overflow-hidden transition-colors duration-500 border-b ${
      theme === 'dark' ? 'bg-[#0B192C] border-slate-800' : 'bg-white border-stone-150'
    }`}>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* Header */}
        <div className="text-center mb-10">
          <span className={`text-[10px] font-extrabold font-mono tracking-[4px] uppercase block mb-3 ${
            theme === 'dark' ? 'text-amber-400' : 'text-blue-600'
          }`}>
            INTERACTIVE PLATFORM UNIVERSE
          </span>
          <h2 className={`font-display font-black text-3xl sm:text-4xl leading-tight ${
            theme === 'dark' ? 'text-white' : 'text-[#0B192C]'
          }`}>
            Four Personas. One Connected Core.
          </h2>
          <p className={`mt-3 text-sm max-w-xl mx-auto leading-relaxed ${
            theme === 'dark' ? 'text-slate-400' : 'text-slate-500'
          }`}>
            Click a role to see its exclusive features and try a live sandbox.
          </p>
        </div>

        {/* Persona tab pills */}
        <div className={`flex flex-wrap justify-center gap-2 p-1.5 rounded-2xl border mb-8 ${
          theme === 'dark' ? 'bg-slate-950/60 border-slate-800' : 'bg-stone-50 border-stone-200'
        }`}>
          {(Object.keys(personas) as PersonaId[]).map(pid => {
            const p = personas[pid];
            const Icon = p.icon;
            const isActive = active === pid;
            return (
              <button
                key={pid}
                onClick={() => setActive(pid)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                  isActive
                    ? theme === 'dark' ? 'bg-slate-800 text-white border-slate-700 shadow-sm' : 'bg-white text-slate-900 border-stone-300 shadow-sm'
                    : theme === 'dark' ? 'text-slate-400 border-transparent hover:bg-slate-900/60 hover:text-slate-200' : 'text-stone-500 border-transparent hover:bg-white hover:text-stone-800'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 shrink-0 ${isActive ? p.color.split(' ')[0] : 'text-slate-400'}`} />
                {p.name}
                  </button>
                );
              })}
            </div>

        {/* Unified card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className={`rounded-3xl border overflow-hidden ${
              theme === 'dark' ? 'border-slate-800 bg-[#060c1d]' : 'border-stone-200 bg-white shadow-sm'
            }`}
          >
            {/* Card header bar */}
            <div className={`flex items-center gap-3 px-6 py-4 border-b ${
              theme === 'dark' ? 'border-slate-800 bg-slate-950/40' : 'border-stone-100 bg-stone-50'
            }`}>
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center border ${persona.color}`}>
                <persona.icon className="w-4 h-4 stroke-[2]" />
              </div>
              <div>
                <span className={`text-sm font-extrabold font-display ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                  {persona.name}
              </span>
                <span className={`block text-[10px] font-mono mt-0.5 ${theme === 'dark' ? 'text-slate-500' : 'text-stone-400'}`}>
                  {persona.tagline}
                </span>
              </div>
            </div>

            {/* Content: features left, sandbox right */}
            <div className="grid grid-cols-1 lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x divide-stone-100 dark:divide-slate-800">

              {/* Left: feature checklist */}
              <div className="p-6 flex flex-col gap-4">
                <span className={`text-[9px] font-mono font-extrabold uppercase tracking-widest ${
                  theme === 'dark' ? 'text-slate-500' : 'text-stone-400'
                }`}>
                  {active === 'shared' ? 'Shared Core Stack' : 'Exclusive Functions'}
              </span>
                <div className="space-y-2.5">
                  {persona.features.map((feat, i) => (
                    <div key={i} className={`flex items-start gap-3 p-3 rounded-2xl border transition-colors ${
                      theme === 'dark' ? 'bg-slate-950/40 border-slate-850 hover:border-slate-800' : 'bg-stone-50 border-stone-200 hover:bg-white'
                    }`}>
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5 stroke-[2.5]" />
                      <span className={`text-xs font-medium leading-relaxed ${
                        theme === 'dark' ? 'text-slate-300' : 'text-slate-700'
                      }`}>
                        {feat}
                      </span>
                    </div>
                  ))}
                </div>
                        </div>
                        
              {/* Right: live sandbox */}
              <div className={`p-6 ${theme === 'dark' ? 'bg-[#030a18]' : 'bg-stone-50/60'}`}>
                <span className={`text-[9px] font-mono font-extrabold uppercase tracking-widest block mb-4 ${
                  theme === 'dark' ? 'text-slate-500' : 'text-stone-400'
                }`}>
                  Live Sandbox
                </span>
                {sandbox[active]}
                  </div>

            </div>
          </motion.div>
        </AnimatePresence>

      </div>
    </section>
  );
}
