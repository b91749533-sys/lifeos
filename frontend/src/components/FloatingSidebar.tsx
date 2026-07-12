'use client';

import React from 'react';
import { useStore } from '@/store/useStore';
import {
  LayoutDashboard,
  CheckSquare,
  Target,
  Flame,
  Dumbbell,
  CircleDollarSign,
  BookOpen,
  FileText,
  GraduationCap,
  Code2,
  Sparkles,
  Settings,
} from 'lucide-react';
import { clsx } from 'clsx';

export default function FloatingSidebar() {
  const activePanel = useStore((state) => state.activePanel);
  const setActivePanel = useStore((state) => state.setActivePanel);
  const theme = useStore((state) => state.theme);
  const accentColor = useStore((state) => state.accentColor);

  const menuItems = [
    { id: 'dashboard', name: 'Dashboard', icon: LayoutDashboard },
    { id: 'ai', name: 'AI Assistant', icon: Sparkles, highlight: true },
    { id: 'tasks', name: 'Tasks', icon: CheckSquare },
    { id: 'goals', name: 'Goals', icon: Target },
    { id: 'habits', name: 'Habits', icon: Flame },
    { id: 'health', name: 'Gym & Health', icon: Dumbbell },
    { id: 'finance', name: 'Finance', icon: CircleDollarSign },
    { id: 'journal', name: 'Journal', icon: BookOpen },
    { id: 'notes', name: 'Notes', icon: FileText },
    { id: 'study', name: 'Study Hub', icon: GraduationCap },
    { id: 'dev', name: 'Workspace', icon: Code2 },
    { id: 'settings', name: 'Settings', icon: Settings },
  ];

  const getAccentBg = () => {
    switch (accentColor) {
      case 'emerald': return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
      case 'blue': return 'bg-blue-500/10 text-blue-400 border-blue-500/30';
      case 'indigo': return 'bg-indigo-500/10 text-indigo-400 border-indigo-500/30';
      case 'violet': return 'bg-violet-500/10 text-violet-400 border-violet-500/30';
      case 'rose': return 'bg-rose-500/10 text-rose-400 border-rose-500/30';
      default: return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
    }
  };

  return (
    <div className="fixed top-12 left-4 bottom-4 w-16 hover:w-48 group bg-slate-950/40 backdrop-blur-md border border-white/5 rounded-2xl flex flex-col justify-between items-center py-6 transition-all duration-300 z-40 select-none overflow-hidden">
      <div className="flex flex-col gap-2 w-full px-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activePanel === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActivePanel(item.id)}
              className={clsx(
                "w-full flex items-center justify-start gap-4 px-3 py-2.5 rounded-xl border border-transparent transition-all duration-200 group/btn relative overflow-hidden",
                isActive 
                  ? getAccentBg()
                  : "text-white/60 hover:text-white hover:bg-white/5",
                item.highlight && !isActive && "text-purple-400 hover:text-purple-300 bg-purple-500/5 border-purple-500/10"
              )}
            >
              <Icon className={clsx(
                "w-5 h-5 min-w-5 shrink-0 transition-transform duration-300 group-hover/btn:scale-110",
                item.highlight && !isActive && "animate-pulse"
              )} />
              
              <span className="text-sm font-medium tracking-wide opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-75 whitespace-nowrap">
                {item.name}
              </span>

              {/* Subtly show glowing dot for Active */}
              {isActive && (
                <div className={clsx(
                  "absolute right-2 w-1.5 h-1.5 rounded-full",
                  accentColor === 'emerald' && 'bg-emerald-400',
                  accentColor === 'blue' && 'bg-blue-400',
                  accentColor === 'indigo' && 'bg-indigo-400',
                  accentColor === 'violet' && 'bg-violet-400',
                  accentColor === 'rose' && 'bg-rose-400'
                )} />
              )}
            </button>
          );
        })}
      </div>

      <div className="flex flex-col items-center group-hover:flex-row gap-2 px-4 w-full">
        <div className="w-8 h-8 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center shrink-0">
          <span className="text-emerald-400 text-[10px] font-bold">YM</span>
        </div>
        <div className="flex-col opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap overflow-hidden leading-none hidden group-hover:flex">
          <span className="text-white text-xs font-semibold">Youssef M.</span>
          <span className="text-white/40 text-[9px]">LifeOS User</span>
        </div>
      </div>
    </div>
  );
}
