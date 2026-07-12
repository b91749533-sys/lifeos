'use client';

import React from 'react';
import { Calendar, Clock } from 'lucide-react';

interface EventItem {
  id: string;
  title: string;
  startTime: string;
  endTime: string;
  color?: string;
}

interface ScheduleWidgetProps {
  events?: EventItem[];
  isLoading?: boolean;
}

export default function ScheduleWidget({ events = [], isLoading }: ScheduleWidgetProps) {
  const formatEventTime = (isoString: string) => {
    const d = new Date(isoString);
    return d.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  const getColorClass = (color?: string) => {
    switch (color) {
      case 'rose': return 'border-rose-500/20 bg-rose-500/5 text-rose-300';
      case 'emerald': return 'border-emerald-500/20 bg-emerald-500/5 text-emerald-300';
      case 'indigo': return 'border-indigo-500/20 bg-indigo-500/5 text-indigo-300';
      default: return 'border-blue-500/20 bg-blue-500/5 text-blue-300';
    }
  };

  return (
    <div className="glass p-5 rounded-2xl flex flex-col justify-between h-48 border border-white/5 relative overflow-hidden">
      <div className="flex items-center justify-between text-xs font-semibold text-white/50 mb-2">
        <div className="flex items-center gap-1.5">
          <Calendar className="w-4 h-4 text-indigo-400" />
          <span>TODAY\'S SCHEDULE</span>
        </div>
        <span className="text-[10px] font-bold text-white/40">CALENDAR</span>
      </div>

      <div className="flex-1 overflow-y-auto space-y-2 pr-1">
        {isLoading ? (
          <div className="space-y-2 py-1">
            <div className="h-8 bg-white/5 rounded-lg animate-pulse" />
            <div className="h-8 bg-white/5 rounded-lg animate-pulse" />
          </div>
        ) : events.length === 0 ? (
          <div className="h-full flex items-center justify-center text-white/30 text-[11px] font-medium italic">
            No events scheduled today.
          </div>
        ) : (
          events.map((event) => (
            <div
              key={event.id}
              className={`p-2 rounded-xl border flex flex-col gap-0.5 ${getColorClass(event.color)}`}
            >
              <span className="text-white text-xs font-semibold truncate">
                {event.title}
              </span>
              <div className="flex items-center gap-1 text-[9px] opacity-75 font-mono">
                <Clock className="w-3 h-3" />
                <span>
                  {formatEventTime(event.startTime)} - {formatEventTime(event.endTime)}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
