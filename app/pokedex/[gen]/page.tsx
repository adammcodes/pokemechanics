import styles from "./_components/Pokedexes.module.css";
// components
import PokedexById from "./_components/PokedexById";
import NationalDex from "./_components/NationalDex";
import { getVersionGroup } from "@/app/helpers/graphql/getVersionGroup";
import { Metadata } from "next";
import convertKebabCaseToTitleCase from "@/utils/convertKebabCaseToTitleCase";

// fetch the game version for the selected generation
type PageProps = {
  params: {
    gen: string;
  };
  searchParams?: {
    [key: string]: string | string[] | undefined;
  };
};

// Generate metadata for SEO
export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { gen } = params;
  const canonicalUrl = `https://www.pokemechanics.app/pokedex/${gen}`;
  const formattedGen = convertKebabCaseToTitleCase(gen);

  return {
    title: `Pokédex - ${formattedGen} | Pokémechanics`,
    description: `Browse the complete Pokédex for ${formattedGen} with detailed stats, types, abilities, evolution chains, and move lists for all Pokémon in this generation.`,
    alternates: {
      canonical: canonicalUrl,
    },
  };
}

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

  const formattedGen = gen
    .replace("-", " ")
    .replace(/\b\w/g, (l) => l.toUpperCase());

  return (
    <section className="flex flex-col w-full h-full px-2 lg:px-5">
      {/* SEO-friendly header */}
      <div className="px-2 lg:px-5 py-4">
        <h1 className="text-2xl font-bold mb-2 text-center">
          Pokédex - {formattedGen}
        </h1>
      </div>

      <div className="flex flex-wrap gap-y-2 w-full justify-around items-start px-2 py-2 lg:px-5">
        <div
          className={`${styles.pokedexes} flex flex-wrap gap-4 w-full justify-around items-start px-5`}
        >
          {/* render each pokedex in the generation */}
          {pokedexes.length > 0 &&
            pokedexes.map((dex) => (
              <PokedexById
                key={dex.id.toString()}
                dexId={dex.id}
                dexName={dex.name}
                game={gen}
                generationString={generationString}
              />
            ))}
        </div>
        {/* render the national dex for the game/generation */}
        <NationalDex game={gen} generationString={generationString} />
      </div>
    </section>
  );
}
