'use client';

import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import StepContent from '@mui/material/StepContent';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import { formatDateTime } from '@careernext/utils';
import type { ApplicationStatusHistoryQuery } from '@careernext/graphql-types';
import { getApolloErrorMessage } from '@/utils';
import { STATUS_LABELS } from './constants';

interface ApplicationTimelineDialogProps {
  open: boolean;
  onClose: () => void;
  jobTitle: string;
  company: string;
  history: ApplicationStatusHistoryQuery['applicationStatusHistory'];
  loading: boolean;
  error: unknown;
}

/** Real, dated history — not a re-derivation of the current status, the actual recorded trail. */
export function ApplicationTimelineDialog({
  open,
  onClose,
  jobTitle,
  company,
  history,
  loading,
  error,
}: ApplicationTimelineDialogProps) {
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs" slotProps={{ paper: { sx: { borderRadius: '20px' } } }}>
      <DialogTitle sx={{ pr: 7 }}>
        Status Timeline
        {/* component="span": DialogTitle renders an <h2> — a nested <p> (Typography's
            default) would be invalid HTML, so this stays an inline element. */}
        <Typography component="span" variant="body2" color="text.secondary" sx={{ display: 'block', fontWeight: 400 }}>
          {jobTitle} — {company}
        </Typography>
        <IconButton onClick={onClose} aria-label="Close" sx={{ position: 'absolute', right: 12, top: 12 }}>
          <CloseRoundedIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
            <CircularProgress size={24} />
          </Box>
        ) : error ? (
          <Alert severity="error" variant="outlined" sx={{ borderRadius: 2 }}>
            {getApolloErrorMessage(error, 'Could not load the status history.')}
          </Alert>
        ) : history.length === 0 ? (
          <Typography variant="body2" color="text.secondary" sx={{ py: 2 }}>
            No history recorded yet.
          </Typography>
        ) : (
          <Stepper orientation="vertical" activeStep={history.length}>
            {history.map((entry) => (
              <Step key={entry.id} completed>
                <StepLabel>{STATUS_LABELS[entry.toStatus]}</StepLabel>
                <StepContent>
                  <Typography variant="caption" color="text.secondary">
                    {formatDateTime(entry.changedAt)}
                  </Typography>
                </StepContent>
              </Step>
            ))}
          </Stepper>
        )}
      </DialogContent>
      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button onClick={onClose} sx={{ textTransform: 'none', fontWeight: 600 }}>
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
}
