'use client';

import { useState, type MouseEvent } from 'react';
import { useRouter } from 'next/navigation';
import Badge from '@mui/material/Badge';
import IconButton from '@mui/material/IconButton';
import Popover from '@mui/material/Popover';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Divider from '@mui/material/Divider';
import NotificationsNoneRoundedIcon from '@mui/icons-material/NotificationsNoneRounded';
import NotificationsOffRoundedIcon from '@mui/icons-material/NotificationsOffRounded';
import type { NotificationFieldsFragment } from '@careernext/graphql-types';
import { useNotifications } from '@/hooks/notifications/useNotifications';
import { NotificationRow } from './NotificationRow';

export function NotificationsBell() {
  const router = useRouter();
  const { notifications, unreadCount, loading, markRead, markAllRead, refetchNotifications } = useNotifications();
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const open = Boolean(anchorEl);

  const handleOpen = (event: MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
    // The badge count polls on its own; the list itself doesn't, so make
    // sure it's fresh every time it's about to be seen.
    void refetchNotifications();
  };
  const handleClose = () => setAnchorEl(null);

  const handleSelect = (notification: NotificationFieldsFragment) => {
    if (!notification.readAt) void markRead(notification.id);
    handleClose();
    if (notification.link) router.push(notification.link);
  };

  return (
    <>
      <IconButton onClick={handleOpen} aria-label="Notifications" size="small">
        <Badge badgeContent={unreadCount} color="error" overlap="circular">
          <NotificationsNoneRoundedIcon fontSize="small" />
        </Badge>
      </IconButton>

      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        slotProps={{ paper: { sx: { width: 380, maxWidth: '90vw', borderRadius: '16px', mt: 1 } } }}
      >
        <Stack spacing={0}>
          <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ px: 2, py: 1.5 }}>
            <Typography variant="subtitle1" fontWeight={700}>
              Notifications
            </Typography>
            {unreadCount > 0 && (
              <Button
                onClick={() => void markAllRead()}
                size="small"
                sx={{ textTransform: 'none', fontWeight: 600 }}
              >
                Mark all read
              </Button>
            )}
          </Stack>
          <Divider />

          <Box sx={{ maxHeight: 420, overflowY: 'auto', p: 1 }}>
            {loading ? (
              <Stack alignItems="center" sx={{ py: 5 }}>
                <CircularProgress size={24} />
              </Stack>
            ) : notifications.length === 0 ? (
              <Stack spacing={1} alignItems="center" sx={{ py: 5 }}>
                <NotificationsOffRoundedIcon sx={{ fontSize: 32, color: 'text.disabled' }} />
                <Typography variant="body2" color="text.secondary">
                  You&apos;re all caught up.
                </Typography>
              </Stack>
            ) : (
              <Stack spacing={0.5}>
                {notifications.map((notification) => (
                  <NotificationRow key={notification.id} notification={notification} onClick={handleSelect} />
                ))}
              </Stack>
            )}
          </Box>
        </Stack>
      </Popover>
    </>
  );
}
