import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { BrandLogo } from '@/components/auth/BrandLogo';
import { StepProgress } from './StepProgress';

interface OnboardingHeaderProps {
  step: number;
  totalSteps: number;
}

export function OnboardingHeader({ step, totalSteps }: OnboardingHeaderProps) {
  return (
    <Stack spacing={3} alignItems="center" sx={{ mb: { xs: 5, sm: 6 }, textAlign: 'center' }}>
      <BrandLogo />
      <Stack spacing={0.75} alignItems="center">
        <Typography variant="h5" component="h1" fontWeight={700} letterSpacing="-0.01em">
          Your Next Career Move Starts Here.
        </Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          Let&apos;s setup your Career Workspace.
        </Typography>
      </Stack>
      <Box sx={{ width: '100%' }}>
        <StepProgress step={step} totalSteps={totalSteps} />
      </Box>
    </Stack>
  );
}
