'use client';

import React, { useState } from 'react';
import { useStore } from '@/store/useStore';
import AiBriefingWidget from './widgets/AiBriefingWidget';
import ScheduleWidget from './widgets/ScheduleWidget';
import HabitsWidget from './widgets/HabitsWidget';
import TasksWidget from './widgets/TasksWidget';
import PomodoroWidget from './widgets/PomodoroWidget';
import FinanceWidget from './widgets/FinanceWidget';
import GymWidget from './widgets/GymWidget';
import WeatherWidget from './widgets/WeatherWidget';
import { LayoutGrid, Eye, EyeOff, Settings } from 'lucide-react';

interface DashboardGridProps {
  data?: any;
  isLoading?: boolean;
}

export default function DashboardGrid({ data, isLoading }: DashboardGridProps) {
  const widgets = useStore((state) => state.widgets);
  const toggleWidget = useStore((state) => state.toggleWidget);
  const [showConfig, setShowConfig] = useState(false);

  // Render the widget by ID
  const renderWidget = (id: string) => {
    switch (id) {
      case 'ai-briefing':
        return <AiBriefingWidget key={id} briefing={data?.briefing} isLoading={isLoading} />;
      case 'schedule':
        return <ScheduleWidget key={id} events={data?.events} isLoading={isLoading} />;
      case 'habits':
        return <HabitsWidget key={id} habits={data?.habits} isLoading={isLoading} />;
      case 'tasks':
        return <TasksWidget key={id} tasks={data?.tasks} isLoading={isLoading} />;
      case 'pomodoro':
        return <PomodoroWidget key={id} />;
      case 'finance':
        return <FinanceWidget key={id} spentToday={data?.finance?.spentToday} budgets={data?.finance?.budgets} isLoading={isLoading} />;
      case 'gym':
        return <GymWidget key={id} sleep={data?.health?.sleep} water={data?.health?.water} calories={data?.health?.calories} workoutsToday={data?.health?.workoutsToday} isLoading={isLoading} />;
      case 'weather':
        return <WeatherWidget key={id} />;
      default:
        return null;
    }
  };

  const visibleWidgets = widgets
    .filter((w) => w.visible)
    .sort((a, b) => a.order - b.order);

  return (
    <div className="w-full space-y-6">
      {/* Dashboard Toolbar */}
      <div className="flex items-center justify-between border-b border-white/5 pb-4">
        <div>
          <h1 className="text-xl font-extrabold text-white tracking-tight">
            Welcome Back, Youssef Manssouri
          </h1>
          <p className="text-xs text-white/40 mt-1">
            System active. Workspace synchronized with SQLite local storage.
          </p>
        </div>

        <button
          onClick={() => setShowConfig(!showConfig)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 border border-white/5 text-white/70 hover:text-white hover:bg-white/10 text-xs font-semibold transition-all"
        >
          <Settings className="w-4 h-4" />
          <span>Customize Widgets</span>
        </button>
      </div>

      {/* Widget customization overlay */}
      {showConfig && (
        <div className="p-4 rounded-2xl bg-slate-950/60 border border-white/5 grid grid-cols-2 md:grid-cols-4 gap-2">
          {widgets.map((w) => (
            <button
              key={w.id}
              onClick={() => toggleWidget(w.id)}
              className={`flex items-center justify-between p-2.5 rounded-xl border text-xs font-semibold transition-all ${
                w.visible
                  ? 'bg-emerald-500/10 border-emerald-500/25 text-emerald-400'
                  : 'bg-white/5 border-white/5 text-white/40 hover:text-white/60'
              }`}
            >
              <span>{w.name}</span>
              {w.visible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
            </button>
          ))}
        </div>
      )}

      {/* Widgets Grid */}
      {visibleWidgets.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-48 rounded-2xl border border-dashed border-white/10 text-white/40 text-xs">
          <span>All widgets hidden. Click "Customize Widgets" to restore.</span>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {visibleWidgets.map((w) => renderWidget(w.id))}
        </div>
      )}
    </div>
  );
}
