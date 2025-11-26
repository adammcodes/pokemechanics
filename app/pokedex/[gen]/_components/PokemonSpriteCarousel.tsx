import getSpriteUrl from "@/constants/spriteUrlTemplates";
import type { PokemonDexNumber } from "@/app/helpers/graphql/getGenerationVersions";
import Link from "next/link";

type PokemonSpriteCarouselProps = {
  pokemonList: PokemonDexNumber[];
  versionGroups: string[];
  generation: string;
  genNumber: number;
  dexId: number;
  regionName: string;
};

export default function PokemonSpriteCarousel({
  pokemonList,
  versionGroups,
  generation,
  genNumber,
  dexId,
  regionName,
}: PokemonSpriteCarouselProps) {
  return (
    <div className="overflow-x-auto">
      <div className="flex gap-3 pb-2">
        {pokemonList.map((entry: PokemonDexNumber) => {
          const regionalVariant = entry.pokemonspecy.pokemons.find((variant) =>
            variant.name.includes(regionName.toLowerCase())
          );
          const regionalVariantId = regionalVariant?.id || undefined;

          // Gen 6 uses 3D-rendered sprites that should be smooth
          const isPixelArt = genNumber !== 6;

          const spriteUrl = getSpriteUrl({
            versionGroup: versionGroups[0],
            generation: generation.split("-")[1],
            pokemonId: regionalVariantId || entry.pokemon_species_id,
          });

          return (
            <Link
              href={`/${generation}/${entry.pokemonspecy.name}`}
              key={`${dexId}-${entry.pokemon_species_id}`}
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
            </Link>
          );
        })}
      </div>
    </div>
  );
}
