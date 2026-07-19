import type { ReactNode } from 'react';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Fade from '@mui/material/Fade';
import { BrandLogo } from './BrandLogo';

interface AuthCardProps {
  heading: string;
  subheading?: string;
  children: ReactNode;
  footer?: ReactNode;
}

export function AuthCard({ heading, subheading, children, footer }: AuthCardProps) {
  return (
    <Fade in timeout={450}>
      <Box>
        <Box sx={{ mb: { xs: 4, md: 5 } }}>
          <BrandLogo />
        </Box>

        <Stack spacing={0.75} sx={{ mb: 4 }}>
          <Typography variant="h4" component="h1" fontWeight={700} letterSpacing="-0.02em">
            {heading}
          </Typography>
          {subheading && (
            <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.6 }}>
              {subheading}
            </Typography>
          )}
        </Stack>

        <Stack spacing={3}>{children}</Stack>

        {footer && <Box sx={{ mt: 4 }}>{footer}</Box>}
      </Box>
    </Fade>
  );
}
