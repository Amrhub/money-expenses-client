import '/styles/globals.css';
import Sidebar, { drawerWidth } from '@/components/Sidebar/Sidebar';
import CssBaseline from '@mui/material/CssBaseline';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import { UserProvider } from '@auth0/nextjs-auth0/client';
import { withPageAuthRequired } from '@auth0/nextjs-auth0';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';

function App({ Component, pageProps }: AppProps) {
  const queryClient = new QueryClient();

  return (
    <>
      <Head>
        <meta name='viewport' content='initial-scale=1, width=device-width' />
      </Head>
      <UserProvider>
        <QueryClientProvider client={queryClient}>
          <CssBaseline />
          <Sidebar />
          <main
            style={{ marginLeft: `${drawerWidth}px`, paddingBlock: '24px', paddingInline: '32px' }}
          >
            <Component {...pageProps} />
          </main>
        </QueryClientProvider>
      </UserProvider>
    </>
  );
}

export default App;
