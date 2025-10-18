"use client";
import { useSearchParams, usePathname } from "next/navigation";
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
  const pathname = usePathname();

  // Extract game from URL path if we're on a /pokedex/[gen] route
  const pokedexMatch = pathname?.match(/^\/pokedex\/([^\/]+)/);
  const gameFromPath = pokedexMatch?.[1] || null;

  // Priority: URL path param > search param > cookie
  // The game from page search params take priority over the game from cookies
  // This is to improve server side rendering performance
  const selectedGame = gameFromPath || (pageParams.get("game") as string);

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
