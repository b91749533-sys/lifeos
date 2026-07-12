'use client';

import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useStore } from '@/store/useStore';
import StatusBar from '@/components/StatusBar';
import FloatingSidebar from '@/components/FloatingSidebar';
import DashboardGrid from '@/components/DashboardGrid';
import PanelsContainer from '@/components/panels/PanelsContainer';
import CommandPalette from '@/components/CommandPalette';
import { Cpu, RefreshCw, AlertCircle, Sparkles, ArrowRight, Shield, Zap, Check, Lock, Mail, User, Info } from 'lucide-react';
import { clsx } from 'clsx';

export default function Home() {
  const activePanel = useStore((state) => state.activePanel);
  const theme = useStore((state) => state.theme);
  const accentColor = useStore((state) => state.accentColor);

  // Authentication & Landing Page State
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup' | 'forgot' | 'verify' | null>(null);
  const [emailInput, setEmailInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [nameInput, setNameInput] = useState('');

  // Fetch central Dashboard data from NestJS backend
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['dashboard'],
    queryFn: async () => {
      const response = await axios.get('http://localhost:3001/api/dashboard', {
        headers: { 'x-user-email': 'youssef@example.com' },
      });
      return response.data;
    },
    enabled: isLoggedIn, // Only query when logged in
    refetchInterval: 30000,
  });

  const getAccentBgClass = () => {
    switch (accentColor) {
      case 'emerald': return 'bg-emerald-500 hover:bg-emerald-600 text-slate-950';
      case 'blue': return 'bg-blue-500 hover:bg-blue-600 text-slate-950';
      case 'indigo': return 'bg-indigo-500 hover:bg-indigo-600 text-slate-950';
      case 'violet': return 'bg-violet-500 hover:bg-violet-600 text-slate-950';
      case 'rose': return 'bg-rose-500 hover:bg-rose-600 text-slate-950';
      default: return 'bg-emerald-500 hover:bg-emerald-600 text-slate-950';
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

  // MOCK LOGIN / SIGNUP PROCESS
  const handleAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (authMode === 'login') {
      setIsLoggedIn(true);
      setAuthMode(null);
    } else if (authMode === 'signup') {
      setAuthMode('verify');
    } else if (authMode === 'verify') {
      setIsLoggedIn(true);
      setAuthMode(null);
    } else if (authMode === 'forgot') {
      setAuthMode('login');
    }
  };

  // IF NOT LOGGED IN, RENDER PREMIUM LANDING PAGE
  if (!isLoggedIn) {
    return (
      <main className="min-h-screen bg-[#070913] text-white overflow-x-hidden font-sans relative">
        {/* Animated Radial Space Glows */}
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-purple-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/2 right-1/4 w-[700px] h-[700px] bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

        {/* Floating Landing Header */}
        <header className="w-full max-w-7xl mx-auto px-6 h-20 flex justify-between items-center relative z-20">
          <div className="flex items-center gap-2">
            <Cpu className="w-5 h-5 text-emerald-400" />
            <span className="font-extrabold text-sm tracking-wider uppercase">LifeOS</span>
          </div>

          <div className="flex gap-4">
            <button 
              onClick={() => {
                setAuthMode('login');
                setEmailInput('youssef@example.com');
              }}
              className="text-xs font-semibold text-white/70 hover:text-white transition-colors"
            >
              Sign In
            </button>
            <button 
              onClick={() => {
                setAuthMode('signup');
                setEmailInput('');
              }}
              className="px-4 py-2 bg-white text-slate-950 rounded-xl text-xs font-bold hover:bg-white/90 transition-all shadow-lg"
            >
              Get Started
            </button>
          </div>
        </header>

        {/* HERO SECTION */}
        <section className="max-w-5xl mx-auto px-6 pt-16 pb-24 text-center space-y-8 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/5 bg-white/5 text-[10px] font-semibold text-emerald-400/90 tracking-wide uppercase">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Designed By Youssef Manssouri</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight leading-none text-white max-w-4xl mx-auto bg-clip-text text-transparent bg-gradient-to-b from-white via-white to-white/60">
            The Personal Operating System for your Life.
          </h1>

          <p className="text-sm md:text-base text-white/50 max-w-xl mx-auto leading-relaxed">
            Centralize tasks, goals, habits, workouts, finances, and journal entries into one intelligent workspace powered by Gemini AI.
          </p>

          <div className="flex justify-center gap-4">
            <button
              onClick={() => setIsLoggedIn(true)}
              className="px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold rounded-xl text-xs flex items-center gap-2 shadow-xl glow-emerald transition-all"
            >
              <span>Demo Quick Entry</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => setAuthMode('login')}
              className="px-6 py-3 bg-white/5 border border-white/10 hover:bg-white/10 font-bold rounded-xl text-xs transition-colors"
            >
              Learn More
            </button>
          </div>

          {/* Interactive mockup preview container */}
          <div className="relative pt-12 max-w-4xl mx-auto">
            <div className="glass p-4 rounded-3xl border border-white/10 shadow-2xl relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-tr from-purple-500/10 via-transparent to-emerald-500/10 pointer-events-none" />
              <div className="h-64 md:h-96 rounded-2xl bg-slate-950/80 border border-white/5 flex flex-col justify-between p-6">
                <div className="flex justify-between items-center border-b border-white/5 pb-3">
                  <div className="flex gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-red-500/50" />
                    <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/50" />
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/50" />
                  </div>
                  <span className="text-[10px] text-white/30 uppercase font-mono">youssef-manssouri.lifeos.dev</span>
                </div>
                <div className="flex-1 flex items-center justify-center">
                  <div className="text-center space-y-2">
                    <Cpu className="w-12 h-12 text-emerald-400 mx-auto animate-pulse" />
                    <h3 className="text-sm font-bold text-white">SYSTEM ONLINE</h3>
                    <p className="text-[10px] text-white/40">Zustand & TanStack Query initialized. Ready to execute.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* PRICING SECTION */}
        <section className="max-w-5xl mx-auto px-6 py-20 border-t border-white/5">
          <div className="text-center space-y-2 mb-12">
            <h2 className="text-2xl font-bold text-white">SaaS Tier Pricing</h2>
            <p className="text-xs text-white/40">Select the plan that matches your lifecycle organization needs.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { name: 'Core Edition', price: '0', desc: 'Personal SQLite storage offline bypass.', features: ['Workspace widgets', 'Local Tasks & Habits', 'Offline mode bypass', 'By Youssef Manssouri branding'] },
              { name: 'Pro Workspace', price: '12', desc: 'Gemini AI Assistant with full context.', features: ['All Core features', 'Gemini API integrations', 'AI Spending & Health Advice', 'GitHub/Dev Workspace integrations'], active: true },
              { name: 'Enterprise OS', price: '49', desc: 'Custom roadmaps & wearable trackers.', features: ['All Pro features', 'Real-time collaborative nodes', 'Wearables database hooks', 'Dedicated developer roadmaps'] }
            ].map((plan, idx) => (
              <div 
                key={idx} 
                className={clsx("p-6 rounded-3xl border flex flex-col justify-between space-y-6 relative overflow-hidden",
                  plan.active ? 'border-emerald-500/35 bg-emerald-500/5 shadow-2xl' : 'border-white/5 bg-white/5'
                )}
              >
                {plan.active && (
                  <span className="absolute top-4 right-4 bg-emerald-500 text-slate-950 text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-full">
                    Recommended
                  </span>
                )}
                <div>
                  <h3 className="text-base font-bold text-white">{plan.name}</h3>
                  <p className="text-[11px] text-white/40 mt-1">{plan.desc}</p>
                  <div className="mt-4 flex items-baseline gap-1">
                    <span className="text-3xl font-extrabold font-mono">${plan.price}</span>
                    <span className="text-white/40 text-xs">/month</span>
                  </div>
                </div>
                <ul className="space-y-2 text-[10px] text-white/70">
                  {plan.features.map((f, fIdx) => (
                    <li key={fIdx} className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
                <button
                  onClick={() => setIsLoggedIn(true)}
                  className={clsx("w-full py-2.5 rounded-xl text-xs font-bold transition-all",
                    plan.active ? 'bg-emerald-500 hover:bg-emerald-600 text-slate-950 glow-emerald' : 'bg-white/5 hover:bg-white/10 text-white'
                  )}
                >
                  Enter Workspace
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* FOOTER */}
        <footer className="w-full border-t border-white/5 py-8 text-center text-[10px] text-white/30 space-y-2">
          <p>© {new Date().getFullYear()} LifeOS Personal operating system. All rights reserved.</p>
          <p className="text-emerald-400 font-semibold tracking-widest uppercase">By Youssef Manssouri</p>
        </footer>

        {/* AUTH MODAL INTERFACE */}
        {authMode && (
          <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md flex items-center justify-center z-50 p-4 animate-fade-in">
            <div className="w-full max-w-sm glass p-6 rounded-3xl border border-white/10 flex flex-col space-y-4 shadow-2xl">
              <div className="text-center">
                <Cpu className="w-8 h-8 text-emerald-400 mx-auto" />
                <h3 className="text-base font-bold text-white mt-2 capitalize">{authMode} Mode</h3>
                <p className="text-[10px] text-white/40 mt-1">LifeOS Gateway Protocol. By Youssef Manssouri.</p>
              </div>

              <form onSubmit={handleAuthSubmit} className="space-y-3">
                {authMode === 'signup' && (
                  <div className="relative">
                    <User className="w-3.5 h-3.5 text-white/40 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="Full Name"
                      required
                      value={nameInput}
                      onChange={(e) => setNameInput(e.target.value)}
                      className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/5 text-xs text-white placeholder-white/30 focus:outline-none"
                    />
                  </div>
                )}
                {authMode !== 'verify' && (
                  <div className="relative">
                    <Mail className="w-3.5 h-3.5 text-white/40 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      placeholder="Email Address"
                      required
                      value={emailInput}
                      onChange={(e) => setEmailInput(e.target.value)}
                      className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/5 text-xs text-white placeholder-white/30 focus:outline-none"
                    />
                  </div>
                )}
                {(authMode === 'login' || authMode === 'signup') && (
                  <div className="relative">
                    <Lock className="w-3.5 h-3.5 text-white/40 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="password"
                      placeholder="Password"
                      required
                      value={passwordInput}
                      onChange={(e) => setPasswordInput(e.target.value)}
                      className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/5 text-xs text-white placeholder-white/30 focus:outline-none"
                    />
                  </div>
                )}
                {authMode === 'verify' && (
                  <div className="space-y-2">
                    <p className="text-[10px] text-white/40 text-center">Enter the mock code sent to {emailInput}</p>
                    <input
                      type="text"
                      placeholder="Code (e.g. 123456)"
                      required
                      className="w-full text-center py-2.5 rounded-xl bg-white/5 border border-white/5 text-xs text-white tracking-widest focus:outline-none"
                    />
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-slate-950 text-xs font-bold transition-all shadow-lg glow-emerald"
                >
                  Continue Gateway
                </button>
              </form>

              <div className="flex justify-between items-center text-[10px] text-white/40 pt-2 border-t border-white/5">
                {authMode === 'login' ? (
                  <>
                    <button onClick={() => setAuthMode('forgot')}>Forgot Password?</button>
                    <button onClick={() => setAuthMode('signup')}>Sign Up</button>
                  </>
                ) : (
                  <button className="mx-auto" onClick={() => setAuthMode('login')}>Return to Login</button>
                )}
              </div>
            </div>
          </div>
        )}
      </main>
    );
  }

  // IF LOGGED IN, RENDER OS WORKSPACE
  return (
    <main className="min-h-screen text-white relative bg-[#0b0f19] overflow-y-auto">
      {/* Background overlays */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-1/4 w-[600px] h-[600px] bg-purple-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Mac-like OS StatusBar */}
      <StatusBar />

      {/* Central Operating Workspace */}
      <div className="flex pl-24 pr-8 pt-16 pb-8 min-h-screen w-full relative z-10">
        
        {/* Sidebar */}
        <FloatingSidebar />

        {/* Dashboard Grid / Panels */}
        <div className="flex-1 w-full max-w-7xl mx-auto">
          {error ? (
            <div className="glass p-8 rounded-3xl border border-white/5 max-w-md mx-auto text-center space-y-4 my-24 animate-fade-in">
              <AlertCircle className="w-12 h-12 text-rose-500 mx-auto" />
              <div>
                <h3 className="text-base font-bold text-white">Core Connection Offline</h3>
                <p className="text-xs text-white/50 mt-1.5 leading-relaxed">
                  Unable to establish connection to the LifeOS NestJS backend Core (http://localhost:3001). 
                  Please ensure the NestJS backend API is booted and active.
                </p>
              </div>
              <button
                onClick={() => refetch()}
                className={clsx("w-full py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2", getAccentBgClass())}
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Retry Handshake</span>
              </button>
            </div>
          ) : (
            <>
              {activePanel === 'dashboard' ? (
                <DashboardGrid data={data} isLoading={isLoading} />
              ) : (
                <PanelsContainer onRefetchDashboard={refetch} />
              )}
            </>
          )}
        </div>
      </div>

      {/* Command Palette */}
      <CommandPalette />
    </main>
  );
}
