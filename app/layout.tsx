import MainNav from '@/components/main-nav/main-nav';
import { Toaster } from '@/components/ui/toaster';
import Providers from '@/lib/providers';
import { Metadata, Viewport } from 'next';
import { Inter as FontSans } from 'next/font/google';
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

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  // interactiveWidget: 'resizes-content',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang='en'>
      <body className={fontSans.variable}>
        <Providers>
          <MainNav />
          <div className='px-4 pt-4 min-h-screen bg-background font-sans antialiased'>
            {children}
          </div>
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}
