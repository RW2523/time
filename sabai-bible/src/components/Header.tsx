/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Menu, X, Play, Sparkles } from 'lucide-react';
import { useTheme } from '../ThemeContext';

interface HeaderProps {
  onNotify: (msg: string) => void;
}

export default function Header({ onNotify }: HeaderProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
      onNotify(`Navigating to ${id} section...`);
    }
  };

  const navLinks = [
    { label: 'Features', id: 'features' },
    { label: 'Read', id: 'read-section' },
    { label: 'Chat', id: 'chat-section' },
    { label: 'Visualize', id: 'visualize-section' },
    { label: 'Plans', id: 'plans-section' },
    { label: 'Community', id: 'community-section' }
  ];

  return (
    <header
      id="main-header"
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 font-sans border-b ${
        isScrolled
          ? theme === 'dark'
            ? 'bg-[#0B192C]/90 backdrop-blur-md border-slate-800 py-3 shadow-lg'
            : 'bg-white/90 backdrop-blur-md border-stone-200/80 py-3 shadow-sm'
          : theme === 'dark'
            ? 'bg-transparent border-transparent py-5'
            : 'bg-transparent border-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          
          {/* Logo with Small Cross Icon */}
          <div
            className="flex items-center gap-2 cursor-pointer group select-none"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          >
            <div className={`flex items-center justify-center w-8 h-8 rounded-lg transition-transform duration-300 group-hover:scale-110 ${
              theme === 'dark'
                ? 'bg-gradient-to-br from-amber-400 to-gold-600 text-[#030712] shadow-sm'
                : 'bg-gradient-to-br from-[#0B192C] to-blue-800 text-white shadow-sm'
            }`}>
              {/* Simple elegant cross representation */}
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M11 2h2v7h5v2h-5v11h-2v-11h-5v-2h5V2z" />
              </svg>
            </div>
            <div className="flex flex-col text-left">
              <span className={`font-display font-black text-lg tracking-tight leading-none transition-colors ${
                theme === 'dark' ? 'text-white' : 'text-slate-900'
              }`}>
                SabAI<span className={theme === 'dark' ? 'text-amber-400' : 'text-blue-600'}> Bible</span>
              </span>
              <span className={`text-[7.5px] font-mono tracking-widest font-extrabold uppercase transition-colors ${
                theme === 'dark' ? 'text-amber-500/80' : 'text-slate-500'
              }`}>
                Divine Exegesis Suite
              </span>
            </div>
          </div>

          {/* SaaS Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => scrollToSection(link.id)}
                className={`text-xs font-bold tracking-wide uppercase transition-colors cursor-pointer ${
                  theme === 'dark'
                    ? 'text-slate-300 hover:text-amber-400'
                    : 'text-slate-600 hover:text-blue-600'
                }`}
              >
                {link.label}
              </button>
            ))}
          </nav>

          {/* Right CTAs */}
          <div className="hidden md:flex items-center gap-3">
            
            {/* Quick theme toggler with absolute UI style */}
            <button
              onClick={toggleTheme}
              className={`p-2 rounded-lg border transition-all cursor-pointer ${
                theme === 'dark'
                  ? 'bg-slate-900/50 border-slate-800 text-amber-450 hover:bg-slate-800'
                  : 'bg-stone-50 border-stone-200 text-slate-700 hover:bg-stone-100'
              }`}
              title="Toggle Theme Mode"
            >
              {theme === 'dark' ? (
                <svg className="w-4 h-4 fill-none stroke-current stroke-2" viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="4" />
                  <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
                </svg>
              ) : (
                <svg className="w-4 h-4 fill-none stroke-current stroke-2" viewBox="0 0 24 24">
                  <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
                </svg>
              )}
            </button>

            <button
              onClick={() => onNotify("Launching 3-minute interactive walkthrough demo video...")}
              className={`text-xs font-bold tracking-wide uppercase px-3 py-2 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
                theme === 'dark'
                  ? 'text-slate-300 hover:text-white hover:bg-slate-850'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-stone-100'
              }`}
            >
              <Play className="w-3 h-3 fill-current text-amber-550" />
              Watch Preview
            </button>
            <button
              onClick={() => onNotify("Opening SabAI Bible sandbox environment...")}
              className={`px-4 py-2 rounded-lg text-xs font-extrabold uppercase tracking-wider transition-all duration-300 shadow-sm hover:shadow-md cursor-pointer ${
                theme === 'dark'
                  ? 'bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-350 hover:to-amber-450 text-slate-950 font-black'
                  : 'bg-[#0B192C] hover:bg-slate-900 text-white'
              }`}
            >
              Try SabAI Bible
            </button>
          </div>

          {/* Mobile hamburger and theme switcher */}
          <div className="flex md:hidden items-center gap-1.5">
            <button
              onClick={toggleTheme}
              className={`p-2 rounded-lg border transition-all cursor-pointer ${
                theme === 'dark'
                  ? 'bg-slate-900/50 border-slate-800 text-amber-450'
                  : 'bg-stone-50 border-stone-200 text-slate-700'
              }`}
            >
              {theme === 'dark' ? (
                <svg className="w-3.5 h-3.5 fill-none stroke-current stroke-2" viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="4" />
                  <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
                </svg>
              ) : (
                <svg className="w-3.5 h-3.5 fill-none stroke-current stroke-2" viewBox="0 0 24 24">
                  <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
                </svg>
              )}
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={`p-2 rounded-lg transition-colors ${
                theme === 'dark' ? 'text-slate-300 hover:text-white' : 'text-slate-605 hover:text-slate-900'
              }`}
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className={`md:hidden absolute top-full left-0 right-0 shadow-xl py-5 px-5 flex flex-col gap-3 animate-fadeIn transition-colors border-b ${
          theme === 'dark' 
            ? 'bg-[#0B192C] border-slate-850' 
            : 'bg-white border-stone-200'
        }`}>
          {navLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => scrollToSection(link.id)}
              className={`text-left font-bold text-xs uppercase py-2 transition-colors ${
                theme === 'dark' ? 'text-slate-300 hover:text-amber-400' : 'text-slate-600 hover:text-blue-600'
              }`}
            >
              {link.label}
            </button>
          ))}
          <hr className={theme === 'dark' ? 'border-slate-800 my-1' : 'border-stone-150 my-1'} />
          
          <div className="flex flex-col gap-2.5 pt-1">
            <button
              onClick={() => onNotify("Launching interactive video trailer...")}
              className={`flex items-center justify-center gap-2 font-bold text-xs py-2.5 border rounded-lg transition-all ${
                theme === 'dark'
                  ? 'border-slate-800 text-slate-300 hover:bg-slate-850/50'
                  : 'border-stone-200 text-slate-705 hover:bg-stone-50'
              }`}
            >
              <Play className="w-3.5 h-3.5 fill-current text-amber-550" />
              Watch Preview
            </button>
            <button
              onClick={() => onNotify("Entering SabAI Bible portal...")}
              className={`w-full py-2.5 rounded-lg text-xs font-black uppercase text-center transition-all ${
                theme === 'dark'
                  ? 'bg-amber-400 text-slate-950 shadow-sm'
                  : 'bg-[#0B192C] text-white shadow-sm'
              }`}
            >
              Try SabAI Bible
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
