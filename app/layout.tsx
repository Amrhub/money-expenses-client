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
import { Metadata } from 'next';

const fontSans = FontSans({
  subsets: ['latin'],
  variable: '--font-sans',
});

const queryClient = new QueryClient({});

export const metadata: Metadata = {
  title: 'Money Expenses',
  description: 'Track your expenses and income',
  keywords: 'money, expenses, income, track, finance, budget',
};

// FIXME Why App component gets re-rendered on every page change?
export default function RootLayout({ Component, pageProps }: AppProps) {
  return (
    <html lang='en'>
      <div className={cn('min-h-screen bg-background font-sans antialiased', fontSans.variable)}>
        <Head>
          <title>Money Expenses</title>
          <meta name='viewport' content='initial-scale=1, width=device-width' />
          <link
            rel='stylesheet'
            href='https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap'
          />
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
              <body className={cn('px-4 pt-4', fontSans.variable)}>
                <Component {...pageProps} />
              </body>
              <Toaster />
            </QueryClientProvider>
          </ThemeProvider>
        </UserProvider>
      </div>
    </html>
  );
}
