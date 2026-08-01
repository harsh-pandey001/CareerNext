'use client';

import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import { alpha } from '@mui/material/styles';
import BookmarkRoundedIcon from '@mui/icons-material/BookmarkRounded';
import BookmarkBorderRoundedIcon from '@mui/icons-material/BookmarkBorderRounded';
import LocationOnRoundedIcon from '@mui/icons-material/LocationOnRounded';
import OpenInNewRoundedIcon from '@mui/icons-material/OpenInNewRounded';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import AccessTimeRoundedIcon from '@mui/icons-material/AccessTimeRounded';
import { formatRelativeDate } from '@careernext/utils';
import type { JobFieldsFragment } from '@careernext/graphql-types';
import {
  JOB_TYPE_LABELS,
  WORK_MODE_LABELS,
  formatSalaryRange,
  getCompanyInitials,
} from './constants';

interface JobCardProps {
  job: JobFieldsFragment;
  pending: boolean;
  /** Omit both to hide the bookmark control entirely (e.g. custom jobs, where it has no use). */
  onSave?: (jobId: string) => void;
  onUnsave?: (jobId: string) => void;
  onApply: (jobId: string) => void;
  /** Opens a detail view — Save/Apply stay independently clickable via stopPropagation. */
  onClick?: (jobId: string) => void;
}

export function JobCard({ job, pending, onSave, onUnsave, onApply, onClick }: JobCardProps) {
  const showSaveButton = !!onSave && !!onUnsave;
  const isSaved = job.applicationStatus === 'SAVED';
  const isApplied =
    job.applicationStatus === 'APPLIED' ||
    (!!job.applicationStatus && job.applicationStatus !== 'SAVED');
  const salary = formatSalaryRange(job.salaryMin, job.salaryMax);

  const handleApply = () => {
    onApply(job.id);
    if (job.externalUrl) {
      window.open(job.externalUrl, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <Paper
      elevation={0}
      onClick={onClick ? () => onClick(job.id) : undefined}
      sx={{
        p: 2.75,
        borderRadius: '16px',
        border: '1px solid',
        borderColor: 'divider',
        display: 'flex',
        flexDirection: 'column',
        gap: 1.75,
        height: '100%',
        // A grid row only stretches cards to match its OWN tallest card — two
        // cards with very different content (e.g. one with skills chips, one
        // without) can still end up in different rows with different row
        // heights, so the grid reads uneven from row to row. A shared floor
        // height keeps every card the same size regardless of which row it
        // lands in; the flex spacer below still pushes the Apply button to
        // the bottom the same way it always did.
        minHeight: 328,
        cursor: onClick ? 'pointer' : undefined,
        transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
        '&:hover': {
          borderColor: 'primary.main',
          boxShadow: (theme) =>
            `0 4px 20px ${alpha(theme.palette.primary.main, theme.palette.mode === 'dark' ? 0.18 : 0.1)}`,
        },
      }}
    >
      <Stack direction="row" spacing={1.5} alignItems="flex-start">
        <Box
          sx={{
            width: 44,
            height: 44,
            borderRadius: '10px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            bgcolor: (theme) => alpha(theme.palette.primary.main, 0.12),
            color: 'primary.main',
            fontWeight: 700,
            fontSize: '0.85rem',
          }}
        >
          {getCompanyInitials(job.company)}
        </Box>
        <Stack spacing={0.25} sx={{ flex: 1, minWidth: 0 }}>
          <Typography variant="subtitle1" fontWeight={700} noWrap>
            {job.title}
          </Typography>
          <Typography variant="body2" color="text.secondary" noWrap>
            {job.company}
          </Typography>
        </Stack>
        {showSaveButton && (
          <Button
            onClick={(event) => {
              event.stopPropagation();
              isSaved ? onUnsave?.(job.id) : onSave?.(job.id);
            }}
            disabled={pending || isApplied}
            aria-label={isSaved ? 'Unsave job' : 'Save job'}
            size="small"
            sx={{ minWidth: 0, p: 1, color: isSaved ? 'primary.main' : 'text.secondary' }}
          >
            {isSaved ? (
              <BookmarkRoundedIcon fontSize="small" />
            ) : (
              <BookmarkBorderRoundedIcon fontSize="small" />
            )}
          </Button>
        )}
      </Stack>

      <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
        <Chip
          label={JOB_TYPE_LABELS[job.type]}
          size="small"
          sx={{ bgcolor: 'action.hover', fontWeight: 600 }}
        />
        <Chip
          label={WORK_MODE_LABELS[job.workMode]}
          size="small"
          sx={{ bgcolor: 'action.hover', fontWeight: 600 }}
        />
        {job.location && (
          <Chip
            icon={<LocationOnRoundedIcon sx={{ fontSize: '16px !important' }} />}
            label={job.location}
            size="small"
            variant="outlined"
          />
        )}
        {job.experienceRequired && (
          <Chip label={job.experienceRequired} size="small" variant="outlined" />
        )}
        {job.postedAt && (
          <Chip
            icon={<AccessTimeRoundedIcon sx={{ fontSize: '15px !important' }} />}
            label={`Posted ${formatRelativeDate(job.postedAt).toLowerCase()}`}
            size="small"
            variant="outlined"
          />
        )}
      </Stack>

      {salary && (
        <Typography variant="body2" fontWeight={700} sx={{ color: 'success.main' }}>
          {salary}
          <Typography component="span" variant="caption" color="text.secondary" fontWeight={400}>
            {' '}
            / year
          </Typography>
        </Typography>
      )}

      <Typography
        variant="body2"
        color="text.secondary"
        sx={{
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
        }}
      >
        {job.description}
      </Typography>

      {job.skills.length > 0 && (
        <Stack direction="row" spacing={0.75} flexWrap="wrap" useFlexGap>
          {job.skills.map((skill) => (
            <Chip
              key={skill}
              label={skill}
              size="small"
              variant="outlined"
              sx={{ borderColor: 'divider', fontSize: '0.7rem' }}
            />
          ))}
        </Stack>
      )}

      <Box sx={{ flex: 1 }} />

      <Button
        onClick={(event) => {
          event.stopPropagation();
          handleApply();
        }}
        disabled={pending || isApplied}
        fullWidth
        variant={isApplied ? 'outlined' : 'contained'}
        disableElevation
        startIcon={
          pending ? (
            <CircularProgress size={16} color="inherit" />
          ) : isApplied ? (
            <CheckCircleRoundedIcon fontSize="small" />
          ) : (
            <OpenInNewRoundedIcon fontSize="small" />
          )
        }
        sx={{
          textTransform: 'none',
          fontWeight: 600,
          borderRadius: '10px',
          ...(isApplied
            ? { color: 'success.main', borderColor: 'success.main' }
            : {
                background: (theme) =>
                  theme.palette.mode === 'dark'
                    ? 'linear-gradient(135deg, #0F766E 0%, #14B8A6 100%)'
                    : 'linear-gradient(135deg, #065F46 0%, #0D9488 100%)',
              }),
        }}
      >
        {isApplied ? 'Applied' : 'Apply Now'}
      </Button>
    </Paper>
  );
}
