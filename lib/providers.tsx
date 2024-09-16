'use client';

import { ThemeProvider } from '@/components/theme-provider';
import { UserProvider } from '@auth0/nextjs-auth0/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';

interface IProps {
  children: React.ReactNode;
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      gcTime: 1 * 60 * 60 * 1000,
      staleTime: 60 * 1000,
    },
  },
});

const Providers = ({ children }: IProps) => {
  return (
    <UserProvider>
      <ThemeProvider attribute='class' defaultTheme='system' enableSystem disableTransitionOnChange>
        <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
      </ThemeProvider>
    </UserProvider>
  );
};

export default Providers;
