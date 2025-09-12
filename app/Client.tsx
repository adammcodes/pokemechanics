"use client";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { QueryClient, QueryClientProvider } from "react-query";
import { GameContextProvider } from "@/context/GameContextProvider";
import { Layout } from "@/components/common/Layout";
import { ApolloProvider } from "@apollo/client";
import { ChakraProvider } from "@chakra-ui/react";
import client from "@/apollo/apollo-client.js";
import { LayoutSkeleton } from "@/components/common/LayoutSkeleton";

// query client for react-query
const queryClient = new QueryClient();

export default function Client({ children }: { children?: React.ReactNode }) {
  const pageParams = useSearchParams();
  // The game from page search params take priority over the game from the local storage
  // This is to improve server side rendering performance
  const selectedGame = pageParams.get("game") as string;
  return (
    <ApolloProvider client={client}>
      <QueryClientProvider client={queryClient}>
        <GameContextProvider selectedGame={selectedGame}>
          <ChakraProvider>
            <Suspense
              fallback={
                <LayoutSkeleton>
                  <div></div>
                </LayoutSkeleton>
              }
            >
              <Layout>{children}</Layout>
            </Suspense>
          </ChakraProvider>
        </GameContextProvider>
      </QueryClientProvider>
    </ApolloProvider>
  );
}
