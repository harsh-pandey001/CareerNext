import type { ReactNode } from 'react';
import Box from '@mui/material/Box';
import { AppSidebar } from '@/layouts/AppSidebar';
import { AppTopBar } from '@/layouts/AppTopBar';

export default function AppLayout({ children }: { children: ReactNode }) {
  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <Box sx={{ display: { xs: 'none', md: 'block' } }}>
        <AppSidebar />
      </Box>
      <Box component="main" sx={{ flex: 1, minWidth: 0 }}>
        <AppTopBar />
        <Box sx={{ px: { xs: 2.5, md: 4 }, py: 4 }}>{children}</Box>
      </Box>
    </Box>
  );
}
