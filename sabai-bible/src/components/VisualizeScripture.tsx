/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { journeyOptions as defaultJourneys } from '../mockData';
import { BibleJourney, JourneyStop } from '../types';
import {
  Compass, MapPin, ChevronRight, Landmark
} from 'lucide-react';
import { useTheme } from '../ThemeContext';

interface VisualizeScriptureProps {
  onNotify: (msg: string) => void;
  journeys?: BibleJourney[];
}

export default function VisualizeScripture({ onNotify, journeys = defaultJourneys }: VisualizeScriptureProps) {
  const [activeJourneyId, setActiveJourneyId] = useState(journeys[0]?.id ?? 'paul-mission');
  const [activeStopId, setActiveStopId] = useState<number>(1);
  const { theme } = useTheme();

  const activeJourney: BibleJourney =
    journeys.find((j) => j.id === activeJourneyId) || journeys[0];

  const activeStop: JourneyStop =
    activeJourney.stops.find((s) => s.id === activeStopId) || activeJourney.stops[0];

  const visualCards = [
    {
      title: 'Patriarchal Family Lineages',
      desc: 'Trace clean genealogical links between Genesis ancestors, ancient judges, and Davidic lineages in full zoomable nested graphs.',
      tag: 'Lineage Grapher'
    },
    {
      title: 'Temple Architectural Blueprints',
      desc: 'Explore 3D layouts and floor blueprints of Solomon’s Temple, the Tabernacle courtyard, and Herod’s courts matching ancient cubit texts.',
      tag: 'Spatial Blueprints'
    },
    {
      title: 'Historical Kingdom Boundaries',
      desc: 'Overlay contemporary sovereign borders over historical tribal allotments, the divided kingdom, and Persian satrapies.',
      tag: 'Political Cartography'
    }
  ];

  const handleStopSelect = (stop: JourneyStop) => {
    setActiveStopId(stop.id);
    onNotify(`Selected map waypoint: ${stop.name} (${stop.region})`);
  };

  const handleJourneyChange = (id: string) => {
    setActiveJourneyId(id);
    setActiveStopId(1);
    const journey = journeys.find((j) => j.id === id);
    onNotify(`Switched geographic map view to: ${journey?.title ?? id}`);
  };

  return (
    <div className="w-full relative transition-colors duration-500 text-left">
      
      {/* High End Map Section Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch mb-8 pt-2">
        
        {/* LHS Vector Map Card */}
        <div className={`lg:col-span-7 border rounded-2xl p-5 flex flex-col justify-between shadow-sm min-h-[420px] relative transition-colors duration-500 ${
          theme === 'dark' ? 'bg-[#030712] border-slate-850' : 'bg-white border-stone-202'
        }`}>
          
          {/* Header selection control */}
          <div className={`flex flex-wrap items-center justify-between gap-3 border-b pb-4 mb-5 transition-colors ${
            theme === 'dark' ? 'border-slate-805' : 'border-stone-105'
          }`}>
            <span className={`text-[10px] font-mono font-bold tracking-wider uppercase ${
              theme === 'dark' ? 'text-slate-450' : 'text-stone-500'
            }`}>
              Vector Cartography Grid (Select Era Map)
            </span>
            <div className="flex flex-wrap gap-2">
              {journeys.map((journey) => (
                <button
                  key={journey.id}
                  onClick={() => handleJourneyChange(journey.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer border ${
                    activeJourneyId === journey.id
                      ? theme === 'dark'
                        ? 'bg-gradient-to-r from-amber-500 to-gold-550 text-slate-950 border-gold-450 shadow-md'
                        : 'bg-[#b45309] text-white border-amber-800'
                      : theme === 'dark'
                        ? 'bg-slate-900 border-slate-800 text-slate-350 hover:bg-slate-850'
                        : 'bg-stone-50 border-stone-200 text-stone-605 hover:bg-stone-100'
                  }`}
                >
                  {journey.title}
                </button>
              ))}
            </div>
          </div>

          {/* Custom Interactive SVG cartography board */}
          <div className={`flex-1 border rounded-xl relative overflow-hidden flex items-center justify-center p-4 min-h-[260px] cursor-crosshair transition-colors ${
            theme === 'dark' ? 'bg-[#060c1d] border-slate-805' : 'bg-stone-50 border-stone-205'
          }`}>
            
            {/* Compass background */}
            <div className="absolute top-4 right-4 text-slate-350 opacity-15">
              <Compass className="w-16 h-16 animate-spin-slow stroke-[1.2]" />
            </div>

            {/* Dynamic coordinates system coordinates lines */}
            <div className={`absolute inset-0 opacity-[0.05] grid grid-cols-10 grid-rows-6 border pointer-events-none ${
              theme === 'dark' ? 'border-slate-500' : 'border-stone-400'
            }`} />

            <svg className="w-full h-full max-h-[300px] select-none" viewBox="0 0 100 85">
              {/* Ancient Sea / Coastline abstract representations */}
              <path d="M 5,20 Q 35,45 80,10" fill="none" stroke={theme === 'dark' ? '#f59e0b' : '#b45309'} strokeWidth="0.5" strokeDasharray="1 3" className="opacity-30" />
              <path d="M 12,62 Q 40,75 88,50" fill="none" stroke={theme === 'dark' ? '#f59e0b' : '#b45309'} strokeWidth="0.5" strokeDasharray="1 3" className="opacity-30" />

              {/* Draw Route Paths connection lines */}
              {activeJourney.stops.map((stop, i) => {
                if (i === activeJourney.stops.length - 1) return null;
                const nextStop = activeJourney.stops[i + 1];
                return (
                  <g key={i}>
                    <path
                      d={`M ${stop.coordinates.x},${stop.coordinates.y} L ${nextStop.coordinates.x},${nextStop.coordinates.y}`}
                      fill="none"
                      stroke={theme === 'dark' ? '#cca043' : '#b45309'}
                      strokeWidth="1.5"
                      strokeDasharray="2 2"
                      className="opacity-75"
                    />
                    <path
                      d={`M ${stop.coordinates.x},${stop.coordinates.y} L ${nextStop.coordinates.x},${nextStop.coordinates.y}`}
                      fill="none"
                      stroke={theme === 'dark' ? '#eab308' : '#78350f'}
                      strokeWidth="0.8"
                      className="opacity-95"
                    />
                  </g>
                );
              })}

              {/* Render interactive pins */}
              {activeJourney.stops.map((stop) => {
                const isCurrent = stop.id === activeStopId;
                return (
                  <g key={stop.id} className="cursor-pointer group" onClick={() => handleStopSelect(stop)}>
                    {isCurrent && (
                      <circle
                        cx={stop.coordinates.x}
                        cy={stop.coordinates.y}
                        r="4.5"
                        fill={theme === 'dark' ? '#eab308' : '#b45309'}
                        className="animate-ping opacity-35"
                      />
                    )}
                    <circle
                      cx={stop.coordinates.x}
                      cy={stop.coordinates.y}
                      r={isCurrent ? '3.8' : '2.5'}
                      fill={isCurrent ? (theme === 'dark' ? '#eab308' : '#b45309') : '#ffffff'}
                      stroke={theme === 'dark' ? '#ca8a04' : '#78350f'}
                      strokeWidth="1.5"
                      className="transition-all hover:scale-125"
                    />
                    <text
                      x={stop.coordinates.x}
                      y={stop.coordinates.y - 4}
                      fill={isCurrent ? (theme === 'dark' ? '#ffffff' : '#111827') : (theme === 'dark' ? '#94a3b8' : '#64748b')}
                      fontSize="3.8"
                      fontFamily="var(--font-sans)"
                      fontWeight={isCurrent ? 'bold' : '500'}
                      textAnchor="middle"
                      className="pointer-events-none drop-shadow"
                    >
                      {stop.name}
                    </text>
                  </g>
                );
              })}
            </svg>

            {/* Readout coordinates bar */}
            <div className={`absolute bottom-3 left-3 border px-2.5 py-1 rounded text-[9px] font-mono flex items-center gap-1.5 shadow-sm font-semibold transition-colors ${
              theme === 'dark' ? 'bg-[#030712]/90 border-slate-800 text-slate-355' : 'bg-white border-stone-200 text-stone-605'
            }`}>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>GRID COORDS: {activeStop.coordinates.x}X / {activeStop.coordinates.y}Y</span>
              <span>•</span>
              <span>Tribe Region: {activeStop.region}</span>
            </div>
          </div>

          {/* Instruction footnote */}
          <div className={`text-[10px] font-mono mt-3 text-left transition-colors ${
            theme === 'dark' ? 'text-slate-500' : 'text-stone-405'
          }`}>
            *Interactive Study Note: Click coordinate waypoints on the geographic vector map directly to reload site detail history.
          </div>
        </div>

        {/* RHS Deep Detail inspectors panel */}
        <div className={`lg:col-span-5 border rounded-2xl p-5 sm:p-6 flex flex-col justify-between shadow-sm transition-colors duration-500 ${
          theme === 'dark' ? 'bg-[#060c1d] border-slate-805' : 'bg-white border-stone-202'
        }`}>
          
          <div className="space-y-4">
            <div className={`flex justify-between items-center border-b pb-3 transition-colors ${
              theme === 'dark' ? 'border-slate-805' : 'border-stone-150'
            }`}>
              <div className={`border px-2.5 py-1 rounded-lg text-[9.5px] font-mono font-bold transition-colors ${
                theme === 'dark' 
                  ? 'bg-gold-550/10 border-gold-400/20 text-gold-300' 
                  : 'bg-amber-50 border-amber-105 text-amber-850'
              }`}>
                WAYPOINT {activeStop.id} OF {activeJourney.stops.length}
              </div>
              <span className={`text-[10px] font-mono font-bold leading-none ${
                theme === 'dark' ? 'text-slate-500' : 'text-stone-405'
              }`}>MAP SIGHT DETAIL</span>
            </div>

            <div className="text-left">
              <span className={`text-[9px] font-mono font-bold uppercase block ${
                theme === 'dark' ? 'text-slate-500' : 'text-stone-450'
              }`}>SITE WAYPOINT LANDMARK</span>
              <h4 className={`text-xl font-display font-extrabold mt-0.5 transition-colors ${
                theme === 'dark' ? 'text-white' : 'text-stone-900'
              }`}>
                {activeStop.name}, {activeStop.region}
              </h4>
              <div className={`inline-flex items-center gap-1.5 mt-2.5 border px-2.5 py-1 rounded text-[10.5px] font-mono font-extrabold shadow-3xs transition-colors ${
                theme === 'dark' 
                  ? 'bg-gold-500/10 border-gold-450/20 text-gold-300' 
                  : 'bg-amber-50 border-amber-205 text-[#78350f]'
              }`}>
                📖 ANCHOR PROMISE: {activeStop.keyVerse}
              </div>
            </div>

            <div className={`p-4 rounded-xl border space-y-2.5 text-left transition-colors ${
              theme === 'dark' ? 'bg-[#030712] border-slate-805' : 'bg-stone-50 border-stone-202'
            }`}>
              <span className={`text-[9.5px] uppercase font-mono font-bold block tracking-wide ${
                theme === 'dark' ? 'text-gold-400' : 'text-stone-500'
              }`}>
                Historical Exegesis & Sights Records
              </span>
              <p className={`text-xs leading-relaxed font-semibold transition-colors ${
                theme === 'dark' ? 'text-slate-300' : 'text-stone-655'
              }`}>
                {activeStop.description}
              </p>
            </div>

            <div className={`p-3 rounded-xl border flex items-center justify-between text-xs transition-colors ${
              theme === 'dark' ? 'bg-[#030712] border-slate-805' : 'bg-stone-50 border-stone-202 shadow-3xs'
            }`}>
              <span className={`font-bold flex items-center gap-1.5 text-[11px] ${
                theme === 'dark' ? 'text-slate-205' : 'text-stone-705'
              }`}>
                <Landmark className={`w-3.5 h-3.5 ${theme === 'dark' ? 'text-gold-400 animate-pulse' : 'text-amber-802'}`} />
                Deep Archaeological Dossier
              </span>
              <button
                onClick={() => onNotify(`Generating comprehensive historical archive summary PDF for ${activeStop.name}...`)}
                className={`px-2.5 py-1 font-bold text-[10px] rounded-lg border cursor-pointer transition-all ${
                  theme === 'dark'
                    ? 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-850'
                    : 'bg-white border-stone-250 text-amber-850 hover:bg-stone-50'
                }`}
              >
                Download PDF
              </button>
            </div>
          </div>

          {/* Stop points horizontally scroll container */}
          <div className="pt-4 border-t space-y-2 text-left transition-colors border-slate-800">
            <span className={`text-[10px] font-bold text-left block uppercase tracking-wider ${
              theme === 'dark' ? 'text-slate-500' : 'text-stone-450'
            }`}>
              WAYPOINT SEQUENCE SEQUENTIAL CARDS
            </span>
            <div className="flex gap-2 overflow-x-auto pb-1 max-w-full select-none">
              {activeJourney.stops.map((stop) => {
                const isCurrent = stop.id === activeStopId;
                return (
                  <button
                    key={stop.id}
                    onClick={() => handleStopSelect(stop)}
                    className={`px-3-5 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap shrink-0 transition-all border cursor-pointer ${
                      isCurrent
                        ? theme === 'dark'
                          ? 'bg-gold-550 text-slate-950 border-gold-450 shadow-sm scale-[1.02]'
                          : 'bg-stone-900 border-stone-900 text-white shadow-sm'
                        : theme === 'dark'
                          ? 'bg-[#030712] border-slate-850 text-slate-300 hover:bg-slate-900'
                          : 'bg-stone-50 border-stone-202 text-stone-600 hover:bg-stone-100'
                    }`}
                  >
                    <span className={`text-[8.5px] font-mono block text-left ${isCurrent ? 'text-current opacity-70' : 'text-slate-405'}`}>STOP {stop.id}</span>
                    {stop.name}
                  </button>
                );
              })}
            </div>
          </div>

        </div>
      </div>

      {/* Lower Classroom/blueprint panels */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
        {visualCards.map((card, idx) => (
          <div
            key={idx}
            className={`p-5 rounded-2xl border transition duration-300 text-left flex flex-col justify-between shadow-xs ${
              theme === 'dark' 
                ? 'bg-[#060c1d] border-slate-850 hover:border-gold-400/30' 
                : 'bg-white border-stone-200 hover:border-amber-500'
            }`}
          >
            <div>
              <span className={`text-[9px] font-mono font-bold border px-2 py-0.5 rounded uppercase tracking-widest ${
                theme === 'dark' 
                  ? 'bg-gold-500/10 text-gold-300 border-gold-500/20' 
                  : 'bg-amber-50 text-amber-802 border-amber-205'
              }`}>
                {card.tag}
              </span>
              <h4 className={`font-display font-extrabold text-md mt-3 mb-2 ${
                theme === 'dark' ? 'text-white' : 'text-stone-900'
              }`}>
                {card.title}
              </h4>
              <p className={`text-xs font-normal leading-relaxed ${
                theme === 'dark' ? 'text-slate-400' : 'text-stone-605'
              }`}>
                {card.desc}
              </p>
            </div>
            <button
              onClick={() => onNotify(`Constructing virtual workspace sandbox for ${card.title}...`)}
              className={`text-[9.5px] tracking-widest uppercase font-bold flex items-center gap-1 mt-4 hover:translate-x-0.5 transition cursor-pointer self-end ${
                theme === 'dark' ? 'text-gold-400 hover:text-gold-300' : 'text-amber-850 hover:text-amber-900'
              }`}
            >
              Launch Sandbox
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>

    </div>
  );
}
