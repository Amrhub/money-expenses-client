import '/styles/globals.css';
import Sidebar, { drawerWidth } from '@/components/Sidebar/Sidebar';
import CssBaseline from '@mui/material/CssBaseline';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import { UserProvider } from '@auth0/nextjs-auth0/client';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
import { Box, ThemeProvider, createTheme } from '@mui/material';
import LoaderModal from '@/components/modals/loader/LoaderModal';
import { Inter as FontSans } from 'next/font/google';
import { cn } from '@/lib/utils';
import { ThemeProvider as ThemeProviderSU } from '@/components/theme-provider';
import MainNav from '@/components/main-nav/main-nav';

const fontSans = FontSans({
  subsets: ['latin'],
  variable: '--font-sans',
});

const theme = createTheme({
  palette: {
    secondary: {
      main: '#7865eb',
      dark: '#5446a4',
      light: '#9383ef',
      contrastText: '#fff',
    },
  },
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
        <ThemeProviderSU
          attribute='class'
          defaultTheme='system'
          enableSystem
          disableTransitionOnChange
        >
          <ThemeProvider theme={theme}>
            <QueryClientProvider client={queryClient}>
              <CssBaseline />
              <MainNav />
              <LoaderModal />
              <Box component='main' className='px-4 pt-4'>
                <Component {...pageProps} />
              </Box>
            </QueryClientProvider>
          </ThemeProvider>
        </ThemeProviderSU>
      </UserProvider>
    </div>
  );
}

export default App;
