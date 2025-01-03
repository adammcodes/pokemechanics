import useGameClient from "@/hooks/useGameClient";
import { NamedAPIResource } from "pokenode-ts";
import styles from "../Pokedexes.module.css";
// components
import PokedexById from "../PokedexById";
import NationalDex from "../NationalDex";

interface VersionGroup {
  generation: NamedAPIResource;
  id: number;
  move_learn_methods: NamedAPIResource[];
  name: string;
  order: number;
  pokedexes: NamedAPIResource[];
  regions: NamedAPIResource[];
  versions: NamedAPIResource[];
  error?: any;
}

// fetch the game version for the selected generation
async function getVersionGroup(gen: string): Promise<VersionGroup> {
  // fetch the version group for the selected generation
  const api = useGameClient();
  try {
    return await api
      .getVersionGroupByName(gen)
      .then((data: VersionGroup) => data)
      .catch((error: any) => {
        throw new Error(error.message);
      });
  } catch (error: any) {
    console.error(error.message);
    return error;
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
  // pokedexes is an array of pokedexes for the selected generation [{ name, url }]
  const pokedexes: NamedAPIResource[] = versionGroup.pokedexes;

  return (
    <section className="flex flex-col w-full h-full px-2 lg:px-5">
      <div className="flex flex-wrap gap-y-2 w-full justify-around items-start px-2 lg:px-5">
        <div
          className={`${styles.pokedexes} flex flex-wrap gap-4 w-full justify-around items-start px-5`}
        >
          {/* render each pokedex in the generation */}
          {pokedexes.length > 0 &&
            pokedexes.map((dex: NamedAPIResource) => {
              const dexId: number = Number(dex.url.split("/").at(-2));
              return (
                <PokedexById
                  key={dex.url}
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
