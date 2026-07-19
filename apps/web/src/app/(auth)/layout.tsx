import type { ReactNode } from 'react';
import Box from '@mui/material/Box';
import { AuthBrandPanel } from '@/components/auth/AuthBrandPanel';

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <Box
        component="main"
        sx={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          px: { xs: 3, sm: 6, md: 8, lg: 10 },
          py: { xs: 6, md: 4 },
        }}
      >
        <Box sx={{ width: '100%', maxWidth: 440 }}>{children}</Box>
      </Box>

      <Box sx={{ display: { xs: 'none', sm: 'flex' }, flex: 1 }}>
        <AuthBrandPanel />
      </Box>
    </Box>
  );
}
