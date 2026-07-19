'use client';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import DescriptionRoundedIcon from '@mui/icons-material/DescriptionRounded';
import EventAvailableRoundedIcon from '@mui/icons-material/EventAvailableRounded';
import { BrandLogo } from '@/components/auth/BrandLogo';
import { ProfileCompletionCard } from './ProfileCompletionCard';
import { PreviewStatCard } from './PreviewStatCard';
import { SkillsPreviewCard } from './SkillsPreviewCard';
import { AiSuggestionsCard } from './AiSuggestionsCard';

const fadeUpKeyframes = {
  '@keyframes fade-up': {
    from: { opacity: 0, transform: 'translateY(14px)' },
    to: { opacity: 1, transform: 'translateY(0)' },
  },
} as const;

function fadeUpSx(delay: number) {
  return {
    ...fadeUpKeyframes,
    opacity: 0,
    '@media (prefers-reduced-motion: no-preference)': {
      animation: `fade-up 0.5s ease-out ${delay}s both`,
    },
    '@media (prefers-reduced-motion: reduce)': {
      opacity: 1,
    },
  } as const;
}

export function DashboardPreviewPanel() {
  return (
    <Box
      component="aside"
      sx={{
        position: 'relative',
        width: '100%',
        height: '100%',
        overflowY: 'auto',
        px: { sm: 4, md: 6, lg: 7 },
        py: { sm: 5, md: 7 },
        background: (theme) =>
          theme.palette.mode === 'dark'
            ? 'radial-gradient(circle at 12% 0%, rgba(13,148,136,0.18), transparent 55%), #0f172a'
            : 'radial-gradient(circle at 12% 0%, rgba(13,148,136,0.10), transparent 55%), #f8fafc',
      }}
    >
      <Box sx={{ mb: { sm: 5, md: 6 } }}>
        <BrandLogo />
      </Box>

      <Typography
        component="h2"
        fontWeight={700}
        letterSpacing="-0.02em"
        sx={{ fontSize: { sm: '1.65rem', md: '2rem', lg: '2.35rem' }, lineHeight: 1.15, mb: 2 }}
      >
        Build Your Career Smarter.
      </Typography>
      <Typography
        sx={{
          color: 'text.secondary',
          fontSize: { sm: '0.95rem', md: '1rem' },
          lineHeight: 1.7,
          mb: { sm: 4, md: 5 },
          maxWidth: 440,
        }}
      >
        CareerNext helps professionals manage their career journey including jobs,
        interviews, resumes, skills and learning roadmaps in one place.
      </Typography>

      <Stack spacing={2} sx={{ maxWidth: 420 }}>
        <Stack direction="row" spacing={2} sx={fadeUpSx(0.05)}>
          <Box sx={{ flex: 1 }}>
            <ProfileCompletionCard value={92} />
          </Box>
          <Stack spacing={2} sx={{ flex: 1 }}>
            <PreviewStatCard icon={<DescriptionRoundedIcon fontSize="small" />} label="Applications" value="24" />
            <PreviewStatCard
              icon={<EventAvailableRoundedIcon fontSize="small" />}
              label="Upcoming Interviews"
              value="5"
            />
          </Stack>
        </Stack>

        <Box sx={fadeUpSx(0.15)}>
          <SkillsPreviewCard skills={['React', 'AWS', 'Docker']} />
        </Box>

        <Box sx={fadeUpSx(0.25)}>
          <AiSuggestionsCard items={['Redis', 'CI/CD', 'AWS S3']} />
        </Box>
      </Stack>
    </Box>
  );
}
