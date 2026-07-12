'use client';

import React from 'react';
import { Sun, Wind, Droplets } from 'lucide-react';

export default function WeatherWidget() {
  return (
    <div className="glass p-5 rounded-2xl flex flex-col justify-between h-48 border border-white/5 relative overflow-hidden group">
      {/* Visual background gradient for premium feel */}
      <div className="absolute top-0 right-0 w-24 h-24 bg-yellow-500/10 blur-2xl rounded-full group-hover:bg-yellow-500/15 transition-all duration-500" />

      <div className="flex items-center justify-between text-xs font-semibold text-white/50 mb-2">
        <div className="flex items-center gap-1.5">
          <Sun className="w-4 h-4 text-yellow-400" />
          <span>WEATHER OVERVIEW</span>
        </div>
        <span className="text-[10px] font-bold text-white/40">CASABLANCA</span>
      </div>

      <div className="flex justify-between items-center my-1">
        <div className="flex flex-col">
          <span className="text-3xl font-extrabold text-white tracking-tight leading-none font-mono">
            24°C
          </span>
          <span className="text-[10px] font-medium text-white/40 mt-1 uppercase tracking-wider">
            Sunny & Clear
          </span>
        </div>
        <Sun className="w-12 h-12 text-yellow-400 fill-yellow-400/20 drop-shadow-[0_0_12px_rgba(250,204,21,0.3)] animate-spin-slow" />
      </div>

      <div className="grid grid-cols-2 gap-2 mt-2 pt-2 border-t border-white/5">
        <div className="flex items-center gap-1.5 text-[10px] text-white/50">
          <Wind className="w-3.5 h-3.5 text-sky-400" />
          <span>Wind: 14 km/h</span>
        </div>
        <div className="flex items-center gap-1.5 text-[10px] text-white/50">
          <Droplets className="w-3.5 h-3.5 text-blue-400" />
          <span>Humidity: 65%</span>
        </div>
      </div>
    </div>
  );
}
