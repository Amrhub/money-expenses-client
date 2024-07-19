import '/styles/globals.css';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import { UserProvider } from '@auth0/nextjs-auth0/client';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
import LoaderModal from '@/components/modals/loader/LoaderModal';
import { Inter as FontSans } from 'next/font/google';
import { cn } from '@/lib/utils';
import { ThemeProvider } from '@/components/theme-provider';
import MainNav from '@/components/main-nav/main-nav';
import { Toaster } from '@/components/ui/toaster';

const fontSans = FontSans({
  subsets: ['latin'],
  variable: '--font-sans',
});

function App({ Component, pageProps }: AppProps) {
  const queryClient = new QueryClient();

  return (
    <div className={cn('min-h-screen bg-background font-sans antialiased', fontSans.variable)}>
      <Head>
        <title>Money Expenses</title>
        <meta name='viewport' content='initial-scale=1, width=device-width' />
      </Head>
      <UserProvider>
        <ThemeProvider
          attribute='class'
          defaultTheme='system'
          enableSystem
          disableTransitionOnChange
        >
          <QueryClientProvider client={queryClient}>
            <MainNav />
            <LoaderModal />
            <main className={cn('px-4 pt-4', fontSans.variable)}>
              <Component {...pageProps} />
            </main>
            <Toaster />
          </QueryClientProvider>
        </ThemeProvider>
      </UserProvider>
    </div>
  );
}

export default App;
