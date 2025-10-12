import { Metadata } from "next";
import { redirect } from "next/navigation";
import { getVersionGroup } from "@/app/helpers/graphql/getVersionGroup";
import { fetchPokemonSpeciesById } from "@/app/helpers/rest/fetchPokemonSpeciesById";
import { fetchPokemonById } from "@/app/helpers/rest/fetchPokemonById";
import { fetchPokedexById } from "@/app/helpers/rest/fetchPokedexById";
import PokemonCard from "./_components/card/PokemonCard";
import convertKebabCaseToTitleCase from "@/utils/convertKebabCaseToTitleCase";

type PageProps = {
  params: {
    id: string;
  };
  searchParams?: {
    [key: string]: string | string[] | undefined;
  };
};

// Generate metadata for SEO
export async function generateMetadata({
  params,
  searchParams,
}: PageProps): Promise<Metadata> {
  const { id } = params;
  const selectedGame = (searchParams?.game as string) ?? "red-blue";

  try {
    const [speciesData, versionData] = await Promise.all([
      fetchPokemonSpeciesById(Number(id)),
      getVersionGroup(selectedGame),
    ]);

    const pokemonName = speciesData.name;
    const versionName = convertKebabCaseToTitleCase(versionData.name);

    const title = `${
      pokemonName.charAt(0).toUpperCase() + pokemonName.slice(1)
    } | ${versionName}`;
    const description = `Learn about ${
      pokemonName.charAt(0).toUpperCase() + pokemonName.slice(1)
    } | Pokémechanics - Complete stats, moves, abilities, and evolution information.`;
    const canonicalUrl = `https://www.pokemechanics.app/pokemon/${id}`;

    return {
      title,
      description,
      alternates: {
        canonical: canonicalUrl,
      },
      robots: {
        index: true,
        follow: true,
      },
    };
  } catch (error) {
    console.error("Error generating metadata:", error);

    // Return fallback metadata
    return {
      title: "Pokémon | Pokémechanics",
      description:
        "Complete Pokémon information, stats, moves, abilities, and evolution details.",
      alternates: {
        canonical: `https://www.pokemechanics.app/pokemon/${id}`,
      },
    };
  }
}

export default async function Pokemon({ params, searchParams }: PageProps) {
  const { id } = params;
  const dexId = searchParams?.dexId as string;
  const selectedGame = (searchParams?.game as string) ?? "red-blue";

  if (!selectedGame) {
    redirect("/");
  }

  if (!id || !dexId) {
    redirect("/pokedex");
  }

  try {
    // Fetch all data on the server
    const [pokemonData, speciesData, versionData, dexData] = await Promise.all([
      fetchPokemonById(Number(id)),
      fetchPokemonSpeciesById(Number(id)),
      getVersionGroup(selectedGame),
      fetchPokedexById(Number(dexId)),
    ]);

    // Check if we have the required data
    if (!pokemonData || !speciesData || !versionData || !dexData) {
      return (
        <main className="w-full">
          <h1>Data Not Found</h1>
          <p>The requested Pokémon data could not be found.</p>
        </main>
      );
    }

    return (
      <main className="w-full">
        <PokemonCard
          pokemonData={pokemonData}
          speciesData={speciesData}
          versionData={versionData}
          dexData={dexData}
          dexId={Number(dexId)}
          game={selectedGame}
        />
      </main>
    );
  } catch (error) {
    console.error("Error loading Pokémon data:", error);

    // Handle specific error types
    if (error instanceof Error) {
      if (error.message.includes("Failed to fetch")) {
        return (
          <main className="w-full">
            <h1>Network Error</h1>
            <p>
              Unable to connect to the Pokémon database. Please try again later.
            </p>
          </main>
        );
      }

      if (error.message.includes("greater than the maximum")) {
        return (
          <main className="w-full max-w-screen-sm mx-auto text-center">
            <h1>Invalid Pokémon</h1>
            <p>The requested Pokémon ID is not valid.</p>
          </main>
        );
      }
    }

    // Generic error fallback
    return (
      <main className="w-full">
        <h1>Something went wrong</h1>
        <p>
          We encountered an error while loading the Pokémon data. Please try
          again.
        </p>
      </main>
    );
  }
}
