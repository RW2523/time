/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useTheme } from '../ThemeContext';
import { supabase } from '../lib/supabase';
import {
  User, Mail, MessageSquare, Send, CheckCircle2,
  BookOpen, ScrollText, GraduationCap, Heart,
} from 'lucide-react';

type Role = 'Pastor / Minister' | 'Teaching Mentor' | 'Student' | 'Devoted Believer' | 'Other';

const roles: { label: Role; icon: React.ElementType; color: string }[] = [
  { label: 'Pastor / Minister', icon: ScrollText, color: 'text-blue-500 bg-blue-500/10 border-blue-500/30' },
  { label: 'Teaching Mentor',   icon: GraduationCap, color: 'text-amber-500 bg-amber-500/10 border-amber-500/30' },
  { label: 'Student',           icon: BookOpen,  color: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/30' },
  { label: 'Devoted Believer',  icon: Heart,     color: 'text-purple-500 bg-purple-500/10 border-purple-500/30' },
  { label: 'Other',             icon: User,      color: 'text-slate-400 bg-slate-500/10 border-slate-500/30' },
];

export default function ContactSection() {
  const { theme } = useTheme();

  const [name, setName]         = useState('');
  const [email, setEmail]       = useState('');
  const [role, setRole]         = useState<Role | ''>('');
  const [message, setMessage]   = useState('');
  const [loading, setLoading]   = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError]       = useState('');

  const valid = name.trim() && email.includes('@') && role;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!valid) return;
    setLoading(true);
    setError('');

    try {
      if (supabase) {
        const { error: dbErr } = await supabase.from('contacts').insert({
          name: name.trim(),
          email: email.trim().toLowerCase(),
          role,
          message: message.trim() || null,
        });
        if (dbErr) throw dbErr;
      }
      setSubmitted(true);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Something went wrong. Please try again.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const isDark = theme === 'dark';

  return (
    <section id="contact" className={`py-24 relative overflow-hidden border-t transition-colors duration-500 ${
      isDark ? 'bg-[#060d1f] border-slate-800' : 'bg-[#F4F7FB] border-stone-200'
    }`}>
      {/* Radial glow */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className={`absolute top-[-120px] left-1/2 -translate-x-1/2 w-[700px] h-[400px] rounded-full blur-[140px] ${
          isDark ? 'bg-blue-600/8' : 'bg-blue-400/10'
        }`} />
        <div className={`absolute bottom-[-80px] right-[-80px] w-[400px] h-[300px] rounded-full blur-[100px] ${
          isDark ? 'bg-amber-500/6' : 'bg-amber-400/8'
        }`} />
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* Section header */}
        <div className="text-center mb-14">
          <span className={`inline-flex items-center gap-2 text-[9px] font-mono font-extrabold tracking-[4px] uppercase px-3 py-1.5 rounded-full border mb-5 ${
            isDark ? 'bg-blue-500/10 border-blue-500/20 text-blue-400' : 'bg-blue-50 border-blue-200 text-blue-600'
          }`}>
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
            Early Access
          </span>
          <h2 className={`font-display font-black text-3xl sm:text-4xl tracking-tight leading-tight mb-4 ${
            isDark ? 'text-white' : 'text-[#0B192C]'
          }`}>
            Join the First Wave of{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-amber-500 select-none">
              SabAI Bible Users.
            </span>
          </h2>
          <p className={`text-sm max-w-xl mx-auto leading-relaxed ${
            isDark ? 'text-slate-400' : 'text-slate-500'
          }`}>
            Tell us who you are and how you study Scripture. Early members get priority app access,
            exclusive beta features, and a direct line to shape the product.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">

          {/* Left: value props */}
          <div className="lg:col-span-2 space-y-5">
            {[
              {
                num: '01',
                title: 'Priority App Access',
                body: 'Be among the first to download on iOS and Android before the public launch.',
              },
              {
                num: '02',
                title: 'Shape the Product',
                body: 'Your feedback directly influences the feature roadmap — your voice matters.',
              },
              {
                num: '03',
                title: 'Exclusive Beta Features',
                body: 'Early members unlock features weeks ahead of general availability.',
              },
            ].map(item => (
              <div key={item.num} className={`flex gap-4 p-4 rounded-2xl border transition-colors ${
                isDark ? 'border-slate-800 bg-slate-900/30' : 'border-stone-200 bg-white shadow-sm'
              }`}>
                <span className={`text-[10px] font-mono font-black shrink-0 mt-0.5 ${
                  isDark ? 'text-blue-400' : 'text-blue-600'
                }`}>{item.num}</span>
                <div>
                  <p className={`text-xs font-extrabold mb-0.5 ${isDark ? 'text-white' : 'text-stone-900'}`}>{item.title}</p>
                  <p className={`text-[11px] leading-relaxed ${isDark ? 'text-slate-400' : 'text-stone-500'}`}>{item.body}</p>
                </div>
              </div>
            ))}

            {/* Verse */}
            <blockquote className={`p-4 rounded-2xl border-l-2 ${
              isDark ? 'border-amber-500/40 bg-amber-500/5' : 'border-amber-400 bg-amber-50'
            }`}>
              <p className={`text-xs italic font-serif leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                "Plans fail for lack of counsel, but with many advisers they succeed."
              </p>
              <cite className={`mt-1.5 block text-[10px] font-mono font-bold not-italic ${
                isDark ? 'text-amber-400' : 'text-amber-700'
              }`}>— Proverbs 15:22 (NIV)</cite>
            </blockquote>
          </div>

          {/* Right: form */}
          <div className={`lg:col-span-3 rounded-3xl border overflow-hidden ${
            isDark ? 'border-slate-800 bg-[#0B192C]' : 'border-stone-200 bg-white shadow-sm'
          }`}>

            {/* Form header bar */}
            <div className={`px-7 py-5 border-b flex items-center justify-between ${
              isDark ? 'border-slate-800 bg-slate-900/40' : 'border-stone-100 bg-stone-50'
            }`}>
              <div>
                <p className={`text-sm font-extrabold font-display ${isDark ? 'text-white' : 'text-stone-900'}`}>
                  Express Your Interest
                </p>
                <p className={`text-[10px] font-mono mt-0.5 ${isDark ? 'text-slate-500' : 'text-stone-400'}`}>
                  Takes 30 seconds · No spam, ever.
                </p>
              </div>
              <CheckCircle2 className={`w-5 h-5 ${isDark ? 'text-emerald-500/40' : 'text-emerald-400'}`} />
            </div>

            <AnimatePresence mode="wait">
              {submitted ? (
                /* ── Success state ── */
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="px-7 py-12 flex flex-col items-center text-center gap-4"
                >
                  <div className={`w-16 h-16 rounded-2xl flex items-center justify-center ${
                    isDark ? 'bg-emerald-500/10' : 'bg-emerald-50'
                  }`}>
                    <CheckCircle2 className="w-8 h-8 text-emerald-500 stroke-[2]" />
                  </div>
                  <div>
                    <h3 className={`text-lg font-black font-display mb-2 ${isDark ? 'text-white' : 'text-stone-900'}`}>
                      Thank you, {name.split(' ')[0]}!
                    </h3>
                    <p className={`text-sm leading-relaxed max-w-sm ${isDark ? 'text-slate-400' : 'text-stone-500'}`}>
                      We have received your interest. Our team will reach out to you at{' '}
                      <span className={`font-bold ${isDark ? 'text-blue-400' : 'text-blue-600'}`}>{email}</span>{' '}
                      shortly with early access details. Welcome to the SabAI Bible family.
                    </p>
                  </div>
                  <blockquote className={`mt-2 border-l-2 pl-3 text-left ${
                    isDark ? 'border-blue-500/40' : 'border-blue-300'
                  }`}>
                    <p className={`text-[11px] italic font-serif ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                      "Commit to the Lord whatever you do, and he will establish your plans."
                    </p>
                    <cite className={`text-[9px] font-mono font-bold not-italic ${isDark ? 'text-blue-400' : 'text-blue-600'}`}>
                      — Proverbs 16:3
                    </cite>
                  </blockquote>
                </motion.div>
              ) : (
                /* ── Form ── */
                <motion.form
                  key="form"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  onSubmit={handleSubmit}
                  className="px-7 py-7 space-y-5"
                >
                  {/* Name + Email row */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className={`block text-[9px] font-mono font-bold uppercase tracking-widest mb-1.5 ${
                        isDark ? 'text-slate-500' : 'text-stone-400'
                      }`}>Full Name *</label>
                      <div className="relative">
                        <User className={`absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 ${isDark ? 'text-slate-600' : 'text-stone-400'}`} />
                        <input
                          type="text"
                          value={name}
                          onChange={e => setName(e.target.value)}
                          placeholder="John Calvin"
                          required
                          className={`w-full pl-9 pr-3 py-2.5 border rounded-xl text-xs focus:outline-none focus:ring-1 transition-colors ${
                            isDark
                              ? 'bg-slate-950 border-slate-800 text-white placeholder:text-slate-700 focus:ring-blue-500/30'
                              : 'bg-stone-50 border-stone-200 text-stone-900 placeholder:text-stone-400 focus:ring-blue-300'
                          }`}
                        />
                      </div>
                    </div>
                    <div>
                      <label className={`block text-[9px] font-mono font-bold uppercase tracking-widest mb-1.5 ${
                        isDark ? 'text-slate-500' : 'text-stone-400'
                      }`}>Email Address *</label>
                      <div className="relative">
                        <Mail className={`absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 ${isDark ? 'text-slate-600' : 'text-stone-400'}`} />
                        <input
                          type="email"
                          value={email}
                          onChange={e => setEmail(e.target.value)}
                          placeholder="you@church.org"
                          required
                          className={`w-full pl-9 pr-3 py-2.5 border rounded-xl text-xs focus:outline-none focus:ring-1 transition-colors ${
                            isDark
                              ? 'bg-slate-950 border-slate-800 text-white placeholder:text-slate-700 focus:ring-blue-500/30'
                              : 'bg-stone-50 border-stone-200 text-stone-900 placeholder:text-stone-400 focus:ring-blue-300'
                          }`}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Role pills */}
                  <div>
                    <label className={`block text-[9px] font-mono font-bold uppercase tracking-widest mb-2 ${
                      isDark ? 'text-slate-500' : 'text-stone-400'
                    }`}>I am a… *</label>
                    <div className="flex flex-wrap gap-2">
                      {roles.map(r => {
                        const Icon = r.icon;
                        const isSelected = role === r.label;
                        return (
                          <button
                            key={r.label}
                            type="button"
                            onClick={() => setRole(r.label)}
                            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl border text-[10.5px] font-bold transition-all cursor-pointer ${
                              isSelected
                                ? r.color
                                : isDark
                                  ? 'border-slate-800 bg-slate-900/40 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                                  : 'border-stone-200 bg-white text-stone-500 hover:border-stone-300 hover:text-stone-700'
                            }`}
                          >
                            <Icon className="w-3 h-3 shrink-0" />
                            {r.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Message */}
                  <div>
                    <label className={`block text-[9px] font-mono font-bold uppercase tracking-widest mb-1.5 ${
                      isDark ? 'text-slate-500' : 'text-stone-400'
                    }`}>
                      How do you study Scripture? <span className={isDark ? 'text-slate-700' : 'text-stone-300'}>(optional)</span>
                    </label>
                    <div className="relative">
                      <MessageSquare className={`absolute left-3 top-3 w-3.5 h-3.5 ${isDark ? 'text-slate-600' : 'text-stone-400'}`} />
                      <textarea
                        value={message}
                        onChange={e => setMessage(e.target.value)}
                        placeholder="e.g. I lead a weekly small group and preach twice a month..."
                        rows={3}
                        className={`w-full pl-9 pr-3 py-2.5 border rounded-xl text-xs resize-none focus:outline-none focus:ring-1 transition-colors ${
                          isDark
                            ? 'bg-slate-950 border-slate-800 text-white placeholder:text-slate-700 focus:ring-blue-500/30'
                            : 'bg-stone-50 border-stone-200 text-stone-900 placeholder:text-stone-400 focus:ring-blue-300'
                        }`}
                      />
                    </div>
                  </div>

                  {error && (
                    <p className="text-[10.5px] text-red-400 font-mono">{error}</p>
                  )}

                  <button
                    type="submit"
                    disabled={!valid || loading}
                    className={`w-full py-3 rounded-xl text-[10.5px] font-extrabold uppercase tracking-widest flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-40 ${
                      isDark
                        ? 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-lg shadow-blue-900/30'
                        : 'bg-[#0B192C] hover:bg-slate-800 text-white shadow-md'
                    }`}
                  >
                    {loading
                      ? <><span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" /> Submitting…</>
                      : <><Send className="w-3.5 h-3.5" /> Request Early Access</>}
                  </button>

                  <p className={`text-[9px] font-mono text-center ${isDark ? 'text-slate-700' : 'text-stone-400'}`}>
                    By submitting, you agree to be contacted about SabAI Bible. No spam — ever.
                  </p>
                </motion.form>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
