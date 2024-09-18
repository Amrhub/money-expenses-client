import MainNav from '@/components/main-nav/main-nav';
import LoaderModal from '@/components/modals/loader/LoaderModal';
import { Toaster } from '@/components/ui/toaster';
import Providers from '@/lib/providers';
import { Metadata } from 'next';
import { Inter as FontSans } from 'next/font/google';
import '/styles/globals.css';
import { SignedOut, SignInButton, SignedIn, UserButton } from '@clerk/nextjs';

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
      <body className={fontSans.variable}>
        <Providers>
          {/* <SignedOut>
            <SignInButton />
          </SignedOut> */}

          <MainNav />
          <LoaderModal />
          <div className='px-4 pt-4 min-h-screen bg-background font-sans antialiased'>
            {children}
          </div>
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}
