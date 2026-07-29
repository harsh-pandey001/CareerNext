'use client';

import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import ButtonBase from '@mui/material/ButtonBase';
import { alpha } from '@mui/material/styles';
import { formatRelativeTime } from '@careernext/utils';
import type { NotificationFieldsFragment } from '@careernext/graphql-types';
import { NOTIFICATION_COLORS, NOTIFICATION_ICONS } from './constants';

interface NotificationRowProps {
  notification: NotificationFieldsFragment;
  onClick?: (notification: NotificationFieldsFragment) => void;
}

export function NotificationRow({ notification, onClick }: NotificationRowProps) {
  const Icon = NOTIFICATION_ICONS[notification.type];
  const color = NOTIFICATION_COLORS[notification.type];
  const unread = !notification.readAt;

  return (
    <ButtonBase
      onClick={() => onClick?.(notification)}
      sx={{
        width: '100%',
        textAlign: 'left',
        borderRadius: '12px',
        p: 1.25,
        gap: 1.5,
        alignItems: 'flex-start',
        justifyContent: 'flex-start',
        bgcolor: unread ? (theme) => alpha(theme.palette.primary.main, theme.palette.mode === 'dark' ? 0.1 : 0.06) : 'transparent',
        '&:hover': { bgcolor: (theme) => alpha(theme.palette.text.primary, 0.04) },
      }}
    >
      <Box
        sx={{
          width: 32,
          height: 32,
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          bgcolor: (theme) => alpha(theme.palette[color].main, 0.12),
          color: `${color}.main`,
          flexShrink: 0,
        }}
      >
        <Icon sx={{ fontSize: 18 }} />
      </Box>
      <Stack spacing={0.25} sx={{ minWidth: 0, flex: 1 }}>
        <Typography variant="body2" fontWeight={700}>
          {notification.title}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {notification.message}
        </Typography>
        <Typography variant="caption" color="text.secondary">
          {formatRelativeTime(notification.createdAt)}
        </Typography>
      </Stack>
      {unread && <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: 'primary.main', flexShrink: 0, mt: 0.75 }} />}
    </ButtonBase>
  );
}
