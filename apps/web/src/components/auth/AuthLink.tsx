import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';
import NextLink from 'next/link';

interface AuthLinkProps {
  prompt: string;
  linkText: string;
  href: string;
}

export function AuthLink({ prompt, linkText, href }: AuthLinkProps) {
  return (
    <Box sx={{ textAlign: 'center' }}>
      <Typography variant="body2" color="text.secondary" component="span">
        {prompt}{' '}
      </Typography>
      <Link component={NextLink} href={href} variant="body2" underline="hover" sx={{ fontWeight: 600 }}>
        {linkText}
      </Link>
    </Box>
  );
}
