import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import LinearProgress from '@mui/material/LinearProgress';

const STEP_LABELS = ['Authentication', 'Upload Resume', 'Basic Information', 'Career Preferences'];

interface StepProgressProps {
  step: number;
  totalSteps: number;
}

export function StepProgress({ step, totalSteps }: StepProgressProps) {
  const percent = Math.round((step / totalSteps) * 100);

  return (
    <Box sx={{ mb: 5 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', mb: 1 }}>
        <Typography
          variant="overline"
          sx={{ color: 'text.secondary', fontWeight: 600, letterSpacing: '0.08em', lineHeight: 1.4 }}
        >
          Step {step} of {totalSteps} · {STEP_LABELS[step - 1]}
        </Typography>
        <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600 }}>
          {percent}% Completed
        </Typography>
      </Box>
      <LinearProgress
        variant="determinate"
        value={percent}
        sx={{
          height: 6,
          borderRadius: 999,
          bgcolor: 'action.hover',
          '& .MuiLinearProgress-bar': {
            borderRadius: 999,
            background: 'linear-gradient(90deg, #065F46 0%, #0D9488 100%)',
          },
        }}
      />
    </Box>
  );
}
