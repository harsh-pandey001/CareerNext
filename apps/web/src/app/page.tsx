import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

export default function HomePage() {
  return (
    <Container maxWidth="md">
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          gap: 2,
        }}
      >
        <Typography variant="h2" fontWeight={700}>
          CareerNext
        </Typography>
        <Typography variant="h5" color="text.secondary">
          Your Next Career Move Starts Here.
        </Typography>
      </Box>
    </Container>
  );
}
