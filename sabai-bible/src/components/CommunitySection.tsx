/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useTheme } from '../ThemeContext';
import { MessageSquare, Heart, Share2, Paperclip, FileText, Play, Volume2 } from 'lucide-react';

interface CommunitySectionProps {
  onNotify: (msg: string) => void;
}

export default function CommunitySection({ onNotify }: CommunitySectionProps) {
  const { theme } = useTheme();

  const posts = [
    {
      avatar: 'SM',
      avatarColor: 'bg-indigo-650 bg-indigo-600',
      author: 'Sarah Jenkins',
      role: 'Intercessory Team Lead',
      time: '2h ago',
      type: 'Prayer Request',
      body: 'Please pray for our upcoming community youth outreach program next Saturday. Pray that hearts will be open, and that we can reflect the grace of Scripture with absolute warmth.',
      metrics: { hearts: 14, comments: 3 }
    },
    {
      avatar: 'DL',
      avatarColor: 'bg-[#ca8a04]',
      author: 'David Lim',
      role: 'Covenant Leader',
      time: '4h ago',
      type: 'Verse Reflection',
      body: 'Reflecting on Psalm 23:1 today: &ldquo;The Lord is my shepherd; I shall not want.&rdquo; True contentment is resting on the Shepherd’s sovereign character, instead of stressing over our self-provision fears.',
      verse: 'Psalm 23:1',
      metrics: { hearts: 22, comments: 8 }
    },
    {
      avatar: 'MG',
      avatarColor: 'bg-emerald-600',
      author: 'Pastor Marcus G.',
      role: 'Lead Chaplain',
      time: '1d ago',
      type: 'Shared Study Report',
      body: 'I compiled a comprehensive exegesis study of John 3:16 using the SabAI Bible generator. It outlines the Greek verb details and historical context of Nicodemus’ midnight dialogue. Perfect study guide!',
      attachment: {
        name: 'John_3_16_Theological_Report.pdf',
        size: '1.4 MB',
        type: 'pdf'
      },
      metrics: { hearts: 31, comments: 12 }
    },
    {
      avatar: 'KJ',
      avatarColor: 'bg-[#ca8a04]',
      author: 'Kevin Jordan',
      role: 'Sunday Teacher',
      time: '2d ago',
      type: 'Shared Audio Scene',
      body: 'Just generated this 1-minute narrated story about Israel crossing the Red Sea using SabAI audio voice assets to share with my class tomorrow. Listen to the acoustic background harps!',
      attachment: {
        name: 'The_Exodus_Epic_Audio.mp3',
        duration: '1:15 min',
        type: 'audio'
      },
      metrics: { hearts: 19, comments: 4 }
    }
  ];

  const [activeLike, setActiveLike] = useState<Record<number, boolean>>({});

  const clickHeart = (idx: number, author: string) => {
    setActiveLike(prev => ({
      ...prev,
      [idx]: !prev[idx]
    }));
    onNotify(`Liked community reflection from ${author}!`);
  };

  return (
    <section id="community-section" className={`py-24 relative overflow-hidden transition-colors duration-500 border-b ${
      theme === 'dark' 
        ? 'bg-[#0B192C] text-slate-100 border-slate-800' 
        : 'bg-white text-stone-900 border-stone-150'
    }`}>
      
      {/* Absolute faint background lights */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[700px] h-[300px] bg-rose-500/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Module Header */}
        <div className="max-w-3xl mx-auto text-center mb-16">
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
          <p className={`mt-4 text-xs sm:text-sm max-w-xl mx-auto leading-relaxed ${
            theme === 'dark' ? 'text-slate-400' : 'text-slate-500'
          }`}>
            Share prayers, reflections, Bible insights, media, and study resources with your faith community.
          </p>
        </div>

        {/* Community Feed Mockup Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
          {posts.map((post, idx) => (
            <div
              key={idx}
              className={`p-5 rounded-2xl border text-left flex flex-col justify-between transition-all duration-300 transform hover:-translate-y-0.5 ${
                theme === 'dark'
                  ? 'bg-slate-900/40 border-slate-850 hover:border-slate-800'
                  : 'bg-slate-50/50 border-stone-200/60 hover:bg-white shadow-3xs hover:shadow-xs'
              }`}
            >
              <div>
                
                {/* Header info bar */}
                <div className="flex justify-between items-start mb-3.5">
                  <div className="flex items-center gap-2.5">
                    {/* Rounded label circle */}
                    <div className={`w-8 h-8 rounded-full ${post.avatarColor} text-white font-black text-xs flex items-center justify-center shrink-0`}>
                      {post.avatar}
                    </div>
                    <div>
                      <p className={`text-xs font-black leading-tight ${theme === 'dark' ? 'text-slate-105' : 'text-[#0B192C]'}`}>
                        {post.author}
                      </p>
                      <p className="text-[9px] text-slate-500 font-mono mt-0.5">{post.role}</p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <span className="text-[8px] font-mono font-bold text-slate-400 uppercase tracking-wider bg-slate-100 dark:bg-slate-950 px-2 py-0.5 rounded border dark:border-slate-850">
                      {post.type}
                    </span>
                    <span className="text-[8px] text-slate-500 font-mono italic">{post.time}</span>
                  </div>
                </div>

                {/* Reflection Body Text */}
                <p className={`text-xs leading-relaxed mb-4 ${theme === 'dark' ? 'text-slate-300 font-medium' : 'text-slate-700 font-medium'}`}>
                  <span dangerouslySetInnerHTML={{ __html: post.body }} />
                </p>

                {/* Optional Highlighted Verse Box */}
                {post.verse && (
                  <div className={`p-2.5 rounded-xl border-l-[3.5px] border-amber-500 mb-4 text-left ${
                    theme === 'dark' ? 'bg-[#0B192C]/40 border-slate-800' : 'bg-white border-stone-200 shadow-3xs'
                  }`}>
                    <span className="text-[8px] font-mono text-[#ca8a04] font-black uppercase tracking-wider block mb-0.5">SCRIPTURE PIN</span>
                    <span className={`text-[10.5px] font-serif leading-relaxed italic ${theme === 'dark' ? 'text-slate-300' : 'text-slate-750'}`}>
                      &ldquo;The Lord is my shepherd; I shall not want.&rdquo;
                    </span>
                  </div>
                )}

                {/* Optional PDF Attachment Box */}
                {post.attachment && post.attachment.type === 'pdf' && (
                  <div 
                    onClick={() => onNotify(`Downloading file: ${post.attachment?.name}`)}
                    className={`p-2.5 rounded-xl border flex items-center justify-between cursor-pointer mb-4 ${
                      theme === 'dark'
                        ? 'bg-[#0B192C]/50 border-slate-800 hover:border-slate-700'
                        : 'bg-white border-stone-200 hover:bg-slate-50 shadow-3xs'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-rose-500/10 text-rose-505 flex items-center justify-center shrink-0">
                        <FileText className="w-4 h-4 text-rose-500" />
                      </div>
                      <div className="text-left">
                        <span className="text-[10px] font-black block text-slate-700 dark:text-slate-350 truncate max-w-[150px]">
                          {post.attachment.name}
                        </span>
                        <span className="text-[8.5px] font-mono text-slate-500">{post.attachment.size} &bull; PDF Exegesis Document</span>
                      </div>
                    </div>
                    <span className="text-[8.5px] font-bold font-mono tracking-wider text-rose-600 uppercase bg-rose-500/10 px-1.5 py-0.5 rounded">
                      Download
                    </span>
                  </div>
                )}

                {/* Optional Audio Attachment Box */}
                {post.attachment && post.attachment.type === 'audio' && (
                  <div 
                    onClick={() => onNotify(`Streaming audio note: ${post.attachment?.name}`)}
                    className={`p-2.5 rounded-xl border flex items-center justify-between cursor-pointer mb-4 ${
                      theme === 'dark'
                        ? 'bg-[#0B192C]/50 border-slate-800 hover:border-slate-700'
                        : 'bg-white border-stone-200 hover:bg-slate-50 shadow-3xs'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-[#ca8a04] flex items-center justify-center shrink-0">
                        <Volume2 className="w-4 h-4 text-amber-500" />
                      </div>
                      <div className="text-left">
                        <span className="text-[10px] font-black block text-slate-700 dark:text-slate-355 truncate max-w-[150px]">
                          {post.attachment.name}
                        </span>
                        <span className="text-[8.5px] font-mono text-slate-500">{post.attachment.duration} &bull; MP3 Scripture Story</span>
                      </div>
                    </div>
                    <span className="text-[8.5px] font-bold font-mono tracking-wider text-amber-600 uppercase bg-amber-500/10 px-1.5 py-0.5 rounded">
                      Play
                    </span>
                  </div>
                )}

              </div>

              {/* Feed metrics action triggers */}
              <div className="flex justify-between items-center border-t border-light border-slate-200/25 pt-2.5 mt-2 text-[10.5px] font-mono font-bold text-slate-500">
                <div className="flex gap-4">
                  <button
                    onClick={() => clickHeart(idx, post.author)}
                    className={`flex items-center gap-1 cursor-pointer transition ${
                      activeLike[idx] ? 'text-rose-500 scale-105' : 'hover:text-slate-905'
                    }`}
                  >
                    <Heart className={`w-3.5 h-3.5 ${activeLike[idx] ? 'fill-current text-rose-500' : ''}`} />
                    <span>{post.metrics.hearts + (activeLike[idx] ? 1 : 0)}</span>
                  </button>
                  <button
                    onClick={() => onNotify(`Opening conversation for reflection from ${post.author}`)}
                    className="flex items-center gap-1 cursor-pointer hover:text-slate-950"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>{post.metrics.comments} replies</span>
                  </button>
                </div>

                <button
                  onClick={() => onNotify("Copying secure reflection URL...")}
                  className="flex items-center gap-1 cursor-pointer hover:text-slate-950"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  <span>Share Link</span>
                </button>
              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
