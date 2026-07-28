'use client';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Tooltip from '@mui/material/Tooltip';
import type { ApplicationStatus } from '@careernext/graphql-types';
import { PIPELINE_ORDER, STATUS_LABELS } from './constants';

interface PipelineStepperProps {
  status: ApplicationStatus;
}

/**
 * Compact segmented-bar version of the pipeline for the kanban card — a
 * full MUI Stepper (8 steps + labels) doesn't fit a 280px column. The rich,
 * dated version lives in ApplicationTimelineDialog.
 */
export function PipelineStepper({ status }: PipelineStepperProps) {
  const isRejected = status === 'REJECTED';
  const currentIndex = PIPELINE_ORDER.indexOf(status);

  return (
    <Stack spacing={0.5}>
      <Stack direction="row" spacing={0.5}>
        {PIPELINE_ORDER.map((stage, index) => (
          <Tooltip key={stage} title={STATUS_LABELS[stage]}>
            <Box
              sx={{
                flex: 1,
                height: 4,
                borderRadius: 999,
                bgcolor: isRejected ? 'error.main' : index <= currentIndex ? 'primary.main' : 'action.hover',
              }}
            />
          </Tooltip>
        ))}
      </Stack>
      <Typography variant="caption" fontWeight={600} sx={{ color: isRejected ? 'error.main' : 'text.secondary' }}>
        {isRejected ? 'Rejected' : STATUS_LABELS[status]}
      </Typography>
    </Stack>
  );
}
