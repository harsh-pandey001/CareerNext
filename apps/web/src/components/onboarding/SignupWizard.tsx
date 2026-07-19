'use client';

import Box from '@mui/material/Box';
import Fade from '@mui/material/Fade';
import { StepProgress } from './StepProgress';
import { StepAuthentication } from './steps/StepAuthentication';
import { StepResumeUpload } from './steps/StepResumeUpload';
import { StepBasicInfo } from './steps/StepBasicInfo';
import { StepPreferences } from './steps/StepPreferences';
import { StepSuccess } from './steps/StepSuccess';
import { useOnboardingStore, TOTAL_STEPS } from './store';

export function SignupWizard() {
  const step = useOnboardingStore((s) => s.step);

  return (
    <Box sx={{ width: '100%', maxWidth: 480 }}>
      {step <= TOTAL_STEPS && <StepProgress step={step} totalSteps={TOTAL_STEPS} />}
      <Box aria-live="polite">
        <Fade in key={step} timeout={350}>
          <Box>
            {step === 1 && <StepAuthentication />}
            {step === 2 && <StepResumeUpload />}
            {step === 3 && <StepBasicInfo />}
            {step === 4 && <StepPreferences />}
            {step === 5 && <StepSuccess />}
          </Box>
        </Fade>
      </Box>
    </Box>
  );
}
