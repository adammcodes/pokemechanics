import { Metadata } from "next";
import { redirect } from "next/navigation";
import { getVersionGroup } from "@/app/helpers/graphql/getVersionGroup";
import { fetchPokemonSpeciesByName } from "@/app/helpers/rest/fetchPokemonSpeciesByName";
import { fetchPokemonByName } from "@/app/helpers/rest/fetchPokemonByName";
import { fetchPokedexByName } from "@/app/helpers/rest/fetchPokedexByName";
import PokemonCard from "./_components/card/PokemonCard";
import convertKebabCaseToTitleCase from "@/utils/convertKebabCaseToTitleCase";
import { romanToNumber } from "@/utils/romanToNumber";
import { fetchGenerationById } from "@/app/helpers/rest/fetchGenerationById";
import { numOfPokemonByGen } from "@/constants/numOfPokemonByGen";

// Enable ISR - revalidate every 1 hour (3600 seconds)
// This caches the page and reduces API calls to PokeAPI
export const revalidate = 3600;

type PageProps = {
  params: {
    name: string;
    game: string;
    dex: string;
  };
};

// Generate metadata for SEO
export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { name, game, dex } = params;

  try {
    const [speciesData, versionData] = await Promise.all([
      fetchPokemonSpeciesByName(name),
      getVersionGroup(game),
    ]);

    const pokemonName = speciesData.name;
    const versionName = convertKebabCaseToTitleCase(versionData.name);

    const title = `${
      pokemonName.charAt(0).toUpperCase() + pokemonName.slice(1)
    } | ${versionName}`;
    const description = `Learn about ${
      pokemonName.charAt(0).toUpperCase() + pokemonName.slice(1)
    } | Pokémechanics - Complete stats, moves, abilities, and evolution information.`;
    const canonicalUrl = `https://www.pokemechanics.app/pokemon/${name}/${game}/${dex}`;

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
        canonical: `https://www.pokemechanics.app/pokemon/${name}/${game}/${dex}`,
      },
    };
  }
}

export default async function Pokemon({ params }: PageProps) {
  const { name, game, dex } = params;

  if (!name || !game || !dex) {
    redirect("/pokedex");
  }

  try {
    // Fetch all data on the server
    const [pokemonData, speciesData, versionData, dexData] = await Promise.all([
      fetchPokemonByName(name),
      fetchPokemonSpeciesByName(name),
      getVersionGroup(game),
      fetchPokedexByName(dex),
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

    const generation = versionData.generation.name;
    const pokemonNationalDexNumber = speciesData.id;
    const maxDexNumberForGen = numOfPokemonByGen[generation];

    if (pokemonNationalDexNumber > maxDexNumberForGen) {
      const displayName =
        speciesData.name.charAt(0).toUpperCase() + speciesData.name.slice(1);
      return (
        <main className="w-full max-w-screen-sm mx-auto text-center p-8">
          <h1 className="text-2xl font-bold mb-4">Pokémon Not Available</h1>
          <p className="mb-4">
            {displayName} does not exist in{" "}
            {versionData.name
              .split("-")
              .map((w: string) => w.charAt(0).toUpperCase() + w.slice(1))
              .join(" ")}
            .
          </p>
          <a
            href={`/pokemon/${name}`}
            className="inline-block bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded"
          >
            Choose a valid game version
          </a>
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
          dexName={dex}
          game={game}
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

      if (
        error.message.includes("not found") ||
        error.message.includes("404")
      ) {
        return (
          <main className="w-full max-w-screen-sm mx-auto text-center">
            <h1>Invalid Pokémon</h1>
            <p>The requested Pokémon could not be found.</p>
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
