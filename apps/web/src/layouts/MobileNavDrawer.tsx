'use client';

import Drawer from '@mui/material/Drawer';
import { useUIStore } from '@/store/ui.store';
import { AppSidebar } from './AppSidebar';

/**
 * Below `md` the permanent sidebar is hidden — without this drawer, phones
 * would have no way to navigate between sections at all. Opened via the
 * hamburger in AppTopBar; reuses the exact same AppSidebar content.
 */
export function MobileNavDrawer() {
  const open = useUIStore((s) => s.sidebarOpen);
  const toggleSidebar = useUIStore((s) => s.toggleSidebar);

  return (
    <Drawer
      variant="temporary"
      open={open}
      onClose={toggleSidebar}
      ModalProps={{ keepMounted: true }}
      sx={{ display: { xs: 'block', md: 'none' }, '& .MuiDrawer-paper': { width: 260 } }}
    >
      <AppSidebar onNavigate={toggleSidebar} />
    </Drawer>
  );
}
