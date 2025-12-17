"use client";

import { useState } from "react";
import convertKebabCaseToTitleCase from "@/utils/convertKebabCaseToTitleCase";
import { EXCLUDED_VERSION_GROUPS } from "@/constants/excludedVersionGroups";
import PokemonSpriteCarousel from "./PokemonSpriteCarousel";
import type { Pokedex } from "@/app/helpers/graphql/getGenerationVersions";

type PokedexCardProps = {
  pokedex: Pokedex;
  versionGroups: string[];
  generation: string;
  genNumber: number;
};

export default function PokedexCard({
  pokedex: dex,
  versionGroups,
  generation,
  genNumber,
}: PokedexCardProps) {
  const [searchTerm, setSearchTerm] = useState("");

  // Filter Pokemon by species name
  const filteredPokemon = dex.pokemondexnumbers.filter((entry) =>
    entry.pokemonspecy.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div
      key={dex.id}
      className="w-full flex flex-col bg-white dark:bg-gray-800/50 relative rounded-lg shadow-lg border border-gray-300 dark:border-gray-700 p-6 h-full min-h-[280px] hover:shadow-xl hover:border-gray-400 dark:hover:border-gray-600 transition-all duration-200"
    >
      {/* Version group badges */}
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

      {/* Search bar */}
      <div className="mb-4 relative">
        <input
          type="text"
          placeholder="Search Pokémon..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-3 py-2 text-sm rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
        />
        {searchTerm && (
          <p className="text-xs text-gray-600 dark:text-gray-400 absolute bottom-0 right-2">
            Showing {filteredPokemon.length} of {dex.pokemondexnumbers.length}{" "}
            Pokémon
          </p>
        )}
      </div>

      {/* Pokemon sprites carousel */}
      <PokemonSpriteCarousel
        pokemonList={filteredPokemon}
        versionGroups={versionGroups}
        generation={generation}
        genNumber={genNumber}
        dexId={dex.id}
        regionName={dex.region.name}
      />
    </div>
  );
}
