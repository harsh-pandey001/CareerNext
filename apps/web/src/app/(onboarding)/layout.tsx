import type { ReactNode } from 'react';
import Box from '@mui/material/Box';
import { DashboardPreviewPanel } from '@/components/onboarding/DashboardPreviewPanel';

export default function OnboardingLayout({ children }: { children: ReactNode }) {
  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <Box sx={{ display: { xs: 'none', sm: 'flex' }, flex: { sm: '0 0 40%' } }}>
        <DashboardPreviewPanel />
      </Box>

      <Box
        component="main"
        sx={{
          flex: { xs: '1 1 100%', sm: '0 0 60%' },
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          px: { xs: 3, sm: 5, md: 8, lg: 10 },
          py: { xs: 6, md: 5 },
          overflowY: 'auto',
        }}
      >
        {children}
      </Box>
    </Box>
  );
}
