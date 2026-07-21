'use client';

import { useState, type MouseEvent } from 'react';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Badge from '@mui/material/Badge';
import Avatar from '@mui/material/Avatar';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import ListItemIcon from '@mui/material/ListItemIcon';
import LightModeRoundedIcon from '@mui/icons-material/LightModeRounded';
import DarkModeRoundedIcon from '@mui/icons-material/DarkModeRounded';
import NotificationsNoneRoundedIcon from '@mui/icons-material/NotificationsNoneRounded';
import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded';
import { useUIStore } from '@/store/ui.store';
import { useAuthStore } from '@/store/auth.store';
import { useLogout } from '@/hooks/auth/useLogout';
import { NOTIFICATIONS } from '@/components/dashboard/mock-data';

function getInitials(firstName: string, lastName: string) {
  return `${firstName[0] ?? ''}${lastName[0] ?? ''}`.toUpperCase();
}

export function AppTopBar() {
  const themeMode = useUIStore((s) => s.themeMode);
  const toggleTheme = useUIStore((s) => s.toggleTheme);
  const user = useAuthStore((s) => s.user);
  const { logout } = useLogout();

  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const menuOpen = Boolean(anchorEl);

  const handleMenuOpen = (event: MouseEvent<HTMLElement>) => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);

  return (
    <Box
      component="header"
      sx={{
        position: 'sticky',
        top: 0,
        zIndex: (theme) => theme.zIndex.appBar,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
        gap: 1,
        px: { xs: 2.5, md: 4 },
        py: 2,
        borderBottom: '1px solid',
        borderColor: 'divider',
        bgcolor: (theme) => (theme.palette.mode === 'dark' ? 'background.default' : 'background.paper'),
      }}
    >
      <IconButton onClick={toggleTheme} aria-label="Toggle color mode" size="small">
        {themeMode === 'dark' ? <LightModeRoundedIcon fontSize="small" /> : <DarkModeRoundedIcon fontSize="small" />}
      </IconButton>

      <IconButton aria-label="Notifications" size="small">
        <Badge badgeContent={NOTIFICATIONS.length} color="primary">
          <NotificationsNoneRoundedIcon fontSize="small" />
        </Badge>
      </IconButton>

      <IconButton onClick={handleMenuOpen} aria-label="Account menu" size="small" sx={{ ml: 0.5 }}>
        <Avatar sx={{ width: 34, height: 34, fontSize: '0.85rem', fontWeight: 700 }}>
          {user ? getInitials(user.firstName, user.lastName) : '?'}
        </Avatar>
      </IconButton>

      <Menu anchorEl={anchorEl} open={menuOpen} onClose={handleMenuClose} onClick={handleMenuClose}>
        <Box sx={{ px: 2, py: 1, minWidth: 200 }}>
          <Typography variant="body2" fontWeight={700} noWrap>
            {user ? `${user.firstName} ${user.lastName}` : 'Signed in'}
          </Typography>
          {user && (
            <Typography variant="caption" color="text.secondary" noWrap sx={{ display: 'block' }}>
              {user.email}
            </Typography>
          )}
        </Box>
        <Divider />
        <MenuItem onClick={() => void logout()}>
          <ListItemIcon>
            <LogoutRoundedIcon fontSize="small" />
          </ListItemIcon>
          Log out
        </MenuItem>
      </Menu>
    </Box>
  );
}
