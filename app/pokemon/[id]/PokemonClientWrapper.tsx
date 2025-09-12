"use client";

import { PokemonContextProvider } from "@/context/PokemonContextProvider";
import { PokedexContextProvider } from "@/context/PokedexContextProvider";
import PokemonVariety from "app/pokemon/[id]/PokemonVariety";

type PokemonClientWrapperProps = {
  pokemonData: any;
  speciesData: any;
  versionData: any;
  dexId: number;
};

export default function PokemonClientWrapper({
  pokemonData,
  speciesData,
  versionData,
  dexId,
}: PokemonClientWrapperProps) {
  return (
    <PokedexContextProvider dexId={dexId}>
      <PokemonContextProvider
        pokemonData={pokemonData}
        speciesData={speciesData}
        versionData={versionData}
      >
        <PokemonVariety
          regions={versionData.regions}
          name={speciesData.name}
          varieties={speciesData.varieties}
        />
      </PokemonContextProvider>
    </PokedexContextProvider>
  );
}
