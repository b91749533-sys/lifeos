'use client';

import React, { useState, useEffect } from 'react';
import { useStore } from '@/store/useStore';
import { CloudRain, Sun, Cloud, Cpu, Command } from 'lucide-react';

export default function StatusBar() {
  const activePanel = useStore((state) => state.activePanel);
  const setCommandPaletteOpen = useStore((state) => state.setCommandPaletteOpen);
  const [time, setTime] = useState('');
  const [date, setDate] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTime(
        now.toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
          hour12: false,
        })
      );
      setDate(
        now.toLocaleDateString('en-US', {
          weekday: 'short',
          month: 'short',
          day: 'numeric',
        })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 60000);
    return () => clearInterval(interval);
  }, []);

  const getPanelTitle = () => {
    switch (activePanel) {
      case 'dashboard':
        return 'Dashboard';
      case 'tasks':
        return 'Task Manager';
      case 'goals':
        return 'Goals System';
      case 'habits':
        return 'Habit Tracker';
      case 'health':
        return 'Gym & Health';
      case 'finance':
        return 'Finance Hub';
      case 'journal':
        return 'Journal';
      case 'notes':
        return 'Notes System';
      case 'study':
        return 'Study Hub';
      case 'dev':
        return 'Developer Workspace';
      case 'ai':
        return 'Gemini AI Assistant';
      case 'settings':
        return 'System Settings';
      default:
        return 'LifeOS';
    }
  };

  return (
    <div className="w-full h-8 px-4 flex items-center justify-between text-xs font-medium text-white/70 bg-slate-950/40 backdrop-blur-md border-b border-white/5 select-none z-50 fixed top-0 left-0">
      {/* Left section: App indicators */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-1.5 text-emerald-400">
          <Cpu className="w-3.5 h-3.5" />
          <span className="font-bold text-white tracking-wider text-[10px]">LIFE OS</span>
        </div>
        <div className="h-3 w-px bg-white/10" />
        <span className="text-white font-semibold">{getPanelTitle()}</span>
      </div>

      {/* Middle section: Personal Branding */}
      <div className="absolute left-1/2 -translate-x-1/2 flex items-center gap-2">
        <span className="text-white/40 font-light">Powered by Gemini AI</span>
        <span className="text-white/20">•</span>
        <span className="text-emerald-400/90 font-semibold tracking-wide uppercase text-[9px] px-1.5 py-0.5 rounded border border-emerald-500/20 bg-emerald-500/5">
          By Youssef Manssouri
        </span>
      </div>

      {/* Right section: System stats & Time */}
      <div className="flex items-center gap-4">
        <button 
          onClick={() => setCommandPaletteOpen(true)}
          className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-white/5 border border-white/5 hover:bg-white/10 hover:text-white transition-colors"
        >
          <Command className="w-3 h-3" />
          <span>K</span>
        </button>

        <div className="flex items-center gap-1 text-white/60">
          <Sun className="w-3.5 h-3.5 text-yellow-400/80" />
          <span>24°C, Casablanca</span>
        </div>
        
        <div className="h-3 w-px bg-white/10" />

        <div className="flex items-center gap-2">
          <span>{date}</span>
          <span className="text-white font-bold">{time}</span>
        </div>
      </div>
    </div>
  );
}
