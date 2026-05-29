/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useTheme } from '../ThemeContext';
import { MessageSquare, Heart, Share2, FileText, Volume2 } from 'lucide-react';

interface CommunitySectionProps {
  onNotify: (msg: string) => void;
}

export default function CommunitySection({ onNotify }: CommunitySectionProps) {
  const { theme } = useTheme();

  const posts = [
    {
      avatar: 'DL',
      avatarColor: 'bg-amber-600',
      author: 'David Lim',
      role: 'Covenant Leader',
      time: '4h ago',
      type: 'Verse Reflection',
      body: 'True contentment is resting on the Shepherd\'s sovereign character, not our self-provision fears.',
      verse: 'Psalm 23:1',
      metrics: { hearts: 22, comments: 8 },
    },
    {
      avatar: 'MG',
      avatarColor: 'bg-emerald-600',
      author: 'Pastor Marcus G.',
      role: 'Lead Chaplain',
      time: '1d ago',
      type: 'Study Report',
      body: 'Compiled a John 3:16 exegesis with SabAI — Greek verb details, Nicodemus context included.',
      attachment: { name: 'John_3_16_Report.pdf', size: '1.4 MB', type: 'pdf' as const },
      metrics: { hearts: 31, comments: 12 },
    },
    {
      avatar: 'KJ',
      avatarColor: 'bg-indigo-600',
      author: 'Kevin Jordan',
      role: 'Sunday Teacher',
      time: '2d ago',
      type: 'Audio Story',
      body: 'Generated a 1-min narrated Red Sea crossing story to share with class — the harp background is stunning.',
      attachment: { name: 'Exodus_Epic.mp3', duration: '1:15 min', type: 'audio' as const },
      metrics: { hearts: 19, comments: 4 },
    },
  ];

  const [liked, setLiked] = useState<Record<number, boolean>>({});

  return (
    <section id="community-section" className={`py-20 relative overflow-hidden transition-colors duration-500 border-b ${
      theme === 'dark' ? 'bg-[#0B192C] border-slate-800' : 'bg-white border-stone-150'
    }`}>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* Header */}
        <div className="text-center mb-12">
          <span className={`text-[10px] font-extrabold font-mono tracking-[3px] uppercase block mb-3 ${
            theme === 'dark' ? 'text-blue-400' : 'text-blue-600'
          }`}>
            ACTIVE FELLOWSHIP FEED
          </span>
          <h2 className={`font-display font-black text-3xl sm:text-4xl leading-tight ${
            theme === 'dark' ? 'text-white' : 'text-[#0B192C]'
          }`}>
            Learn and grow together.
          </h2>
          <p className={`mt-3 text-sm max-w-md mx-auto leading-relaxed ${
            theme === 'dark' ? 'text-slate-400' : 'text-slate-500'
          }`}>
            Share prayers, insights, media, and study resources with your faith community.
          </p>
        </div>

        {/* 3-column feed */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {posts.map((post, idx) => (
            <div
              key={idx}
              className={`p-4 rounded-2xl border flex flex-col justify-between transition-all hover:-translate-y-0.5 ${
                theme === 'dark'
                  ? 'bg-slate-900/40 border-slate-800 hover:border-slate-700'
                  : 'bg-stone-50 border-stone-200 hover:bg-white shadow-xs'
              }`}
            >
              {/* Top */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className={`w-7 h-7 rounded-full ${post.avatarColor} text-white font-black text-[9px] flex items-center justify-center shrink-0`}>
                      {post.avatar}
                    </div>
                    <div>
                      <p className={`text-[11px] font-black leading-none ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                        {post.author}
                      </p>
                      <p className="text-[9px] text-slate-500 font-mono mt-0.5">{post.role}</p>
                    </div>
                  </div>
                  <span className={`text-[8px] font-mono font-bold uppercase px-1.5 py-0.5 rounded border ${
                    theme === 'dark' ? 'bg-slate-950 border-slate-800 text-slate-400' : 'bg-white border-stone-200 text-stone-500'
                  }`}>
                    {post.type}
                  </span>
                </div>

                <p className={`text-xs leading-relaxed mb-3 ${
                  theme === 'dark' ? 'text-slate-300' : 'text-slate-600'
                }`}>
                  {post.body}
                </p>

                {post.verse && (
                  <div className={`px-3 py-2 rounded-lg border-l-2 border-amber-500 mb-3 ${
                    theme === 'dark' ? 'bg-slate-950/50' : 'bg-amber-50'
                  }`}>
                    <span className="text-[9px] font-mono text-amber-600 font-bold block mb-0.5">
                      {post.verse}
                    </span>
                    <span className={`text-[10px] italic ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
                      "The Lord is my shepherd; I shall not want."
                    </span>
                  </div>
                )}

                {post.attachment && (
                  <button
                    onClick={() => onNotify(`Opening: ${post.attachment!.name}`)}
                    className={`w-full flex items-center justify-between p-2.5 rounded-xl border mb-3 cursor-pointer transition ${
                      theme === 'dark'
                        ? 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                        : 'bg-white border-stone-200 hover:bg-stone-50 shadow-xs'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <div className={`w-6 h-6 rounded-lg flex items-center justify-center ${
                        post.attachment.type === 'pdf' ? 'bg-rose-500/10 text-rose-500' : 'bg-amber-500/10 text-amber-500'
                      }`}>
                        {post.attachment.type === 'pdf'
                          ? <FileText className="w-3.5 h-3.5" />
                          : <Volume2 className="w-3.5 h-3.5" />}
                      </div>
                      <span className={`text-[10px] font-bold truncate max-w-[120px] ${
                        theme === 'dark' ? 'text-slate-300' : 'text-slate-700'
                      }`}>
                        {post.attachment.name}
                      </span>
                    </div>
                    <span className={`text-[8px] font-mono font-bold uppercase ${
                      post.attachment.type === 'pdf' ? 'text-rose-500' : 'text-amber-500'
                    }`}>
                      {post.attachment.type === 'pdf' ? 'PDF' : 'Play'}
                    </span>
                  </button>
                )}
              </div>

              {/* Footer metrics */}
              <div className={`flex items-center justify-between pt-2.5 border-t text-[10px] font-mono font-bold ${
                theme === 'dark' ? 'border-slate-800 text-slate-500' : 'border-stone-100 text-stone-400'
              }`}>
                <div className="flex gap-3">
                  <button
                    onClick={() => {
                      setLiked(p => ({ ...p, [idx]: !p[idx] }));
                      onNotify(`Liked post by ${post.author}`);
                    }}
                    className={`flex items-center gap-1 transition cursor-pointer ${
                      liked[idx] ? 'text-rose-500' : 'hover:text-slate-700'
                    }`}
                  >
                    <Heart className={`w-3 h-3 ${liked[idx] ? 'fill-current' : ''}`} />
                    {post.metrics.hearts + (liked[idx] ? 1 : 0)}
                  </button>
                  <button
                    onClick={() => onNotify(`Replies from ${post.author}`)}
                    className="flex items-center gap-1 cursor-pointer hover:text-slate-700"
                  >
                    <MessageSquare className="w-3 h-3" />
                    {post.metrics.comments}
                  </button>
                </div>
                <button
                  onClick={() => onNotify('Copying link…')}
                  className="flex items-center gap-1 cursor-pointer hover:text-slate-700"
                >
                  <Share2 className="w-3 h-3" />
                  Share
                </button>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
