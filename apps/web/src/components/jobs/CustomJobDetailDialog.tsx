'use client';

import type { ReactNode } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import Link from '@mui/material/Link';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import LocationOnRoundedIcon from '@mui/icons-material/LocationOnRounded';
import OpenInNewRoundedIcon from '@mui/icons-material/OpenInNewRounded';
import type { JobFieldsFragment } from '@careernext/graphql-types';
import { JOB_TYPE_LABELS, WORK_MODE_LABELS } from './constants';

interface CustomJobDetailDialogProps {
  open: boolean;
  onClose: () => void;
  onEdit: () => void;
  job: JobFieldsFragment | undefined;
  loading: boolean;
}

interface DetailBlockProps {
  label: string;
  children: ReactNode;
}

function DetailBlock({ label, children }: DetailBlockProps) {
  return (
    <Stack spacing={0.5}>
      <Typography variant="caption" fontWeight={700} color="text.secondary" sx={{ textTransform: 'uppercase', letterSpacing: '0.04em' }}>
        {label}
      </Typography>
      {children}
    </Stack>
  );
}

export function CustomJobDetailDialog({ open, onClose, onEdit, job, loading }: CustomJobDetailDialogProps) {
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm" slotProps={{ paper: { sx: { borderRadius: '20px' } } }}>
      <DialogTitle sx={{ pr: 7 }}>
        {job ? job.title : 'Job Details'}
        <IconButton onClick={onClose} aria-label="Close" sx={{ position: 'absolute', right: 12, top: 12 }}>
          <CloseRoundedIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers>
        {loading || !job ? (
          <Stack alignItems="center" sx={{ py: 6 }}>
            <CircularProgress size={24} />
          </Stack>
        ) : (
          <Stack spacing={2.5}>
            <DetailBlock label="Company">
              <Typography variant="body1" fontWeight={700}>
                {job.company}
              </Typography>
            </DetailBlock>

            <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
              <Chip label={JOB_TYPE_LABELS[job.type]} size="small" sx={{ bgcolor: 'action.hover', fontWeight: 600 }} />
              <Chip label={WORK_MODE_LABELS[job.workMode]} size="small" sx={{ bgcolor: 'action.hover', fontWeight: 600 }} />
              {job.location && (
                <Chip
                  icon={<LocationOnRoundedIcon sx={{ fontSize: '16px !important' }} />}
                  label={job.location}
                  size="small"
                  variant="outlined"
                />
              )}
              {job.experienceRequired && <Chip label={job.experienceRequired} size="small" variant="outlined" />}
            </Stack>

            {job.contactEmail && (
              <DetailBlock label="Contact Email">
                <Typography variant="body2">{job.contactEmail}</Typography>
              </DetailBlock>
            )}

            {job.skills.length > 0 && (
              <DetailBlock label="Tech / Skills Required">
                <Stack direction="row" spacing={0.75} flexWrap="wrap" useFlexGap>
                  {job.skills.map((skill) => (
                    <Chip key={skill} label={skill} size="small" variant="outlined" sx={{ borderColor: 'divider' }} />
                  ))}
                </Stack>
              </DetailBlock>
            )}

            {job.externalUrl && (
              <DetailBlock label="Job Link">
                <Link
                  href={job.externalUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.5, fontWeight: 600 }}
                >
                  {job.externalUrl}
                  <OpenInNewRoundedIcon sx={{ fontSize: 14 }} />
                </Link>
              </DetailBlock>
            )}

            {job.description && (
              <DetailBlock label="Job Description">
                <Typography variant="body2" color="text.secondary" sx={{ whiteSpace: 'pre-wrap' }}>
                  {job.description}
                </Typography>
              </DetailBlock>
            )}

            <Divider />

            <DetailBlock label="Cover Letter">
              {job.coverLetter ? (
                <Typography variant="body2" color="text.secondary" sx={{ whiteSpace: 'pre-wrap' }}>
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
                <Typography variant="body2" color="text.secondary" sx={{ whiteSpace: 'pre-wrap' }}>
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
          sx={{ textTransform: 'none', fontWeight: 600, borderRadius: '10px', px: 3 }}
        >
          Edit
        </Button>
      </DialogActions>
    </Dialog>
  );
}
