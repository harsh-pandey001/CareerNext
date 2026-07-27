'use client';

import { Component, type ErrorInfo, type ReactNode } from 'react';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import ErrorOutlineRoundedIcon from '@mui/icons-material/ErrorOutlineRounded';

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

/**
 * Last line of defense for render-time crashes inside the app area — a
 * thrown error in one widget must not take down the whole shell with a
 * white screen. Class component by necessity: error boundaries have no
 * hook equivalent.
 */
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  override state: ErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  override componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    // eslint-disable-next-line no-console
    console.error('Unhandled render error:', error, errorInfo.componentStack);
  }

  override render(): ReactNode {
    if (!this.state.hasError) return this.props.children;

    return (
      <Stack spacing={2} alignItems="center" justifyContent="center" sx={{ py: 12, textAlign: 'center' }}>
        <ErrorOutlineRoundedIcon sx={{ fontSize: 48, color: 'text.disabled' }} />
        <Stack spacing={0.5}>
          <Typography variant="h6" fontWeight={700}>
            Something went wrong
          </Typography>
          <Typography variant="body2" color="text.secondary">
            An unexpected error occurred while rendering this page.
          </Typography>
        </Stack>
        <Button
          variant="contained"
          disableElevation
          onClick={() => window.location.reload()}
          sx={{ textTransform: 'none', fontWeight: 600, borderRadius: '10px' }}
        >
          Reload Page
        </Button>
      </Stack>
    );
  }
}
