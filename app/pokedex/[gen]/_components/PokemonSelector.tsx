"use client";
// Types
import { PokedexPokemon } from "./PokedexById";
// Components
import AutocompleteBase from "@/components/common/AutocompleteBase";
// Utils
import toTitleCase from "@/utils/toTitleCase";

export type PokemonOption = {
  label: string;
  name: string;
  value: number | string; // national dex id number
  pokemonId?: number; // regional dex id number
  variantId?: number; // variant form id number
  number?: number;
};

type PokemonSelectorProps = {
  pokemon: PokedexPokemon[];
  regionName: string;
  dexId: number;
  dexName: string;
  game: string;
  generationString: string;
  defaultPokemonName?: string;
  defaultPokemonId?: number;
};

// Component for selecting a Version Group: e.g. "Red/Blue", "Yellow", "Silver/Gold", etc
const PokemonSelector: React.FC<PokemonSelectorProps> =
  function PokemonSelector({
    pokemon,
    defaultPokemonId, // national dex id number
    defaultPokemonName,
    regionName,
    dexId,
    dexName,
    game,
    generationString,
  }) {
    const pokemonOptions: PokemonOption[] = pokemon.map((p) => {
      // If the regionName is not "National" then we need to check if there is a variant id of the pokemon for the region
      let variantId: number | undefined;
      if (regionName !== "National") {
        const variantForRegion = p.pokemonspecy.pokemons.find((variant) =>
          variant.name.includes(regionName)
        );
        variantId = variantForRegion?.pokemonsprites[0].id;
      }
      const dexNumber: number = p.pokemon_species_id; // this is the national dex number
      const pokemonId: number = p.pokedex_number; // this is the regional dex number
      const pokemonName: string = p.pokemonspecy.name; // make sure we use the variant pokemon name if it exists for the current region
      const variantForRegion =
        p.pokemonspecy?.pokemons?.find(
          (variant) =>
            variant.is_default === false && variant.name.includes(regionName)
        ) || undefined;
      return {
        label: toTitleCase(pokemonName),
        name: variantForRegion ? variantForRegion.name : pokemonName,
        value: dexNumber, // the value property we use as [id] in pokemon page dynamic routes
        pokemonId: pokemonId, // this is the regional dex number
        variantId: variantId, // for variant forms of pokemon we use this as the [id] in pokemon page dynamic routes
        versionGroup: game,
        generationString: generationString,
        dexId: dexId, // for link template
        dexName: dexName, // for link template
        game, // for link template
      };
    });

    return (
      <>
        <AutocompleteBase
          options={pokemonOptions}
          hasImageOptions={true}
          defaultValue={
            defaultPokemonName
              ? `(#${defaultPokemonId}) ${toTitleCase(defaultPokemonName)}`
              : ""
          }
          linkTemplate="/pokemon/{name}/{game}/{dexName}"
        />
      </>
    );
  };

export default PokemonSelector;
