import Link from 'next/link';
import { navLinks } from '../Sidebar/nav-config';
import { usePathname, useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Button } from '../ui/button';
import { ThemeToggler } from '../ui/theme-toggler';
import { useUser } from '@auth0/nextjs-auth0/client';
import { logOut } from '@/utils/utils';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { DropdownMenuItem } from '@radix-ui/react-dropdown-menu';
import { LogOut, Menu } from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '../ui/sheet';
import UserAvatar from '../ui/user-avatar';
import Logo from '../ui/logo';
import { Separator } from '../ui/separator';

const MainNav = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { user } = useUser();

  if (!user) return null;

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

        <DropdownMenu>
          <DropdownMenuTrigger className='rounded-full'>
            <UserAvatar userPicture={user.picture} />
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel>
              <p className='text-sm font-medium leading-none'>{user.name}</p>
              <p className='text-xs leading-none text-muted-foreground'>{user.email}</p>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => logOut(router)}
              className='flex items-center hover:cursor-pointer'
            >
              <LogOut className='mr-1 h-4 w-4' />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className='lg:hidden ml-auto'>
        <Sheet>
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
                <UserAvatar userPicture={user.picture} />{' '}
                <span className='flex flex-col max-w-[170px]'>
                  <span className='text-sm font-bold leading-none text-left mb-2 text-ellipsis'>
                    Hi, {user.name} 👋🏻
                  </span>
                  <span className='text-xs leading-none text-muted-foreground text-ellipsis'>
                    {user.email}
                  </span>
                </span>
                <span className='ml-auto flex gap-2 items-center'>
                  <ThemeToggler />

                  <Button variant='ghost' onClick={() => logOut(router)}>
                    <LogOut className='h-4 w-4' />
                  </Button>
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
