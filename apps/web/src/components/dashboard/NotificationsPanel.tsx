'use client';

import { useRouter } from 'next/navigation';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import NotificationsOffRoundedIcon from '@mui/icons-material/NotificationsOffRounded';
import type { NotificationFieldsFragment } from '@careernext/graphql-types';
import { NotificationRow } from '@/components/notifications/NotificationRow';
import { SectionCard } from './SectionCard';

interface NotificationsPanelProps {
  notifications: NotificationFieldsFragment[];
}

export function NotificationsPanel({ notifications }: NotificationsPanelProps) {
  const router = useRouter();

  return (
    <SectionCard title="Notifications" subtitle="Your most recent updates">
      {notifications.length === 0 ? (
        <Stack spacing={1} alignItems="center" sx={{ py: 2 }}>
          <NotificationsOffRoundedIcon sx={{ fontSize: 28, color: 'text.disabled' }} />
          <Typography variant="body2" color="text.secondary">
            You&apos;re all caught up.
          </Typography>
        </Stack>
      ) : (
        <Stack spacing={0.5}>
          {notifications.map((notification) => (
            <NotificationRow
              key={notification.id}
              notification={notification}
              onClick={(clicked) => {
                if (clicked.link) router.push(clicked.link);
              }}
            />
          ))}
        </Stack>
      )}
    </SectionCard>
  );
}
