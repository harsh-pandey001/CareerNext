'use client';

import { useState } from 'react';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Typography from '@mui/material/Typography';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import GitHubIcon from '@mui/icons-material/GitHub';
import { GoogleIcon } from './icons/GoogleIcon';

export function SocialAuthButtons() {
  const [comingSoon, setComingSoon] = useState<string | null>(null);

  return (
    <>
      <Stack spacing={1.5}>
        <Button
          fullWidth
          variant="outlined"
          size="large"
          startIcon={<GoogleIcon />}
          onClick={() => setComingSoon('Google')}
          sx={{
            textTransform: 'none',
            fontWeight: 600,
            borderRadius: '10px',
            borderColor: 'divider',
            color: 'text.primary',
            py: 1.1,
            '&:hover': { borderColor: 'primary.main', backgroundColor: 'action.hover' },
          }}
        >
          Continue with Google
        </Button>

        <Button
          fullWidth
          variant="outlined"
          size="large"
          onClick={() => setComingSoon('GitHub')}
          sx={{
            textTransform: 'none',
            fontWeight: 600,
            borderRadius: '10px',
            borderColor: 'divider',
            color: 'text.secondary',
            py: 1.1,
            justifyContent: 'flex-start',
            px: 2.25,
            '&:hover': { borderColor: 'primary.main', backgroundColor: 'action.hover' },
          }}
        >
          <Stack direction="row" spacing={1.5} alignItems="center" sx={{ width: '100%' }}>
            <GitHubIcon fontSize="small" />
            <Typography variant="button" sx={{ textTransform: 'none', fontWeight: 600 }}>
              Continue with GitHub
            </Typography>
            <Chip
              label="Soon"
              size="small"
              variant="outlined"
              sx={{ ml: 'auto', height: 22, fontSize: '0.7rem', fontWeight: 600 }}
            />
          </Stack>
        </Button>
      </Stack>

      <Snackbar
        open={!!comingSoon}
        autoHideDuration={3000}
        onClose={() => setComingSoon(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          severity="info"
          variant="filled"
          onClose={() => setComingSoon(null)}
          sx={{ borderRadius: 2 }}
        >
          {comingSoon} sign-in is coming soon.
        </Alert>
      </Snackbar>
    </>
  );
}
