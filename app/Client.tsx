"use client";
import { Suspense } from "react";
import { QueryClient, QueryClientProvider } from "react-query";
import { GameContextProvider } from "@/context/GameContextProvider";
import { Layout } from "@/components/common/Layout";
import { ApolloProvider } from "@apollo/client";
import { ChakraProvider } from "@chakra-ui/react";
import client from "@/apollo/apollo-client.js";
import PokeballLoader from "@/components/common/PokeballLoader";

// query client for react-query
const queryClient = new QueryClient();

export default function Client({ children }: { children?: React.ReactNode }) {
  return (
    <ApolloProvider client={client}>
      <QueryClientProvider client={queryClient}>
        <GameContextProvider>
          <ChakraProvider>
            <Suspense fallback={<PokeballLoader />}>
              <Layout>{children}</Layout>
            </Suspense>
          </ChakraProvider>
        </GameContextProvider>
      </QueryClientProvider>
    </ApolloProvider>
  );
}
