'use client';

import React from 'react';
import { Dumbbell, Droplet, Moon, Egg } from 'lucide-react';

interface GymWidgetProps {
  sleep?: number | null;
  water?: number | null;
  calories?: number | null;
  workoutsToday?: number;
  isLoading?: boolean;
}

export default function GymWidget({ sleep, water, calories, workoutsToday = 0, isLoading }: GymWidgetProps) {
  return (
    <div className="glass p-5 rounded-2xl flex flex-col justify-between h-48 border border-white/5 relative overflow-hidden">
      <div className="flex items-center justify-between text-xs font-semibold text-white/50 mb-2">
        <div className="flex items-center gap-1.5">
          <Dumbbell className="w-4 h-4 text-rose-400" />
          <span>HEALTH & GYM</span>
        </div>
        <span className="text-[10px] font-bold text-white/40">METRICS</span>
      </div>

      <div className="grid grid-cols-2 gap-2 flex-1">
        {/* Sleep Metric */}
        <div className="flex items-center gap-2 bg-white/5 p-2 rounded-xl border border-white/5 hover:bg-white/10 transition-colors">
          <Moon className="w-4 h-4 text-indigo-400 shrink-0" />
          <div className="flex flex-col overflow-hidden">
            <span className="text-white text-xs font-bold leading-none font-mono">
              {isLoading ? '...' : sleep ? `${sleep}h` : '8.0h'}
            </span>
            <span className="text-[8px] text-white/40 mt-0.5 uppercase tracking-wider font-semibold">Sleep</span>
          </div>
        </div>

        {/* Water Metric */}
        <div className="flex items-center gap-2 bg-white/5 p-2 rounded-xl border border-white/5 hover:bg-white/10 transition-colors">
          <Droplet className="w-4 h-4 text-blue-400 shrink-0" />
          <div className="flex flex-col overflow-hidden">
            <span className="text-white text-xs font-bold leading-none font-mono">
              {isLoading ? '...' : water ? `${water}L` : '2.5L'}
            </span>
            <span className="text-[8px] text-white/40 mt-0.5 uppercase tracking-wider font-semibold">Water</span>
          </div>
        </div>

        {/* Calories Metric */}
        <div className="flex items-center gap-2 bg-white/5 p-2 rounded-xl border border-white/5 hover:bg-white/10 transition-colors">
          <Egg className="w-4 h-4 text-amber-400 shrink-0" />
          <div className="flex flex-col overflow-hidden">
            <span className="text-white text-xs font-bold leading-none font-mono">
              {isLoading ? '...' : calories ? `${calories} kcal` : '450 kcal'}
            </span>
            <span className="text-[8px] text-white/40 mt-0.5 uppercase tracking-wider font-semibold">Burned</span>
          </div>
        </div>

        {/* Workout frequency metric */}
        <div className="flex items-center gap-2 bg-white/5 p-2 rounded-xl border border-white/5 hover:bg-white/10 transition-colors">
          <Dumbbell className="w-4 h-4 text-rose-400 shrink-0" />
          <div className="flex flex-col overflow-hidden">
            <span className="text-white text-xs font-bold leading-none font-mono">
              {isLoading ? '...' : workoutsToday > 0 ? `${workoutsToday} done` : 'Rest Day'}
            </span>
            <span className="text-[8px] text-white/40 mt-0.5 uppercase tracking-wider font-semibold">Activity</span>
          </div>
        </div>
      </div>
    </div>
  );
}
