import { ApolloClient, InMemoryCache, createHttpLink, from, fromPromise } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { onError } from '@apollo/client/link/error';
import { print } from 'graphql';
import { env } from '@/config/env';
import { ROUTES } from '@/constants';
import { useAuthStore } from '@/store/auth.store';
import { REFRESH_TOKEN_MUTATION } from '@/graphql/auth/mutations';
import type { RefreshTokenMutation } from '@careernext/graphql-types';

/**
 * Apollo Client factory. GraphQL is the ONLY data-fetching layer (no REST).
 * `credentials: 'include'` sends the httpOnly refresh cookie on every
 * request; the access token itself is attached per-request from in-memory
 * Zustand state (never localStorage) via the auth link below.
 */
const httpLink = createHttpLink({ uri: env.graphqlEndpoint, credentials: 'include' });

const authLink = setContext((_, { headers }) => {
  const token = useAuthStore.getState().accessToken;
  return {
    headers: {
      ...headers,
      ...(token ? { authorization: `Bearer ${token}` } : {}),
    },
  };
});

// Operations that must NOT trigger a refresh-and-retry on their own
// UNAUTHENTICATED error — refreshing off of a failed refresh/login/register
// would loop forever.
const REFRESH_EXEMPT_OPERATIONS = new Set(['RefreshToken', 'Login', 'Register', 'Logout']);

let refreshPromise: Promise<string | null> | null = null;

/**
 * Performs the refresh over a plain `fetch` (not the Apollo client itself)
 * to avoid a circular dependency between the client and its own error link.
 */
async function refreshAccessToken(): Promise<string | null> {
  try {
    const response = await fetch(env.graphqlEndpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ query: print(REFRESH_TOKEN_MUTATION) }),
    });
    const json = (await response.json()) as { data?: RefreshTokenMutation };
    if (!json.data?.refreshToken) return null;

    const { accessToken, user } = json.data.refreshToken;
    useAuthStore.getState().setAuth({ accessToken, user });
    return accessToken;
  } catch {
    return null;
  }
}

/**
 * On an UNAUTHENTICATED error, refreshes the access token once (concurrent
 * 401s share the same in-flight refresh via `refreshPromise`) and retries
 * the failed operation. If the refresh itself fails, clears the session and
 * sends the user to `/login`.
 */
const errorLink = onError(({ graphQLErrors, operation, forward }) => {
  if (!graphQLErrors?.length) return;

  const isUnauthenticated = graphQLErrors.some((err) => err.extensions?.code === 'UNAUTHENTICATED');
  if (!isUnauthenticated) return;

  if (REFRESH_EXEMPT_OPERATIONS.has(operation.operationName)) {
    useAuthStore.getState().clearAuth();
    return;
  }

  refreshPromise ??= refreshAccessToken().finally(() => {
    refreshPromise = null;
  });

  return fromPromise(
    refreshPromise.then((newAccessToken) => {
      if (!newAccessToken) {
        useAuthStore.getState().clearAuth();
        if (typeof window !== 'undefined') {
          window.location.href = ROUTES.LOGIN;
        }
      }
      // On success, authLink re-reads the (now updated) store token when
      // `forward` re-enters the chain below — no need to touch headers here.
    }),
  ).flatMap(() => forward(operation));
});

export function createApolloClient() {
  return new ApolloClient({
    link: from([errorLink, authLink, httpLink]),
    cache: new InMemoryCache(),
    defaultOptions: {
      watchQuery: { fetchPolicy: 'cache-and-network' },
    },
  });
}
