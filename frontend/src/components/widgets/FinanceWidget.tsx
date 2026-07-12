'use client';

import React from 'react';
import { CircleDollarSign, TrendingUp } from 'lucide-react';
import { useStore } from '@/store/useStore';

interface Budget {
  id: string;
  category: string;
  limit: number;
}

interface FinanceWidgetProps {
  spentToday?: number;
  budgets?: Budget[];
  isLoading?: boolean;
}

export default function FinanceWidget({ spentToday = 0, budgets = [], isLoading }: FinanceWidgetProps) {
  const accentColor = useStore((state) => state.accentColor);

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
          <CircleDollarSign className="w-4 h-4 text-emerald-400" />
          <span>FINANCE OVERVIEW</span>
        </div>
        <span className="text-[10px] font-bold text-white/40">MAD</span>
      </div>

      <div className="my-1.5 flex justify-between items-center bg-white/5 p-3 rounded-xl border border-white/5">
        <div className="flex flex-col">
          <span className="text-white text-lg font-bold font-mono tracking-tight leading-none">
            {spentToday.toLocaleString()} MAD
          </span>
          <span className="text-[9px] font-semibold text-white/30 uppercase tracking-wider mt-1">
            Spent Today
          </span>
        </div>
        
        <div className="flex items-center gap-1 text-[10px] text-emerald-400/90 font-semibold bg-emerald-500/10 px-2 py-0.5 rounded-full">
          <TrendingUp className="w-3.5 h-3.5" />
          <span>On Track</span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto space-y-1.5 pr-1">
        {isLoading ? (
          <div className="h-6 bg-white/5 rounded animate-pulse" />
        ) : budgets.length === 0 ? (
          <div className="h-full flex items-center justify-center text-white/30 text-[10px] italic">
            No budgets configured.
          </div>
        ) : (
          budgets.map((b) => (
            <div key={b.id} className="flex justify-between items-center text-[10px] text-white/60">
              <span className="font-medium truncate max-w-24">{b.category} Budget</span>
              <span className="font-mono text-white/80">{b.limit.toLocaleString()} MAD</span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
