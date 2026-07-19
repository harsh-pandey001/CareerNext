import Button, { type ButtonProps } from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';

interface SubmitButtonProps extends ButtonProps {
  loading?: boolean;
}

export function SubmitButton({ loading, children, disabled, sx, ...rest }: SubmitButtonProps) {
  return (
    <Button
      type="submit"
      variant="contained"
      size="large"
      fullWidth
      disableElevation
      disabled={disabled || loading}
      sx={{
        textTransform: 'none',
        fontWeight: 600,
        fontSize: '0.95rem',
        py: 1.25,
        borderRadius: '10px',
        background: (theme) =>
          theme.palette.mode === 'dark'
            ? 'linear-gradient(135deg, #0F766E 0%, #14B8A6 100%)'
            : 'linear-gradient(135deg, #065F46 0%, #0D9488 100%)',
        '&:hover': {
          background: (theme) =>
            theme.palette.mode === 'dark'
              ? 'linear-gradient(135deg, #115E59 0%, #2DD4BF 100%)'
              : 'linear-gradient(135deg, #047857 0%, #14B8A6 100%)',
          boxShadow: '0 6px 20px rgba(13,148,136,0.35)',
        },
        ...sx,
      }}
      {...rest}
    >
      {loading ? <CircularProgress size={22} color="inherit" /> : children}
    </Button>
  );
}
