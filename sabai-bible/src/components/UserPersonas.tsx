/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useTheme } from '../ThemeContext';
import { 
  Book, GraduationCap, ScrollText, Users, ArrowRight, Sparkles, 
  Lock, BookOpen, Map, Calendar, Gamepad2, Heart, Flame, Volume2, 
  ShieldCheck, CheckCircle2, ListChecks, Plus, Trash2, Send, Star, Play
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface UserPersonasProps {
  onNotify: (msg: string) => void;
}

type PersonaId = 'pastor' | 'teacher' | 'student' | 'believer' | 'shared';

export default function UserPersonas({ onNotify }: UserPersonasProps) {
  const { theme } = useTheme();
  const [activePersona, setActivePersona] = useState<PersonaId>('shared');

  // Sandbox states for Pastor
  const [sermonTopic, setSermonTopic] = useState('Hope in the Storm (Mark 4:35-41)');
  const [isStructuring, setIsStructuring] = useState(false);
  const [draftedSermon, setDraftedSermon] = useState<{
    title: string;
    sections: { heading: string; points: string[] }[];
  } | null>({
    title: 'Hope in the Storm (Mark 4:35-41)',
    sections: [
      { heading: 'I. The Unexpected Sudden Tempest', points: ['Storms occur even when we obey His direct command to cross over', 'Jesus is restfully sleeping, testing relational dependencies'] },
      { heading: 'II. The Revelation of Sovereign Peace', points: ['Quiet command: "Peace, be still!" controls kinetic molecular arrays', 'Faith vs Fear division: He cares more about character than simple comfort'] }
    ]
  });

  // Sandbox states for Teaching Mentor
  const [newSyllabusName, setNewSyllabusName] = useState('Davidic Leadership');
  const [syllabusDays, setSyllabusDays] = useState<5 | 10>(5);
  const [groupParticipants, setGroupParticipants] = useState<string[]>(['Noah S.', 'Emma W.', 'Sophia K.', 'Lucas M.']);
  const [newParticipant, setNewParticipant] = useState('');
  const [isGeneratingSyllabus, setIsGeneratingSyllabus] = useState(false);
  const [activeSyllabus, setActiveSyllabus] = useState<{ day: string; topic: string; activity: string }[]>([
    { day: 'Day 1', topic: 'The Humble Shepherd Boy (1 San 16:7)', activity: 'Interactive David puppet crafts & field games' },
    { day: 'Day 2', topic: 'The Smooth Brook Stones (1 Sam 17:40)', activity: 'Field stream pebble collection and memory painting' },
    { day: 'Day 3', topic: 'Courage of Conviction (1 Sam 17:45)', activity: 'Goliath visual obstacle course event' },
    { day: 'Day 4', topic: 'Faithful Friendship (1 Sam 18:3)', activity: 'Jonathan mutual covenants friendship craft ribbons' },
    { day: 'Day 5', topic: 'Ascending of the King (2 Sam 5:4)', activity: 'Golden cardboard crown making and graduation march' }
  ]);

  // Sandbox states for Student Trivia Game
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswerIdx, setSelectedAnswerIdx] = useState<number | null>(null);
  const [isTriviaAnswered, setIsTriviaAnswered] = useState(false);
  const [triviaScore, setTriviaScore] = useState(0);
  const [achievementUnlocked, setAchievementUnlocked] = useState(false);

  const triviaQuestions = [
    {
      question: 'How many smooth stones did young David pick from the stream to face Goliath?',
      options: ['1 Stone', '3 Stones', '5 Stones', '12 Stones'],
      correctIndex: 2,
      explanation: 'David selected five smooth stones in 1 Samuel 17:40, representing calculated complete obedience.'
    },
    {
      question: 'In what city was Solomon’s Temple constructed?',
      options: ['Bethlehem', 'Jerusalem', 'Nazareth', 'Hebron'],
      correctIndex: 1,
      explanation: 'Solomon built the majestic House of the Lord in Jerusalem on Mount Moriah.'
    },
    {
      question: 'What is the Greek word meaning "dividing or distracting the mind" in Phil 4:6?',
      options: ['Agape (ἀγάπη)', 'Merimnao (μεριμνάω)', 'Logos (λόγος)', 'Zoë (ζωή)'],
      correctIndex: 1,
      explanation: 'Paul uses "μεριμνάω" (merimnao) to capture anxious care that pulls the human mind apart.'
    }
  ];

  // Sandbox states for Normal Believer Timeline Milestone
  const [activeTimelineStep, setActiveTimelineStep] = useState(0);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  const timelineMilestones = [
    { era: '2000 BC', title: 'Abrahamic Covenant', scripture: 'Genesis 15:5', summary: 'God promises offspring like the stars. Covenant of Grace initiated.' },
    { era: '1000 BC', title: 'Davidic Kingdom established', scripture: '2 Samuel 7:16', summary: 'Covenant of an eternal royal throne established under King David.' },
    { era: '60 AD', title: 'Pauline Travels & Epistles', scripture: 'Philippians 4:6', summary: 'Apostle Paul writes letters of calm joy from a secure Roman prison cell.' },
    { era: '95 AD', title: 'Patmos Revelations', scripture: 'Revelation 21:3', summary: 'John catalogs vision of God making His physical dwelling tabernacle among men.' }
  ];

  // Shared Core Interactive: Word Lookup Root Spotlight comparative view
  const [spotlightWord, setSpotlightWord] = useState<string | null>(null);

  const personas = {
    pastor: {
      name: 'Pastor / Minister',
      color: 'border-blue-500 bg-blue-500/10 text-blue-500',
      tagline: 'Deep theological composition, rapid scaffolding, and pulpit delivery.',
      exclusive: [
        'Sermon drafting workspace (with rich text outline compilers)',
        'One-click "Structure My Sermon" template engine',
        'Direct resource cloud libraries (Google Drive, YouTube context, PDF integration)',
        'Multi-format export tools (Slide Decks, high-impact PDF pastoral handouts)'
      ]
    },
    teacher: {
      name: 'Teaching Mentor',
      color: 'border-amber-500 bg-amber-500/10 text-amber-500',
      tagline: 'Curating structured syllabus streams, tracking group metrics, and managing media.',
      exclusive: [
        'Study Plan Builder (Scaffold 5-day / 10-session / custom curriculum models)',
        'Safe group classrooms roster generation and secure join codes',
        'Student progress indicators and comprehensive insights dashboard',
        'Curated teaching assets library for mentoring events'
      ]
    },
    student: {
      name: 'Student',
      color: 'border-emerald-500 bg-emerald-500/10 text-emerald-500',
      tagline: 'Encouraging, gamified bible reading with kids paths and moderated sharing.',
      exclusive: [
        'Clear daily roadmap lesson layout with custom goals indicator',
        'Interactive Biblical quiz trivia games and memory matching apps',
        'Highly engaging, kid-friendly illustrated narrative summaries',
        'Teacher-moderated safe peer discussion and group sharing'
      ]
    },
    believer: {
      name: 'Normal Devoted Believer',
      color: 'border-purple-500 bg-purple-500/10 text-purple-500',
      tagline: 'Personal quiet time, chronological context search, and supportive feedback loops.',
      exclusive: [
        'Chronological historical timeline maps and family lineage graphs',
        'Real-time shared community highlights feed with safe reactions',
        'Listen back / professional narration text-to-speech audio player'
      ]
    },
    shared: {
      name: 'Shared Core Features',
      color: 'border-indigo-500 bg-indigo-500/10 text-indigo-500',
      tagline: 'Universal foundational modules accessible across all target accounts.',
      exclusive: [
        'Secure passwordless authentication and data privacy protection models',
        'Advanced Bible Reader - AISearch, Context Study, Cross-Refs & Personal Notebooks',
        'Companion Theology Chat module powered by theological scholars reviews',
        'Dynamic scripture visualizations (Geographic route models, history blueprints)',
        'Youth and mens fellowship reading plans with shared daily homes',
        'Continuous motivation streaks and safe offline cache files'
      ]
    }
  };

  const handleStructureSermon = () => {
    setIsStructuring(true);
    onNotify(`Structuring custom sermon outlines for: "${sermonTopic}"`);
    setTimeout(() => {
      setIsStructuring(false);
      setDraftedSermon({
        title: sermonTopic,
        sections: [
          { heading: 'I. The Context of the Proclamation', points: [`Digging deep into the underlying themes of "${sermonTopic}"`, 'Reflecting on historical, relational elements around this scripture'] },
          { heading: 'II. Direct Heart Call & Application', points: ['Removing visual anxiety elements to surrender to faith', 'How to actively apply this message to your home or office during the week'] }
        ]
      });
      onNotify('Homiletical skeleton structured.');
    }, 1200);
  };

  const handleGenerateSyllabus = () => {
    setIsStructuring(true);
    onNotify(`AI compiling Mentor ${syllabusDays}-Day Syllabus for: "${newSyllabusName}"`);
    setTimeout(() => {
      setIsStructuring(false);
      const output = [];
      for(let i = 1; i <= syllabusDays; i++) {
        output.push({
          day: `Day ${i}`,
          topic: `Unit ${i}: Journeying in ${newSyllabusName}`,
          activity: `Group session ${i} discussion, theme memory cards, & quiz challenge`
        });
      }
      setActiveSyllabus(output);
      onNotify('Curriculum generated successfully!');
    }, 1200);
  };

  const handleAddParticipant = () => {
    if(!newParticipant.trim()) return;
    setGroupParticipants([...groupParticipants, newParticipant.trim()]);
    setNewParticipant('');
    onNotify('Added member to Mentor Classroom group');
  };

  const handleRemoveParticipant = (idx: number) => {
    const backup = [...groupParticipants];
    backup.splice(idx, 1);
    setGroupParticipants(backup);
  };

  const handleSelectOption = (idx: number) => {
    if (isTriviaAnswered) return;
    setSelectedAnswerIdx(idx);
    setIsTriviaAnswered(true);
    const correct = idx === triviaQuestions[currentQuestionIndex].correctIndex;
    if (correct) {
      setTriviaScore((prev) => prev + 1);
      if (triviaScore + 1 === triviaQuestions.length) {
        setAchievementUnlocked(true);
      }
    }
  };

  const handleNextQuestion = () => {
    setSelectedAnswerIdx(null);
    setIsTriviaAnswered(false);
    if (currentQuestionIndex < triviaQuestions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    } else {
      // restart
      setCurrentQuestionIndex(0);
      setTriviaScore(0);
      setAchievementUnlocked(false);
    }
  };

  return (
    <section id="persona-universe" className={`py-24 relative overflow-hidden transition-colors duration-500 border-b ${
      theme === 'dark' 
        ? 'bg-[#0B192C] text-slate-100 border-slate-800' 
        : 'bg-white text-stone-900 border-stone-150'
    }`}>
      
      {/* Visual background rings */}
      <div className="absolute top-1/4 left-1/3 w-[500px] h-[500px] border border-blue-500/[0.04] rounded-full pointer-events-none" />
      <div className="absolute top-1/3 right-1/4 w-[400px] h-[400px] border border-amber-500/[0.04] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
        
        {/* Title Block */}
        <div className="max-w-3xl mx-auto mb-16">
          <span className={`text-[10px] font-extrabold font-mono tracking-[4px] uppercase block mb-3.5 ${
            theme === 'dark' ? 'text-amber-400' : 'text-blue-600'
          }`}>
            INTERACTIVE BIBLE PLATFORM UNIVERSE
          </span>
          <h2 className={`font-display font-black text-3xl sm:text-4xl lg:text-5xl leading-tight ${
            theme === 'dark' ? 'text-white' : 'text-[#0B192C]'
          }`}>
            Four Personas. One Connected Core.
          </h2>
          <p className={`mt-4 text-xs sm:text-sm max-w-xl mx-auto leading-relaxed ${
            theme === 'dark' ? 'text-slate-400' : 'text-slate-500'
          }`}>
            Discover how SabAI Bible seamlessly serves unique exclusive workflows for Pastors, Teaching Mentors, Students, and Believers while uniting everyone through a robust, shared scripture center.
          </p>
        </div>

        {/* OVERLAP DIAGRAM / SELECTOR */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center max-w-6xl mx-auto mb-16 text-left">
          
          {/* LHS Graphical Venn Circle Overlap representation */}
          <div className="lg:col-span-6 flex flex-col items-center justify-center">
            
            <div className="relative w-full max-w-[420px] aspect-square flex items-center justify-center select-none scale-100 md:scale-105">
              
              {/* Outer boundary guidelines */}
              <div className="absolute inset-0 rounded-full border border-dashed border-slate-300 dark:border-slate-800 pointer-events-none" />
              
              {/* Circle Teaching Mentor (Top-Left) */}
              <button
                onClick={() => {
                  setActivePersona('teacher');
                  onNotify("Exploring Teaching Mentor exclusive requirements");
                }}
                className={`absolute top-[10%] left-[10%] w-[190px] h-[190px] rounded-full border-2 transition-all flex flex-col items-center justify-center p-3 text-center ${
                  activePersona === 'teacher'
                    ? 'border-amber-500 bg-amber-500/15 z-20 shadow-lg scale-105'
                    : 'border-amber-500/30 bg-amber-500/[0.02] hover:bg-amber-500/[0.08] hover:border-amber-500/60 z-10'
                }`}
              >
                <GraduationCap className={`w-6 h-6 mb-1 ${activePersona === 'teacher' ? 'text-amber-400' : 'text-amber-500/70'}`} />
                <span className="text-[11px] font-extrabold font-mono tracking-wider dark:text-amber-300 text-amber-900 uppercase">Teaching Mentor</span>
                <span className="text-[8px] font-mono opacity-60 mt-1">Syllabus & Roster</span>
              </button>

              {/* Circle Student (Top-Right) */}
              <button
                onClick={() => {
                  setActivePersona('student');
                  onNotify("Exploring Student interactive ecosystem");
                }}
                className={`absolute top-[10%] right-[10%] w-[190px] h-[190px] rounded-full border-2 transition-all flex flex-col items-center justify-center p-3 text-center ${
                  activePersona === 'student'
                    ? 'border-emerald-500 bg-emerald-500/15 z-20 shadow-lg scale-105'
                    : 'border-emerald-500/30 bg-emerald-500/[0.02] hover:bg-emerald-500/[0.08] hover:border-emerald-500/60 z-10'
                }`}
              >
                <Gamepad2 className={`w-6 h-6 mb-1 ${activePersona === 'student' ? 'text-emerald-400' : 'text-emerald-500/70'}`} />
                <span className="text-[11px] font-extrabold font-mono tracking-wider dark:text-emerald-300 text-emerald-900 uppercase">Student</span>
                <span className="text-[8px] font-mono opacity-60 mt-1">Lessons & Quizzes</span>
              </button>

              {/* Circle Pastor (Bottom-Left) */}
              <button
                onClick={() => {
                  setActivePersona('pastor');
                  onNotify("Exploring Pastor homiletical sermon drafting");
                }}
                className={`absolute bottom-[10%] left-[10%] w-[190px] h-[190px] rounded-full border-2 transition-all flex flex-col items-center justify-center p-3 text-center ${
                  activePersona === 'pastor'
                    ? 'border-blue-500 bg-blue-500/15 z-20 shadow-lg scale-105'
                    : 'border-blue-500/30 bg-blue-500/[0.02] hover:bg-blue-500/[0.08] hover:border-blue-500/60 z-10'
                }`}
              >
                <ScrollText className={`w-6 h-6 mb-1 ${activePersona === 'pastor' ? 'text-blue-400' : 'text-blue-500/70'}`} />
                <span className="text-[11px] font-extrabold font-mono tracking-wider dark:text-blue-300 text-blue-900 uppercase">Pastor</span>
                <span className="text-[8px] font-mono opacity-60 mt-1">Sermon Homiletics</span>
              </button>

              {/* Circle Normal Believer (Bottom-Right) */}
              <button
                onClick={() => {
                  setActivePersona('believer');
                  onNotify("Exploring Normal Believer chronological modules");
                }}
                className={`absolute bottom-[10%] right-[10%] w-[190px] h-[190px] rounded-full border-2 transition-all flex flex-col items-center justify-center p-3 text-center ${
                  activePersona === 'believer'
                    ? 'border-purple-500 bg-purple-500/15 z-20 shadow-lg scale-105'
                    : 'border-purple-500/30 bg-purple-500/[0.02] hover:bg-purple-500/[0.08] hover:border-purple-500/60 z-10'
                }`}
              >
                <Heart className={`w-6 h-6 mb-1 ${activePersona === 'believer' ? 'text-purple-400' : 'text-purple-500/70'}`} />
                <span className="text-[11px] font-extrabold font-mono tracking-wider dark:text-purple-300 text-purple-900 uppercase">Believer</span>
                <span className="text-[8px] font-mono opacity-60 mt-1">Timeline & Devotion</span>
              </button>

              {/* Central Intersection - Shared Core */}
              <button
                onClick={() => {
                  setActivePersona('shared');
                  onNotify("Exploring foundational Shared Core features");
                }}
                className={`absolute w-[120px] h-[120px] rounded-full border-3 transition-all flex flex-col items-center justify-center p-2 text-center shadow-2xl ${
                  activePersona === 'shared'
                    ? 'border-indigo-500 bg-gradient-to-br from-indigo-500 to-violet-600 text-white z-35 scale-110'
                    : 'border-indigo-500/50 bg-indigo-900/60 hover:bg-indigo-900/80 hover:border-indigo-505 text-indigo-300 z-30'
                }`}
              >
                <Sparkles className="w-5 h-5 mb-0.5 animate-pulse" />
                <span className="text-[9.5px] font-black tracking-tight leading-tight uppercase block">Shared Core</span>
                <span className="text-[7.5px] opacity-90 block leading-tight mt-0.5 font-mono">ALL USERS</span>
              </button>

            </div>

            {/* Hint below overlap */}
            <div className="mt-6 flex gap-2 items-center bg-slate-500/5 px-4 py-1.5 rounded-full border border-slate-200/10 text-[10.5px] font-mono text-slate-500 justify-center">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-ping" />
              <span>Tap circles or tabs to explore custom feature sets</span>
            </div>

          </div>

          {/* RHS Interactive details of the selected Persona Segment */}
          <div className="lg:col-span-6 space-y-6">
            
            {/* Persona Segment Tabs (Desktop and Mobile layout) */}
            <div className="flex flex-wrap gap-2 pb-2 border-b border-dashed border-slate-300/35">
              {(Object.keys(personas) as PersonaId[]).map((pid) => {
                const label = personas[pid].name;
                const isActive = activePersona === pid;
                return (
                  <button
                    key={pid}
                    onClick={() => {
                      setActivePersona(pid);
                      onNotify(`Switched active view to: ${label}`);
                    }}
                    className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all border cursor-pointer ${
                      isActive
                        ? theme === 'dark'
                          ? 'bg-slate-800 text-white border-indigo-500 shadow-sm'
                          : 'bg-[#0B192C] text-white border-[#0B192C]'
                        : theme === 'dark'
                          ? 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                          : 'bg-stone-50 border-stone-200 text-slate-650 hover:bg-stone-100'
                    }`}
                  >
                    {pid === 'shared' ? '🎯 Universal Shared' : label}
                  </button>
                );
              })}
            </div>

            {/* Details Content Panel */}
            <div className="space-y-4">
              <span className="text-[10px] font-mono font-extrabold uppercase py-1 px-3 bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 rounded-full inline-block">
                Active Category: {personas[activePersona].name}
              </span>
              
              <h3 className={`font-display font-black text-2xl tracking-tight leading-tight ${
                theme === 'dark' ? 'text-white' : 'text-[#0B192C]'
              }`}>
                {personas[activePersona].tagline}
              </h3>

              {/* Exclusives Checklist directly modeled on the uploaded PNG diagram */}
              <div className="space-y-3 pt-2">
                <span className="text-[10px] font-mono font-extrabold text-slate-500 uppercase tracking-widest block">
                  {activePersona === 'shared' ? 'SHARED CORE STACKS' : 'AUTHORIZED EXCLUSIVE FUNCTIONS'}
                </span>
                
                <div className="grid grid-cols-1 gap-2.5">
                  {personas[activePersona].exclusive.map((feat, idx) => (
                    <div 
                      key={idx} 
                      className={`p-3.5 border rounded-2xl flex items-start gap-3 transition-colors ${
                        theme === 'dark' 
                          ? 'bg-slate-950/40 border-slate-850/70 hover:border-slate-800' 
                          : 'bg-slate-50 border-[#E2E8F0] hover:bg-white hover:border-slate-300'
                      }`}
                    >
                      <div className="w-5 h-5 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center shrink-0 mt-0.5">
                        <CheckCircle2 className="w-3.5 h-3.5 stroke-[3]" />
                      </div>
                      <div className="text-left">
                        <p className={`text-[12px] font-bold ${
                          theme === 'dark' ? 'text-white' : 'text-slate-900'
                        }`}>
                          {feat.split('(')[0].trim()}
                        </p>
                        {feat.includes('(') && (
                          <p className="text-[10.5px] font-mono text-slate-500 mt-0.5 leading-normal">
                            Specification: {feat.substring(feat.indexOf('(') + 1, feat.lastIndexOf(')'))}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>


            </div>

          </div>

        </div>

        {/* PERSUASIVE SECTOR: LIVE WORKSPACE SANDBOX CONSOLE */}
        <div id="persona-sandbox" className="max-w-6xl mx-auto pt-8 border-t border-dashed border-slate-300/35 text-left">
          
          <div className="mb-8 max-w-2xl">
            <span className="text-[10px] font-mono font-extrabold text-blue-500 uppercase tracking-widest block mb-2">
              LIVE SIMULATOR CONSOLE
            </span>
            <h3 className={`font-display font-black text-2xl transition-colors ${
              theme === 'dark' ? 'text-white' : 'text-slate-905'
            }`}>
              Interactive Feature Proof of Concept
            </h3>
            <p className={`text-xs mt-1.5 leading-relaxed ${
              theme === 'dark' ? 'text-slate-400' : 'text-slate-500'
            }`}>
              Experience exactly why we represent these user flows. Run simulated commands below matching each of the targeted diagram cohorts in real time.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch font-sans">
            
            {/* Mini Control Side Panel Switch */}
            <div className="lg:col-span-3 flex flex-col gap-2">
              <span className="text-[9px] font-mono font-bold text-slate-500 uppercase tracking-widest block px-1">
                SELECT PLAYGROUND:
              </span>
              
              <button
                onClick={() => {
                  setActivePersona('pastor');
                  onNotify("Activated Pastor Sermon outline builder sandbox");
                }}
                className={`py-3.5 px-4 rounded-xl text-left flex items-center justify-between transition-colors border cursor-pointer ${
                  activePersona === 'pastor'
                    ? 'bg-blue-600/10 border-blue-500/40 text-blue-400 font-extrabold'
                    : 'bg-slate-500/5 hover:bg-slate-500/10 border-transparent text-slate-400 font-semibold'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <ScrollText className="w-4 h-4" />
                  <span className="text-xs">1. Pastor Portal</span>
                </div>
                <span className="text-[9px] font-mono opacity-60">ACTIVE</span>
              </button>

              <button
                onClick={() => {
                  setActivePersona('teacher');
                  onNotify("Activated Teaching Mentor lesson roster sandbox");
                }}
                className={`py-3.5 px-4 rounded-xl text-left flex items-center justify-between transition-colors border cursor-pointer ${
                  activePersona === 'teacher'
                    ? 'bg-amber-600/10 border-amber-500/40 text-amber-500 font-extrabold'
                    : 'bg-slate-500/5 hover:bg-slate-500/10 border-transparent text-slate-400 font-semibold'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <GraduationCap className="w-4 h-4" />
                  <span className="text-xs">2. Teaching Mentor</span>
                </div>
                <span className="text-[9px] font-mono opacity-60">ACTIVE</span>
              </button>

              <button
                onClick={() => {
                  setActivePersona('student');
                  onNotify("Activated Student trivia review sandbox");
                }}
                className={`py-3.5 px-4 rounded-xl text-left flex items-center justify-between transition-colors border cursor-pointer ${
                  activePersona === 'student'
                    ? 'bg-emerald-600/10 border-emerald-500/40 text-emerald-400 font-extrabold'
                    : 'bg-slate-500/5 hover:bg-slate-500/10 border-transparent text-slate-400 font-semibold'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Gamepad2 className="w-4 h-4" />
                  <span className="text-xs">3. Student Quiz</span>
                </div>
                <span className="text-[9px] font-mono opacity-60">GAMES</span>
              </button>

              <button
                onClick={() => {
                  setActivePersona('believer');
                  onNotify("Activated Normal Believer historical timeline timelines sandbox");
                }}
                className={`py-3.5 px-4 rounded-xl text-left flex items-center justify-between transition-colors border cursor-pointer ${
                  activePersona === 'believer'
                    ? 'bg-purple-600/10 border-purple-500/40 text-purple-400 font-extrabold'
                    : 'bg-slate-500/5 hover:bg-slate-500/10 border-transparent text-slate-400 font-semibold'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Heart className="w-4 h-4" />
                  <span className="text-xs">4. Believer Milestones</span>
                </div>
                <span className="text-[9px] font-mono opacity-60">TIMELINE</span>
              </button>

              <button
                onClick={() => {
                  setActivePersona('shared');
                  onNotify("Activated Universal Shared Core word spotlight comparative sandbox");
                }}
                className={`py-3.5 px-4 rounded-xl text-left flex items-center justify-between transition-colors border cursor-pointer ${
                  activePersona === 'shared'
                    ? 'bg-indigo-600/10 border-indigo-500/40 text-indigo-400 font-extrabold'
                    : 'bg-slate-500/5 hover:bg-slate-500/10 border-transparent text-slate-400 font-semibold'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Sparkles className="w-4 h-4" />
                  <span className="text-xs">🎯 Shared Core Reader</span>
                </div>
                <span className="text-[9px] font-mono opacity-60">SHARED</span>
              </button>
            </div>

            {/* Sandbox Operations Frame Canvas */}
            <div className={`lg:col-span-9 border rounded-2xl p-6 relative overflow-hidden flex flex-col justify-between transition-colors duration-500 ${
              theme === 'dark' ? 'bg-[#050B14] border-slate-800' : 'bg-slate-50/20 border-[#E2E8F0]'
            }`}>
              
              {/* Backlight shine overlay */}
              <div className="absolute top-[-50px] right-[-50px] w-64 h-64 bg-indigo-500/5 rounded-full blur-[80px] pointer-events-none" />

              {/* 1. PASTOR WORKFLOW SANDBOX */}
              {activePersona === 'pastor' && (
                <div className="space-y-4 text-left">
                  <div className="flex justify-between items-center border-b border-dashed border-slate-700/35 pb-3">
                    <div className="flex items-center gap-2 text-blue-505 dark:text-blue-400">
                      <ScrollText className="w-5 h-5" />
                      <span className="text-xs font-mono font-black uppercase tracking-wider">Pastor: Structure My Sermon</span>
                    </div>
                    <span className="text-[9.5px] px-2.5 py-0.5 rounded border border-dashed text-blue-500 border-blue-500/20 font-mono font-bold uppercase">Homiletical Scaffold</span>
                  </div>

                  <p className="text-[12px] text-slate-500 leading-relaxed font-semibold">
                    The direct sermon outline synthesizer translates random thoughts, notes or specific passages instantly into fully-structured pulpits handouts.
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                    {/* LHS Input controls */}
                    <div className="space-y-3">
                      <div>
                        <label className="block text-[9px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">Sermon Main Theme Topic</label>
                        <select 
                          value={sermonTopic} 
                          onChange={(e) => {
                            setSermonTopic(e.target.value);
                            setDraftedSermon(null);
                          }}
                          className={`w-full border rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:border-blue-500 transition-colors ${
                            theme === 'dark' ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-stone-200 text-stone-850'
                          }`}
                        >
                          <option value="Hope in the Storm (Mark 4:35-41)">Hope in the Storm (Mark 4:35-41)</option>
                          <option value="Living by Faith, Not Sight (Gen 12:1-4)">Living by Faith, Not Sight (Gen 12:1-4)</option>
                          <option value="Smooth Brook Stones (1 Sam 17:40)">Smooth Brook Stones (1 Sam 17:40)</option>
                          <option value="Fostering Fellowship Unity (Acts 2:42-47)">Fostering Fellowship Unity (Acts 2:42-47)</option>
                        </select>
                      </div>

                      <button
                        onClick={handleStructureSermon}
                        disabled={isStructuring}
                        className="px-5 py-3 w-full rounded-xl bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800/40 text-white font-extrabold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition shadow-md cursor-pointer"
                      >
                        {isStructuring ? (
                          <>
                            <span className="w-3.5 h-3.5 rounded-full border-2 border-white border-t-transparent animate-spin" />
                            Synthesizing structures...
                          </>
                        ) : (
                          <>
                            <Sparkles className="w-4 h-4" />
                            Structure My Sermon
                          </>
                        )}
                      </button>
                    </div>

                    {/* RHS Output preview */}
                    <div className={`p-4 rounded-xl border min-h-[170px] flex flex-col justify-between transition-colors text-[11px] ${
                      theme === 'dark' ? 'bg-[#030712] border-slate-850' : 'bg-white border-[#E2E8F0]'
                    }`}>
                      {draftedSermon ? (
                        <div className="space-y-2.5">
                          <span className="text-[9px] font-mono text-slate-500 uppercase tracking-wider block">Pulpit Delivery Blueprint:</span>
                          <h4 className="font-display font-black text-xs text-blue-500 uppercase">{draftedSermon.title}</h4>
                          <div className="space-y-2 pl-1">
                            {draftedSermon.sections.map((sect, sIdx) => (
                              <div key={sIdx} className="space-y-1">
                                <span className={`font-mono font-bold text-[10px] block ${theme === 'dark' ? 'text-amber-400':'text-amber-700'}`}>{sect.heading}</span>
                                <ul className="list-disc list-inside space-y-0.5 text-slate-500 pl-1 font-semibold">
                                  {sect.points.map((pt, pIdx) => (
                                    <li key={pIdx}>{pt}</li>
                                  ))}
                                </ul>
                              </div>
                            ))}
                          </div>
                        </div>
                      ) : (
                        <div className="h-full flex flex-col items-center justify-center text-center py-6 text-slate-500">
                          <ScrollText className="w-8 h-8 opacity-25 mb-1.5" />
                          <p className="font-mono text-[10px] uppercase">Awaiting Scaffold Command</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* 2. TEACHING MENTOR WORKFLOW SANDBOX */}
              {activePersona === 'teacher' && (
                <div className="space-y-4 text-left">
                  <div className="flex justify-between items-center border-b border-dashed border-slate-705 pb-3">
                    <div className="flex items-center gap-2 text-amber-500">
                      <GraduationCap className="w-5 h-5" />
                      <span className="text-xs font-mono font-black uppercase tracking-wider">Teacher Portal: Syllabus Builder & Classrooms</span>
                    </div>
                    <span className="text-[9.5px] px-2.5 py-0.5 rounded border border-dashed text-amber-500 border-amber-500/20 font-mono font-bold uppercase">Administrative Suite</span>
                  </div>

                  <p className="text-[12px] text-slate-500 leading-relaxed font-semibold">
                    Set up custom multi-day curriculum models based on Biblical topics and coordinate kids join rosters.
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start pt-1">
                    
                    {/* LHS Controls */}
                    <div className="md:col-span-4 space-y-3">
                      <div>
                        <label className="block text-[9px] font-bold uppercase tracking-wider text-slate-500 mb-1">Roster Class Name</label>
                        <input
                          type="text"
                          value={newSyllabusName}
                          onChange={(e) => setNewSyllabusName(e.target.value)}
                          className={`w-full border rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:border-amber-500 transition-colors ${
                            theme === 'dark' ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-stone-200 text-stone-850'
                          }`}
                        />
                      </div>

                      <div>
                        <label className="block text-[9px] font-bold uppercase tracking-wider text-slate-500 mb-1">Days Duration</label>
                        <div className="flex gap-2">
                          <button
                            onClick={() => setSyllabusDays(5)}
                            className={`flex-1 py-1.5 rounded-lg text-xs font-mono font-bold border transition ${
                              syllabusDays === 5
                                ? 'bg-amber-500/10 text-amber-500 border-amber-500/50'
                                : 'bg-slate-500/5 border-transparent text-slate-400'
                            }`}
                          >
                            5-Day
                          </button>
                          <button
                            onClick={() => setSyllabusDays(10)}
                            className={`flex-1 py-1.5 rounded-lg text-xs font-mono font-bold border transition ${
                              syllabusDays === 10
                                ? 'bg-amber-500/10 text-amber-500 border-amber-500/50'
                                : 'bg-slate-500/5 border-transparent text-slate-400'
                            }`}
                          >
                            10-Session
                          </button>
                        </div>
                      </div>

                      <button
                        onClick={handleGenerateSyllabus}
                        className="w-full py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-mono font-extrabold uppercase tracking-wide text-[10px] transition-colors"
                      >
                        Rebuild Mentor Plan
                      </button>
                    </div>

                    {/* Mid Syllabus Stream */}
                    <div className="md:col-span-5 space-y-2">
                      <span className="text-[9px] font-mono text-slate-505 font-bold uppercase block">Generated syllabus map:</span>
                      <div className="space-y-1.5 max-h-[160px] overflow-y-auto pr-1">
                        {activeSyllabus.map((step, sIdx) => (
                          <div 
                            key={sIdx} 
                            className={`p-2 border rounded-xl text-[10px] leading-relaxed transition-colors ${
                              theme === 'dark' ? 'bg-slate-900/60 border-slate-800' : 'bg-white border-[#E2E8F0]'
                            }`}
                          >
                            <div className="flex justify-between items-center font-bold text-amber-500">
                              <span>{step.day}</span>
                              <span className="text-[8px] font-mono opacity-60">SABAI-MENTOR v1</span>
                            </div>
                            <h5 className={`font-bold mt-0.5 ${theme === 'dark' ? 'text-white':'text-slate-900'}`}>{step.topic}</h5>
                            <p className="text-slate-500 mt-0.5 text-[9.5px] font-semibold">Activity: {step.activity}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* RHS Group Roster Participants */}
                    <div className="md:col-span-3 space-y-2">
                      <span className="text-[9px] font-mono text-slate-505 font-bold uppercase block">Roster Group ({groupParticipants.length}):</span>
                      
                      <div className="space-y-1.5 max-h-[110px] overflow-y-auto pr-1">
                        {groupParticipants.map((part, pIdx) => (
                          <div 
                            key={pIdx} 
                            className="flex justify-between items-center text-[10.5px] px-2 py-1 rounded-lg border bg-slate-500/5 border-slate-500/10"
                          >
                            <span className="font-semibold text-slate-400">{part}</span>
                            <button 
                              onClick={() => handleRemoveParticipant(pIdx)}
                              className="text-red-500 hover:text-red-700 p-0.5 transition-colors cursor-pointer"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>
                        ))}
                      </div>

                      {/* Add interactive member */}
                      <div className="flex gap-1">
                        <input
                          type="text"
                          value={newParticipant}
                          onChange={(e) => setNewParticipant(e.target.value)}
                          placeholder="Add email/name"
                          className={`flex-1 border rounded-lg px-2 py-1.5 text-[10px] focus:outline-none focus:border-amber-500 transition-colors ${
                            theme === 'dark' ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-stone-200 text-stone-850'
                          }`}
                        />
                        <button
                          onClick={handleAddParticipant}
                          className="px-2 py-1 rounded-lg bg-slate-500/10 text-slate-300 border border-slate-500/20 hover:bg-slate-550 transition-colors"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                  </div>
                </div>
              )}

              {/* 3. STUDENT WORKFLOW SANDBOX (Trivia quiz games) */}
              {activePersona === 'student' && (
                <div className="space-y-4 text-left">
                  <div className="flex justify-between items-center border-b border-dashed border-slate-705 pb-3">
                    <div className="flex items-center gap-2 text-emerald-500">
                      <Gamepad2 className="w-5 h-5 animate-bounce" />
                      <span className="text-xs font-mono font-black uppercase tracking-wider">Student Arena: Fun Bible Trivia Quiz</span>
                    </div>
                    <span className="text-[9.5px] px-2.5 py-0.5 rounded border border-dashed text-emerald-500 border-emerald-500/20 font-mono font-bold uppercase">Kid & Teenager Gamified</span>
                  </div>

                  <p className="text-[12px] text-slate-500 leading-relaxed font-semibold">
                    An interactive showcase of kid-friendly quiz panels, streak points calibration, and safety moderation achievements.
                  </p>

                  <div className="max-w-xl mx-auto border rounded-xl p-4 sm:p-5 mt-1 relative transition-colors bg-emerald-500/[0.02] border-emerald-500/20">
                    
                    {/* Progress tracking indicator */}
                    <div className="flex justify-between items-center text-[9px] font-mono text-slate-550 mb-3">
                      <span>QUESTION {currentQuestionIndex + 1} OF {triviaQuestions.length}</span>
                      <span className="text-emerald-500 font-extrabold flex items-center gap-1">
                        <Flame className="w-3.5 h-3.5 fill-current" /> SCORE: {triviaScore}
                      </span>
                    </div>

                    {/* Active Question Title */}
                    <h4 className={`text-sm font-black tracking-tight leading-snug mb-4 ${theme === 'dark'?'text-white':'text-slate-900'}`}>
                      {triviaQuestions[currentQuestionIndex].question}
                    </h4>

                    {/* Multi-choice list */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {triviaQuestions[currentQuestionIndex].options.map((opt, oIdx) => {
                        const isCorrect = oIdx === triviaQuestions[currentQuestionIndex].correctIndex;
                        const isChosen = oIdx === selectedAnswerIdx;
                        
                        let optionStyle = theme === 'dark' 
                          ? 'bg-slate-900/60 border-slate-800 text-slate-300 hover:bg-slate-850' 
                          : 'bg-white border-[#E2E8F0] text-slate-700 hover:bg-stone-50';
                        
                        if (isTriviaAnswered) {
                          if (isCorrect) {
                            optionStyle = 'bg-emerald-500/10 border-emerald-500 text-emerald-500 font-extrabold';
                          } else if (isChosen) {
                            optionStyle = 'bg-red-500/10 border-red-500/70 text-red-500 font-extrabold';
                          } else {
                            optionStyle = 'opacity-30 border-transparent text-slate-500';
                          }
                        }

                        return (
                          <button
                            key={oIdx}
                            disabled={isTriviaAnswered}
                            onClick={() => handleSelectOption(oIdx)}
                            className={`p-3 rounded-xl border text-left text-xs font-bold transition-all relative overflow-hidden cursor-pointer ${optionStyle}`}
                          >
                            <span>{opt}</span>
                            {isTriviaAnswered && isCorrect && (
                              <span className="absolute right-3.5 top-1/2 -translate-y-1/2 bg-emerald-500 text-white rounded-full p-0.5 text-[8px] font-mono font-bold">✔️ OK</span>
                            )}
                          </button>
                        );
                      })}
                    </div>

                    {/* Explanations & Next workflow */}
                    {isTriviaAnswered && (
                      <div className="mt-4 pt-4 border-t border-slate-200/15 flex flex-col md:flex-row md:items-center justify-between gap-3 text-left">
                        <p className={`text-[10.5px] leading-relaxed max-w-sm font-semibold ${theme === 'dark'?'text-slate-400':'text-slate-600'}`}>
                          ℹ️ {triviaQuestions[currentQuestionIndex].explanation}
                        </p>
                        <button
                          onClick={handleNextQuestion}
                          className="px-4 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-mono font-extrabold uppercase shrink-0 transition shadow-xs cursor-pointer"
                        >
                          {currentQuestionIndex < triviaQuestions.length - 1 ? 'Next Challenge' : 'Reset Arena'}
                        </button>
                      </div>
                    )}

                    {/* Achievement unlock badge */}
                    {achievementUnlocked && (
                      <div className="absolute inset-0 bg-emerald-900/95 backdrop-blur-xs rounded-xl flex flex-col items-center justify-center p-6 text-center z-20 animate-fade-in text-white">
                        <Star className="w-12 h-12 text-amber-400 fill-amber-400 animate-spin mb-2" />
                        <h4 className="font-black text-lg tracking-tight">Theological Scholar Unlocked! 🏆</h4>
                        <p className="text-xs opacity-80 max-w-sm mt-1">You scored a perfect 100% on the active Biblical trivia modules. Secure badges shared instantly with your class register.</p>
                        <button
                          onClick={handleNextQuestion}
                          className="mt-4 px-5 py-2 rounded-xl bg-white text-emerald-950 text-xs font-mono font-extrabold uppercase hover:bg-stone-100 transition"
                        >
                          Repeat Training
                        </button>
                      </div>
                    )}

                  </div>
                </div>
              )}

              {/* 4. NORMAL BELIEVER WORKFLOW SANDBOX */}
              {activePersona === 'believer' && (
                <div className="space-y-4 text-left">
                  <div className="flex justify-between items-center border-b border-dashed border-slate-705 pb-3">
                    <div className="flex items-center gap-2 text-purple-500">
                      <Heart className="w-5 h-5" />
                      <span className="text-xs font-mono font-black uppercase tracking-wider">Believer Workspace: Timeline & Text-to-Speech Viewer</span>
                    </div>
                    <span className="text-[9.5px] px-2.5 py-0.5 rounded border border-dashed text-purple-500 border-purple-500/20 font-mono font-bold uppercase">Chronological Devotion</span>
                  </div>

                  <p className="text-[12px] text-slate-500 leading-relaxed font-semibold">
                    Visualize standard covenant lineage checkpoints or listen block by block to professional voice narration summaries.
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch pt-2">
                    
                    {/* Timeline Tracker Milestones LHS */}
                    <div className="md:col-span-6 space-y-2">
                      <span className="text-[9px] font-mono font-bold text-slate-500 uppercase tracking-widest block">CHRONOLOGICAL ERA checkpoints:</span>
                      
                      <div className="space-y-1.5">
                        {timelineMilestones.map((mil, idx) => {
                          const isActive = idx === activeTimelineStep;
                          return (
                            <button
                              key={idx}
                              onClick={() => {
                                setActiveTimelineStep(idx);
                                onNotify(`Navigated checkpoint: ${mil.title}`);
                              }}
                              className={`w-full p-3.5 border text-left rounded-xl transition-all flex items-start gap-3 cursor-pointer ${
                                isActive
                                  ? 'border-purple-500 bg-purple-500/10'
                                  : 'border-slate-500/10 bg-slate-500/5 hover:border-slate-500/20'
                              }`}
                            >
                              <div className={`mt-0.5 px-2 py-0.5 text-[8.5px] font-semibold font-mono rounded border ${
                                isActive 
                                  ? 'bg-purple-500 text-white border-purple-400' 
                                  : 'bg-slate-500/15 text-slate-400 border-transparent'
                              }`}>
                                {mil.era}
                              </div>
                              <div className="text-left flex-1">
                                <h5 className={`font-extrabold text-[12px] ${isActive ? 'text-purple-400 font-black':'text-slate-400 font-bold'}`}>{mil.title}</h5>
                                <p className="text-[9.5px] text-slate-500 leading-none mt-1">Scripture Ref: {mil.scripture}</p>
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Active Checkpoint & Listen block narration */}
                    <div className={`md:col-span-6 p-4 rounded-xl border flex flex-col justify-between transition-colors ${
                      theme === 'dark' ? 'bg-[#030712] border-slate-850' : 'bg-white border-[#E2E8F0]'
                    }`}>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center text-[8px] font-mono text-purple-400 uppercase tracking-wider">
                          <span>Timeline Core Synopsis</span>
                          <span>{timelineMilestones[activeTimelineStep].era} era</span>
                        </div>
                        
                        <h4 className={`text-base font-black italic tracking-wide ${theme === 'dark' ? 'text-white':'text-slate-900'}`}>
                          &ldquo; {timelineMilestones[activeTimelineStep].summary} &rdquo;
                        </h4>

                        <div className="p-3 border rounded-lg bg-slate-500/5 text-[10.5px] font-mono leading-relaxed text-slate-450 italic">
                          Anchor text: &ldquo;{timelineMilestones[activeTimelineStep].scripture}&rdquo;
                        </div>
                      </div>

                      <div className="pt-4 border-t border-slate-200/15 mt-3 flex items-center justify-between">
                        <span className="text-[9px] font-mono font-semibold text-slate-500">SIMULATED DEVOTIONAL SPEAKER:</span>
                        
                        <button
                          onClick={() => {
                            setIsPlayingAudio(!isPlayingAudio);
                            onNotify(isPlayingAudio ? "Silenced simulated scripture speech." : `Narrating lesson block: "${timelineMilestones[activeTimelineStep].title}"`);
                          }}
                          className={`flex items-center gap-1.5 px-3 py-1.5 text-[10px] uppercase font-mono tracking-wider font-extrabold rounded-lg border transition ${
                            isPlayingAudio 
                              ? 'bg-purple-500 text-white border-purple-400' 
                              : 'bg-slate-500/5 hover:bg-slate-500/10 text-slate-350 border-slate-500/20'
                          }`}
                        >
                          <Volume2 className={`w-3.5 h-3.5 ${isPlayingAudio ? 'animate-bounce' : ''}`} />
                          {isPlayingAudio ? 'Mute' : 'Synthesize Audio'}
                        </button>
                      </div>

                    </div>

                  </div>
                </div>
              )}

              {/* 5. SHARED CORE WORKFLOW SANDBOX (spotlight Lookup comparison) */}
              {activePersona === 'shared' && (
                <div className="space-y-4 text-left">
                  <div className="flex justify-between items-center border-b border-dashed border-slate-705 pb-3">
                    <div className="flex items-center gap-2 text-indigo-400">
                      <Sparkles className="w-5 h-5" />
                      <span className="text-xs font-mono font-black uppercase tracking-wider">Shared Core: Parallel Bible Reader & Lexicon</span>
                    </div>
                    <span className="text-[9.5px] px-2.5 py-0.5 rounded border border-dashed text-indigo-400 border-indigo-500/20 font-mono font-bold uppercase">Universal Reference</span>
                  </div>

                  <p className="text-[12px] text-slate-500 leading-relaxed font-semibold">
                    The focal center. Access parallel translation columns, complete exegesis insights, and toggle original Greek Root Lexicons instantly.
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
                    
                    {/* Translate ESV Column */}
                    <div className={`p-4 rounded-xl border flex flex-col justify-between transition-colors ${
                      theme === 'dark' ? 'bg-[#030712] border-slate-850' : 'bg-white border-[#E2E8F0]'
                    }`}>
                      <div>
                        <div className="flex justify-between items-center border-b border-light pb-2 mb-2 text-[9px] font-mono text-slate-500 font-bold uppercase">
                          <span>ESV Translation</span>
                          <span>Philippians 4:6</span>
                        </div>
                        <p className={`text-[11.5px] leading-relaxed font-serif ${theme === 'dark'?'text-slate-100':'text-stone-900'}`}>
                          &ldquo;do not be {' '}
                          <button 
                            onClick={() => {
                              setSpotlightWord('anxious');
                              onNotify("Toggled original Greek word spotlight: μεριμνάω");
                            }}
                            className="bg-indigo-500/10 hover:bg-indigo-505 hover:bg-indigo-500/25 px-1 rounded text-indigo-400 font-bold underline decoration-dashed cursor-pointer font-sans"
                          >
                            anxious
                          </button>
                          {' '} about anything, but in everything by prayer and supplication with thanksgiving let your requests be made known to God.&rdquo;
                        </p>
                      </div>
                      <span className="text-[9px] font-mono text-slate-500 mt-4 block">Click the highlighted word to see the lexicon.</span>
                    </div>

                    {/* Translate KJV Column */}
                    <div className={`p-4 rounded-xl border flex flex-col justify-between transition-colors ${
                      theme === 'dark' ? 'bg-[#030712] border-slate-850' : 'bg-white border-[#E2E8F0]'
                    }`}>
                      <div>
                        <div className="flex justify-between items-center border-b border-light pb-2 mb-2 text-[9px] font-mono text-slate-500 font-bold uppercase">
                          <span>KJV Translative</span>
                          <span>Philippians 4:6</span>
                        </div>
                        <p className={`text-[11.5px] leading-relaxed font-serif ${theme === 'dark'?'text-slate-100':'text-stone-900'}`}>
                          &ldquo;Be {' '}
                          <button 
                            onClick={() => {
                              setSpotlightWord('anxious');
                              onNotify("Toggled original Greek word spotlight: μεριμνάω");
                            }}
                            className="bg-indigo-500/10 hover:bg-indigo-505 hover:bg-indigo-500/25 px-1 rounded text-indigo-400 font-bold underline decoration-dashed cursor-pointer font-sans"
                          >
                            careful
                          </button>
                          {' '} for nothing; but in every thing by prayer and supplication with thanksgiving let your requests be made known unto God.&rdquo;
                        </p>
                      </div>
                      <span className="text-[9.5px] font-mono text-indigo-505 dark:text-indigo-400 font-bold block mt-4 text-right">★ Standard Parallel Mode</span>
                    </div>

                  </div>

                  {/* Lexicon Spotlight lookup panel */}
                  {spotlightWord && (
                    <div className="p-4 border rounded-xl bg-indigo-505 bg-indigo-500/[0.03] border-indigo-500/20 relative animate-slideUp">
                      <div className="flex justify-between items-start">
                        <div>
                          <span className="text-[8.5px] font-mono text-indigo-400 font-bold uppercase tracking-wider block">Scripture Lexicon Spotlights:</span>
                          <h5 className="font-display font-black text-sm text-indigo-505 dark:text-indigo-300 mt-1">μεριμνάω (merimnao)</h5>
                          <p className={`text-xs mt-1 leading-relaxed ${theme === 'dark' ? 'text-slate-350':'text-stone-650'}`}>
                            From <span className="italic block font-mono text-[10px] text-slate-500 inline">merizo</span> (to divide or draw in different directions). It captures an anxious state of mind that divides attention, pulls energy in opposite directions, and paralyzes relational trusts in Providence.
                          </p>
                        </div>
                        <button
                          onClick={() => setSpotlightWord(null)}
                          className="text-[9px] font-mono font-bold text-slate-400 hover:text-slate-200 border border-slate-550 border-slate-500/20 rounded px-2 py-0.5 hover:bg-slate-500/10 cursor-pointer"
                        >
                          Clear spotlight
                        </button>
                      </div>
                    </div>
                  )}

                </div>
              )}

            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
