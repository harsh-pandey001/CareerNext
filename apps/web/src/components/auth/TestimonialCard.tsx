import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import { alpha } from '@mui/material/styles';
import FormatQuoteRoundedIcon from '@mui/icons-material/FormatQuoteRounded';

interface TestimonialCardProps {
  quote: string;
  name: string;
  designation: string;
}

function getInitials(name: string) {
  return name
    .split(' ')
    .filter(Boolean)
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
}

export function TestimonialCard({ quote, name, designation }: TestimonialCardProps) {
  return (
    <Box
      sx={{
        borderRadius: '20px',
        p: 3,
        background: alpha('#fff', 0.1),
        backdropFilter: 'blur(20px)',
        border: '1px solid',
        borderColor: alpha('#fff', 0.18),
        boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
      }}
    >
      <FormatQuoteRoundedIcon sx={{ color: alpha('#fff', 0.4), fontSize: 32, mb: 1 }} />
      <Typography
        component="blockquote"
        sx={{ m: 0, color: '#fff', fontSize: '1.05rem', lineHeight: 1.6, mb: 2.5 }}
      >
        {quote}
      </Typography>
      <Stack direction="row" spacing={1.5} alignItems="center">
        <Avatar
          sx={{
            bgcolor: alpha('#fff', 0.2),
            color: '#fff',
            fontWeight: 700,
            fontSize: '0.9rem',
            width: 40,
            height: 40,
          }}
        >
          {getInitials(name)}
        </Avatar>
        <Box>
          <Typography sx={{ color: '#fff', fontWeight: 600, fontSize: '0.9rem', lineHeight: 1.3 }}>
            {name}
          </Typography>
          <Typography sx={{ color: alpha('#fff', 0.7), fontSize: '0.825rem' }}>
            {designation}
          </Typography>
        </Box>
      </Stack>
    </Box>
  );
}
