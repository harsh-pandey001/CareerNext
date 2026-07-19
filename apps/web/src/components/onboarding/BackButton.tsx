import Button from '@mui/material/Button';

interface BackButtonProps {
  onClick: () => void;
}

export function BackButton({ onClick }: BackButtonProps) {
  return (
    <Button
      variant="outlined"
      size="large"
      onClick={onClick}
      sx={{
        textTransform: 'none',
        fontWeight: 600,
        borderRadius: '10px',
        borderColor: 'divider',
        color: 'text.primary',
        px: 4,
        '&:hover': { borderColor: 'primary.main', backgroundColor: 'action.hover' },
      }}
    >
      Back
    </Button>
  );
}
