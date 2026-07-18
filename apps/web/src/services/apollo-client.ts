import { ApolloClient, InMemoryCache, createHttpLink, from } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { env } from '@/config/env';

/**
 * Apollo Client factory. GraphQL is the ONLY data-fetching layer (no REST).
 * An auth link is wired here so JWT access tokens (V1 auth) attach automatically.
 */
const httpLink = createHttpLink({ uri: env.graphqlEndpoint });

const authLink = setContext((_, { headers }) => {
  // Access token wiring lands with V1 authentication.
  const token = typeof window !== 'undefined' ? window.localStorage.getItem('accessToken') : null;
  return {
    headers: {
      ...headers,
      ...(token ? { authorization: `Bearer ${token}` } : {}),
    },
  };
});

export function createApolloClient() {
  return new ApolloClient({
    link: from([authLink, httpLink]),
    cache: new InMemoryCache(),
    defaultOptions: {
      watchQuery: { fetchPolicy: 'cache-and-network' },
    },
  });
}
