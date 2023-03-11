import { Drawer, Typography, Stack, styled, ListItemButton } from '@mui/material';
import { blueGrey } from '@mui/material/colors';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { navLinks } from './nav-config';
export const drawerWidth = 256;

const NavLinks = styled('div')(({ theme }) => ({
  paddingInline: theme.spacing(1),
}));

const Sidebar = () => {
  const router = useRouter();

  return (
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
    </Drawer>
  );
};

export default Sidebar;
