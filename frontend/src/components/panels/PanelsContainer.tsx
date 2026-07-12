'use client';

import React, { useState, useEffect } from 'react';
import { useStore } from '@/store/useStore';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import {
  Sparkles, CheckSquare, Target, Flame, Dumbbell, CircleDollarSign, BookOpen, FileText, GraduationCap, Code2, Settings,
  Plus, Check, Trash2, Calendar, Clock, Play, HelpCircle, Save, FolderOpen, Send, Moon, Sun, ArrowRight, Github, Code
} from 'lucide-react';
import { clsx } from 'clsx';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface PanelsContainerProps {
  onRefetchDashboard: () => void;
}

export default function PanelsContainer({ onRefetchDashboard }: PanelsContainerProps) {
  const activePanel = useStore((state) => state.activePanel);
  const setActivePanel = useStore((state) => state.setActivePanel);
  const accentColor = useStore((state) => state.accentColor);
  const setAccentColor = useStore((state) => state.setAccentColor);
  const theme = useStore((state) => state.theme);
  const setTheme = useStore((state) => state.setTheme);
  const queryClient = useQueryClient();

  const getAccentBtnClass = () => {
    switch (accentColor) {
      case 'emerald': return 'bg-emerald-500 hover:bg-emerald-600 text-slate-950 glow-emerald';
      case 'blue': return 'bg-blue-500 hover:bg-blue-600 text-slate-950 glow-blue';
      case 'indigo': return 'bg-indigo-500 hover:bg-indigo-600 text-slate-950 glow-indigo';
      case 'violet': return 'bg-violet-500 hover:bg-violet-600 text-slate-950 glow-violet';
      case 'rose': return 'bg-rose-500 hover:bg-rose-600 text-slate-950 glow-rose';
      default: return 'bg-emerald-500 hover:bg-emerald-600 text-slate-950 glow-emerald';
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

  const getAccentBgClass = () => {
    switch (accentColor) {
      case 'emerald': return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/25';
      case 'blue': return 'bg-blue-500/10 text-blue-400 border-blue-500/25';
      case 'indigo': return 'bg-indigo-500/10 text-indigo-400 border-indigo-500/25';
      case 'violet': return 'bg-violet-500/10 text-violet-400 border-violet-500/25';
      case 'rose': return 'bg-rose-500/10 text-rose-400 border-rose-500/25';
      default: return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/25';
    }
  };

  // Header helpers or bypass configs
  const headers = { 'x-user-email': 'youssef@example.com' };

  // ==========================================
  // 1. TASKS PANEL LOGIC & UI
  // ==========================================
  const { data: tasks = [], isLoading: tasksLoading } = useQuery({
    queryKey: ['tasks'],
    queryFn: async () => {
      const res = await axios.get('http://localhost:3001/api/tasks', { headers });
      return res.data;
    },
    enabled: activePanel === 'tasks',
  });

  const createTaskMutation = useMutation({
    mutationFn: async (title: string) => {
      const res = await axios.post('http://localhost:3001/api/tasks', { title }, { headers });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      onRefetchDashboard();
    },
  });

  const deleteTaskMutation = useMutation({
    mutationFn: async (id: string) => {
      await axios.delete(`http://localhost:3001/api/tasks/${id}`, { headers });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      onRefetchDashboard();
    },
  });

  const toggleTaskMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const res = await axios.patch(`http://localhost:3001/api/tasks/${id}`, { status }, { headers });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      onRefetchDashboard();
    },
  });

  const breakdownMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await axios.post(`http://localhost:3001/api/tasks/${id}/ai-breakdown`, {}, { headers });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      onRefetchDashboard();
    },
  });

  const [newTaskTitle, setNewTaskTitle] = useState('');

  // ==========================================
  // 2. GOALS PANEL LOGIC & UI
  // ==========================================
  const { data: goals = [], isLoading: goalsLoading } = useQuery({
    queryKey: ['goals'],
    queryFn: async () => {
      const res = await axios.get('http://localhost:3001/api/goals', { headers });
      return res.data;
    },
    enabled: activePanel === 'goals',
  });

  const createGoalMutation = useMutation({
    mutationFn: async (payload: { title: string; targetValue: number; unit: string }) => {
      const res = await axios.post('http://localhost:3001/api/goals', payload, { headers });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['goals'] });
      onRefetchDashboard();
    },
  });

  const [newGoalTitle, setNewGoalTitle] = useState('');
  const [newGoalTarget, setNewGoalTarget] = useState(10);
  const [newGoalUnit, setNewGoalUnit] = useState('');

  // ==========================================
  // 3. HABITS PANEL LOGIC & UI
  // ==========================================
  const { data: habitsStats, isLoading: habitsLoading } = useQuery({
    queryKey: ['habitsStats'],
    queryFn: async () => {
      const res = await axios.get('http://localhost:3001/api/habits/stats', { headers });
      return res.data;
    },
    enabled: activePanel === 'habits',
  });

  const createHabitMutation = useMutation({
    mutationFn: async (name: string) => {
      const res = await axios.post('http://localhost:3001/api/habits', { name }, { headers });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['habitsStats'] });
      onRefetchDashboard();
    },
  });

  const [newHabitName, setNewHabitName] = useState('');

  // ==========================================
  // 4. GYM & HEALTH PANEL LOGIC & UI
  // ==========================================
  const { data: healthData, isLoading: healthLoading } = useQuery({
    queryKey: ['healthData'],
    queryFn: async () => {
      const res = await axios.get('http://localhost:3001/api/health', { headers });
      return res.data;
    },
    enabled: activePanel === 'health',
  });

  const logNutritionMutation = useMutation({
    mutationFn: async (payload: { waterIntake?: number; sleepHours?: number; protein?: number }) => {
      const res = await axios.post('http://localhost:3001/api/health/nutrition', payload, { headers });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['healthData'] });
      onRefetchDashboard();
    },
  });

  const [waterInput, setWaterInput] = useState('');
  const [sleepInput, setSleepInput] = useState('');

  // ==========================================
  // 5. FINANCE PANEL LOGIC & UI
  // ==========================================
  const { data: financeData, isLoading: financeLoading } = useQuery({
    queryKey: ['financeData'],
    queryFn: async () => {
      const res = await axios.get('http://localhost:3001/api/finance', { headers });
      return res.data;
    },
    enabled: activePanel === 'finance',
  });

  const { data: financeInsights, refetch: getFinanceInsights } = useQuery({
    queryKey: ['financeInsights'],
    queryFn: async () => {
      const res = await axios.get('http://localhost:3001/api/finance/insights', { headers });
      return res.data;
    },
    enabled: false,
  });

  const logTransactionMutation = useMutation({
    mutationFn: async (payload: { amount: number; category: string; type: string }) => {
      const res = await axios.post('http://localhost:3001/api/finance/expenses', payload, { headers });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['financeData'] });
      onRefetchDashboard();
    },
  });

  const [txAmount, setTxAmount] = useState('');
  const [txCategory, setTxCategory] = useState('');
  const [txType, setTxType] = useState('EXPENSE');

  // ==========================================
  // 6. JOURNAL PANEL LOGIC & UI
  // ==========================================
  const { data: journals = [], isLoading: journalsLoading } = useQuery({
    queryKey: ['journals'],
    queryFn: async () => {
      const res = await axios.get('http://localhost:3001/api/journal', { headers });
      return res.data;
    },
    enabled: activePanel === 'journal',
  });

  const createJournalMutation = useMutation({
    mutationFn: async (payload: { title: string; content: string; mood: string }) => {
      const res = await axios.post('http://localhost:3001/api/journal', payload, { headers });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['journals'] });
    },
  });

  const [journalTitle, setJournalTitle] = useState('');
  const [journalContent, setJournalContent] = useState('');
  const [journalMood, setJournalMood] = useState('productive');

  // ==========================================
  // 7. NOTES PANEL LOGIC & UI
  // ==========================================
  const { data: notes = [], isLoading: notesLoading } = useQuery({
    queryKey: ['notes'],
    queryFn: async () => {
      const res = await axios.get('http://localhost:3001/api/notes', { headers });
      return res.data;
    },
    enabled: activePanel === 'notes',
  });

  const createNoteMutation = useMutation({
    mutationFn: async (payload: { title: string; content: string }) => {
      const res = await axios.post('http://localhost:3001/api/notes', payload, { headers });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes'] });
    },
  });

  const updateNoteMutation = useMutation({
    mutationFn: async ({ id, content }: { id: string; content: string }) => {
      const res = await axios.patch(`http://localhost:3001/api/notes/${id}`, { content }, { headers });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes'] });
    },
  });

  const [selectedNote, setSelectedNote] = useState<any>(null);
  const [noteTitle, setNoteTitle] = useState('');
  const [noteContent, setNoteContent] = useState('');

  // ==========================================
  // 8. STUDY HUB PANEL LOGIC & UI
  // ==========================================
  const { data: studyData, isLoading: studyLoading } = useQuery({
    queryKey: ['studyData'],
    queryFn: async () => {
      const res = await axios.get('http://localhost:3001/api/study', { headers });
      return res.data;
    },
    enabled: activePanel === 'study',
  });

  const generateQuizMutation = useMutation({
    mutationFn: async (payload: { topic: string; content: string }) => {
      const res = await axios.post('http://localhost:3001/api/study/generate-quiz', payload, { headers });
      return res.data;
    },
  });

  const [quizTopic, setQuizTopic] = useState('');
  const [quizContent, setQuizContent] = useState('');
  const [quizResult, setQuizResult] = useState<any>(null);

  // ==========================================
  // 9. DEVELOPER PANEL LOGIC & UI
  // ==========================================
  const { data: devWorkspace, isLoading: devLoading } = useQuery({
    queryKey: ['devWorkspace'],
    queryFn: async () => {
      const res = await axios.get('http://localhost:3001/api/workspace', { headers });
      return res.data;
    },
    enabled: activePanel === 'dev',
  });

  const [newProjectName, setNewProjectName] = useState('');
  const createProjectMutation = useMutation({
    mutationFn: async (name: string) => {
      const res = await axios.post('http://localhost:3001/api/workspace/projects', { name }, { headers });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['devWorkspace'] });
    },
  });

  // ==========================================
  // 10. AI ASSISTANT PANEL LOGIC & UI
  // ==========================================
  const { data: conversations = [], refetch: refetchChats } = useQuery({
    queryKey: ['conversations'],
    queryFn: async () => {
      const res = await axios.get('http://localhost:3001/api/ai/conversations', { headers });
      return res.data;
    },
    enabled: activePanel === 'ai',
  });

  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const { data: chatDetails, refetch: refetchChatDetails } = useQuery({
    queryKey: ['chatDetails', activeChatId],
    queryFn: async () => {
      const res = await axios.get(`http://localhost:3001/api/ai/conversations/${activeChatId}`, { headers });
      return res.data;
    },
    enabled: !!activeChatId,
  });

  const startChatMutation = useMutation({
    mutationFn: async () => {
      const res = await axios.post('http://localhost:3001/api/ai/conversations', {}, { headers });
      return res.data;
    },
    onSuccess: (newChat) => {
      refetchChats();
      setActiveChatId(newChat.id);
    },
  });

  const sendMessageMutation = useMutation({
    mutationFn: async (content: string) => {
      const res = await axios.post(`http://localhost:3001/api/ai/conversations/${activeChatId}/messages`, { content }, { headers });
      return res.data;
    },
    onSuccess: () => {
      refetchChatDetails();
    },
  });

  const [chatInput, setChatInput] = useState('');

  // Auto create chat on panel open if none exists
  useEffect(() => {
    if (activePanel === 'ai' && conversations.length === 0) {
      startChatMutation.mutate();
    } else if (activePanel === 'ai' && conversations.length > 0 && !activeChatId) {
      setActiveChatId(conversations[0].id);
    }
  }, [activePanel, conversations]);

  if (activePanel === 'dashboard') return null;

  return (
    <div className="w-full min-h-[calc(100vh-6rem)] p-6 rounded-3xl bg-slate-950/20 backdrop-blur-xl border border-white/5 shadow-2xl relative overflow-hidden animate-fade-in">
      
      {/* Top Banner with branding and path */}
      <div className="flex items-center justify-between mb-8 border-b border-white/5 pb-4">
        <div>
          <span className={clsx("text-[10px] uppercase font-bold tracking-wider", getAccentTextClass())}>
            LifeOS System Application
          </span>
          <h2 className="text-2xl font-extrabold text-white tracking-tight mt-1 capitalize">
            {activePanel === 'dev' ? 'Developer Workspace' : activePanel} Mode
          </h2>
        </div>
        <button
          onClick={() => setActivePanel('dashboard')}
          className="px-3.5 py-1.5 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 hover:text-white text-xs font-semibold text-white/70 transition-colors"
        >
          Close App
        </button>
      </div>

      {/* ==========================================
          1. TASKS PANEL
          ========================================== */}
      {activePanel === 'tasks' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Create new task..."
                value={newTaskTitle}
                onChange={(e) => setNewTaskTitle(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && newTaskTitle) {
                    createTaskMutation.mutate(newTaskTitle);
                    setNewTaskTitle('');
                  }
                }}
                className="flex-1 px-4 py-2.5 rounded-xl bg-white/5 border border-white/5 focus:border-white/10 focus:outline-none text-sm text-white placeholder-white/30"
              />
              <button
                onClick={() => {
                  if (newTaskTitle) {
                    createTaskMutation.mutate(newTaskTitle);
                    setNewTaskTitle('');
                  }
                }}
                className={clsx("px-4 py-2.5 rounded-xl text-xs font-bold transition-all", getAccentBtnClass())}
              >
                Add Task
              </button>
            </div>

            <div className="space-y-2.5">
              {tasksLoading ? (
                <div className="h-24 bg-white/5 rounded-2xl animate-pulse" />
              ) : tasks.length === 0 ? (
                <div className="p-8 text-center text-white/30 text-xs italic">No tasks created yet.</div>
              ) : (
                tasks.map((task: any) => (
                  <div key={task.id} className="p-4 rounded-2xl bg-white/5 border border-white/5 flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3">
                      <button
                        onClick={() => toggleTaskMutation.mutate({ id: task.id, status: task.status === 'DONE' ? 'TODO' : 'DONE' })}
                        className="mt-0.5 text-white/40 hover:text-white"
                      >
                        <div className={clsx("w-5 h-5 rounded border flex items-center justify-center transition-all",
                          task.status === 'DONE' ? "bg-emerald-500 border-emerald-500 text-slate-950" : "border-white/10"
                        )}>
                          {task.status === 'DONE' && <Check className="w-3.5 h-3.5 stroke-[3px]" />}
                        </div>
                      </button>
                      <div>
                        <h4 className={clsx("text-sm font-semibold text-white", task.status === 'DONE' && "line-through text-white/30")}>
                          {task.title}
                        </h4>
                        {task.subtasks && task.subtasks.length > 0 && (
                          <div className="mt-2 space-y-1 pl-1">
                            {task.subtasks.map((st: any) => (
                              <div key={st.id} className="flex items-center gap-2 text-[10px] text-white/50">
                                <span className={clsx("w-1.5 h-1.5 rounded-full", st.isCompleted ? "bg-emerald-400" : "bg-white/10")} />
                                <span className={st.isCompleted ? "line-through text-white/20" : ""}>{st.title}</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        disabled={breakdownMutation.isPending}
                        onClick={() => breakdownMutation.mutate(task.id)}
                        className={clsx("flex items-center gap-1.5 px-2 py-1 rounded text-[10px] font-bold border transition-all", getAccentBgClass())}
                      >
                        <Sparkles className="w-3 h-3" />
                        <span>{breakdownMutation.isPending && breakdownMutation.variables === task.id ? 'Breaking...' : 'AI Breakdown'}</span>
                      </button>
                      <button
                        onClick={() => deleteTaskMutation.mutate(task.id)}
                        className="p-1.5 rounded hover:bg-red-500/10 text-white/40 hover:text-red-400 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
          <div className="glass p-5 rounded-2xl border border-white/5 h-fit space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-purple-400" />
              <span>AI Task Copilot</span>
            </h3>
            <p className="text-white/60 text-xs leading-relaxed">
              Use **AI Breakdown** on any task to automatically disintegrate broad milestones into specific, highly actionable subtasks parsed by Gemini.
            </p>
          </div>
        </div>
      )}

      {/* ==========================================
          2. GOALS PANEL
          ========================================== */}
      {activePanel === 'goals' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input
              type="text"
              placeholder="Goal title (e.g. Save 50,000 MAD)"
              value={newGoalTitle}
              onChange={(e) => setNewGoalTitle(e.target.value)}
              className="px-4 py-2.5 rounded-xl bg-white/5 border border-white/5 focus:outline-none text-sm text-white"
            />
            <input
              type="number"
              placeholder="Target value"
              value={newGoalTarget || ''}
              onChange={(e) => setNewGoalTarget(Number(e.target.value))}
              className="px-4 py-2.5 rounded-xl bg-white/5 border border-white/5 focus:outline-none text-sm text-white font-mono"
            />
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Unit (MAD, kg, books)"
                value={newGoalUnit}
                onChange={(e) => setNewGoalUnit(e.target.value)}
                className="flex-1 px-4 py-2.5 rounded-xl bg-white/5 border border-white/5 focus:outline-none text-sm text-white"
              />
              <button
                onClick={() => {
                  if (newGoalTitle && newGoalTarget) {
                    createGoalMutation.mutate({
                      title: newGoalTitle,
                      targetValue: newGoalTarget,
                      unit: newGoalUnit || 'points',
                    });
                    setNewGoalTitle('');
                    setNewGoalUnit('');
                  }
                }}
                className={clsx("px-4 py-2.5 rounded-xl text-xs font-bold transition-all shrink-0", getAccentBtnClass())}
              >
                Add Goal
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {goalsLoading ? (
              <div className="h-32 bg-white/5 rounded-2xl animate-pulse" />
            ) : goals.length === 0 ? (
              <div className="col-span-2 p-8 text-center text-white/30 text-xs italic">No goals created yet.</div>
            ) : (
              goals.map((goal: any) => {
                const percent = Math.min(100, Math.round((goal.currentValue / goal.targetValue) * 100));
                return (
                  <div key={goal.id} className="p-5 rounded-2xl bg-white/5 border border-white/5 space-y-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="text-base font-bold text-white">{goal.title}</h4>
                        <span className="text-[10px] text-white/40 font-mono mt-1 block">
                          Target: {goal.targetValue} {goal.unit}
                        </span>
                      </div>
                      <span className={clsx("text-lg font-extrabold font-mono", getAccentTextClass())}>
                        {percent}%
                      </span>
                    </div>

                    {/* Progress Bar */}
                    <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                      <div
                        className={clsx("h-full rounded-full transition-all duration-500",
                          accentColor === 'emerald' && 'bg-emerald-500',
                          accentColor === 'blue' && 'bg-blue-500',
                          accentColor === 'indigo' && 'bg-indigo-500',
                          accentColor === 'violet' && 'bg-violet-500',
                          accentColor === 'rose' && 'bg-rose-500'
                        )}
                        style={{ width: `${percent}%` }}
                      />
                    </div>

                    {/* AI Suggestions Box */}
                    {goal.aiSuggestions && (
                      <div className="p-3 rounded-xl bg-purple-500/5 border border-purple-500/10 text-[11px] text-white/70 space-y-1">
                        <div className="flex items-center gap-1.5 text-purple-400 font-bold">
                          <Sparkles className="w-3.5 h-3.5" />
                          <span>AI Milestones Plan</span>
                        </div>
                        <p className="whitespace-pre-line leading-relaxed mt-1 text-white/60">
                          {goal.aiSuggestions}
                        </p>
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* ==========================================
          3. HABITS PANEL
          ========================================== */}
      {activePanel === 'habits' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Create new habit..."
                value={newHabitName}
                onChange={(e) => setNewHabitName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && newHabitName) {
                    createHabitMutation.mutate(newHabitName);
                    setNewHabitName('');
                  }
                }}
                className="flex-1 px-4 py-2.5 rounded-xl bg-white/5 border border-white/5 focus:outline-none text-sm text-white"
              />
              <button
                onClick={() => {
                  if (newHabitName) {
                    createHabitMutation.mutate(newHabitName);
                    setNewHabitName('');
                  }
                }}
                className={clsx("px-4 py-2.5 rounded-xl text-xs font-bold transition-all", getAccentBtnClass())}
              >
                Add Habit
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {habitsLoading ? (
                <div className="h-24 bg-white/5 rounded-2xl animate-pulse" />
              ) : !habitsStats?.habits || habitsStats.habits.length === 0 ? (
                <div className="col-span-2 p-8 text-center text-white/30 text-xs italic">No habits logged.</div>
              ) : (
                habitsStats.habits.map((habit: any) => (
                  <div key={habit.id} className="p-4 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-between">
                    <div className="flex flex-col">
                      <span className="text-sm font-semibold text-white">{habit.name}</span>
                      <span className="text-[10px] text-white/40 mt-1">Total completions: {habit.totalCompletions}</span>
                    </div>
                    <div className="flex items-center gap-1 bg-rose-500/10 border border-rose-500/20 px-2 py-0.5 rounded-full text-rose-400 font-mono text-xs">
                      <Flame className="w-3.5 h-3.5 fill-current" />
                      <span>{habit.streak}d streak</span>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* GitHub-style mock contributions grid for daily logs */}
            <div className="p-5 rounded-2xl bg-white/5 border border-white/5 space-y-3">
              <h3 className="text-xs font-bold text-white/60 uppercase tracking-wider">Habit Completion Activity Heatmap</h3>
              <div className="flex flex-wrap gap-1">
                {Array.from({ length: 52 * 7 }).map((_, i) => {
                  const level = Math.floor(Math.random() * 4);
                  return (
                    <div
                      key={i}
                      className={clsx("w-2 h-2 rounded-sm transition-all",
                        level === 0 && 'bg-white/5',
                        level === 1 && 'bg-emerald-500/20',
                        level === 2 && 'bg-emerald-500/50',
                        level === 3 && 'bg-emerald-500'
                      )}
                    />
                  );
                })}
              </div>
            </div>
          </div>

          <div className="glass p-5 rounded-2xl border border-white/5 h-fit space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-purple-400" />
              <span>AI Coaching Feedback</span>
            </h3>
            <p className="text-white/70 text-xs leading-relaxed italic whitespace-pre-line">
              {habitsStats?.coaching || "Log your habits to retrieve strategic motivation briefings."}
            </p>
          </div>
        </div>
      )}

      {/* ==========================================
          4. GYM & HEALTH PANEL
          ========================================== */}
      {activePanel === 'health' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-white/5 border border-white/5 space-y-3">
                <h4 className="text-xs font-bold text-white/60">Log Water Intake (Liters)</h4>
                <div className="flex gap-2">
                  <input
                    type="number"
                    step="0.1"
                    placeholder="e.g. 0.5"
                    value={waterInput}
                    onChange={(e) => setWaterInput(e.target.value)}
                    className="flex-1 px-3 py-2 rounded-xl bg-white/5 border border-white/5 text-xs text-white"
                  />
                  <button
                    onClick={() => {
                      if (waterInput) {
                        logNutritionMutation.mutate({ waterIntake: Number(waterInput) });
                        setWaterInput('');
                      }
                    }}
                    className={clsx("px-3 py-2 rounded-xl text-[11px] font-bold transition-all", getAccentBtnClass())}
                  >
                    Log Water
                  </button>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-white/5 border border-white/5 space-y-3">
                <h4 className="text-xs font-bold text-white/60">Log Sleep Duration (Hours)</h4>
                <div className="flex gap-2">
                  <input
                    type="number"
                    step="0.5"
                    placeholder="e.g. 7.5"
                    value={sleepInput}
                    onChange={(e) => setSleepInput(e.target.value)}
                    className="flex-1 px-3 py-2 rounded-xl bg-white/5 border border-white/5 text-xs text-white"
                  />
                  <button
                    onClick={() => {
                      if (sleepInput) {
                        logNutritionMutation.mutate({ sleepHours: Number(sleepInput) });
                        setSleepInput('');
                      }
                    }}
                    className={clsx("px-3 py-2 rounded-xl text-[11px] font-bold transition-all", getAccentBtnClass())}
                  >
                    Log Sleep
                  </button>
                </div>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-white/5 border border-white/5 space-y-4">
              <h3 className="text-sm font-bold text-white">Workout Frequency & Exercise Logs</h3>
              {healthLoading ? (
                <div className="h-32 bg-white/5 rounded-2xl animate-pulse" />
              ) : healthData?.workouts?.length === 0 ? (
                <div className="p-6 text-center text-white/30 text-xs italic">No workout history logged.</div>
              ) : (
                <div className="space-y-3">
                  {healthData?.workouts?.map((w: any) => (
                    <div key={w.id} className="p-3.5 rounded-xl bg-white/5 border border-white/5 flex flex-col gap-1.5">
                      <div className="flex justify-between items-center text-xs">
                        <span className="font-bold text-white">{w.title}</span>
                        <span className="text-white/40">{new Date(w.createdAt).toLocaleDateString()}</span>
                      </div>
                      {w.exercises && w.exercises.length > 0 && (
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-1">
                          {w.exercises.map((ex: any) => (
                            <div key={ex.id} className="text-[10px] text-white/60 bg-white/5 p-1.5 rounded">
                              <span className="font-bold text-white block">{ex.name}</span>
                              <span className="text-white/40">{ex.sets}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="glass p-5 rounded-2xl border border-white/5 h-fit space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-purple-400" />
              <span>AI Health Coaching</span>
            </h3>
            <p className="text-white/70 text-xs leading-relaxed italic">
              Reviewing your training parameters, sleep quality, and daily hydration level to construct physiological hypertrophy recommendations.
            </p>
          </div>
        </div>
      )}

      {/* ==========================================
          5. FINANCE PANEL
          ========================================== */}
      {activePanel === 'finance' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <input
                type="number"
                placeholder="Amount (MAD)"
                value={txAmount}
                onChange={(e) => setTxAmount(e.target.value)}
                className="px-3.5 py-2 rounded-xl bg-white/5 border border-white/5 text-xs text-white"
              />
              <input
                type="text"
                placeholder="Category (e.g. Food)"
                value={txCategory}
                onChange={(e) => setTxCategory(e.target.value)}
                className="px-3.5 py-2 rounded-xl bg-white/5 border border-white/5 text-xs text-white"
              />
              <div className="flex gap-2">
                <select
                  value={txType}
                  onChange={(e) => setTxType(e.target.value)}
                  className="px-2 py-2 rounded-xl bg-white/5 border border-white/5 text-xs text-white focus:outline-none"
                >
                  <option className="bg-slate-900" value="EXPENSE">Expense</option>
                  <option className="bg-slate-900" value="INCOME">Income</option>
                  <option className="bg-slate-900" value="SAVING">Saving</option>
                </select>
                <button
                  onClick={() => {
                    if (txAmount && txCategory) {
                      logTransactionMutation.mutate({
                        amount: Number(txAmount),
                        category: txCategory,
                        type: txType,
                      });
                      setTxAmount('');
                      setTxCategory('');
                    }
                  }}
                  className={clsx("px-3.5 py-2 rounded-xl text-xs font-bold transition-all shrink-0", getAccentBtnClass())}
                >
                  Log
                </button>
              </div>
            </div>

            {/* Transactions lists */}
            <div className="p-5 rounded-2xl bg-white/5 border border-white/5 space-y-3">
              <h3 className="text-sm font-bold text-white">Recent Transactions</h3>
              {financeLoading ? (
                <div className="h-24 bg-white/5 rounded animate-pulse" />
              ) : !financeData?.expenses || financeData.expenses.length === 0 ? (
                <div className="text-center text-white/30 text-xs italic py-4">No logged transactions.</div>
              ) : (
                <div className="space-y-2">
                  {financeData.expenses.slice(0, 10).map((tx: any) => (
                    <div key={tx.id} className="flex justify-between items-center p-2 rounded bg-white/5 text-xs border border-white/5">
                      <div className="flex flex-col">
                        <span className="font-bold text-white">{tx.category}</span>
                        <span className="text-[10px] text-white/40">{new Date(tx.date).toLocaleDateString()}</span>
                      </div>
                      <span className={clsx("font-bold font-mono",
                        tx.type === 'INCOME' ? 'text-emerald-400' : 'text-red-400'
                      )}>
                        {tx.type === 'INCOME' ? '+' : '-'}{tx.amount} MAD
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="glass p-5 rounded-2xl border border-white/5 h-fit space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-purple-400" />
              <span>AI Spending insights</span>
            </h3>
            <button
              onClick={() => getFinanceInsights()}
              className="w-full py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold transition-colors"
            >
              Ask AI Financial Advisor
            </button>
            {financeInsights?.insights && (
              <p className="text-white/70 text-xs leading-relaxed italic whitespace-pre-line mt-3 border-t border-white/5 pt-3">
                {financeInsights.insights}
              </p>
            )}
          </div>
        </div>
      )}

      {/* ==========================================
          6. JOURNAL PANEL
          ========================================== */}
      {activePanel === 'journal' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            <div className="space-y-3 bg-white/5 p-5 rounded-2xl border border-white/5">
              <input
                type="text"
                placeholder="Entry title..."
                value={journalTitle}
                onChange={(e) => setJournalTitle(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/5 focus:outline-none text-sm text-white"
              />
              <textarea
                placeholder="Write your reflection today..."
                value={journalContent}
                onChange={(e) => setJournalContent(e.target.value)}
                className="w-full h-48 px-4 py-3 rounded-xl bg-white/5 border border-white/5 focus:outline-none text-sm text-white resize-none"
              />
              <div className="flex justify-between items-center">
                <div className="flex gap-1">
                  {['happy', 'productive', 'anxious', 'sad'].map((mood) => (
                    <button
                      key={mood}
                      onClick={() => setJournalMood(mood)}
                      className={clsx("px-2.5 py-1 rounded-xl text-[10px] font-bold border capitalize transition-all",
                        journalMood === mood ? getAccentBgClass() : "border-white/5 text-white/40"
                      )}
                    >
                      {mood}
                    </button>
                  ))}
                </div>
                <button
                  onClick={() => {
                    if (journalTitle && journalContent) {
                      createJournalMutation.mutate({
                        title: journalTitle,
                        content: journalContent,
                        mood: journalMood,
                      });
                      setJournalTitle('');
                      setJournalContent('');
                    }
                  }}
                  className={clsx("px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5", getAccentBtnClass())}
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Save Log</span>
                </button>
              </div>
            </div>
          </div>

          <div className="glass p-5 rounded-2xl border border-white/5 max-h-[400px] overflow-y-auto space-y-4">
            <h3 className="text-sm font-bold text-white">Previous Logs</h3>
            {journalsLoading ? (
              <div className="h-12 bg-white/5 rounded animate-pulse" />
            ) : journals.length === 0 ? (
              <div className="text-center text-white/30 text-xs italic py-4">No journal entries.</div>
            ) : (
              journals.map((j: any) => (
                <div key={j.id} className="p-3.5 rounded-xl bg-white/5 border border-white/5 space-y-2">
                  <div className="flex justify-between items-center text-[10px]">
                    <span className="font-bold text-white">{j.title}</span>
                    <span className="text-white/40">{new Date(j.createdAt).toLocaleDateString()}</span>
                  </div>
                  <p className="text-[11px] text-white/60 line-clamp-3 leading-relaxed">{j.content}</p>
                  {j.aiReflection && (
                    <div className="border-t border-white/5 pt-2 text-[10px] text-purple-400 italic">
                      AI: {j.aiReflection}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* ==========================================
          7. NOTES PANEL
          ========================================== */}
      {activePanel === 'notes' && (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-1 glass p-4 rounded-2xl border border-white/5 space-y-3 h-[450px] overflow-y-auto">
            <div className="flex justify-between items-center pb-2 border-b border-white/5">
              <span className="text-xs font-bold text-white/60">Documents</span>
              <button
                onClick={() => {
                  createNoteMutation.mutate({
                    title: 'New Document',
                    content: 'Write notes here...',
                  });
                }}
                className="p-1 rounded bg-white/5 border border-white/5 hover:bg-white/10 text-white"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-1.5">
              {notesLoading ? (
                <div className="h-10 bg-white/5 rounded animate-pulse" />
              ) : notes.length === 0 ? (
                <div className="text-center text-white/30 text-xs italic py-4">No notes created.</div>
              ) : (
                notes.map((n: any) => (
                  <button
                    key={n.id}
                    onClick={() => {
                      setSelectedNote(n);
                      setNoteTitle(n.title);
                      setNoteContent(n.content);
                    }}
                    className={clsx("w-full text-left p-2.5 rounded-xl text-xs font-medium border transition-all truncate block",
                      selectedNote?.id === n.id ? getAccentBgClass() : "border-transparent text-white/60 hover:text-white hover:bg-white/5"
                    )}
                  >
                    {n.title}
                  </button>
                ))
              )}
            </div>
          </div>

          <div className="lg:col-span-3 bg-white/5 p-5 rounded-2xl border border-white/5 h-[450px] flex flex-col justify-between">
            {selectedNote ? (
              <div className="flex-1 flex flex-col justify-between">
                <div className="space-y-4">
                  <input
                    type="text"
                    value={noteTitle}
                    onChange={(e) => setNoteTitle(e.target.value)}
                    className="w-full bg-transparent border-b border-white/5 pb-2 text-base font-bold text-white focus:outline-none"
                  />
                  <textarea
                    value={noteContent}
                    onChange={(e) => setNoteContent(e.target.value)}
                    className="w-full h-72 bg-transparent text-xs text-white/80 leading-relaxed focus:outline-none resize-none"
                  />
                </div>

                <div className="flex justify-end gap-2 border-t border-white/5 pt-3">
                  <button
                    onClick={() => {
                      updateNoteMutation.mutate({
                        id: selectedNote.id,
                        content: noteContent,
                      });
                    }}
                    className={clsx("px-4 py-2 rounded-xl text-xs font-bold transition-all", getAccentBtnClass())}
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex-1 flex items-center justify-center text-white/30 text-xs italic">
                Select a document from the file menu or create a new note.
              </div>
            )}
          </div>
        </div>
      )}

      {/* ==========================================
          8. STUDY HUB PANEL
          ========================================== */}
      {activePanel === 'study' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            <div className="p-5 rounded-2xl bg-white/5 border border-white/5 space-y-4">
              <h3 className="text-sm font-bold text-white">Course Syllabus & Exam Calendars</h3>
              {studyLoading ? (
                <div className="h-20 bg-white/5 rounded animate-pulse" />
              ) : !studyData?.courses || studyData.courses.length === 0 ? (
                <div className="p-6 text-center text-white/30 text-xs italic">No course records found.</div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {studyData.courses.map((c: any) => (
                    <div key={c.id} className="p-4 rounded-xl bg-white/5 border border-white/5 flex flex-col justify-between">
                      <div>
                        <span className="text-[10px] text-white/40 font-mono tracking-wide">{c.code || 'COURSES'}</span>
                        <h4 className="text-sm font-bold text-white mt-0.5">{c.name}</h4>
                      </div>
                      <div className="flex justify-between items-center mt-4">
                        <span className="text-[10px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20 font-bold uppercase">
                          GPA weight: {c.gpaWeight}
                        </span>
                        <span className="font-mono text-white text-xs font-bold">Grade: {c.grade || 'Pending'}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="glass p-5 rounded-2xl border border-white/5 h-fit space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-purple-400" />
              <span>AI Study Quiz Builder</span>
            </h3>
            <div className="space-y-3">
              <input
                type="text"
                placeholder="Topic (e.g. Distributed Systems)"
                value={quizTopic}
                onChange={(e) => setQuizTopic(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/5 text-xs text-white"
              />
              <textarea
                placeholder="Paste key notes or facts here..."
                value={quizContent}
                onChange={(e) => setQuizContent(e.target.value)}
                className="w-full h-24 px-3 py-2 rounded-xl bg-white/5 border border-white/5 text-xs text-white resize-none"
              />
              <button
                disabled={generateQuizMutation.isPending}
                onClick={() => {
                  if (quizTopic && quizContent) {
                    generateQuizMutation.mutate(
                      { topic: quizTopic, content: quizContent },
                      {
                        onSuccess: (data) => {
                          setQuizResult(data);
                        },
                      }
                    );
                  }
                }}
                className="w-full py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold transition-colors"
              >
                {generateQuizMutation.isPending ? 'Formulating...' : 'Generate 3-Question Quiz'}
              </button>
            </div>

            {quizResult && (
              <div className="mt-4 border-t border-white/5 pt-4 space-y-3">
                <h4 className="text-xs font-bold text-white">Your Generated Test:</h4>
                {quizResult.map((q: any, i: number) => (
                  <div key={i} className="space-y-1.5 text-[11px]">
                    <p className="font-semibold text-white/90">{i+1}. {q.question}</p>
                    <div className="grid grid-cols-2 gap-1.5">
                      {q.choices.map((c: string, idx: number) => (
                        <div key={idx} className={clsx("p-1.5 rounded border text-[10px]",
                          idx === q.correctIndex ? "border-emerald-500/30 bg-emerald-500/5 text-emerald-400 font-bold" : "border-white/5 text-white/50"
                        )}>
                          {c}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ==========================================
          9. DEVELOPER PANEL
          ========================================== */}
      {activePanel === 'dev' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            <div className="p-5 rounded-2xl bg-white/5 border border-white/5 space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-sm font-bold text-white">Project Roadmaps</h3>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="New Project..."
                    value={newProjectName}
                    onChange={(e) => setNewProjectName(e.target.value)}
                    className="px-3 py-1.5 rounded-xl bg-white/5 border border-white/5 text-xs text-white"
                  />
                  <button
                    onClick={() => {
                      if (newProjectName) {
                        createProjectMutation.mutate(newProjectName);
                        setNewProjectName('');
                      }
                    }}
                    className={clsx("px-3 py-1.5 rounded-xl text-[10px] font-bold transition-all", getAccentBtnClass())}
                  >
                    Add
                  </button>
                </div>
              </div>

              {devLoading ? (
                <div className="h-20 bg-white/5 rounded animate-pulse" />
              ) : devWorkspace.length === 0 ? (
                <div className="text-center text-white/30 text-xs italic py-4">No active roadmaps.</div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {devWorkspace.map((project: any) => (
                    <div key={project.id} className="p-4 rounded-xl bg-white/5 border border-white/5 space-y-2">
                      <h4 className="text-sm font-bold text-white flex items-center gap-1.5">
                        <Code className="w-4 h-4 text-emerald-400" />
                        <span>{project.name}</span>
                      </h4>
                      <span className="text-[10px] bg-white/5 text-white/40 px-2 py-0.5 rounded border border-white/5 uppercase font-bold tracking-wider">
                        Status: {project.status}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="glass p-5 rounded-2xl border border-white/5 space-y-4 h-fit">
            <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
              <Github className="w-4 h-4 text-white" />
              <span>Git Commits Activity</span>
            </h3>
            <div className="space-y-3.5">
              {[
                { message: 'refactor: implement modular AI assistant routing', author: 'Youssef Manssouri', date: '2h ago', sha: 'a5c8e2b' },
                { message: 'feat: add premium glassmorphism OS sidebar', author: 'Youssef Manssouri', date: '5h ago', sha: 'e92d4f1' },
                { message: 'chore: configure SQLite Prisma provider', author: 'Youssef Manssouri', date: '1d ago', sha: 'c4a9d70' }
              ].map((c, idx) => (
                <div key={idx} className="flex gap-2 text-xs border-l-2 border-white/10 pl-3 relative">
                  <div className="absolute -left-1.5 top-1.5 w-2.5 h-2.5 rounded-full bg-emerald-400" />
                  <div className="flex flex-col gap-0.5">
                    <span className="font-semibold text-white/80 text-[11px] leading-tight">{c.message}</span>
                    <span className="text-[10px] text-white/40">{c.author} • {c.date} • <span className="font-mono">{c.sha}</span></span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ==========================================
          10. AI ASSISTANT PANEL
          ========================================== */}
      {activePanel === 'ai' && (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-[480px]">
          <div className="lg:col-span-1 glass p-4 rounded-2xl border border-white/5 flex flex-col justify-between h-full">
            <div className="space-y-3 overflow-y-auto flex-1 pr-1">
              <div className="flex justify-between items-center border-b border-white/5 pb-2">
                <span className="text-xs font-bold text-white/60">Discussions</span>
                <button
                  onClick={() => startChatMutation.mutate()}
                  className="p-1 rounded bg-white/5 border border-white/5 hover:bg-white/10 text-white"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>

              {conversations.map((c: any) => (
                <button
                  key={c.id}
                  onClick={() => setActiveChatId(c.id)}
                  className={clsx("w-full text-left p-2.5 rounded-xl text-xs border font-medium truncate block",
                    activeChatId === c.id ? getAccentBgClass() : "border-transparent text-white/60 hover:text-white hover:bg-white/5"
                  )}
                >
                  {c.title}
                </button>
              ))}
            </div>
          </div>

          <div className="lg:col-span-3 bg-white/5 rounded-2xl border border-white/5 flex flex-col justify-between h-full overflow-hidden">
            {activeChatId ? (
              <div className="flex-1 flex flex-col justify-between overflow-hidden">
                {/* Chat Message Lists */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {chatDetails?.messages?.map((msg: any) => (
                    <div key={msg.id} className={clsx("flex gap-3 text-xs max-w-lg items-start",
                      msg.sender === 'USER' ? 'ml-auto justify-end' : 'mr-auto justify-start'
                    )}>
                      {msg.sender !== 'USER' && (
                        <div className="w-7 h-7 rounded-full bg-purple-500/20 border border-purple-500/35 flex items-center justify-center shrink-0">
                          <Sparkles className="w-4 h-4 text-purple-400" />
                        </div>
                      )}
                      <div className={clsx("p-3 rounded-2xl border leading-relaxed text-justify",
                        msg.sender === 'USER' 
                          ? 'bg-slate-900 border-white/5 text-white/95 rounded-tr-none' 
                          : 'bg-white/5 border-white/5 text-white/80 rounded-tl-none whitespace-pre-wrap'
                      )}>
                        {msg.content}
                      </div>
                    </div>
                  ))}
                  {sendMessageMutation.isPending && (
                    <div className="flex gap-3 text-xs mr-auto justify-start items-start">
                      <div className="w-7 h-7 rounded-full bg-purple-500/20 border border-purple-500/35 flex items-center justify-center shrink-0 animate-pulse">
                        <Sparkles className="w-4 h-4 text-purple-400" />
                      </div>
                      <div className="p-3 rounded-2xl border bg-white/5 border-white/5 text-white/40 rounded-tl-none animate-pulse">
                        Generating intelligence analysis...
                      </div>
                    </div>
                  )}
                </div>

                {/* Input block */}
                <div className="p-4 border-t border-white/5 bg-slate-950/20 flex gap-2">
                  <input
                    type="text"
                    placeholder="Ask AI (e.g. Plan my day, Analyze my spending)..."
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && chatInput && !sendMessageMutation.isPending) {
                        sendMessageMutation.mutate(chatInput);
                        setChatInput('');
                      }
                    }}
                    className="flex-1 px-4 py-2.5 rounded-xl bg-white/5 border border-white/5 focus:outline-none text-xs text-white"
                  />
                  <button
                    disabled={sendMessageMutation.isPending || !chatInput}
                    onClick={() => {
                      sendMessageMutation.mutate(chatInput);
                      setChatInput('');
                    }}
                    className={clsx("px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center", getAccentBtnClass())}
                  >
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex-1 flex items-center justify-center text-white/30 text-xs italic">
                Select or initialize a chat thread to query the AI workspace copilot.
              </div>
            )}
          </div>
        </div>
      )}

      {/* ==========================================
          10. SETTINGS PANEL
          ========================================== */}
      {activePanel === 'settings' && (
        <div className="max-w-md space-y-6">
          <div className="p-5 rounded-2xl bg-white/5 border border-white/5 space-y-4">
            <h3 className="text-sm font-bold text-white">Visual Personalization</h3>
            
            <div className="space-y-3">
              <span className="text-[11px] text-white/40 block font-bold uppercase tracking-wider">Accent System Color</span>
              <div className="flex gap-2">
                {[
                  { name: 'emerald', hex: 'bg-emerald-500' },
                  { name: 'blue', hex: 'bg-blue-500' },
                  { name: 'indigo', hex: 'bg-indigo-500' },
                  { name: 'violet', hex: 'bg-violet-500' },
                  { name: 'rose', hex: 'bg-rose-500' }
                ].map((color) => (
                  <button
                    key={color.name}
                    onClick={() => setAccentColor(color.name)}
                    className={clsx("w-8 h-8 rounded-full border-2 transition-all flex items-center justify-center",
                      color.hex,
                      accentColor === color.name ? 'border-white scale-110 shadow-lg' : 'border-transparent hover:scale-105'
                    )}
                  >
                    {accentColor === color.name && <Check className="w-4 h-4 text-slate-950 stroke-[3px]" />}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-3 border-t border-white/5 pt-4">
              <span className="text-[11px] text-white/40 block font-bold uppercase tracking-wider">System Interface Theme</span>
              <div className="flex gap-2">
                <button
                  onClick={() => setTheme('dark')}
                  className={clsx("flex-1 p-2.5 rounded-xl border text-xs font-semibold flex items-center justify-center gap-2 transition-all",
                    theme === 'dark' ? getAccentBgClass() : "border-white/5 text-white/40 hover:text-white/60"
                  )}
                >
                  <Moon className="w-4 h-4" />
                  <span>Dark Space Theme</span>
                </button>
                <button
                  onClick={() => setTheme('light')}
                  className={clsx("flex-1 p-2.5 rounded-xl border text-xs font-semibold flex items-center justify-center gap-2 transition-all",
                    theme === 'light' ? getAccentBgClass() : "border-white/5 text-white/40 hover:text-white/60"
                  )}
                >
                  <Sun className="w-4 h-4" />
                  <span>Light Glass Theme</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
