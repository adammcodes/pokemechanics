"use client";
import { useSearchParams } from "next/navigation";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { GameContextProvider } from "@/context/GameContextProvider";
import { Layout } from "@/components/common/Layout";
import { ErrorBoundary } from "@/components/common/ErrorBoundary";

// query client for @tanstack/react-query
const queryClient = new QueryClient();

export default function Client({
  children,
  initialGame,
}: {
  children?: React.ReactNode;
  initialGame: string;
}) {
  const pageParams = useSearchParams();
  // The game from page search params take priority over the game from cookies
  // This is to improve server side rendering performance
  const selectedGame = pageParams.get("game") as string;

  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <GameContextProvider
          selectedGame={selectedGame}
          initialGame={initialGame}
        >
          <Layout>{children}</Layout>
        </GameContextProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}
