"use client";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { QueryClient, QueryClientProvider } from "react-query";
import { GameContextProvider } from "@/context/GameContextProvider";
import { Layout } from "@/components/common/Layout";
import { LayoutSkeleton } from "@/components/common/LayoutSkeleton";
import { ErrorBoundary } from "@/components/common/ErrorBoundary";

// query client for react-query
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
          <Suspense
            fallback={
              <LayoutSkeleton>
                <div></div>
              </LayoutSkeleton>
            }
          >
            <Layout>{children}</Layout>
          </Suspense>
        </GameContextProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}
