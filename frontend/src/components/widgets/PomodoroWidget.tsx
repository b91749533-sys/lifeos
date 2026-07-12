'use client';

import React, { useEffect } from 'react';
import { useStore } from '@/store/useStore';
import { Play, Pause, RotateCcw, Timer } from 'lucide-react';

export default function PomodoroWidget() {
  const { timeLeft, isActive, mode, completedCycles } = useStore((state) => state.pomodoro);
  const startPomodoro = useStore((state) => state.startPomodoro);
  const pausePomodoro = useStore((state) => state.pausePomodoro);
  const resetPomodoro = useStore((state) => state.resetPomodoro);
  const tickPomodoro = useStore((state) => state.tickPomodoro);
  const setPomodoroMode = useStore((state) => state.setPomodoroMode);
  const accentColor = useStore((state) => state.accentColor);

  useEffect(() => {
    let interval: any = null;
    if (isActive) {
      interval = setInterval(() => {
        tickPomodoro();
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isActive, tickPomodoro]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getAccentBtnClass = () => {
    switch (accentColor) {
      case 'emerald': return 'bg-emerald-500 hover:bg-emerald-600';
      case 'blue': return 'bg-blue-500 hover:bg-blue-600';
      case 'indigo': return 'bg-indigo-500 hover:bg-indigo-600';
      case 'violet': return 'bg-violet-500 hover:bg-violet-600';
      case 'rose': return 'bg-rose-500 hover:bg-rose-600';
      default: return 'bg-emerald-500 hover:bg-emerald-600';
    }
  };

  const getProgressWidth = () => {
    const maxTime = mode === 'work' ? 1500 : 300;
    return `${((maxTime - timeLeft) / maxTime) * 100}%`;
  };

  return (
    <div className="glass p-5 rounded-2xl flex flex-col justify-between h-48 border border-white/5 relative overflow-hidden">
      {/* Background progress bar */}
      <div 
        className="absolute bottom-0 left-0 h-1.5 bg-emerald-500/30 transition-all duration-1000"
        style={{ 
          width: getProgressWidth(),
          backgroundColor: accentColor === 'emerald' ? 'rgba(16, 185, 129, 0.3)' : 
                           accentColor === 'blue' ? 'rgba(59, 130, 246, 0.3)' : 
                           accentColor === 'indigo' ? 'rgba(99, 102, 241, 0.3)' : 
                           accentColor === 'violet' ? 'rgba(139, 92, 246, 0.3)' : 'rgba(244, 63, 94, 0.3)'
        }}
      />

      <div className="flex items-center justify-between text-xs font-semibold text-white/50">
        <div className="flex items-center gap-1.5">
          <Timer className="w-4 h-4 text-emerald-400" />
          <span>FOCUS SESSION</span>
        </div>
        <span className="bg-white/5 px-2 py-0.5 rounded-full text-[10px]">
          Cycles: {completedCycles}
        </span>
      </div>

      <div className="flex items-center justify-between my-2">
        <div className="flex flex-col">
          <span className="text-4xl font-extrabold text-white tracking-tight leading-none font-mono">
            {formatTime(timeLeft)}
          </span>
          <span className="text-[10px] font-medium text-white/40 mt-1 uppercase tracking-wider">
            {mode === 'work' ? 'Deep Work Time' : 'Refuel Break'}
          </span>
        </div>

        <div className="flex gap-1.5">
          <button
            onClick={() => setPomodoroMode('work')}
            className={`px-2 py-1 rounded text-[10px] font-bold border transition-colors ${
              mode === 'work' ? 'bg-white/10 border-white/10 text-white' : 'border-transparent text-white/40 hover:text-white/60'
            }`}
          >
            Work
          </button>
          <button
            onClick={() => setPomodoroMode('break')}
            className={`px-2 py-1 rounded text-[10px] font-bold border transition-colors ${
              mode === 'break' ? 'bg-white/10 border-white/10 text-white' : 'border-transparent text-white/40 hover:text-white/60'
            }`}
          >
            Break
          </button>
        </div>
      </div>

      <div className="flex gap-2">
        {isActive ? (
          <button
            onClick={pausePomodoro}
            className="flex-1 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-colors border border-white/5"
          >
            <Pause className="w-3.5 h-3.5" />
            <span>Pause</span>
          </button>
        ) : (
          <button
            onClick={startPomodoro}
            className={`flex-1 py-2 rounded-xl text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-all glow-emerald ${getAccentBtnClass()}`}
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>Start Focus</span>
          </button>
        )}

        <button
          onClick={resetPomodoro}
          className="p-2 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 text-white/70 hover:text-white transition-colors"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
