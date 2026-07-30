import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import { alpha } from '@mui/material/styles';
import ExploreRoundedIcon from '@mui/icons-material/ExploreRounded';

/**
 * The curated catalog is seeded dummy data with no real openings behind it —
 * rather than let users save/apply to placeholder jobs, this replaces
 * browsing entirely until a real job source is wired up. Custom Jobs (add
 * your own externally-sourced applications) is the actually-useful feature
 * in the meantime, and stays fully active above this.
 */
export function BrowseJobsComingSoon() {
  return (
    <Paper
      elevation={0}
      sx={{
        p: 5,
        borderRadius: '20px',
        border: '1px dashed',
        borderColor: 'divider',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
        gap: 1.5,
      }}
    >
      <Box
        sx={{
          width: 56,
          height: 56,
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          bgcolor: (theme) => alpha(theme.palette.primary.main, 0.12),
          color: 'primary.main',
        }}
      >
        <ExploreRoundedIcon sx={{ fontSize: 28 }} />
      </Box>
      <Stack direction="row" alignItems="center" spacing={1}>
        <Typography variant="subtitle1" fontWeight={700}>
          Curated Job Board
        </Typography>
        <Chip
          label="Coming Soon"
          size="small"
          sx={{ height: 20, fontSize: '0.65rem', fontWeight: 700, bgcolor: 'action.hover' }}
        />
      </Stack>
      <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 420 }}>
        We&apos;re working on real, live job listings. Until then, use{' '}
        <Typography component="span" variant="body2" fontWeight={700}>
          Your Added Jobs
        </Typography>{' '}
        above to track applications you&apos;ve made elsewhere.
      </Typography>
    </Paper>
  );
}
