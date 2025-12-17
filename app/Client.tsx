"use client";
import { Suspense } from "react";
import { useSearchParams, usePathname } from "next/navigation";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { GenerationProvider } from "@/context/GenerationProvider";
import { Layout } from "@/components/common/Layout";
import { ErrorBoundary } from "@/components/common/ErrorBoundary";

// query client for @tanstack/react-query
const queryClient = new QueryClient();

function ClientInner({
  children,
  initialGeneration,
}: {
  children?: React.ReactNode;
  initialGeneration: string;
}) {
  const pageParams = useSearchParams();
  const pathname = usePathname();

  // Extract generation from URL path if we're on a /pokedex/[gen] route or /pokemon/[name]/[generation]/[dex] route
  const pokedexMatch = pathname?.match(/^\/pokedex\/([^\/]+)/);
  const pokemonMatch = pathname?.match(/^\/pokemon\/[^\/]+\/([^\/]+)\/[^\/]+$/);
  const generationFromPath = pokedexMatch?.[1] || pokemonMatch?.[1] || null; // e.g. "generation-i"

  // Priority: URL path param > search param
  const selectedGeneration =
    generationFromPath || (pageParams.get("generation") as string);

  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <GenerationProvider
          selectedGeneration={selectedGeneration}
          initialGeneration={initialGeneration}
        >
          <Layout>{children}</Layout>
        </GenerationProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default function Client(props: {
  children?: React.ReactNode;
  initialGeneration: string;
}) {
  return (
    <Suspense fallback={null}>
      <ClientInner {...props} />
    </Suspense>
  );
}
