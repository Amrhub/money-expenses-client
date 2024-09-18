'use client';

import { cn } from '@/lib/utils';
import { SignedIn, SignOutButton, UserButton } from '@clerk/nextjs';
import { dark } from '@clerk/themes';
import { LogOut, Menu } from 'lucide-react';
import { useTheme } from 'next-themes';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { navLinks } from '../Sidebar/nav-config';
import { Button } from '../ui/button';
import Logo from '../ui/logo';
import { Separator } from '../ui/separator';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '../ui/sheet';
import { ThemeToggler } from '../ui/theme-toggler';

const MainNav = () => {
  const pathname = usePathname();
  const { theme } = useTheme();
  const [isSheetOpened, setSheepOpened] = useState(false);

  return (
    <header className='flex h-16 items-center px-4 border-b'>
      <section className='mr-4 flex'>
        <Logo />
      </section>

      <nav className='lg:flex hidden lg:flex-row items-center gap-4'>
        {navLinks.map((link) => (
          <Button variant='link' key={link.path} className='px-0'>
            <Link
              href={link.path}
              key={link.path}
              className={cn(pathname === link.path && 'font-semibold')}
            >
              {link.name}
            </Link>
          </Button>
        ))}
      </nav>
      <div className='hidden ml-auto lg:flex gap-2 items-center'>
        <ThemeToggler />

        <SignedIn>
          <UserButton
            userProfileProps={{
              appearance: {
                baseTheme: theme === 'dark' ? dark : undefined,
              },
            }}
            appearance={{
              baseTheme: theme === 'dark' ? dark : undefined,
            }}
          />
        </SignedIn>
      </div>

      {/* Mobile side nav */}
      <div className='lg:hidden ml-auto'>
        <Sheet open={isSheetOpened} onOpenChange={setSheepOpened}>
          <SignedIn>
            <UserButton
              userProfileProps={{
                appearance: {
                  baseTheme: theme === 'dark' ? dark : undefined,
                },
              }}
              appearance={{
                baseTheme: theme === 'dark' ? dark : undefined,
              }}
            />
          </SignedIn>
          <SheetTrigger asChild>
            <Button variant='ghost'>
              <Menu />
            </Button>
          </SheetTrigger>
          <SheetContent side='top' className='h-auto'>
            <SheetHeader>
              <SheetTitle className='flex items-center'>
                <Logo />
              </SheetTitle>
              <SheetDescription className='flex items-center gap-4 !mt-6'>
                <SignedIn>
                  <UserButton
                    showName
                    userProfileProps={{
                      appearance: {
                        baseTheme: theme === 'dark' ? dark : undefined,
                      },
                    }}
                    appearance={{
                      baseTheme: theme === 'dark' ? dark : undefined,
                      elements: {
                        userButtonBox: {
                          flexDirection: 'row-reverse',
                        },
                        userButtonTrigger: {
                          pointerEvents: 'none',
                        },
                      },
                    }}
                    userProfileUrl='/profile'
                    userProfileMode='navigation'
                  />
                </SignedIn>
                <span className='ml-auto flex gap-2 items-center'>
                  <ThemeToggler />

                  <SignOutButton>
                    <LogOut className='w-4 h-4' />
                  </SignOutButton>
                </span>
              </SheetDescription>

              <Separator className='my-4' />

              <nav className='flex flex-col gap-4 mt-4 items-start'>
                {navLinks.map((link) => (
                  <Button variant='link' key={link.path} className='px-0'>
                    <Link
                      href={link.path}
                      key={link.path}
                      className={cn(pathname === link.path && 'font-semibold')}
                      onClick={() => {
                        setSheepOpened(false);
                      }}
                    >
                      {link.name}
                    </Link>
                  </Button>
                ))}
              </nav>
            </SheetHeader>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
};

export default MainNav;
