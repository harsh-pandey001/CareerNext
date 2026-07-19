'use client';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { alpha } from '@mui/material/styles';
import { TestimonialCard } from './TestimonialCard';
import { TrustedByLogos } from './TrustedByLogos';

const orbKeyframes = {
  '@keyframes orb-drift': {
    '0%, 100%': { transform: 'translate(0, 0) scale(1)' },
    '50%': { transform: 'translate(-24px, 24px) scale(1.06)' },
  },
} as const;

export function AuthBrandPanel() {
  return (
    <Box
      component="aside"
      sx={{
        position: 'relative',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        overflow: 'hidden',
        px: { sm: 4, md: 6, lg: 8 },
        py: { sm: 5, md: 7 },
        background: (theme) =>
          theme.palette.mode === 'dark'
            ? 'linear-gradient(160deg, #042F2E 0%, #0B6B60 100%)'
            : 'linear-gradient(160deg, #064E3B 0%, #0D9488 100%)',
        color: '#fff',
      }}
    >
      <Box
        aria-hidden
        sx={{
          position: 'absolute',
          top: '-12%',
          right: '-10%',
          width: 380,
          height: 380,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(110,231,183,0.28), transparent 70%)',
          ...orbKeyframes,
          '@media (prefers-reduced-motion: no-preference)': {
            animation: 'orb-drift 22s ease-in-out infinite',
          },
        }}
      />
      <Box
        aria-hidden
        sx={{
          position: 'absolute',
          bottom: '-16%',
          left: '-8%',
          width: 420,
          height: 420,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(255,255,255,0.10), transparent 70%)',
          ...orbKeyframes,
          '@media (prefers-reduced-motion: no-preference)': {
            animation: 'orb-drift 26s ease-in-out infinite reverse',
          },
        }}
      />

      <Box sx={{ position: 'relative', zIndex: 1, maxWidth: 480 }}>
        <Typography
          component="h2"
          fontWeight={700}
          letterSpacing="-0.02em"
          sx={{
            mb: 2.5,
            fontSize: { sm: '1.65rem', md: '2.1rem', lg: '2.5rem' },
            lineHeight: 1.15,
          }}
        >
          Your Next Career Move Starts Here.
        </Typography>
        <Typography
          sx={{ color: alpha('#fff', 0.85), fontSize: { sm: '0.95rem', md: '1.05rem' }, lineHeight: 1.7 }}
        >
          CareerNext helps professionals manage their career growth, job applications,
          interviews and learning journey smarter than ever.
        </Typography>
      </Box>

      <Box sx={{ position: 'relative', zIndex: 1, maxWidth: 460, my: { sm: 3, md: 5 } }}>
        <TestimonialCard
          quote="CareerNext helped me stay organized throughout my job search and interview process."
          name="Harsh Pandey"
          designation="Frontend Engineer"
        />
      </Box>

      <Box sx={{ position: 'relative', zIndex: 1, display: { xs: 'none', md: 'block' } }}>
        <TrustedByLogos />
      </Box>
    </Box>
  );
}
