'use client';

import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import { alpha } from '@mui/material/styles';
import { SectionCard } from './SectionCard';
import { UPCOMING_INTERVIEWS } from './mock-data';

function getInitials(name: string) {
  return name
    .split(' ')
    .filter(Boolean)
    .map((word) => word[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
}

export function UpcomingInterviews() {
  return (
    <SectionCard title="Upcoming Interviews" subtitle="Sample preview — Interview Tracker arrives in V2">
      <Stack divider={<Divider sx={{ borderColor: 'divider' }} />} spacing={2}>
        {UPCOMING_INTERVIEWS.map((interview) => (
          <Stack key={interview.id} direction="row" spacing={1.5} alignItems="center">
            <Avatar
              sx={{
                bgcolor: (theme) => alpha(theme.palette.primary.main, 0.12),
                color: 'primary.main',
                fontWeight: 700,
                fontSize: '0.8rem',
                width: 40,
                height: 40,
              }}
            >
              {getInitials(interview.company)}
            </Avatar>
            <Stack spacing={0.4} sx={{ flex: 1, minWidth: 0 }}>
              <Typography variant="body2" fontWeight={600} noWrap>
                {interview.role}
              </Typography>
              <Typography variant="caption" color="text.secondary" noWrap>
                {interview.company} · {interview.round}
              </Typography>
              <Chip
                label={interview.mode}
                size="small"
                sx={{ height: 18, fontSize: '0.65rem', fontWeight: 600, alignSelf: 'flex-start', bgcolor: 'action.hover' }}
              />
            </Stack>
            <Stack spacing={0.25} alignItems="flex-end" sx={{ flexShrink: 0 }}>
              <Typography variant="caption" fontWeight={700}>
                {interview.date}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {interview.time}
              </Typography>
            </Stack>
          </Stack>
        ))}
      </Stack>
    </SectionCard>
  );
}
