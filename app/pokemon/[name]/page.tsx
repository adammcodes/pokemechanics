import { Metadata } from "next";
import { redirect } from "next/navigation";
import { fetchPokemonSpeciesByName } from "@/app/helpers/rest/fetchPokemonSpeciesByName";
import { fetchFromGraphQL } from "@/utils/api";
import convertKebabCaseToTitleCase from "@/utils/convertKebabCaseToTitleCase";
import Link from "next/link";

type PageProps = {
  params: {
    name: string;
  };
};

type VersionGroup = {
  id: number;
  name: string;
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
  const { name } = params;

  try {
    const speciesData = await fetchPokemonSpeciesByName(name);
    const pokemonName = speciesData.name;
    const displayName = pokemonName.charAt(0).toUpperCase() + pokemonName.slice(1);

    return {
      title: `Select Game Version for ${displayName} | Pokémechanics`,
      description: `Choose which game version to view ${displayName} information for.`,
      alternates: {
        canonical: `https://www.pokemechanics.app/pokemon/${name}`,
      },
    };
  } catch (error) {
    return {
      title: "Select Game Version | Pokémechanics",
      description: "Choose which game version to view.",
    };
  }
}

export default async function PokemonGameSelector({ params }: PageProps) {
  const { name } = params;

  try {
    // Verify Pokemon exists
    const speciesData = await fetchPokemonSpeciesByName(name);
    const versionGroups = await getAllVersionGroups();

    const pokemonName = speciesData.name;
    const displayName = pokemonName.charAt(0).toUpperCase() + pokemonName.slice(1);

    return (
      <main className="w-full h-full flex flex-col justify-start items-center p-8">
        <h1 className="text-3xl font-bold mb-4">{displayName}</h1>
        <h2 className="text-xl mb-8">Select a game version to view details</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-4xl">
          {versionGroups.map((vg) => {
            // Use the first pokedex for this version group, or fallback to "national" if available
            const pokedex = vg.pokedexes.find((p) => p.name === "national") || vg.pokedexes[0];

            if (!pokedex) {
              return null; // Skip if no pokedex available
            }

            const gameDisplayName = convertKebabCaseToTitleCase(vg.name);

            return (
              <Link
                key={vg.id}
                href={`/pokemon/${name}/${vg.name}/${pokedex.name}`}
                className="border border-gray-300 rounded-lg p-4 hover:bg-gray-100 hover:border-gray-400 transition-colors"
              >
                <div className="text-center font-medium">{gameDisplayName}</div>
              </Link>
            );
          })}
        </div>
      </main>
    );
  } catch (error) {
    console.error("Error loading Pokemon:", error);

    if (error instanceof Error && (error.message.includes("404") || error.message.includes("not found"))) {
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
