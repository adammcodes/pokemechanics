import { Metadata } from "next";
import { redirect } from "next/navigation";
import { getVersionGroup } from "@/app/helpers/graphql/getVersionGroup";
import { fetchPokemonSpeciesById } from "@/app/helpers/rest/fetchPokemonSpeciesById";
import { fetchPokemonById } from "@/app/helpers/rest/fetchPokemonById";
import { fetchPokedexById } from "@/app/helpers/rest/fetchPokedexById";
import PokemonCardServer from "./PokemonCardServer";
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
    // redirect to the home page
    redirect("/");
  }

  if (!id || !dexId) {
    // redirect to the pokedex page
    redirect("/pokedex");
  }

  // Fetch all data on the server
  const [pokemonData, speciesData, versionData, dexData] = await Promise.all([
    fetchPokemonById(Number(id)),
    fetchPokemonSpeciesById(Number(id)),
    getVersionGroup(selectedGame),
    fetchPokedexById(Number(dexId)),
  ]);

  if (versionData.error || pokemonData.error || speciesData.error || !dexData) {
    return (
      <main className="w-full">
        <h1>There was an error</h1>
        <p>
          {versionData.error?.message ||
            pokemonData.error?.message ||
            speciesData.error?.message ||
            "Failed to load data"}
        </p>
      </main>
    );
  }

  // Check if we have the required data
  if (!pokemonData || !speciesData || !versionData || !dexData || !dexId) {
    return (
      <main className="w-full">
        <h1>Loading...</h1>
        <p>Please wait while we load the Pokémon data.</p>
      </main>
    );
  }

  return (
    <main className="w-full">
      <PokemonCardServer
        pokemonData={pokemonData}
        speciesData={speciesData}
        versionData={versionData}
        dexData={dexData}
        dexId={Number(dexId)}
        game={selectedGame}
      />
    </main>
  );
}
