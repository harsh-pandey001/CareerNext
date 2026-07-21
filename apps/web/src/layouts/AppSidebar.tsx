'use client';

import NextLink from 'next/link';
import { usePathname } from 'next/navigation';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import { alpha } from '@mui/material/styles';
import SpaceDashboardRoundedIcon from '@mui/icons-material/SpaceDashboardRounded';
import WorkOutlineRoundedIcon from '@mui/icons-material/WorkOutlineRounded';
import AssignmentOutlinedIcon from '@mui/icons-material/AssignmentOutlined';
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import FolderOpenOutlinedIcon from '@mui/icons-material/FolderOpenOutlined';
import PersonOutlineRoundedIcon from '@mui/icons-material/PersonOutlineRounded';
import type SvgIcon from '@mui/material/SvgIcon';
import { BrandLogo } from '@/components/auth/BrandLogo';
import { ROUTES } from '@/constants';

interface NavItem {
  label: string;
  href: string;
  icon: typeof SvgIcon;
  comingSoon?: boolean;
}

const NAV_ITEMS: NavItem[] = [
  { label: 'Dashboard', href: ROUTES.DASHBOARD, icon: SpaceDashboardRoundedIcon },
  { label: 'Jobs', href: ROUTES.JOBS, icon: WorkOutlineRoundedIcon, comingSoon: true },
  { label: 'Applications', href: ROUTES.APPLICATIONS, icon: AssignmentOutlinedIcon, comingSoon: true },
  { label: 'Resume', href: ROUTES.RESUME, icon: DescriptionOutlinedIcon, comingSoon: true },
  { label: 'Documents', href: ROUTES.DOCUMENTS, icon: FolderOpenOutlinedIcon, comingSoon: true },
  { label: 'Profile', href: ROUTES.PROFILE, icon: PersonOutlineRoundedIcon, comingSoon: true },
];

export function AppSidebar() {
  const pathname = usePathname();

  return (
    <Box
      component="nav"
      sx={{
        width: 260,
        flexShrink: 0,
        height: '100vh',
        position: 'sticky',
        top: 0,
        display: 'flex',
        flexDirection: 'column',
        borderRight: '1px solid',
        borderColor: 'divider',
        px: 2.5,
        py: 3,
      }}
    >
      <Box sx={{ px: 1, mb: 4 }}>
        <BrandLogo />
      </Box>

      <Stack spacing={0.5}>
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          const itemSx = {
            display: 'flex',
            alignItems: 'center',
            gap: 1.5,
            px: 1.5,
            py: 1.1,
            borderRadius: '10px',
            textDecoration: 'none',
            fontWeight: isActive ? 700 : 500,
          } as const;

          const content = (
            <>
              <Icon fontSize="small" />
              <Typography variant="body2" fontWeight="inherit" sx={{ flex: 1 }}>
                {item.label}
              </Typography>
              {item.comingSoon && (
                <Chip
                  label="Soon"
                  size="small"
                  sx={{ height: 20, fontSize: '0.65rem', fontWeight: 700, bgcolor: 'action.hover' }}
                />
              )}
            </>
          );

          if (item.comingSoon) {
            return (
              <Box
                key={item.href}
                aria-disabled
                sx={{ ...itemSx, color: 'text.disabled', cursor: 'default' }}
              >
                {content}
              </Box>
            );
          }

          return (
            <Box
              key={item.href}
              component={NextLink}
              href={item.href}
              sx={{
                ...itemSx,
                color: isActive ? 'primary.main' : 'text.primary',
                bgcolor: isActive ? (theme) => alpha(theme.palette.primary.main, 0.1) : 'transparent',
                '&:hover': { bgcolor: (theme) => alpha(theme.palette.primary.main, isActive ? 0.14 : 0.06) },
              }}
            >
              {content}
            </Box>
          );
        })}
      </Stack>
    </Box>
  );
}
