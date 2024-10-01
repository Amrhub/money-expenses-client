'use client';

import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu';
import { cn } from '@/lib/utils';
import { SignedIn, SignOutButton, UserButton } from '@clerk/nextjs';
import { dark } from '@clerk/themes';
import { LogOut, Menu } from 'lucide-react';
import { useTheme } from 'next-themes';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { navLinks } from '../nav-config/nav-config';
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

      <NavigationMenu className='hidden lg:flex'>
        <NavigationMenuList>
          {navLinks.map((link) => (
            <NavigationMenuItem key={link.path}>
              <Link href={link.path} legacyBehavior passHref>
                <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                  {link.name}
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
          ))}
        </NavigationMenuList>
      </NavigationMenu>
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
                          color: 'hsl(var(--foreground))',
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

              <NavigationMenu>
                <NavigationMenuList className='flex-col space-x-0'>
                  {navLinks.map((link) => (
                    <NavigationMenuItem
                      key={link.path}
                      className='self-start'
                      onClick={() => {
                        setSheepOpened(false);
                      }}
                    >
                      <Link href={link.path} legacyBehavior passHref>
                        <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                          {link.name}
                        </NavigationMenuLink>
                      </Link>
                    </NavigationMenuItem>
                  ))}
                </NavigationMenuList>
              </NavigationMenu>
            </SheetHeader>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
};

export default MainNav;
