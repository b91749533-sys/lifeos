'use client';

import React, { useEffect, useState, useRef } from 'react';
import { useStore } from '@/store/useStore';
import { Search, Sparkles, LayoutDashboard, CheckSquare, Target, Flame, Dumbbell, CircleDollarSign, BookOpen, FileText, GraduationCap, Code2, Settings } from 'lucide-react';
import { clsx } from 'clsx';

export default function CommandPalette() {
  const isOpen = useStore((state) => state.commandPaletteOpen);
  const setOpen = useStore((state) => state.setCommandPaletteOpen);
  const setActivePanel = useStore((state) => state.setActivePanel);
  const theme = useStore((state) => state.theme);
  const setTheme = useStore((state) => state.setTheme);

  const [query, setQuery] = useState('');
  const overlayRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Monitor Ctrl+K key binding
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setOpen(!isOpen);
      }
      if (e.key === 'Escape') {
        setOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, setOpen]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
    } else {
      setQuery('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const commands = [
    { id: 'dashboard', name: 'Open Dashboard', category: 'Navigation', icon: LayoutDashboard, action: () => setActivePanel('dashboard') },
    { id: 'ai', name: 'Ask Gemini Assistant', category: 'AI Copilot', icon: Sparkles, action: () => setActivePanel('ai') },
    { id: 'tasks', name: 'Manage Tasks & Subtasks', category: 'Navigation', icon: CheckSquare, action: () => setActivePanel('tasks') },
    { id: 'goals', name: 'Track Goals & Milestones', category: 'Navigation', icon: Target, action: () => setActivePanel('goals') },
    { id: 'habits', name: 'Toggle Daily Habits', category: 'Navigation', icon: Flame, action: () => setActivePanel('habits') },
    { id: 'health', name: 'Check Gym Logs & Nutrition', category: 'Navigation', icon: Dumbbell, action: () => setActivePanel('health') },
    { id: 'finance', name: 'View Expenses & Budget', category: 'Navigation', icon: CircleDollarSign, action: () => setActivePanel('finance') },
    { id: 'journal', name: 'Write Daily Journal Log', category: 'Navigation', icon: BookOpen, action: () => setActivePanel('journal') },
    { id: 'notes', name: 'Access Notepad Documents', category: 'Navigation', icon: FileText, action: () => setActivePanel('notes') },
    { id: 'study', name: 'Open Study Hub & Quizzes', category: 'Navigation', icon: GraduationCap, action: () => setActivePanel('study') },
    { id: 'dev', name: 'Open Developer Workspace', category: 'Navigation', icon: Code2, action: () => setActivePanel('dev') },
    { id: 'settings', name: 'Configure Settings', category: 'Navigation', icon: Settings, action: () => setActivePanel('settings') },
    { id: 'theme', name: `Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`, category: 'System Preferences', icon: Settings, action: () => setTheme(theme === 'dark' ? 'light' : 'dark') },
  ];

  const filteredCommands = commands.filter((c) =>
    c.name.toLowerCase().includes(query.toLowerCase()) ||
    c.category.toLowerCase().includes(query.toLowerCase())
  );

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === overlayRef.current) {
      setOpen(false);
    }
  };

  return (
    <div
      ref={overlayRef}
      onClick={handleOverlayClick}
      className="fixed inset-0 bg-slate-950/80 backdrop-blur-md flex items-center justify-center z-50 p-4 animate-fade-in"
    >
      <div className="w-full max-w-lg bg-slate-900/90 border border-white/10 rounded-2xl shadow-2xl flex flex-col overflow-hidden max-h-[400px]">
        {/* Search input bar */}
        <div className="flex items-center gap-3 px-4 py-3 border-b border-white/5">
          <Search className="w-4 h-4 text-white/40 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Type a command or search workspace..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 bg-transparent text-sm text-white placeholder-white/30 focus:outline-none"
          />
        </div>

        {/* Command list */}
        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {filteredCommands.length === 0 ? (
            <div className="text-center py-6 text-white/30 text-xs italic">
              No matching commands found.
            </div>
          ) : (
            filteredCommands.map((cmd) => {
              const Icon = cmd.icon;
              return (
                <button
                  key={cmd.id}
                  onClick={() => {
                    cmd.action();
                    setOpen(false);
                  }}
                  className="w-full flex items-center justify-between p-2.5 rounded-xl text-left hover:bg-white/5 transition-colors group/item"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-7 h-7 rounded-lg bg-white/5 flex items-center justify-center text-white/60 group-hover/item:text-white group-hover/item:bg-white/10 transition-colors">
                      <Icon className="w-4 h-4" />
                    </div>
                    <span className="text-xs font-semibold text-white/80 group-hover/item:text-white transition-colors">
                      {cmd.name}
                    </span>
                  </div>
                  <span className="text-[10px] text-white/30 uppercase font-bold bg-white/5 px-2 py-0.5 rounded border border-white/5">
                    {cmd.category}
                  </span>
                </button>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="px-4 py-2 border-t border-white/5 bg-slate-950/20 flex justify-between items-center text-[10px] text-white/30 font-medium">
          <span>Search or navigate workspace</span>
          <div className="flex gap-2">
            <span>ESC to close</span>
            <span>•</span>
            <span>↵ to select</span>
          </div>
        </div>
      </div>
    </div>
  );
}
