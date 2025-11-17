"use client";
import { Suspense } from "react";
import { useSearchParams, usePathname } from "next/navigation";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { GameContextProvider } from "@/context/GameContextProvider";
import { Layout } from "@/components/common/Layout";
import { ErrorBoundary } from "@/components/common/ErrorBoundary";

// query client for @tanstack/react-query
const queryClient = new QueryClient();

function ClientInner({
  children,
  initialGame,
}: {
  children?: React.ReactNode;
  initialGame: string;
}) {
  const pageParams = useSearchParams();
  const pathname = usePathname();

  // Extract game from URL path if we're on a /pokedex/[gen] route or /pokemon/[name]/[game]/[dex] route
  const pokedexMatch = pathname?.match(/^\/pokedex\/([^\/]+)/);
  const pokemonMatch = pathname?.match(/^\/pokemon\/[^\/]+\/([^\/]+)\/[^\/]+$/);
  const gameFromPath = pokedexMatch?.[1] || pokemonMatch?.[1] || null;

  // Priority: URL path param > search param
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

export default function Client(props: {
  children?: React.ReactNode;
  initialGame: string;
}) {
  return (
    <Suspense fallback={null}>
      <ClientInner {...props} />
    </Suspense>
  );
}
