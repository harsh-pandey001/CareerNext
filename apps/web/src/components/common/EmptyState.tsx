'use client';

import type { ReactNode } from 'react';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { alpha } from '@mui/material/styles';
import type SvgIcon from '@mui/material/SvgIcon';
import { FadeIn, MotionButton } from '@/components/motion';

interface EmptyStateAction {
  label: string;
  onClick: () => void;
  icon?: ReactNode;
}

interface EmptyStateProps {
  icon: typeof SvgIcon;
  title: string;
  description: string;
  action?: EmptyStateAction;
}

/** Shared "nothing here yet" / "no results" state — used wherever a list can be empty. */
export function EmptyState({ icon: Icon, title, description, action }: EmptyStateProps) {
  return (
    <FadeIn y={8}>
      <Stack spacing={1.5} alignItems="center" sx={{ py: 7, px: 2, textAlign: 'center' }}>
        <Box
          sx={{
            width: 56,
            height: 56,
            borderRadius: '16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            bgcolor: (theme) => alpha(theme.palette.primary.main, 0.1),
            color: 'primary.main',
          }}
        >
          <Icon fontSize="medium" />
        </Box>
        <Stack spacing={0.5}>
          <Typography variant="body1" fontWeight={700}>
            {title}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 360 }}>
            {description}
          </Typography>
        </Stack>
        {action && (
          <MotionButton
            onClick={action.onClick}
            variant="outlined"
            startIcon={action.icon}
            sx={{ mt: 1, textTransform: 'none', fontWeight: 600, borderRadius: '10px' }}
          >
            {action.label}
          </MotionButton>
        )}
      </Stack>
    </FadeIn>
  );
}
