import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

interface StepProgressProps {
  step: number;
  totalSteps: number;
}

export function StepProgress({ step, totalSteps }: StepProgressProps) {
  return (
    <Stack spacing={1.5} alignItems="center" sx={{ width: '100%' }}>
      <Typography
        variant="overline"
        sx={{ color: 'text.secondary', fontWeight: 600, letterSpacing: '0.1em', lineHeight: 1.4 }}
      >
        Step {step} of {totalSteps}
      </Typography>
      <Stack
        direction="row"
        alignItems="center"
        role="progressbar"
        aria-valuenow={step}
        aria-valuemin={1}
        aria-valuemax={totalSteps}
        aria-label={`Step ${step} of ${totalSteps}`}
        sx={{ width: '100%' }}
      >
        {Array.from({ length: totalSteps }).map((_, index) => {
          const stepNumber = index + 1;
          const isDone = stepNumber < step;
          const isCurrent = stepNumber === step;
          const isLast = index === totalSteps - 1;
          return (
            <Box key={stepNumber} sx={{ display: 'flex', alignItems: 'center', flex: isLast ? '0 0 auto' : 1 }}>
              <Box
                sx={{
                  width: isCurrent ? 14 : 10,
                  height: isCurrent ? 14 : 10,
                  borderRadius: '50%',
                  flexShrink: 0,
                  bgcolor: isDone || isCurrent ? 'primary.main' : 'transparent',
                  border: '2px solid',
                  borderColor: isDone || isCurrent ? 'primary.main' : 'divider',
                  transition: 'all 0.3s ease',
                }}
              />
              {!isLast && (
                <Box
                  sx={{
                    flex: 1,
                    height: 2,
                    mx: 1,
                    borderRadius: 1,
                    bgcolor: isDone ? 'primary.main' : 'divider',
                    transition: 'background-color 0.3s ease',
                  }}
                />
              )}
            </Box>
          );
        })}
      </Stack>
    </Stack>
  );
}
