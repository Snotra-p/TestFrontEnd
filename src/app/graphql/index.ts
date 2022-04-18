import {
  ApolloClient,
  NormalizedCacheObject,
  createHttpLink,
} from '@apollo/client';
import Config from 'config';
import { cache } from './cache';

function configureApolloClient(
  config: Config,
): ApolloClient<NormalizedCacheObject> {
  const enchancedFetch = (url, init) => {
    return fetch(url, {
      ...init,
      headers: {
        ...init.headers,
        'Access-Control-Allow-Origin': '*',
        authorization: `Bearer ${localStorage.getItem('token')}`,

        // ...(token && { authorization: `Bearer ${token}` }),
      },
    }).then(response => response);
  };

  const link = createHttpLink({
    uri: config.endpoints.https,
    // credentials: 'include',
    fetchOptions: {
      mode: 'cors',
    },
    fetch: enchancedFetch,
  });

  const client = new ApolloClient({
    cache: cache,
    link,
    headers: {
      authorization: localStorage.getItem('token') || '',
      'client-name': 'Ninepeople [web]',
      'client-version': '1.0.0',
    },
  });
  return client;
}

export { configureApolloClient };
export * from './queries';
