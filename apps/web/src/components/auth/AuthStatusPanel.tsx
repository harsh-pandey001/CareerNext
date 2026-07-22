import type { ReactNode } from 'react';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { alpha } from '@mui/material/styles';
import type SvgIcon from '@mui/material/SvgIcon';

interface AuthStatusPanelProps {
  icon: typeof SvgIcon;
  tone: 'success' | 'error' | 'info';
  heading: string;
  description: ReactNode;
  action?: ReactNode;
}

export function AuthStatusPanel({ icon: Icon, tone, heading, description, action }: AuthStatusPanelProps) {
  return (
    <Stack spacing={3} alignItems="center" textAlign="center">
      <Box
        sx={{
          width: 64,
          height: 64,
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          bgcolor: (theme) => alpha(theme.palette[tone].main, 0.12),
          color: `${tone}.main`,
        }}
      >
        <Icon sx={{ fontSize: 32 }} />
      </Box>
      <Stack spacing={1}>
        <Typography variant="body1" fontWeight={600}>
          {heading}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {description}
        </Typography>
      </Stack>
      {action}
    </Stack>
  );
}
