'use client';

import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { alpha } from '@mui/material/styles';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import InfoRoundedIcon from '@mui/icons-material/InfoRounded';
import WarningAmberRoundedIcon from '@mui/icons-material/WarningAmberRounded';
import type SvgIcon from '@mui/material/SvgIcon';
import { SectionCard } from './SectionCard';
import { NOTIFICATIONS, type NotificationItem } from './mock-data';

const ICONS: Record<NotificationItem['type'], typeof SvgIcon> = {
  success: CheckCircleRoundedIcon,
  info: InfoRoundedIcon,
  warning: WarningAmberRoundedIcon,
};

const COLORS: Record<NotificationItem['type'], 'success' | 'info' | 'warning'> = {
  success: 'success',
  info: 'info',
  warning: 'warning',
};

export function NotificationsPanel() {
  return (
    <SectionCard title="Notifications" subtitle="Sample preview — Notifications arrive in V2">
      <Stack spacing={2}>
        {NOTIFICATIONS.map((notification) => {
          const Icon = ICONS[notification.type];
          const color = COLORS[notification.type];

          return (
            <Stack key={notification.id} direction="row" spacing={1.5} alignItems="flex-start">
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
              <Stack spacing={0.25} sx={{ minWidth: 0 }}>
                <Typography variant="body2">{notification.message}</Typography>
                <Typography variant="caption" color="text.secondary">
                  {notification.time}
                </Typography>
              </Stack>
            </Stack>
          );
        })}
      </Stack>
    </SectionCard>
  );
}
