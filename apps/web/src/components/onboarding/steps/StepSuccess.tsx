'use client';

import { useRouter } from 'next/navigation';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import { ProfileCompletionCard } from '../ProfileCompletionCard';
import { SubmitButton } from '@/components/auth/SubmitButton';
import { ROUTES } from '@/constants';

const NEXT_STEPS = ['Add Skills', 'Complete Education Details', 'Upload Certificates', 'Add Github Profile'];

export function StepSuccess() {
  const router = useRouter();

  return (
    <Stack spacing={4} alignItems="center" textAlign="center">
      <Stack spacing={1}>
        <Typography variant="h3" component="h1" fontWeight={700} letterSpacing="-0.02em">
          Congratulations 🎉
        </Typography>
        <Typography variant="h6" sx={{ color: 'text.secondary' }} fontWeight={500}>
          Welcome to CareerNext.
        </Typography>
        <Typography variant="body1" sx={{ color: 'text.secondary' }}>
          Your Career Workspace is Ready.
        </Typography>
      </Stack>

      <ProfileCompletionCard value={85} />

      <Stack spacing={1.5} sx={{ width: '100%', maxWidth: 360 }}>
        <Typography variant="body2" fontWeight={600}>
          Suggested Next Steps
        </Typography>
        {NEXT_STEPS.map((step) => (
          <Stack key={step} direction="row" spacing={1.5} alignItems="center">
            <CheckCircleRoundedIcon sx={{ fontSize: 18, color: 'primary.main' }} />
            <Typography variant="body2">{step}</Typography>
          </Stack>
        ))}
      </Stack>

      <SubmitButton onClick={() => router.push(ROUTES.DASHBOARD)} type="button" sx={{ maxWidth: 320 }}>
        Continue To Dashboard
      </SubmitButton>
    </Stack>
  );
}
