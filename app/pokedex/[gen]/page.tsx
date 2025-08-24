import { NamedAPIResource } from "pokenode-ts";
import styles from "../Pokedexes.module.css";
// utils
import { fetchFromGraphQL } from "@/utils/api";
// components
import PokedexById from "../PokedexById";
import NationalDex from "../NationalDex";

interface VersionGroup {
  generation: NamedAPIResource;
  pokedexes: { name: string; id: number }[];
  error?: any;
}

const query = `
query GetVersionGroup($name: String!) {
  pokemon_v2_versiongroup(where: {name: {_eq: $name}}) {
    id
    name
    order
    pokemon_v2_generation {
      name
    }
    pokemon_v2_pokedexversiongroups {
      pokemon_v2_pokedex {
        id
        name
      }
    }
  }
}
`;

// fetch the game version for the selected generation
async function getVersionGroup(gen: string): Promise<VersionGroup> {
  try {
    const data = await fetchFromGraphQL(query, { name: gen });

    if (!data.data?.pokemon_v2_versiongroup?.[0]) {
      throw new Error(`Version group '${gen}' not found`);
    }

    const versionGroup = data.data.pokemon_v2_versiongroup[0];

    // Transform the GraphQL response to match the expected VersionGroup interface
    return {
      generation: {
        name: versionGroup.pokemon_v2_generation.name,
        url: `/generation/${versionGroup.pokemon_v2_generation.name}`,
      },
      pokedexes: versionGroup.pokemon_v2_pokedexversiongroups.map(
        (pokedexVersionGroup: any) => ({
          name: pokedexVersionGroup.pokemon_v2_pokedex.name,
          id: pokedexVersionGroup.pokemon_v2_pokedex.id,
        })
      ),
    };
  } catch (error: any) {
    console.error("Error fetching version group:", error);
    return { error } as VersionGroup;
  }
}

type PageProps = {
  params: {
    gen: string;
  };
  searchParams?: {
    [key: string]: string | string[] | undefined;
  };
};

// create a Pokedex page for each generation
export default async function Page({ params }: PageProps) {
  // get the version group and pokedexes for the selected generation
  // Get the selected generation from the dynamic route params of the URL
  // e.g. /pokedex/red-blue
  // gen = red-blue
  const { gen } = params;

  const versionGroup = await getVersionGroup(gen);

  if (versionGroup.error) {
    return (
      <main>
        <h1>There was an error</h1>
        <p>{versionGroup.error.message || ""}</p>
      </main>
    );
  }

  // generationString is a string "generation" and the number roman numeral as a string e.g. "generation-i"
  const generationString: string = versionGroup.generation.name;
  // pokedexes is an array of pokedexes for the selected generation [{ name, id }]
  const pokedexes = versionGroup.pokedexes;

  return (
    <section className="flex flex-col w-full h-full px-2 lg:px-5">
      <div className="flex flex-wrap gap-y-2 w-full justify-around items-start px-2 lg:px-5">
        <div
          className={`${styles.pokedexes} flex flex-wrap gap-4 w-full justify-around items-start px-5`}
        >
          {/* render each pokedex in the generation */}
          {pokedexes.length > 0 &&
            pokedexes.map((dex) => {
              const dexId: number = dex.id;
              return (
                <PokedexById
                  key={dex.id.toString()}
                  dexId={dexId}
                  game={gen}
                  generationString={generationString}
                />
              );
            })}
        </div>
        {/* render the national dex for the game/generation */}
        <NationalDex game={gen} generationString={generationString} />
      </div>
    </section>
  );
}
