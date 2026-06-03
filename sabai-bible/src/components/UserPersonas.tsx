/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useTheme } from '../ThemeContext';
import {
  ScrollText, GraduationCap, Heart, Sparkles,
  CheckCircle2, Volume2, Share2, FileText, Image, Video,
  Users, Megaphone, BookOpen, Plus, Trash2, ArrowRight,
} from 'lucide-react';

interface UserPersonasProps {
  onNotify: (msg: string) => void;
}

type PersonaId = 'pastor' | 'teacher' | 'believer';

const personas: Record<PersonaId, {
  name: string;
  icon: React.ElementType;
  color: string;
  ringColor: string;
  tagline: string;
  features: string[];
}> = {
  pastor: {
    name: 'Pastor',
    icon: ScrollText,
    color: 'text-blue-500 bg-blue-500/10 border-blue-500/20',
    ringColor: 'border-blue-500',
    tagline: 'Compose sermons, convert them to any format, and reach your congregation and beyond.',
    features: [
      'Sermon drafting workspace with AI outline builder',
      'One-click sermon → Image · Video · PDF · Text conversion',
      'Consolidated sermon library — organize, tag, and archive',
      'Promote pastor profile and content to congregation members',
      'Social media outreach — post sermons directly to platforms',
      'Export pastoral handouts and slide decks in minutes',
    ],
  },
  teacher: {
    name: 'Teaching Mentor',
    icon: GraduationCap,
    color: 'text-amber-500 bg-amber-500/10 border-amber-500/20',
    ringColor: 'border-amber-500',
    tagline: 'Build syllabi, manage classrooms, and guide believers toward deeper Scripture understanding.',
    features: [
      'Study Plan Builder — 5-day / 10-session / custom models',
      'Safe group classrooms with secure join codes',
      'Student progress indicators and insights dashboard',
      'Curated teaching asset library for mentoring sessions',
      'AI-assisted lesson prep from any scripture passage',
    ],
  },
  believer: {
    name: 'Believer',
    icon: Heart,
    color: 'text-purple-500 bg-purple-500/10 border-purple-500/20',
    ringColor: 'border-purple-500',
    tagline: 'Personal devotions, chronological journeys, and community connection — all in one place.',
    features: [
      'Chronological timeline maps and family lineage graphs',
      'Real-time community highlights and fellowship feed',
      'Professional AI narration and audio story player',
      'Advanced Bible Reader — AI search, cross-refs, notebooks',
      'Companion Theology Chat powered by scholarly context',
      'Geographic route maps and history visualizations',
    ],
  },
};

export default function UserPersonas({ onNotify }: UserPersonasProps) {
  const { theme } = useTheme();
  const [active, setActive] = useState<PersonaId>('pastor');

  // Pastor sandbox state
  const [sermonTopic, setSermonTopic] = useState('Hope in the Storm (Mark 4:35-41)');
  const [exportFormat, setExportFormat] = useState<'Image' | 'Video' | 'PDF' | 'Text'>('PDF');
  const [isExporting, setIsExporting] = useState(false);
  const [isBuilding, setIsBuilding] = useState(false);
  const [draftedSermon, setDraftedSermon] = useState<{ heading: string; points: string[] }[]>([
    { heading: 'I. The Unexpected Tempest', points: ['Storms occur even when we obey', 'Jesus tests relational dependency'] },
    { heading: 'II. Sovereign Peace Revealed', points: ['"Peace, be still!" — divine command', 'Faith over fear: character over comfort'] },
  ]);

  const buildSermon = () => {
    setIsBuilding(true);
    onNotify(`Structuring sermon: "${sermonTopic}"`);
    setTimeout(() => {
      setIsBuilding(false);
      setDraftedSermon([
        { heading: 'I. Context of the Proclamation', points: [`Unpacking: "${sermonTopic}"`, 'Historical and relational setting'] },
        { heading: 'II. Heart Call & Application', points: ['Surrendering anxiety to faith', 'Weekly application for home and community'] },
      ]);
      onNotify('Sermon outline ready.');
    }, 1200);
  };

  const handleExport = () => {
    setIsExporting(true);
    onNotify(`Converting sermon to ${exportFormat}…`);
    setTimeout(() => {
      setIsExporting(false);
      onNotify(`Sermon exported as ${exportFormat} — ready to share!`);
    }, 1500);
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

  // Believer sandbox state
  const milestones = [
    { era: '2000 BC', title: 'Abrahamic Covenant', ref: 'Gen 15:5', summary: 'Offspring like stars — Covenant of Grace initiated.' },
    { era: '1000 BC', title: 'Davidic Kingdom', ref: '2 Sam 7:16', summary: 'Eternal royal throne established under King David.' },
    { era: '60 AD', title: 'Pauline Epistles', ref: 'Phil 4:6', summary: 'Paul writes letters of joy from a Roman prison cell.' },
    { era: '95 AD', title: 'Patmos Revelation', ref: 'Rev 21:3', summary: 'John catalogs God dwelling physically among men.' },
  ];
  const [milestone, setMilestone] = useState(0);

  const formatIcons: Record<string, React.ElementType> = {
    Image, Video, PDF: FileText, Text: BookOpen,
  };

  const sandbox: Record<PersonaId, React.ReactNode> = {
    pastor: (
      <div className="space-y-3">
        {/* Sermon draft area */}
        <div>
          <label className={`block text-[9px] font-bold uppercase tracking-wider mb-1 ${theme === 'dark' ? 'text-slate-500' : 'text-stone-400'}`}>
            Sermon Topic
          </label>
          <select
            value={sermonTopic}
            onChange={e => { setSermonTopic(e.target.value); }}
            className={`w-full border rounded-xl px-3 py-2 text-xs focus:outline-none transition-colors cursor-pointer ${
              theme === 'dark' ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-stone-200 text-stone-900'
            }`}
          >
            {[
              'Hope in the Storm (Mark 4:35-41)',
              'Living by Faith (Gen 12:1-4)',
              'Smooth Stones (1 Sam 17:40)',
              'Fellowship Unity (Acts 2:42-47)',
            ].map(t => <option key={t}>{t}</option>)}
          </select>
        </div>
        <button
          onClick={buildSermon}
          disabled={isBuilding}
          className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-xs font-extrabold uppercase tracking-wider flex items-center justify-center gap-2 transition cursor-pointer"
        >
          {isBuilding
            ? <><span className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" /> Building…</>
            : <><Sparkles className="w-3.5 h-3.5" /> Structure My Sermon</>}
        </button>

        {/* Sermon outline */}
        <div className={`rounded-xl border min-h-[80px] p-3 text-[11px] transition-colors ${
          theme === 'dark' ? 'bg-slate-950 border-slate-800' : 'bg-stone-50 border-stone-200'
        }`}>
          {draftedSermon.map((s, i) => (
            <div key={i} className="mb-2">
              <span className={`font-bold text-[10px] block ${theme === 'dark' ? 'text-blue-400' : 'text-blue-600'}`}>{s.heading}</span>
              {s.points.map((p, j) => <p key={j} className="text-slate-500 pl-2">· {p}</p>)}
            </div>
          ))}
        </div>

        {/* Export / convert */}
        <div className={`rounded-xl border p-3 space-y-2 ${theme === 'dark' ? 'bg-slate-900/50 border-slate-800' : 'bg-blue-50/60 border-blue-100'}`}>
          <p className={`text-[9px] font-extrabold uppercase tracking-widest ${theme === 'dark' ? 'text-slate-400' : 'text-blue-600'}`}>
            Convert Sermon To
          </p>
          <div className="grid grid-cols-4 gap-1.5">
            {(['Image', 'Video', 'PDF', 'Text'] as const).map(fmt => {
              const Icon = formatIcons[fmt] || FileText;
              return (
                <button
                  key={fmt}
                  onClick={() => setExportFormat(fmt)}
                  className={`flex flex-col items-center gap-1 py-2 rounded-lg border text-[9px] font-bold transition cursor-pointer ${
                    exportFormat === fmt
                      ? theme === 'dark' ? 'bg-blue-600 border-blue-500 text-white' : 'bg-blue-600 border-blue-500 text-white'
                      : theme === 'dark' ? 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700' : 'bg-white border-stone-200 text-stone-500 hover:border-stone-300'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  {fmt}
                </button>
              );
            })}
          </div>
          <button
            onClick={handleExport}
            disabled={isExporting}
            className={`w-full py-2 rounded-xl text-[10px] font-extrabold uppercase tracking-wider flex items-center justify-center gap-2 transition cursor-pointer ${
              isExporting
                ? 'opacity-50 cursor-wait'
                : theme === 'dark' ? 'bg-emerald-600 hover:bg-emerald-500 text-white' : 'bg-emerald-600 hover:bg-emerald-500 text-white'
            }`}
          >
            {isExporting
              ? <><span className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" /> Exporting…</>
              : <><Share2 className="w-3 h-3" /> Export & Share as {exportFormat}</>}
          </button>
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
                  className={`flex-1 py-2 rounded-xl border text-xs font-bold transition cursor-pointer ${
                    days === d
                      ? 'bg-amber-500 border-amber-400 text-white'
                      : theme === 'dark' ? 'border-slate-800 text-slate-400 hover:border-slate-700' : 'border-stone-200 text-stone-500 hover:border-stone-300'
                  }`}>
                  {d}d
                </button>
              ))}
            </div>
          </div>
        </div>
        <button onClick={rebuildSyllabus}
          className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-white text-xs font-extrabold uppercase tracking-wider flex items-center justify-center gap-2 transition cursor-pointer">
          <Sparkles className="w-3.5 h-3.5" /> Build Syllabus
        </button>
        <div className={`rounded-xl border divide-y text-[11px] ${theme === 'dark' ? 'border-slate-800 divide-slate-800' : 'border-stone-200 divide-stone-100'}`}>
          {syllabus.slice(0, 3).map((s, i) => (
            <div key={i} className={`flex items-center gap-3 px-3 py-2 ${theme === 'dark' ? 'text-slate-300' : 'text-slate-700'}`}>
              <span className={`text-[8px] font-mono font-bold shrink-0 ${theme === 'dark' ? 'text-amber-400' : 'text-amber-600'}`}>{s.day}</span>
              <span className="truncate">{s.topic}</span>
            </div>
          ))}
          {syllabus.length > 3 && (
            <p className={`px-3 py-2 text-[9px] font-mono ${theme === 'dark' ? 'text-slate-600' : 'text-stone-400'}`}>
              +{syllabus.length - 3} more sessions
            </p>
          )}
        </div>
        <div>
          <p className={`text-[9px] font-bold uppercase tracking-wider mb-1.5 ${theme === 'dark' ? 'text-slate-500' : 'text-stone-400'}`}>Roster ({roster.length})</p>
          <div className="flex flex-wrap gap-1.5 mb-2">
            {roster.map((r, i) => (
              <span key={i} className={`flex items-center gap-1 px-2 py-0.5 rounded-full border text-[9px] font-bold ${
                theme === 'dark' ? 'border-slate-800 text-slate-300' : 'border-stone-200 text-stone-600'
              }`}>
                {r}
                <button onClick={() => { setRoster(rs => rs.filter((_, j) => j !== i)); onNotify(`Removed ${r}`); }} className="cursor-pointer">
                  <Trash2 className="w-2.5 h-2.5 text-slate-400 hover:text-rose-400" />
                </button>
              </span>
            ))}
          </div>
          <div className="flex gap-1.5">
            <input value={newMember} onChange={e => setNewMember(e.target.value)}
              placeholder="Add member name…"
              onKeyDown={e => { if (e.key === 'Enter' && newMember.trim()) { setRoster(r => [...r, newMember.trim()]); setNewMember(''); onNotify('Member added.'); }}}
              className={`flex-1 border rounded-xl px-3 py-1.5 text-xs focus:outline-none ${
                theme === 'dark' ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-stone-200 text-stone-900'
              }`} />
            <button onClick={() => { if (newMember.trim()) { setRoster(r => [...r, newMember.trim()]); setNewMember(''); onNotify('Member added.'); }}}
              className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-white cursor-pointer">
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    ),

    believer: (
      <div className="space-y-3">
        <p className={`text-[9px] font-bold uppercase tracking-wider mb-1 ${theme === 'dark' ? 'text-slate-500' : 'text-stone-400'}`}>
          Biblical Timeline
        </p>
        <div className="space-y-1.5">
          {milestones.map((m, i) => (
            <button key={i} onClick={() => { setMilestone(i); onNotify(`Selected: ${m.title}`); }}
              className={`w-full flex items-start gap-3 p-2.5 rounded-xl border text-left transition cursor-pointer ${
                milestone === i
                  ? theme === 'dark' ? 'bg-purple-500/10 border-purple-500/30' : 'bg-purple-50 border-purple-200'
                  : theme === 'dark' ? 'bg-slate-950/40 border-slate-800 hover:border-slate-700' : 'border-stone-200 bg-stone-50 hover:bg-white'
              }`}>
              <span className={`text-[8px] font-mono font-bold px-2 py-0.5 rounded border shrink-0 mt-0.5 ${
                milestone === i ? 'bg-purple-500 text-white border-purple-400' : theme === 'dark' ? 'bg-slate-800 text-slate-400 border-transparent' : 'bg-stone-100 text-stone-400 border-transparent'
              }`}>{m.era}</span>
              <div className="flex-1 min-w-0">
                <p className={`text-[11px] font-extrabold truncate ${milestone === i ? 'text-purple-400' : theme === 'dark' ? 'text-slate-300' : 'text-stone-700'}`}>{m.title}</p>
                {milestone === i && <p className="text-[10px] text-slate-500 mt-0.5 leading-snug">{m.summary}</p>}
              </div>
              <span className="text-[9px] font-mono text-slate-500 shrink-0">{m.ref}</span>
            </button>
          ))}
        </div>
        <button onClick={() => onNotify(`Narrating: ${milestones[milestone].title}`)}
          className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border text-xs font-bold transition cursor-pointer ${
            theme === 'dark' ? 'bg-purple-500/10 border-purple-500/20 text-purple-300 hover:bg-purple-500/20' : 'bg-purple-50 border-purple-200 text-purple-600 hover:bg-purple-100'
          }`}>
          <Volume2 className="w-3.5 h-3.5" /> Listen to AI Narration
        </button>
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
            BUILT FOR YOUR FAITH COMMUNITY
          </span>
          <h2 className={`font-display font-black text-3xl sm:text-4xl leading-tight ${
            theme === 'dark' ? 'text-white' : 'text-[#0B192C]'
          }`}>
            Already building for believers.
            <br />
            <span className={`${theme === 'dark' ? 'text-amber-400' : 'text-blue-600'}`}>
              Extending to Pastors & Mentors.
            </span>
          </h2>
          <p className={`mt-4 text-sm max-w-2xl mx-auto leading-relaxed ${
            theme === 'dark' ? 'text-slate-400' : 'text-slate-500'
          }`}>
            We are already building this application for shared believers — and we're growing to empower
            Pastors and Teaching Mentors who teach, preach, and reach people.
            Select a role to explore the features built for you.
          </p>

          {/* Mission pillars */}
          <div className="flex flex-wrap justify-center gap-3 mt-6">
            {[
              { icon: Heart, label: 'Believe', color: 'text-purple-500' },
              { icon: BookOpen, label: 'Teach', color: 'text-amber-500' },
              { icon: Megaphone, label: 'Preach', color: 'text-blue-500' },
              { icon: Users, label: 'Reach', color: 'text-emerald-500' },
            ].map(({ icon: Icon, label, color }) => (
              <div key={label} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-bold ${
                theme === 'dark' ? 'border-slate-800 text-slate-300' : 'border-stone-200 text-stone-600'
              }`}>
                <Icon className={`w-3.5 h-3.5 ${color}`} />
                {label}
              </div>
            ))}
          </div>
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
            {/* Card header */}
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
                  Exclusive Features
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
                  Live Preview
                </span>
                {sandbox[active]}
              </div>

            </div>

            {/* Footer CTA */}
            <div className={`flex items-center justify-between px-6 py-4 border-t ${
              theme === 'dark' ? 'border-slate-800 bg-slate-950/40' : 'border-stone-100 bg-stone-50'
            }`}>
              <p className={`text-xs ${theme === 'dark' ? 'text-slate-500' : 'text-stone-400'}`}>
                {active === 'pastor'
                  ? 'Sermons can be promoted to members and shared on social media.'
                  : active === 'teacher'
                  ? 'All believers have access to the shared core features.'
                  : 'Every believer gets the full shared core — timeline, chat, reader.'}
              </p>
              <button
                onClick={() => onNotify(`Requesting early access for ${persona.name}…`)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                  theme === 'dark' ? 'bg-slate-800 hover:bg-slate-700 text-white' : 'bg-[#0B192C] hover:bg-slate-800 text-white'
                }`}
              >
                Get Early Access <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </motion.div>
        </AnimatePresence>

      </div>
    </section>
  );
}
