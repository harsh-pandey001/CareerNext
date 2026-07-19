'use client';

import { useState } from 'react';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import { GoogleIcon } from './icons/GoogleIcon';
import { AppleIcon } from './icons/AppleIcon';

const socialButtonSx = {
  textTransform: 'none',
  fontWeight: 600,
  borderRadius: '10px',
  borderColor: 'divider',
  color: 'text.primary',
  py: 1.1,
  '&:hover': { borderColor: 'primary.main', backgroundColor: 'action.hover' },
} as const;

export function SocialAuthButtons() {
  const [comingSoon, setComingSoon] = useState(false);

  return (
    <>
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

        <Button
          fullWidth
          variant="outlined"
          size="large"
          disabled
          startIcon={<AppleIcon />}
          sx={socialButtonSx}
        >
          Continue with Apple
        </Button>
      </Stack>

      <Snackbar
        open={comingSoon}
        autoHideDuration={3000}
        onClose={() => setComingSoon(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          severity="info"
          variant="filled"
          onClose={() => setComingSoon(false)}
          sx={{ borderRadius: 2 }}
        >
          Google sign-in is coming soon.
        </Alert>
      </Snackbar>
    </>
  );
}
