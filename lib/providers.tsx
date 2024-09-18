'use client';

import { ThemeProvider } from '@/components/theme-provider';
import { UserProvider } from '@auth0/nextjs-auth0/client';
import { ClerkProvider } from '@clerk/nextjs';
import { dark } from '@clerk/themes';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useTheme } from 'next-themes';
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
        <ClerkProvider>
          <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
        </ClerkProvider>
      </ThemeProvider>
    </UserProvider>
  );
};

export default Providers;
