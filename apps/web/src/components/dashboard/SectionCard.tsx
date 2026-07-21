import type { ReactNode } from 'react';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

interface SectionCardProps {
  title: string;
  subtitle?: string;
  action?: ReactNode;
  children: ReactNode;
}

export function SectionCard({ title, subtitle, action, children }: SectionCardProps) {
  return (
    <Paper
      elevation={0}
      sx={{
        p: 3,
        borderRadius: '16px',
        border: '1px solid',
        borderColor: 'divider',
        height: '100%',
      }}
    >
      <Stack direction="row" alignItems="flex-start" justifyContent="space-between" spacing={2} sx={{ mb: 2.5 }}>
        <Stack spacing={0.25}>
          <Typography variant="subtitle1" fontWeight={700}>
            {title}
          </Typography>
          {subtitle && (
            <Typography variant="body2" color="text.secondary">
              {subtitle}
            </Typography>
          )}
        </Stack>
        {action}
      </Stack>
      {children}
    </Paper>
  );
}
