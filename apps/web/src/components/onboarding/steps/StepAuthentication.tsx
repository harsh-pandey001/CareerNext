'use client';

import { useState } from 'react';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import { GoogleIcon } from '@/components/auth/icons/GoogleIcon';
import { AppleIcon } from '@/components/auth/icons/AppleIcon';
import { AuthLink } from '@/components/auth/AuthLink';
import { SubmitButton } from '@/components/auth/SubmitButton';
import { ROUTES } from '@/constants';
import { useOnboardingStore } from '../store';

const socialButtonSx = {
  textTransform: 'none',
  fontWeight: 600,
  borderRadius: '10px',
  borderColor: 'divider',
  color: 'text.primary',
  py: 1.1,
  '&:hover': { borderColor: 'primary.main', backgroundColor: 'action.hover' },
} as const;

export function StepAuthentication() {
  const nextStep = useOnboardingStore((s) => s.nextStep);
  const [comingSoon, setComingSoon] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleContinueWithEmail = async () => {
    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 700));
    setLoading(false);
    nextStep();
  };

  return (
    <Stack spacing={3}>
      <Stack spacing={0.75}>
        <Typography variant="h4" component="h2" fontWeight={700} letterSpacing="-0.02em">
          Let&apos;s Start Your Journey.
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Manage your career growth, opportunities and interviews smarter than ever.
        </Typography>
      </Stack>

      <Stack spacing={1.5}>
        <Button
          fullWidth
          variant="outlined"
          size="large"
          startIcon={<GoogleIcon />}
          onClick={() => setComingSoon(true)}
          sx={socialButtonSx}
        >
          Continue with Google
        </Button>
        <Button fullWidth variant="outlined" size="large" disabled startIcon={<AppleIcon />} sx={socialButtonSx}>
          Continue with Apple
        </Button>
        <SubmitButton loading={loading} onClick={handleContinueWithEmail} type="button">
          Continue with Email
        </SubmitButton>
      </Stack>

      <AuthLink prompt="Already have an account?" linkText="Sign In" href={ROUTES.LOGIN} />

      <Snackbar
        open={comingSoon}
        autoHideDuration={3000}
        onClose={() => setComingSoon(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity="info" variant="filled" onClose={() => setComingSoon(false)} sx={{ borderRadius: 2 }}>
          Google sign-in is coming soon.
        </Alert>
      </Snackbar>
    </Stack>
  );
}
