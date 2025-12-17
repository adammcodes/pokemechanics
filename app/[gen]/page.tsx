import { Metadata } from "next";
import { redirect } from "next/navigation";
import { fetchPokemonSpeciesByName } from "@/app/helpers/rest/fetchPokemonSpeciesByName";
import { fetchPokemonByName } from "@/app/helpers/rest/fetchPokemonByName";
import { fetchFromGraphQL } from "@/utils/api";
import convertKebabCaseToTitleCase from "@/utils/convertKebabCaseToTitleCase";
import Link from "next/link";
import { romanToNumber } from "@/utils/romanToNumber";
import { fetchGenerationById } from "@/app/helpers/rest/fetchGenerationById";
import { getAllPokemonRoutes } from "@/app/helpers/getPokemonRoutes";
import { RestPokemon } from "@/types/index";
import { getBaseSpeciesName } from "@/constants/unsupportedVariants";
import { BASE_URL } from "@/constants/apiConfig";

// Force static generation
export const dynamic = "force-static";

type PageProps = {
  params: Promise<{
    name: string;
  }>;
};

// Generate static params for all unique generation names
export async function generateStaticParams() {
  const routes = await getAllPokemonRoutes();
  // Get unique generation names (remove duplicates)
  const uniqueGens = [...new Set(routes.map((route) => route.gen))];
  return uniqueGens.map((gen) => ({ gen }));
}

type VersionGroup = {
  id: number;
  name: string;
  versions: Array<{
    id: number;
    name: string;
  }>;
  pokedexes: Array<{
    id: number;
    name: string;
  }>;
};

async function getAllVersionGroups(): Promise<VersionGroup[]> {
  const query = `
    query GetAllVersionGroups {
      versiongroup(order_by: {generation_id: asc}) {
        id
        name
        versions {
          id
          name
        }
        pokedexversiongroups {
          pokedex {
            id
            name
          }
        }
      }
    }
  `;

  try {
    const data = await fetchFromGraphQL({ query });

    return data.data.versiongroup.map((vg: any) => ({
      id: vg.id,
      name: vg.name,
      versions: vg.versions.map((v: any) => ({
        id: v.id,
        name: v.name,
      })),
      pokedexes: vg.pokedexversiongroups.map((pvg: any) => ({
        id: pvg.pokedex.id,
        name: pvg.pokedex.name,
      })),
    }));
  } catch (error) {
    console.error("Error fetching version groups:", error);
    throw error;
  }
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { name } = await params;

  // Handle unsupported variants - use base species name instead
  const effectiveName = getBaseSpeciesName(name);

  let pokemonData: RestPokemon | null = null;
  let speciesName = effectiveName;
  try {
    // Fetch Pokemon data from REST API using the name from the URL
    // For unsupported variants, this will use the base species name
    pokemonData = await fetchPokemonByName(effectiveName);
    speciesName = pokemonData ? pokemonData.species.name : effectiveName;
  } catch (error) {
    console.error(
      "Error fetching Pokemon data for name:",
      effectiveName,
      error
    );
  }

  try {
    const speciesData = await fetchPokemonSpeciesByName(speciesName); // ✅ Use species name (no variant names)
    const pokemonName = speciesData.name;
    const displayName =
      speciesName.charAt(0).toUpperCase() + pokemonName.slice(1);

    return {
      title: `Select Game Version for ${displayName} | New Bark Town`,
      description: `Choose which game version to view ${displayName} information for.`,
      alternates: {
        canonical: `${BASE_URL}/pokemon/${name}`,
      },
    };
  } catch (error) {
    return {
      title: "Select Game Version | New Bark Town",
      description: "Choose which game version to view.",
    };
  }
}

export default async function PokemonGameSelector({ params }: PageProps) {
  const { name } = await params;

  // Handle unsupported variants - use base species name instead
  const effectiveName = getBaseSpeciesName(name);

  let pokemonData: RestPokemon | null = null;
  let speciesName = effectiveName;
  try {
    // Fetch Pokemon data from REST API using the name from the URL
    // For unsupported variants, this will use the base species name
    pokemonData = await fetchPokemonByName(effectiveName);
    speciesName = pokemonData ? pokemonData.species.name : effectiveName;
  } catch (error) {
    console.error(
      "Error fetching Pokemon data for name:",
      effectiveName,
      error
    );
  }

  try {
    // Fetch Pokemon data to get available versions
    const [speciesData, allVersionGroups] = await Promise.all([
      fetchPokemonSpeciesByName(speciesName), // ✅ Use species name (no variant names)
      getAllVersionGroups(),
    ]);

    // Check if we have the required data
    if (!pokemonData || !speciesData) {
      return (
        <main className="w-full">
          <h1>Data Not Found</h1>
          <p>The requested Pokémon data could not be found.</p>
        </main>
      );
    }

    const pokemonName = speciesData.name;
    const displayName =
      pokemonName.charAt(0).toUpperCase() + pokemonName.slice(1);
    const formattedDisplayName = convertKebabCaseToTitleCase(displayName);

    // Get list of versions where this Pokemon exists
    const availableVersions = new Set(
      pokemonData.game_indices.map((gi: any) => gi.version.name) || []
    );

    // Filter version groups to only show those where Pokemon exists
    const filteredVersionGroups = allVersionGroups.filter((vg) => {
      // Check if any of the version group's versions are in the Pokemon's game_indices
      return vg.versions.some((v) => availableVersions.has(v.name));
    });

    const pokemonSprite = pokemonData.sprites.front_default;

    const generation = speciesData.generation.name;
    const genNumber = romanToNumber(generation.split("-")[1]);

    const generationData = await fetchGenerationById(genNumber);
    const genVersionGroups = generationData.version_groups;

    return (
      <main className="w-full h-full flex flex-col justify-start items-center p-8">
        <h1 className="text-3xl font-bold mb-4">{formattedDisplayName}</h1>
        <img
          src={pokemonSprite || ""}
          alt={formattedDisplayName}
          className="w-32 h-32"
        />
        <p className="text-lg mb-4">Generation {genNumber}</p>

        {filteredVersionGroups.length > 0 && (
          <>
            <h2 className="text-xl mb-8">
              Select a game version to view details
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-4xl">
              {filteredVersionGroups.map((vg) => {
                // Use the first pokedex for this version group, or fallback to "national" if available
                const pokedex =
                  vg.pokedexes.find((p) => p.name === "national") ||
                  vg.pokedexes[0];

                if (!pokedex) {
                  return null; // Skip if no pokedex available
                }

                const gameDisplayName = convertKebabCaseToTitleCase(vg.name);

                return (
                  <Link
                    key={vg.id}
                    prefetch={false}
                    href={`/pokemon/${name}/${vg.name}/${pokedex.name}`}
                    className="pokeball-box game-selector-link border rounded-lg p-4 transition-colors"
                  >
                    <PokeballBox />
                    <div className="text-center font-medium">
                      {gameDisplayName}
                    </div>
                  </Link>
                );
              })}
            </div>
          </>
        )}
        {filteredVersionGroups.length === 0 && (
          <section className="flex flex-col items-center justify-center">
            <h2 className="text-xl mb-8">
              Search {formattedDisplayName} in the {generation} version groups
              Pokédex:
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-4xl">
              {genVersionGroups.map((vg: { name: string; url: string }) => {
                const versionGroupDisplayName = convertKebabCaseToTitleCase(
                  vg.name
                );
                return (
                  <Link
                    key={vg.url}
                    href={`/pokedex/${vg.name}`}
                    prefetch={false}
                    className="pokeball-box game-selector-link border text-center rounded-lg p-4 transition-colors"
                  >
                    <PokeballBox />
                    {versionGroupDisplayName}
                  </Link>
                );
              })}
            </div>
          </section>
        )}
      </main>
    );
  } catch (error) {
    console.error("Error loading Pokemon:", error);

    if (
      error instanceof Error &&
      (error.message.includes("404") || error.message.includes("not found"))
    ) {
      redirect("/pokedex");
    }

    return (
      <main className="w-full">
        <h1>Error Loading Pokémon</h1>
        <p>Unable to load Pokémon data. Please try again later.</p>
      </main>
    );
  }
}

const PokeballBox = () => {
  return (
    <>
      <span className="pokeball top-left">
        <span className="pokeball-upper"></span>
      </span>
      <span className="pokeball top-right">
        <span className="pokeball-upper"></span>
      </span>
      <span className="pokeball bottom-left">
        <span className="pokeball-upper"></span>
      </span>
      <span className="pokeball bottom-right">
        <span className="pokeball-upper"></span>
      </span>
    </>
  );
};
