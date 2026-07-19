import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';

interface OrDividerProps {
  label?: string;
}

export function OrDivider({ label = 'or continue with email' }: OrDividerProps) {
  return (
    <Divider sx={{ '&::before, &::after': { borderColor: 'divider' } }}>
      <Typography variant="caption" sx={{ color: 'text.secondary', px: 1 }}>
        {label}
      </Typography>
    </Divider>
  );
}
