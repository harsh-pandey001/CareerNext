'use client';

import NextLink from 'next/link';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import LinearProgress from '@mui/material/LinearProgress';
import Link from '@mui/material/Link';
import { useAnimatedProgress } from '@careernext/shared-ui';
import { SectionCard } from './SectionCard';
import { ROUTES } from '@/constants';
import type { SkillOverviewItem } from '@/hooks/dashboard/useDashboardData';

interface SkillsOverviewProps {
  skills: SkillOverviewItem[];
}

function SkillBar({ skill }: { skill: SkillOverviewItem }) {
  // Fills from 0 on mount; MUI's own bar transition is disabled so it tracks
  // the animated value exactly rather than easing a second time behind it.
  const animated = useAnimatedProgress(skill.percent);
  return (
    <Stack spacing={0.75}>
      <Stack direction="row" justifyContent="space-between">
        <Typography variant="body2" fontWeight={600}>
          {skill.name}
        </Typography>
        <Typography variant="caption" color="text.secondary">
          {skill.levelLabel}
        </Typography>
      </Stack>
      <LinearProgress
        variant="determinate"
        value={animated}
        aria-label={`${skill.name}: ${skill.levelLabel}`}
        sx={{
          height: 6,
          borderRadius: 3,
          backgroundColor: 'action.hover',
          '& .MuiLinearProgress-bar': { borderRadius: 3, transition: 'none' },
        }}
      />
    </Stack>
  );
}

export function SkillsOverview({ skills }: SkillsOverviewProps) {
  return (
    <SectionCard title="Skills Overview" subtitle="Your strongest skills, from your profile">
      {skills.length === 0 ? (
        <Stack spacing={0.5} sx={{ py: 2 }}>
          <Typography variant="body2" fontWeight={600}>
            No skills added yet
          </Typography>
          <Typography variant="caption" color="text.secondary">
            <Link component={NextLink} href={ROUTES.PROFILE} fontWeight={600}>
              Add skills on your Profile
            </Link>{' '}
            to see them here.
          </Typography>
        </Stack>
      ) : (
        <Stack spacing={2.25}>
          {skills.map((skill) => (
            <SkillBar key={skill.name} skill={skill} />
          ))}
        </Stack>
      )}
    </SectionCard>
  );
}
