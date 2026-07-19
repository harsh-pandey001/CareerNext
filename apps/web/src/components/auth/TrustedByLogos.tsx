import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { alpha } from '@mui/material/styles';

const COMPANIES = ['Google', 'Microsoft', 'Amazon', 'Uber', 'Adobe', 'Atlassian', 'Razorpay', 'Swiggy'];

export function TrustedByLogos() {
  return (
    <Box>
      <Typography
        variant="caption"
        sx={{
          color: alpha('#fff', 0.6),
          textTransform: 'uppercase',
          letterSpacing: '0.08em',
          fontWeight: 600,
          fontSize: '0.7rem',
        }}
      >
        Trusted by thousands of professionals worldwide
      </Typography>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: { xs: 2.5, lg: 3.5 }, mt: 1.75 }}>
        {COMPANIES.map((company) => (
          <Typography
            key={company}
            sx={{
              color: alpha('#fff', 0.8),
              fontWeight: 600,
              fontSize: '0.95rem',
              letterSpacing: '-0.01em',
              opacity: 0.85,
              transition: 'opacity 0.2s ease',
              '&:hover': { opacity: 1 },
            }}
          >
            {company}
          </Typography>
        ))}
      </Box>
    </Box>
  );
}
