'use client';

import React, { useState, useEffect } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useStore } from '@/store/useStore';

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: false,
        retry: 1,
      },
    },
  }));

  const theme = useStore((state) => state.theme);
  const accentColor = useStore((state) => state.accentColor);

  // Sync theme and accent color on document root
  useEffect(() => {
    const root = window.document.documentElement;
    
    // Theme sync
    if (theme === 'dark') {
      root.classList.add('dark');
      root.style.colorScheme = 'dark';
    } else {
      root.classList.remove('dark');
      root.style.colorScheme = 'light';
    }

    // Accent color sync
    const colorClasses = ['accent-emerald', 'accent-blue', 'accent-indigo', 'accent-violet', 'accent-rose'];
    root.classList.remove(...colorClasses);
    root.classList.add(`accent-${accentColor}`);
  }, [theme, accentColor]);

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
}
