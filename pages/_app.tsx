import '/styles/globals.css';
import Sidebar, { drawerWidth } from '@/components/Sidebar/Sidebar';
import CssBaseline from '@mui/material/CssBaseline';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import { UserProvider } from '@auth0/nextjs-auth0/client';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
import { Box, ThemeProvider, createTheme, useMediaQuery } from '@mui/material';
import LoaderModal from '@/components/modals/loader/LoaderModal';

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
    <>
      <Head>
        <title>Money Expenses</title>
        <meta name='viewport' content='initial-scale=1, width=device-width' />
      </Head>
      <UserProvider>
        <ThemeProvider theme={theme}>
          <QueryClientProvider client={queryClient}>
            <CssBaseline />
            <Sidebar />
            <LoaderModal />
            <Box
              component='main'
              sx={{
                ml: { xs: 0, sm: `${drawerWidth}px` },
                paddingBlock: '24px',
                paddingInline: '32px',
              }}
            >
              <Component {...pageProps} />
            </Box>
          </QueryClientProvider>
        </ThemeProvider>
      </UserProvider>
    </>
  );
}

export default App;
