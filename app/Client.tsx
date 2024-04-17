"use client";
import { QueryClient, QueryClientProvider } from "react-query";
import { GameContextProvider } from "@/context/GameContextProvider";
import { Layout } from "@/components/common/Layout";
import { ApolloProvider } from "@apollo/client";
import { ChakraProvider } from "@chakra-ui/react";
import client from "@/apollo/apollo-client.js";

// query client for react-query
const queryClient = new QueryClient();

export default function Client({ children }: { children?: React.ReactNode }) {
  return (
    <ApolloProvider client={client}>
      <QueryClientProvider client={queryClient}>
        <GameContextProvider>
          <ChakraProvider>
            <Layout>{children}</Layout>
          </ChakraProvider>
        </GameContextProvider>
      </QueryClientProvider>
    </ApolloProvider>
  );
}
