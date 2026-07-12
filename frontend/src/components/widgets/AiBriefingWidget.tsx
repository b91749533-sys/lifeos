'use client';

import React from 'react';
import { Sparkles } from 'lucide-react';
import { useStore } from '@/store/useStore';

interface AiBriefingProps {
  briefing?: string;
  isLoading?: boolean;
}

export default function AiBriefingWidget({ briefing, isLoading }: AiBriefingProps) {
  const accentColor = useStore((state) => state.accentColor);

  const getAccentBorderClass = () => {
    switch (accentColor) {
      case 'emerald': return 'border-emerald-500/25 bg-emerald-500/5 text-emerald-400';
      case 'blue': return 'border-blue-500/25 bg-blue-500/5 text-blue-400';
      case 'indigo': return 'border-indigo-500/25 bg-indigo-500/5 text-indigo-400';
      case 'violet': return 'border-violet-500/25 bg-violet-500/5 text-violet-400';
      case 'rose': return 'border-rose-500/25 bg-rose-500/5 text-rose-400';
      default: return 'border-emerald-500/25 bg-emerald-500/5 text-emerald-400';
    }
  };

  const getBriefingText = () => {
    if (isLoading) {
      return 'Analyzing your metrics, habits, and schedules... formulating briefing.';
    }
    return briefing || "Welcome Youssef Manssouri. Your workspace data is ready. You have 3 active habits and 2 high-priority tasks to address today. Don't forget to Hydrate!";
  };

  return (
    <div className="glass p-5 rounded-2xl flex flex-col justify-between h-48 border border-white/5 relative overflow-hidden group">
      {/* Glow highlight */}
      <div className="absolute -top-12 -right-12 w-32 h-32 bg-purple-500/10 blur-3xl rounded-full group-hover:bg-purple-500/15 transition-all duration-500" />
      
      <div className="flex items-center justify-between text-xs font-semibold text-white/50 z-10">
        <div className="flex items-center gap-1.5">
          <Sparkles className="w-4 h-4 text-purple-400" />
          <span>INTELLIGENT BRIEFING</span>
        </div>
        <span className="text-[10px] uppercase font-bold tracking-wider text-purple-400/90 bg-purple-400/10 px-2 py-0.5 rounded">
          Active OS
        </span>
      </div>

      <div className="flex-1 my-3 overflow-y-auto z-10 pr-1">
        {isLoading ? (
          <div className="flex flex-col gap-2 py-1.5">
            <div className="h-3 w-11/12 bg-white/5 rounded animate-pulse" />
            <div className="h-3 w-10/12 bg-white/5 rounded animate-pulse" />
            <div className="h-3 w-8/12 bg-white/5 rounded animate-pulse" />
          </div>
        ) : (
          <p className="text-white/80 text-xs font-normal leading-relaxed leading-medium text-justify">
            {getBriefingText()}
          </p>
        )}
      </div>

      <div className="text-[10px] font-semibold tracking-wider text-white/40 z-10 flex justify-between items-center">
        <span>GENERATED JUST NOW</span>
        <span className="text-emerald-400 font-bold uppercase">Ready</span>
      </div>
    </div>
  );
}
