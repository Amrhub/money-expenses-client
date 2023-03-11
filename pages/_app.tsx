import '/styles/globals.css';
import Sidebar, { drawerWidth } from '@/components/Sidebar/Sidebar';
import CssBaseline from '@mui/material/CssBaseline';
import type { AppProps } from 'next/app';
import Head from 'next/head';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <meta name='viewport' content='initial-scale=1, width=device-width' />
      </Head>
      <CssBaseline />
      <Sidebar />
      <main style={{ marginLeft: `${drawerWidth}px`, paddingBlock: '24px', paddingInline: '32px' }}>
        <Component {...pageProps} />
      </main>
    </>
  );
}
