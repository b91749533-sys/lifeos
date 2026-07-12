'use client';

import React from 'react';
import { CheckSquare, Check, Circle } from 'lucide-react';
import { useStore } from '@/store/useStore';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { clsx } from 'clsx';

interface TaskItem {
  id: string;
  title: string;
  status: string;
  priority: string;
}

interface TasksWidgetProps {
  tasks?: TaskItem[];
  isLoading?: boolean;
}

export default function TasksWidget({ tasks = [], isLoading }: TasksWidgetProps) {
  const accentColor = useStore((state) => state.accentColor);
  const queryClient = useQueryClient();

  const toggleTaskMutation = useMutation({
    mutationFn: async ({ taskId, status }: { taskId: string; status: string }) => {
      const response = await axios.patch(`http://localhost:3001/api/tasks/${taskId}`, {
        status,
      }, {
        headers: { 'x-user-email': 'youssef@example.com' },
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'URGENT': return 'text-red-500 bg-red-500/10 border-red-500/20';
      case 'HIGH': return 'text-orange-400 bg-orange-400/10 border-orange-400/20';
      case 'MEDIUM': return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20';
      default: return 'text-slate-400 bg-slate-400/10 border-slate-400/20';
    }
  };

  const getCheckClass = () => {
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
          <CheckSquare className="w-4 h-4 text-emerald-400" />
          <span>TASKS DUE TODAY</span>
        </div>
        <span className="text-[10px] font-bold text-white/40">DUE</span>
      </div>

      <div className="flex-1 overflow-y-auto space-y-2 pr-1">
        {isLoading ? (
          <div className="space-y-2 py-1">
            <div className="h-8 bg-white/5 rounded-lg animate-pulse" />
            <div className="h-8 bg-white/5 rounded-lg animate-pulse" />
          </div>
        ) : tasks.length === 0 ? (
          <div className="h-full flex items-center justify-center text-white/30 text-[11px] font-medium italic">
            No active tasks.
          </div>
        ) : (
          tasks.map((task) => (
            <div
              key={task.id}
              className="flex items-center justify-between p-2 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors"
            >
              <div className="flex items-center gap-3">
                <button
                  disabled={toggleTaskMutation.isPending}
                  onClick={() =>
                    toggleTaskMutation.mutate({
                      taskId: task.id,
                      status: task.status === 'DONE' ? 'TODO' : 'DONE',
                    })
                  }
                  className="text-white/40 hover:text-white transition-colors shrink-0"
                >
                  {task.status === 'DONE' ? (
                    <Check className={clsx("w-4.5 h-4.5 stroke-[3px]", getCheckClass())} />
                  ) : (
                    <Circle className="w-4.5 h-4.5" />
                  )}
                </button>
                <span className={clsx(
                  "text-white text-xs font-medium truncate max-w-28",
                  task.status === 'DONE' && "line-through text-white/40"
                )}>
                  {task.title}
                </span>
              </div>

              <span className={clsx("text-[9px] px-1.5 py-0.5 rounded border font-semibold tracking-wider", getPriorityColor(task.priority))}>
                {task.priority}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
