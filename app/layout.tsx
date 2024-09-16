import MainNav from '@/components/main-nav/main-nav';
import LoaderModal from '@/components/modals/loader/LoaderModal';
import { Toaster } from '@/components/ui/toaster';
import Providers from '@/lib/providers';
import { Metadata } from 'next';
import { Inter as FontSans } from 'next/font/google';
import Head from 'next/head';
import '/styles/globals.css';

const fontSans = FontSans({
  subsets: ['latin'],
  variable: '--font-sans',
});

export const metadata: Metadata = {
  title: 'Money Expenses',
  description: 'Track your expenses and income',
  keywords: 'money, expenses, income, track, finance, budget',
};

// FIXME Why App component gets re-rendered on every page change?
export default function RootLayout({
  // This will be populated with nested layouts or pages
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang='en'>
      <Head>
        <meta name='viewport' content='initial-scale=1, width=device-width' />
        <link
          rel='stylesheet'
          href='https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap'
        />
      </Head>
      <body className={fontSans.variable}>
        <Providers>
          <MainNav />
          <LoaderModal />
          <Toaster />
          <div className='px-4 pt-4 min-h-screen bg-background font-sans antialiased'>
            {children}
          </div>
        </Providers>
      </body>
    </html>
  );
}
