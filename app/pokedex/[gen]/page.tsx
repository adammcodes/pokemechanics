import styles from "./_components/Pokedexes.module.css";
// components
import PokedexById from "./_components/PokedexById";
import NationalDex from "./_components/NationalDex";
import { getVersionGroup } from "@/app/helpers/graphql/getVersionGroup";
import { Metadata } from "next";
import { headers } from "next/headers";
import convertKebabCaseToTitleCase from "@/utils/convertKebabCaseToTitleCase";
import { redirect } from "next/navigation";
import { getAllVersionGroups } from "@/app/helpers/getPokemonRoutes";
import { getGenerationVersions } from "@/app/helpers/graphql/getGenerationVersions";
import type { GenerationVersions } from "@/app/helpers/graphql/getGenerationVersions";
import { getGenVersionsString } from "@/utils/getGenVersionsString";
import { romanToNumber } from "@/utils/romanToNumber";
import { EXCLUDED_VERSION_GROUPS } from "@/constants/excludedVersionGroups";
import HeaderStarters from "@/components/header/HeaderStarters";
import getSpriteUrl from "@/constants/spriteUrlTemplates";
import { PokedexPokemon } from "./_components/PokedexById";
// Force static generation
export const dynamic = "force-static";

// fetch the game version for the selected generation
type PageProps = {
  params: Promise<{
    gen: string;
  }>;
  searchParams?: Promise<{
    [key: string]: string | string[] | undefined;
  }>;
};

// Generate static params for all version groups
export async function generateStaticParams() {
  // return [{ gen: "red-blue" }, { gen: "gold-silver" }];
  const versionGroups = getAllVersionGroups();
  return versionGroups.map((gen) => ({ gen }));
}

// Generate metadata for SEO
export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { gen } = await params;
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
  // e.g. /pokedex/generation-i
  // gen e.g. "generation-i"
  const { gen } = await params;

  // Log User-Agent for monitoring bot traffic and API usage patterns
  //const headersList = await headers();
  //const userAgent = headersList.get("user-agent") || "Unknown";
  //console.log(`[Request] /pokedex/${gen} | User-Agent: ${userAgent}`);

  // const versionGroup = await getVersionGroup(gen);
  const genVersions = await getGenerationVersions(gen);

  // If version group not found (e.g., /pokedex/971), redirect to main pokedex page
  if (genVersions.error) {
    redirect("/pokedex");
  }

  const generation = genVersions as GenerationVersions;

  const genVersionsString = getGenVersionsString(generation.versiongroups);

  // Build a map of pokedexes with their associated version groups
  const pokedexMap = new Map<
    number,
    { pokedex: any; versionGroups: string[] }
  >();

  generation.versiongroups.forEach((vg) => {
    vg.pokedexversiongroups.forEach((pvg) => {
      const dex = pvg.pokedex;
      if (pokedexMap.has(dex.id)) {
        // Add this version group to existing pokedex entry
        pokedexMap.get(dex.id)!.versionGroups.push(vg.name);
      } else {
        // Create new entry
        pokedexMap.set(dex.id, {
          pokedex: dex,
          versionGroups: [vg.name],
        });
      }
    });
  });

  const pokedexData = Array.from(pokedexMap.values());

  const genNumber = romanToNumber(gen.split("-")[1]);

  return (
    <section className="flex flex-col w-full h-full px-4 lg:px-8 py-6">
      {/* SEO-friendly header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-center">
          Pokédexes - Gen {genNumber}
        </h1>
        <h2 className="text-2xl text-center">{genVersionsString}</h2>
      </div>

      {/* 2-column grid of pokedex cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-6xl mx-auto [&>*:only-child]:md:col-span-full [&>*:only-child]:md:max-w-2xl [&>*:only-child]:md:mx-auto [&>*:last-child:nth-child(odd)]:md:col-span-full [&>*:last-child:nth-child(odd)]:md:max-w-2xl [&>*:last-child:nth-child(odd)]:md:mx-auto">
        {pokedexData.map(({ pokedex: dex, versionGroups }) => (
          <div
            key={dex.id}
            className="flex flex-col bg-white dark:bg-gray-800/50 relative rounded-lg shadow-lg border border-gray-300 dark:border-gray-700 p-6 h-full min-h-[280px] hover:shadow-xl hover:border-gray-400 dark:hover:border-gray-600 transition-all duration-200"
          >
            <div className="flex flex-wrap gap-2 absolute top-0 left-0">
              {versionGroups
                .filter((vg) => !EXCLUDED_VERSION_GROUPS.includes(vg))
                .map((vg: string) => (
                  <span
                    key={`${dex.id}-${vg}`}
                    className="text-sm px-2 py-1 bg-gray-200 dark:bg-gray-700/50 rounded capitalize text-gray-700 dark:text-gray-300"
                  >
                    {convertKebabCaseToTitleCase(vg)}
                  </span>
                ))}
            </div>
            {/* Card header */}
            <div className="flex flex-wrap justify-between gap-2 items-center mt-2">
              <h3 className="font-semibold capitalize text-gray-900 dark:text-gray-100">
                {convertKebabCaseToTitleCase(dex.name)}
              </h3>
              <div className="flex flex-col gap-2 text-sm">
                <div className="flex items-center gap-4 text-gray-600 dark:text-gray-400">
                  <span className="font-medium text-gray-800 dark:text-gray-300">
                    {dex.pokemondexnumbers_aggregate.aggregate.count} Pokémon
                  </span>
                </div>
              </div>
            </div>

            <hr className="my-4 border-gray-300 dark:border-gray-700" />

            {/* Card content - description */}
            <div className="flex flex-wrap gap-2 justify-between items-center overflow-auto">
              <span className="text-gray-800 dark:text-gray-300 text-sm">
                Region: {convertKebabCaseToTitleCase(dex.region.name)}
              </span>
              {dex.pokedexdescriptions.length > 0 && (
                <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
                  {dex.pokedexdescriptions[0].description}
                </p>
              )}
            </div>

            <hr className="my-4 border-gray-300 dark:border-gray-700" />

            {/* Pokemon sprites carousel */}
            <div className="overflow-x-auto">
              <div className="flex gap-3 pb-2">
                {dex.pokemondexnumbers.map((entry: PokedexPokemon) => {
                  const regionalVariant = entry.pokemonspecy.pokemons.find(
                    (variant) =>
                      variant.name.includes(dex.region.name.toLowerCase())
                  );
                  const regionalVariantSprites =
                    regionalVariant?.pokemonsprites;
                  const regionalVariantId = regionalVariantSprites?.[0]?.id;

                  // Gen 6 uses 3D-rendered sprites that should be smooth
                  const isPixelArt = genNumber !== 6;

                  const spriteUrl = getSpriteUrl({
                    versionGroup: versionGroups[0],
                    generation: gen.split("-")[1],
                    pokemonId: regionalVariantId || entry.pokemon_species_id,
                  });

                  return (
                    <div
                      key={`${dex.id}-${entry.pokemon_species_id}`}
                      className="flex flex-col items-center flex-shrink-0 group"
                    >
                      <div
                        className={`${
                          isPixelArt ? "w-16 h-16" : "w-24 h-24"
                        } flex items-center justify-center bg-gray-100 dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-600 group-hover:border-gray-400 dark:group-hover:border-gray-500 transition-colors`}
                      >
                        <img
                          src={spriteUrl}
                          alt={entry.pokemonspecy.name}
                          className={`object-contain ${
                            isPixelArt ? "pixelated w-full h-full" : ""
                          }`}
                          loading="lazy"
                        />
                      </div>
                      <div className="flex flex-col items-center mt-1">
                        <span className="text-xs text-gray-600 dark:text-gray-400 capitalize">
                          {entry.pokemonspecy.name}
                        </span>
                        <span className="text-xs text-gray-500 dark:text-gray-500 font-mono">
                          #{entry.pokedex_number}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
