import MainNav from '@/components/main-nav/main-nav';
import LoaderModal from '@/components/modals/loader/LoaderModal';
import { ThemeProvider } from '@/components/theme-provider';
import { Toaster } from '@/components/ui/toaster';
import { cn } from '@/lib/utils';
import { UserProvider } from '@auth0/nextjs-auth0/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import type { AppProps } from 'next/app';
import { Inter as FontSans } from 'next/font/google';
import Head from 'next/head';
import '/styles/globals.css';

const fontSans = FontSans({
  subsets: ['latin'],
  variable: '--font-sans',
});

const queryClient = new QueryClient({});

// FIXME Why App component gets re-rendered on every page change?
function App({ Component, pageProps }: AppProps) {
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
