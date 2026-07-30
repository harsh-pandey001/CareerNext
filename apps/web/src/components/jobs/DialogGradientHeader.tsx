import type { ReactNode } from 'react';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import { alpha } from '@mui/material/styles';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';

interface DialogGradientHeaderProps {
  icon: ReactNode;
  title: string;
  subtitle: string;
  onClose: () => void;
  accessory?: ReactNode;
}

/** Shared gradient header for the Custom Job dialogs — matches the app's established CTA gradient. */
export function DialogGradientHeader({ icon, title, subtitle, onClose, accessory }: DialogGradientHeaderProps) {
  return (
    <Box
      sx={{
        position: 'relative',
        px: 3,
        pt: 3,
        pb: 2.5,
        // Rounds itself to match the dialog paper's own corners — deliberately
        // not relying on `overflow: hidden` on the paper for this, since that
        // clips the paper's internal scroll container too and cuts off
        // DialogActions whenever content is taller than the viewport.
        borderRadius: '20px 20px 0 0',
        background: (theme) =>
          theme.palette.mode === 'dark'
            ? 'linear-gradient(135deg, #0F766E 0%, #14B8A6 100%)'
            : 'linear-gradient(135deg, #065F46 0%, #0D9488 100%)',
        color: '#fff',
      }}
    >
      <IconButton
        onClick={onClose}
        aria-label="Close"
        size="small"
        sx={{
          position: 'absolute',
          right: 12,
          top: 12,
          color: '#fff',
          bgcolor: alpha('#fff', 0.14),
          backdropFilter: 'blur(6px)',
          '&:hover': { bgcolor: alpha('#fff', 0.24) },
        }}
      >
        <CloseRoundedIcon fontSize="small" />
      </IconButton>
      <Stack direction="row" spacing={1.75} alignItems="center" sx={{ pr: 5 }}>
        <Box
          sx={{
            width: 48,
            height: 48,
            borderRadius: '14px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            fontWeight: 700,
            fontSize: '1rem',
            bgcolor: alpha('#fff', 0.16),
            backdropFilter: 'blur(6px)',
            border: '1px solid',
            borderColor: alpha('#fff', 0.28),
          }}
        >
          {icon}
        </Box>
        <Stack spacing={0.25} sx={{ minWidth: 0, flex: 1 }}>
          <Typography variant="h6" fontWeight={800} noWrap sx={{ letterSpacing: '-0.01em' }}>
            {title}
          </Typography>
          <Typography variant="body2" noWrap sx={{ opacity: 0.85 }}>
            {subtitle}
          </Typography>
        </Stack>
        {accessory}
      </Stack>
    </Box>
  );
}
