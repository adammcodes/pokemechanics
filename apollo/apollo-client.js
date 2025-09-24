import { ApolloClient, InMemoryCache } from "@apollo/client";

const client = new ApolloClient({
  uri: "/api/graphql", // Use local API route instead of external HTTPS
  cache: new InMemoryCache({
    typePolicies: {
      Query: {
        fields: {
          // Cache Pokemon stats queries
          stats: {
            merge: false,
          },
          // Cache Pokemon abilities queries
          abilities: {
            merge: false,
          },
          // Cache Pokemon types queries
          pokemon_v2_pokemontype: {
            merge: false,
          },
        },
      },
    },
  }),
  defaultOptions: {
    watchQuery: {
      errorPolicy: "all",
      notifyOnNetworkStatusChange: false, // Prevent unnecessary re-renders
      fetchPolicy: "cache-first", // Use cache first to prevent repeated requests
    },
    query: {
      errorPolicy: "all",
      fetchPolicy: "cache-first", // Use cache first to prevent repeated requests
    },
  },
});

export default client;
