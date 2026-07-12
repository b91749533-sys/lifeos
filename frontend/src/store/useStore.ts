import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Widget {
  id: string;
  name: string;
  visible: boolean;
  order: number;
}

interface PomodoroState {
  timeLeft: number;
  isActive: boolean;
  mode: 'work' | 'break';
  completedCycles: number;
}

interface OSState {
  activePanel: string; // 'dashboard' | 'tasks' | 'goals' | 'habits' | 'health' | 'finance' | 'journal' | 'notes' | 'study' | 'dev' | 'ai' | 'settings'
  setActivePanel: (panel: string) => void;
  
  theme: 'dark' | 'light';
  setTheme: (theme: 'dark' | 'light') => void;
  
  accentColor: string; // 'emerald' | 'blue' | 'indigo' | 'violet' | 'rose'
  setAccentColor: (color: string) => void;
  
  widgets: Widget[];
  toggleWidget: (id: string) => void;
  setWidgetOrder: (widgets: Widget[]) => void;
  
  pomodoro: PomodoroState;
  startPomodoro: () => void;
  pausePomodoro: () => void;
  resetPomodoro: () => void;
  tickPomodoro: () => void;
  setPomodoroMode: (mode: 'work' | 'break') => void;
  
  commandPaletteOpen: boolean;
  setCommandPaletteOpen: (open: boolean) => void;
}

const defaultWidgets: Widget[] = [
  { id: 'ai-briefing', name: 'AI Daily Briefing', visible: true, order: 0 },
  { id: 'schedule', name: 'Today\'s Schedule', visible: true, order: 1 },
  { id: 'habits', name: 'Daily Habits', visible: true, order: 2 },
  { id: 'tasks', name: 'Tasks Due', visible: true, order: 3 },
  { id: 'pomodoro', name: 'Pomodoro Focus', visible: true, order: 4 },
  { id: 'finance', name: 'Finance Tracker', visible: true, order: 5 },
  { id: 'gym', name: 'Health & Gym', visible: true, order: 6 },
  { id: 'weather', name: 'Weather Widget', visible: true, order: 7 },
];

export const useStore = create<OSState>()(
  persist(
    (set) => ({
      activePanel: 'dashboard',
      setActivePanel: (panel) => set({ activePanel: panel }),
      
      theme: 'dark',
      setTheme: (theme) => set({ theme }),
      
      accentColor: 'emerald',
      setAccentColor: (accentColor) => set({ accentColor }),
      
      widgets: defaultWidgets,
      toggleWidget: (id) =>
        set((state) => ({
          widgets: state.widgets.map((w) =>
            w.id === id ? { ...w, visible: !w.visible } : w
          ),
        })),
      setWidgetOrder: (widgets) => set({ widgets }),
      
      pomodoro: {
        timeLeft: 1500, // 25 minutes
        isActive: false,
        mode: 'work',
        completedCycles: 0,
      },
      startPomodoro: () =>
        set((state) => ({ pomodoro: { ...state.pomodoro, isActive: true } })),
      pausePomodoro: () =>
        set((state) => ({ pomodoro: { ...state.pomodoro, isActive: false } })),
      resetPomodoro: () =>
        set((state) => ({
          pomodoro: {
            ...state.pomodoro,
            timeLeft: state.pomodoro.mode === 'work' ? 1500 : 300,
            isActive: false,
          },
        })),
      tickPomodoro: () =>
        set((state) => {
          const newTime = state.pomodoro.timeLeft - 1;
          if (newTime <= 0) {
            const nextMode = state.pomodoro.mode === 'work' ? 'break' : 'work';
            return {
              pomodoro: {
                timeLeft: nextMode === 'work' ? 1500 : 300,
                isActive: false, // pause on complete
                mode: nextMode,
                completedCycles:
                  state.pomodoro.mode === 'work'
                    ? state.pomodoro.completedCycles + 1
                    : state.pomodoro.completedCycles,
              },
            };
          }
          return { pomodoro: { ...state.pomodoro, timeLeft: newTime } };
        }),
      setPomodoroMode: (mode) =>
        set((state) => ({
          pomodoro: {
            ...state.pomodoro,
            mode,
            timeLeft: mode === 'work' ? 1500 : 300,
            isActive: false,
          },
        })),
      
      commandPaletteOpen: false,
      setCommandPaletteOpen: (commandPaletteOpen) => set({ commandPaletteOpen }),
    }),
    {
      name: 'lifeos-store',
      partialize: (state) => ({
        activePanel: state.activePanel,
        theme: state.theme,
        accentColor: state.accentColor,
        widgets: state.widgets,
        pomodoro: state.pomodoro,
      }),
    }
  )
);
