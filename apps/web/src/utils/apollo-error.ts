import { ApolloError } from '@apollo/client';

const DEFAULT_MESSAGE = 'Something went wrong. Please try again.';

/**
 * Extracts a user-facing message from a failed Apollo operation. Prefers the
 * server's GraphQL error message (e.g. "Invalid email or password.") over
 * generic network/client error text.
 */
export function getApolloErrorMessage(error: unknown, fallback = DEFAULT_MESSAGE): string {
  if (error instanceof ApolloError) {
    const graphQLMessage = error.graphQLErrors[0]?.message;
    if (graphQLMessage) return graphQLMessage;
    if (error.networkError) return 'Network error. Please check your connection and try again.';
    return error.message || fallback;
  }
  if (error instanceof Error) return error.message || fallback;
  return fallback;
}
