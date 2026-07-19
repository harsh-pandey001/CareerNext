'use client';

import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { ResumeDropzone } from '../ResumeDropzone';
import { SubmitButton } from '@/components/auth/SubmitButton';
import { useOnboardingStore } from '../store';

export function StepResumeUpload() {
  const resumeFileName = useOnboardingStore((s) => s.resumeFileName);
  const setResumeFileName = useOnboardingStore((s) => s.setResumeFileName);
  const nextStep = useOnboardingStore((s) => s.nextStep);

  return (
    <Stack spacing={3}>
      <Stack spacing={0.75}>
        <Typography variant="h4" component="h2" fontWeight={700} letterSpacing="-0.02em">
          Build Your Profile Faster.
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Upload your resume and let CareerNext help you setup your Career Workspace smarter.
        </Typography>
      </Stack>

      <ResumeDropzone fileName={resumeFileName} onFileSelected={setResumeFileName} />

      <Stack direction="row" spacing={2} justifyContent="flex-end">
        <Button
          variant="text"
          size="large"
          onClick={nextStep}
          sx={{ textTransform: 'none', fontWeight: 600, color: 'text.secondary' }}
        >
          Skip For Now
        </Button>
        <SubmitButton onClick={nextStep} type="button" fullWidth={false} sx={{ px: 5 }}>
          Continue
        </SubmitButton>
      </Stack>
    </Stack>
  );
}
