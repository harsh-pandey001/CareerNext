'use client';

import { useEffect, useState } from 'react';
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

  // `keepMounted` means the sidebar inside never remounts on its own, so its
  // nav-item stagger would only ever play once. Bump a key each time the
  // drawer OPENS (not on close — restarting the entrance while the panel
  // slides away would flicker) so the items cascade in on every open.
  const [openCount, setOpenCount] = useState(0);
  useEffect(() => {
    if (open) setOpenCount((count) => count + 1);
  }, [open]);

  return (
    <Drawer
      variant="temporary"
      open={open}
      onClose={toggleSidebar}
      ModalProps={{ keepMounted: true }}
      sx={{ display: { xs: 'block', md: 'none' }, '& .MuiDrawer-paper': { width: 260 } }}
    >
      <AppSidebar onNavigate={toggleSidebar} replayKey={openCount} />
    </Drawer>
  );
}
