"use client";
import { useContext } from "react";
import { GenerationContext } from "@/context/_context";
import Image from "next/image";
import type {
  PokemonDexNumber,
  GenerationVersions,
} from "@/app/helpers/graphql/getGenerationVersions";

const STARTER_DEX_NUMBERS = [1, 4, 7];
const SPRITE_SIZE = 60;

export default function HeaderStarters() {
  const { generationData } = useContext(GenerationContext);

  if (!generationData) return null;

  const generation: GenerationVersions = generationData;

  const pokedexVersionGroups = generation.versiongroups[0].pokedexversiongroups;
  const pokedex = pokedexVersionGroups[0].pokedex;
  const starterSpeciesIds = STARTER_DEX_NUMBERS.map(
    (dexNumber) =>
      pokedex?.pokemondexnumbers.find(
        (pokemon: PokemonDexNumber) => pokemon.pokedex_number === dexNumber
      )?.pokemon_species_id
  );

  const officialArtworkStarter1 = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${starterSpeciesIds[0]}.png`;
  const officialArtworkStarter2 = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${starterSpeciesIds[1]}.png`;
  const officialArtworkStarter3 = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${starterSpeciesIds[2]}.png`;
  return (
    <section>
      <div className="flex flex-row justify-center items-center">
        {starterSpeciesIds[0] && (
          <Image
            src={officialArtworkStarter1}
            alt="Starter 1"
            width={SPRITE_SIZE}
            height={SPRITE_SIZE}
          />
        )}
        {starterSpeciesIds[1] && (
          <Image
            src={officialArtworkStarter2}
            alt="Starter 2"
            width={SPRITE_SIZE + 5}
            height={SPRITE_SIZE + 5}
          />
        )}
        {starterSpeciesIds[2] && (
          <Image
            src={officialArtworkStarter3}
            alt="Starter 3"
            width={SPRITE_SIZE}
            height={SPRITE_SIZE}
          />
        )}
      </div>
    </section>
  );
}
