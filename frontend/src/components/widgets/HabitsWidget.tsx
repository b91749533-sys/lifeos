'use client';

import React from 'react';
import { Flame, Check } from 'lucide-react';
import { useStore } from '@/store/useStore';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

interface HabitItem {
  id: string;
  name: string;
  frequency: string;
  streak: number;
  completedToday: boolean;
}

interface HabitsWidgetProps {
  habits?: HabitItem[];
  isLoading?: boolean;
}

export default function HabitsWidget({ habits = [], isLoading }: HabitsWidgetProps) {
  const accentColor = useStore((state) => state.accentColor);
  const queryClient = useQueryClient();

  const toggleMutation = useMutation({
    mutationFn: async (habitId: string) => {
      const response = await axios.post(`http://localhost:3001/api/habits/${habitId}/toggle`, {}, {
        headers: { 'x-user-email': 'youssef@example.com' },
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
    },
  });

  const getAccentClass = (completed: boolean) => {
    if (!completed) return 'border-white/10 hover:border-white/20 text-transparent';
    switch (accentColor) {
      case 'emerald': return 'bg-emerald-500 border-emerald-500 text-slate-950 glow-emerald';
      case 'blue': return 'bg-blue-500 border-blue-500 text-slate-950 glow-blue';
      case 'indigo': return 'bg-indigo-500 border-indigo-500 text-slate-950 glow-indigo';
      case 'violet': return 'bg-violet-500 border-violet-500 text-slate-950 glow-violet';
      case 'rose': return 'bg-rose-500 border-rose-500 text-slate-950 glow-rose';
      default: return 'bg-emerald-500 border-emerald-500 text-slate-950 glow-emerald';
    }
  };

  const getAccentTextClass = () => {
    switch (accentColor) {
      case 'emerald': return 'text-emerald-400';
      case 'blue': return 'text-blue-400';
      case 'indigo': return 'text-indigo-400';
      case 'violet': return 'text-violet-400';
      case 'rose': return 'text-rose-400';
      default: return 'text-emerald-400';
    }
  };

  return (
    <div className="glass p-5 rounded-2xl flex flex-col justify-between h-48 border border-white/5 relative overflow-hidden">
      <div className="flex items-center justify-between text-xs font-semibold text-white/50 mb-2">
        <div className="flex items-center gap-1.5">
          <Flame className="w-4 h-4 text-rose-500 animate-pulse" />
          <span>DAILY HABITS</span>
        </div>
        <span className="text-[10px] font-bold text-white/40">TODAY</span>
      </div>

      <div className="flex-1 overflow-y-auto space-y-2 pr-1">
        {isLoading ? (
          <div className="space-y-2 py-1">
            <div className="h-8 bg-white/5 rounded-lg animate-pulse" />
            <div className="h-8 bg-white/5 rounded-lg animate-pulse" />
          </div>
        ) : habits.length === 0 ? (
          <div className="h-full flex items-center justify-center text-white/30 text-[11px] font-medium italic">
            No habits created yet.
          </div>
        ) : (
          habits.map((habit) => (
            <div
              key={habit.id}
              className="flex items-center justify-between p-2 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors"
            >
              <div className="flex items-center gap-3">
                <button
                  disabled={toggleMutation.isPending}
                  onClick={() => toggleMutation.mutate(habit.id)}
                  className={`w-5 h-5 rounded-full border flex items-center justify-center transition-all duration-200 shrink-0 ${getAccentClass(
                    habit.completedToday
                  )}`}
                >
                  <Check className="w-3.5 h-3.5 stroke-[3px]" />
                </button>
                <span className="text-white text-xs font-medium truncate max-w-28">
                  {habit.name}
                </span>
              </div>

              <div className="flex items-center gap-1 font-mono text-[10px] text-white/40">
                <Flame className="w-3.5 h-3.5 text-rose-500 fill-current" />
                <span className="font-bold text-white/80">{habit.streak}d</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
