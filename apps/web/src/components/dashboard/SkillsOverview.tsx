import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import LinearProgress from '@mui/material/LinearProgress';
import { SectionCard } from './SectionCard';
import { SKILLS_OVERVIEW } from './mock-data';

export function SkillsOverview() {
  return (
    <SectionCard title="Skills Overview" subtitle="Based on your profile & resume">
      <Stack spacing={2.25}>
        {SKILLS_OVERVIEW.map((skill) => (
          <Stack key={skill.name} spacing={0.75}>
            <Stack direction="row" justifyContent="space-between">
              <Typography variant="body2" fontWeight={600}>
                {skill.name}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {skill.level}%
              </Typography>
            </Stack>
            <LinearProgress
              variant="determinate"
              value={skill.level}
              sx={{
                height: 6,
                borderRadius: 3,
                backgroundColor: 'action.hover',
                '& .MuiLinearProgress-bar': { borderRadius: 3 },
              }}
            />
          </Stack>
        ))}
      </Stack>
    </SectionCard>
  );
}
