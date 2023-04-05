import { useUser } from '@auth0/nextjs-auth0/client';
import {
  Drawer,
  Typography,
  Stack,
  styled,
  ListItemButton,
  useMediaQuery,
  SwipeableDrawer,
  Box,
  IconButton,
} from '@mui/material';
import { blueGrey } from '@mui/material/colors';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { navLinks } from './nav-config';
import LogoutIcon from '@mui/icons-material/Logout';

export const drawerWidth = 256;

const NavLinks = styled('div')(({ theme }) => ({
  paddingInline: theme.spacing(1),
}));

const Sidebar = () => {
  const router = useRouter();
  const isDesktop = useMediaQuery('(min-width: 600px)');
  const [open, setOpen] = useState(false);
  const { user } = useUser();

  const children = (
    <>
      <Stack spacing={2} direction='row' marginLeft={2} marginBottom={4}>
        <Image src='/logo.svg' width={36} height={32} alt='logo' />
        <Typography variant='h6' color={blueGrey[900]} display='inline-block'>
          Money Expenses
        </Typography>
      </Stack>

      <NavLinks>
        {navLinks.map((link) => (
          <Link href={link.path} key={link.path} style={{ textDecoration: 'none' }}>
            <ListItemButton
              selected={router.pathname === link.path}
              sx={{ borderRadius: 1, py: 1.5 }}
            >
              <Typography variant='body1' color='initial'>
                {link.name}
              </Typography>
            </ListItemButton>
          </Link>
        ))}
      </NavLinks>
      <Stack
        marginTop={'auto'}
        mb={1.5}
        mx={3}
        direction='row'
        alignItems='center'
        justifyContent='space-between'
      >
        <Typography variant='body1' color='initial'>
          {user?.name}
        </Typography>
        <IconButton
          aria-label='log out'
          onClick={() => {
            fetch('/api/auth/logout', { method: 'DELETE' });
          }}
          color='error'
        >
          <LogoutIcon />
        </IconButton>
      </Stack>
    </>
  );

  return isDesktop ? (
    <Drawer
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          boxSizing: 'border-box',
          bgcolor: blueGrey[50],
          pt: 3,
        },
      }}
      variant='permanent'
      anchor='left'
    >
      {children}
    </Drawer>
  ) : (
    <SwipeableDrawer
      onClose={() => {
        setOpen(false);
      }}
      onOpen={() => {
        setOpen(true);
      }}
      swipeAreaWidth={80}
      open={open}
    >
      <Stack sx={{ pt: 3, pb: 1.5, width: drawerWidth, height: '100%' }}>{children}</Stack>
    </SwipeableDrawer>
  );
};

export default Sidebar;
