import { ApolloClient, InMemoryCache } from "@apollo/client";

const client = new ApolloClient({
  uri: "/api/graphql", // Use local API route instead of external HTTPS
  cache: new InMemoryCache(),
});

export default client;
