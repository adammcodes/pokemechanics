import "@/styles/globals.css";
import { QueryClient, QueryClientProvider } from "react-query";
import { GameContextProvider } from "@/context/GameContextProvider";
import { Layout } from "@/components/common/Layout";
import { ApolloProvider } from "@apollo/client";
import client from "src/apollo/apollo-client.js";

const queryClient = new QueryClient();

export default function App({ Component, pageProps }) {
  return (
    <ApolloProvider client={client}>
      <QueryClientProvider client={queryClient}>
        <GameContextProvider>
          <Layout>
            <Component {...pageProps} />
          </Layout>
        </GameContextProvider>
      </QueryClientProvider>
    </ApolloProvider>
  );
}
