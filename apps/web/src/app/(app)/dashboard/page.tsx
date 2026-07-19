import type { Metadata } from 'next';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

export const metadata: Metadata = {
  title: 'Dashboard — CareerNext',
};

export default function DashboardPage() {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 1.5,
        px: 3,
        textAlign: 'center',
      }}
    >
      <Typography variant="h4" fontWeight={700}>
        You&apos;re in.
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 420 }}>
        Your career dashboard — applications, interviews and analytics — is on its way.
      </Typography>
    </Box>
  );
}
