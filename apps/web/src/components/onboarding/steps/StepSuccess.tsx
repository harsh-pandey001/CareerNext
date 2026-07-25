'use client';

import { useRouter } from 'next/navigation';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import { useMyProfileQuery } from '@careernext/graphql-types';
import { ProfileCompletionCard } from '@careernext/shared-ui';
import { SubmitButton } from '@/components/auth/SubmitButton';
import { ROUTES } from '@/constants';
import { useOnboardingStore } from '../store';

const NEXT_STEPS = [
  'Add Skills',
  'Complete Education Details',
  'Add Github Profile',
  'Add Linkedin Profile',
  'Upload Certificates',
  'Explore Opportunities',
];

export function StepSuccess() {
  const router = useRouter();
  const reset = useOnboardingStore((s) => s.reset);
  // Real, server-computed completion — the wizard just persisted headline/
  // location/resume, so this reflects what actually landed, not a made-up
  // number the Profile page would immediately contradict.
  const { data } = useMyProfileQuery();

  const handleContinue = () => {
    // Fresh wizard next time /register is visited — without this, the
    // previous account's success screen replays after logout.
    reset();
    router.push(ROUTES.DASHBOARD);
  };

  return (
    <Stack spacing={4} alignItems="center" textAlign="center">
      <Stack spacing={1}>
        <Typography variant="h3" component="h1" fontWeight={700} letterSpacing="-0.02em">
          Welcome To CareerNext.
        </Typography>
        <Typography variant="body1" sx={{ color: 'text.secondary' }}>
          Your Career Workspace Is Ready.
        </Typography>
      </Stack>

      <ProfileCompletionCard value={data?.myProfile.completionPercentage ?? 0} />

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

      <SubmitButton onClick={handleContinue} type="button" sx={{ maxWidth: 320 }}>
        Continue To Dashboard
      </SubmitButton>
    </Stack>
  );
}
