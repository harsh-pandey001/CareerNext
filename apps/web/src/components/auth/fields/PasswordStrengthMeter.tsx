import Stack from '@mui/material/Stack';
import LinearProgress from '@mui/material/LinearProgress';
import Typography from '@mui/material/Typography';

interface PasswordStrengthMeterProps {
  password: string;
}

type StrengthColor = 'error' | 'warning' | 'info' | 'success';

function getPasswordStrength(password: string): { label: string; color: StrengthColor; score: number } {
  let score = 0;
  if (password.length >= 8) score += 1;
  if (password.length >= 12) score += 1;
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score += 1;
  if (/\d/.test(password)) score += 1;
  if (/[^A-Za-z0-9]/.test(password)) score += 1;

  if (score <= 1) return { label: 'Weak', color: 'error', score };
  if (score === 2) return { label: 'Fair', color: 'warning', score };
  if (score <= 4) return { label: 'Good', color: 'info', score };
  return { label: 'Strong', color: 'success', score };
}

export function PasswordStrengthMeter({ password }: PasswordStrengthMeterProps) {
  if (!password) return null;

  const { label, color, score } = getPasswordStrength(password);

  return (
    <Stack spacing={0.5}>
      <LinearProgress
        variant="determinate"
        value={(score / 5) * 100}
        color={color}
        sx={{ height: 6, borderRadius: 3, backgroundColor: 'action.hover' }}
      />
      <Typography variant="caption" fontWeight={600} sx={{ color: `${color}.main` }}>
        {label}
      </Typography>
    </Stack>
  );
}
