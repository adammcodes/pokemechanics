import styles from "../Pokedexes.module.css";
// components
import PokedexById from "../PokedexById";
import NationalDex from "../NationalDex";
import { getVersionGroup } from "@/app/queries/getVersionGroup";

// fetch the game version for the selected generation
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
