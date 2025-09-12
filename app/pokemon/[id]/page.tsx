import { Metadata } from "next";
import { redirect } from "next/navigation";
import { getVersionGroup } from "@/app/queries/getVersionGroup";
// Components
import PokemonClientWrapper from "app/pokemon/[id]/PokemonClientWrapper";

// Server-side data fetching functions
async function fetchPokemonById(id: number) {
  const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`, {
    headers: {
      Accept: "application/json",
      "User-Agent": "Pokemechanics/1.0",
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch Pokemon data: ${response.status}`);
  }

  return response.json();
}

async function fetchPokemonSpeciesById(id: number) {
  const response = await fetch(
    `https://pokeapi.co/api/v2/pokemon-species/${id}`,
    {
      headers: {
        Accept: "application/json",
        "User-Agent": "Pokemechanics/1.0",
      },
    }
  );

  if (!response.ok) {
    throw new Error(`Failed to fetch Pokemon species data: ${response.status}`);
  }

  return response.json();
}

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
    const [pokemonData, speciesData, versionData] = await Promise.all([
      fetchPokemonById(Number(id)),
      fetchPokemonSpeciesById(Number(id)),
      getVersionGroup(selectedGame),
    ]);

    const pokemonName = speciesData.name;
    const types = pokemonData.types
      .map((type: any) => type.type.name)
      .join(" and ");
    const height = pokemonData.height / 10; // Convert from decimeters to meters
    const weight = pokemonData.weight / 10; // Convert from hectograms to kg

    const title = `${
      pokemonName.charAt(0).toUpperCase() + pokemonName.slice(1)
    } | Pokémechanics`;
    const description = `Learn about ${
      pokemonName.charAt(0).toUpperCase() + pokemonName.slice(1)
    }, a ${types} type Pokémon. Height: ${height}m, Weight: ${weight}kg. Complete stats, moves, abilities, and evolution information.`;
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
  const [pokemonData, speciesData, versionData] = await Promise.all([
    fetchPokemonById(Number(id)),
    fetchPokemonSpeciesById(Number(id)),
    getVersionGroup(selectedGame),
  ]);

  if (versionData.error || pokemonData.error || speciesData.error) {
    return (
      <main className="w-full">
        <h1>There was an error</h1>
        <p>
          {versionData.error.message ||
            pokemonData.error.message ||
            speciesData.error.message ||
            "Failed to load data"}
        </p>
      </main>
    );
  }

  // Check if we have the required data
  if (!pokemonData || !speciesData || !versionData || !dexId) {
    return (
      <main className="w-full">
        <h1>Loading...</h1>
        <p>Please wait while we load the Pokémon data.</p>
      </main>
    );
  }

  return (
    <main className="w-full">
      <PokemonClientWrapper
        pokemonData={pokemonData}
        speciesData={speciesData}
        versionData={versionData}
        dexId={Number(dexId)}
      />
    </main>
  );
}
