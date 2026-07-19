import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Chip from '@mui/material/Chip';
import Typography from '@mui/material/Typography';

interface SkillsPreviewCardProps {
  skills: string[];
}

export function SkillsPreviewCard({ skills }: SkillsPreviewCardProps) {
  return (
    <Paper elevation={0} sx={{ p: 2.5, borderRadius: '16px', border: '1px solid', borderColor: 'divider' }}>
      <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 600, mb: 1.5 }}>
        Skills
      </Typography>
      <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
        {skills.map((skill) => (
          <Chip key={skill} label={skill} size="small" sx={{ fontWeight: 600, bgcolor: 'action.hover' }} />
        ))}
      </Stack>
    </Paper>
  );
}
