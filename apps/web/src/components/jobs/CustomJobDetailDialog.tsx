'use client';

import type { ReactNode } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import Link from '@mui/material/Link';
import { alpha } from '@mui/material/styles';
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import LocationOnRoundedIcon from '@mui/icons-material/LocationOnRounded';
import OpenInNewRoundedIcon from '@mui/icons-material/OpenInNewRounded';
import EmailRoundedIcon from '@mui/icons-material/EmailRounded';
import LinkRoundedIcon from '@mui/icons-material/LinkRounded';
import DescriptionRoundedIcon from '@mui/icons-material/DescriptionRounded';
import AutoAwesomeRoundedIcon from '@mui/icons-material/AutoAwesomeRounded';
import AccessTimeRoundedIcon from '@mui/icons-material/AccessTimeRounded';
import SendRoundedIcon from '@mui/icons-material/SendRounded';
import { formatRelativeDate } from '@careernext/utils';
import type { JobFieldsFragment } from '@careernext/graphql-types';
import {
  APPLICATION_MODE_LABELS,
  JOB_TYPE_LABELS,
  WORK_MODE_LABELS,
  getCompanyInitials,
} from './constants';
import { DialogGradientHeader } from './DialogGradientHeader';

interface CustomJobDetailDialogProps {
  open: boolean;
  onClose: () => void;
  onEdit: () => void;
  job: JobFieldsFragment | undefined;
  loading: boolean;
}

interface DetailBlockProps {
  label: string;
  icon?: ReactNode;
  children: ReactNode;
}

function DetailBlock({ label, icon, children }: DetailBlockProps) {
  return (
    <Stack spacing={0.75}>
      <Stack direction="row" spacing={0.75} alignItems="center">
        {icon}
        <Typography
          variant="caption"
          fontWeight={700}
          color="text.secondary"
          sx={{ textTransform: 'uppercase', letterSpacing: '0.06em' }}
        >
          {label}
        </Typography>
      </Stack>
      {children}
    </Stack>
  );
}

const labelIconSx = { fontSize: 14, color: 'text.disabled' } as const;

const editButtonSx = {
  textTransform: 'none',
  fontWeight: 600,
  borderRadius: '10px',
  px: 3,
  background: (theme: import('@mui/material/styles').Theme) =>
    theme.palette.mode === 'dark'
      ? 'linear-gradient(135deg, #0F766E 0%, #14B8A6 100%)'
      : 'linear-gradient(135deg, #065F46 0%, #0D9488 100%)',
  '&:hover': {
    background: (theme: import('@mui/material/styles').Theme) =>
      theme.palette.mode === 'dark'
        ? 'linear-gradient(135deg, #115E59 0%, #2DD4BF 100%)'
        : 'linear-gradient(135deg, #047857 0%, #14B8A6 100%)',
    boxShadow: '0 6px 20px rgba(13,148,136,0.35)',
  },
} as const;

export function CustomJobDetailDialog({
  open,
  onClose,
  onEdit,
  job,
  loading,
}: CustomJobDetailDialogProps) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="sm"
      slotProps={{
        paper: { sx: { borderRadius: '20px' } },
        backdrop: { sx: { backdropFilter: 'blur(4px)', bgcolor: alpha('#0F172A', 0.55) } },
      }}
    >
      <DialogGradientHeader
        icon={job ? getCompanyInitials(job.company) : '?'}
        title={job ? job.title : 'Job Details'}
        subtitle={job ? job.company : 'Loading…'}
        onClose={onClose}
        accessory={
          job?.applicationStatus === 'APPLIED' ? (
            <Chip
              icon={
                <CheckCircleRoundedIcon sx={{ fontSize: '15px !important', color: 'inherit' }} />
              }
              label="Applied"
              size="small"
              sx={{
                flexShrink: 0,
                fontWeight: 700,
                color: '#fff',
                bgcolor: alpha('#fff', 0.18),
                backdropFilter: 'blur(6px)',
                border: '1px solid',
                borderColor: alpha('#fff', 0.3),
              }}
            />
          ) : undefined
        }
      />
      <DialogContent dividers sx={{ pt: 3 }}>
        {loading || !job ? (
          <Stack alignItems="center" sx={{ py: 6 }}>
            <CircularProgress size={24} />
          </Stack>
        ) : (
          <Stack spacing={2.5}>
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
                  icon={<AccessTimeRoundedIcon sx={{ fontSize: '16px !important' }} />}
                  label={`Posted ${formatRelativeDate(job.postedAt).toLowerCase()}`}
                  size="small"
                  variant="outlined"
                />
              )}
            </Stack>

            {job.contactEmail && (
              <DetailBlock label="Contact Email" icon={<EmailRoundedIcon sx={labelIconSx} />}>
                <Typography variant="body2">{job.contactEmail}</Typography>
              </DetailBlock>
            )}

            {job.skills.length > 0 && (
              <DetailBlock label="Tech / Skills Required">
                <Stack direction="row" spacing={0.75} flexWrap="wrap" useFlexGap>
                  {job.skills.map((skill) => (
                    <Chip
                      key={skill}
                      label={skill}
                      size="small"
                      variant="outlined"
                      sx={{ borderColor: 'divider' }}
                    />
                  ))}
                </Stack>
              </DetailBlock>
            )}

            {job.externalUrl && (
              <DetailBlock label="Job Link" icon={<LinkRoundedIcon sx={labelIconSx} />}>
                <Link
                  href={job.externalUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  title={job.externalUrl}
                  sx={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 0.5,
                    fontWeight: 600,
                    maxWidth: '100%',
                  }}
                >
                  {/* Truncate a long URL to one ellipsised line so it can't force the
                      dialog to scroll horizontally — the full link still opens in a new tab. */}
                  <Box
                    component="span"
                    sx={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
                  >
                    {job.externalUrl}
                  </Box>
                  <OpenInNewRoundedIcon sx={{ fontSize: 14, flexShrink: 0 }} />
                </Link>
              </DetailBlock>
            )}

            {job.description && (
              <DetailBlock
                label="Job Description"
                icon={<DescriptionRoundedIcon sx={labelIconSx} />}
              >
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ whiteSpace: 'pre-wrap', overflowWrap: 'anywhere' }}
                >
                  {job.description}
                </Typography>
              </DetailBlock>
            )}

            <Divider>
              <Stack direction="row" spacing={0.5} alignItems="center">
                <AutoAwesomeRoundedIcon sx={{ fontSize: 14, color: 'primary.main' }} />
                <Typography variant="caption" fontWeight={700} color="text.secondary">
                  Application Materials
                </Typography>
              </Stack>
            </Divider>

            {job.applicationMode && (
              <DetailBlock label="Applied Via" icon={<SendRoundedIcon sx={labelIconSx} />}>
                <Typography variant="body2">
                  {APPLICATION_MODE_LABELS[job.applicationMode]}
                </Typography>
              </DetailBlock>
            )}

            {job.resumeVersion && (
              <DetailBlock label="Resume Sent" icon={<DescriptionRoundedIcon sx={labelIconSx} />}>
                <Typography variant="body2">
                  v{job.resumeVersion.version} — {job.resumeVersion.document.fileName}
                </Typography>
              </DetailBlock>
            )}

            <DetailBlock label="Cover Letter">
              {job.coverLetter ? (
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ whiteSpace: 'pre-wrap', overflowWrap: 'anywhere' }}
                >
                  {job.coverLetter}
                </Typography>
              ) : (
                <Typography variant="body2" color="text.disabled" fontStyle="italic">
                  Not added yet.
                </Typography>
              )}
            </DetailBlock>

            <DetailBlock label="Pitch Email">
              {job.pitchEmail ? (
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ whiteSpace: 'pre-wrap', overflowWrap: 'anywhere' }}
                >
                  {job.pitchEmail}
                </Typography>
              ) : (
                <Typography variant="body2" color="text.disabled" fontStyle="italic">
                  Not added yet.
                </Typography>
              )}
            </DetailBlock>
          </Stack>
        )}
      </DialogContent>
      <DialogActions sx={{ px: 3, py: 2 }}>
        <Box sx={{ flex: 1 }} />
        <Button onClick={onClose} sx={{ textTransform: 'none', fontWeight: 600 }}>
          Close
        </Button>
        <Button
          onClick={onEdit}
          variant="contained"
          disableElevation
          disabled={!job}
          startIcon={<EditRoundedIcon fontSize="small" />}
          sx={editButtonSx}
        >
          Edit
        </Button>
      </DialogActions>
    </Dialog>
  );
}
