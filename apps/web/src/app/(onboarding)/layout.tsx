import type { ReactNode } from 'react';
import Box from '@mui/material/Box';

export default function OnboardingLayout({ children }: { children: ReactNode }) {
  return (
    <Box
      sx={{
        position: 'relative',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflowX: 'hidden',
        px: { xs: 3, sm: 4 },
        py: { xs: 6, sm: 8 },
        bgcolor: 'background.default',
      }}
    >
      <Box
        aria-hidden
        sx={{
          position: 'fixed',
          top: '-15%',
          left: '-10%',
          width: 480,
          height: 480,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(13,148,136,0.14), transparent 70%)',
          pointerEvents: 'none',
        }}
      />
      <Box
        aria-hidden
        sx={{
          position: 'fixed',
          bottom: '-18%',
          right: '-10%',
          width: 520,
          height: 520,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(5,150,105,0.10), transparent 70%)',
          pointerEvents: 'none',
        }}
      />

      <Box sx={{ width: '100%', maxWidth: 640, position: 'relative', zIndex: 1 }}>{children}</Box>
    </Box>
  );
}
