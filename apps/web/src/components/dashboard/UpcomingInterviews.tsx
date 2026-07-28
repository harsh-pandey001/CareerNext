import NextLink from 'next/link';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import Link from '@mui/material/Link';
import Divider from '@mui/material/Divider';
import { alpha } from '@mui/material/styles';
import EventNoteRoundedIcon from '@mui/icons-material/EventNoteRounded';
import { formatDateTime } from '@careernext/utils';
import type { InterviewFieldsFragment } from '@careernext/graphql-types';
import { SectionCard } from './SectionCard';
import { ROUTES } from '@/constants';
import { ROUND_LABELS } from '@/components/interviews/constants';

function getCompanyInitials(company: string) {
  return company
    .split(' ')
    .filter(Boolean)
    .map((word) => word[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
}

interface UpcomingInterviewsProps {
  interviews: InterviewFieldsFragment[];
}

export function UpcomingInterviews({ interviews }: UpcomingInterviewsProps) {
  return (
    <SectionCard title="Upcoming Interviews" subtitle="Your next scheduled rounds">
      {interviews.length === 0 ? (
        <Stack spacing={0.5} sx={{ py: 2 }}>
          <Typography variant="body2" fontWeight={600}>
            Nothing scheduled
          </Typography>
          <Typography variant="caption" color="text.secondary">
            <Link component={NextLink} href={ROUTES.INTERVIEWS} fontWeight={600}>
              Schedule an interview
            </Link>{' '}
            when an application moves forward.
          </Typography>
        </Stack>
      ) : (
        <Stack divider={<Divider sx={{ borderColor: 'divider' }} />} spacing={2}>
          {interviews.map((interview) => (
            <Stack key={interview.id} direction="row" spacing={1.5} alignItems="center">
              <Box
                sx={{
                  width: 40,
                  height: 40,
                  borderRadius: '10px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  bgcolor: (theme) => alpha(theme.palette.primary.main, 0.12),
                  color: 'primary.main',
                  fontWeight: 700,
                  fontSize: '0.8rem',
                }}
              >
                {getCompanyInitials(interview.application.job.company)}
              </Box>
              <Stack spacing={0.4} sx={{ flex: 1, minWidth: 0 }}>
                <Typography variant="body2" fontWeight={600} noWrap>
                  {interview.application.job.title}
                </Typography>
                <Typography variant="caption" color="text.secondary" noWrap>
                  {interview.application.job.company} · {ROUND_LABELS[interview.round]}
                </Typography>
                {interview.scheduledAt ? (
                  <Chip
                    icon={<EventNoteRoundedIcon sx={{ fontSize: '14px !important' }} />}
                    label={formatDateTime(interview.scheduledAt)}
                    size="small"
                    sx={{ height: 20, fontSize: '0.65rem', fontWeight: 600, alignSelf: 'flex-start', bgcolor: 'action.hover' }}
                  />
                ) : (
                  <Chip
                    label="Not scheduled yet"
                    size="small"
                    sx={{ height: 20, fontSize: '0.65rem', fontWeight: 600, alignSelf: 'flex-start', bgcolor: 'action.hover' }}
                  />
                )}
              </Stack>
            </Stack>
          ))}
        </Stack>
      )}
    </SectionCard>
  );
}
