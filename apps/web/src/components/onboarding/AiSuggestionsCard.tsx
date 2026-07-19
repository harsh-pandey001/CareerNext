import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import CheckRoundedIcon from '@mui/icons-material/CheckRounded';
import AutoAwesomeRoundedIcon from '@mui/icons-material/AutoAwesomeRounded';

interface AiSuggestionsCardProps {
  items: string[];
}

export function AiSuggestionsCard({ items }: AiSuggestionsCardProps) {
  return (
    <Paper
      elevation={0}
      sx={{
        p: 2.5,
        borderRadius: '16px',
        border: '1px solid',
        borderColor: 'divider',
        background: 'linear-gradient(135deg, rgba(13,148,136,0.08) 0%, rgba(5,150,105,0.03) 100%)',
      }}
    >
      <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1.5 }}>
        <AutoAwesomeRoundedIcon fontSize="small" sx={{ color: 'primary.main' }} />
        <Typography variant="body2" fontWeight={600}>
          AI Suggestions
        </Typography>
      </Stack>
      <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mb: 1 }}>
        Learn:
      </Typography>
      <Stack spacing={0.75}>
        {items.map((item) => (
          <Stack key={item} direction="row" spacing={1} alignItems="center">
            <CheckRoundedIcon sx={{ fontSize: 16, color: 'primary.main' }} />
            <Typography variant="body2">{item}</Typography>
          </Stack>
        ))}
      </Stack>
    </Paper>
  );
}
