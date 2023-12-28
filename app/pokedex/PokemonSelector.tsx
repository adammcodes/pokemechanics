"use client";
import { useRouter } from "next/navigation";
// Types
import { PokedexPokemon } from "./PokedexById";
// Components
import AutocompleteBase from "@/components/common/AutocompleteBase";
// Utils
import convertKebabCaseToTitleCase from "../../src/utils/convertKebabCaseToTitleCase";

export type PokemonOption = {
  label: string;
  name: string;
  value: number | string; // national dex id number
  pokemonId?: number; // regional dex id number
  variantId?: number; // variant form id number
  number?: number;
};

type PokemonSelectorProps = {
  dexId: number;
  pokemon: PokedexPokemon[];
  versionGroup?: string;
  generationString?: string;
  regionName: string;
};

// Component for selecting a Version Group: e.g. "Red/Blue", "Yellow", "Silver/Gold", etc
const PokemonSelector: React.FC<PokemonSelectorProps> =
  function PokemonSelector({
    pokemon,
    dexId,
    versionGroup,
    generationString,
    regionName,
  }) {
    const router = useRouter();

    const onPokemonSelect = (pokemonId: number | string) => {
      // Navigate to the pokemon page
      router.push(`/pokemon/${pokemonId}?dexId=${dexId}`);
    };

    const pokemonOptions: PokemonOption[] = pokemon.map((p) => {
      // If the regionName is not "National" then we need to check if there is a variant id of the pokemon for the region
      let variantId: number | undefined;
      if (regionName !== "National") {
        const variantForRegion =
          p.pokemon_v2_pokemonspecy.pokemon_v2_pokemons.find((variant) =>
            variant.name.includes(regionName)
          );
        variantId = variantForRegion?.pokemon_v2_pokemonsprites[0].id;
      }
      const dexNumber: number = p.pokemon_species_id; // this is the national dex number
      const pokemonId: number = p.pokedex_number; // this is the regional dex number
      const pokemonName: string = p.pokemon_v2_pokemonspecy.name;
      return {
        label: convertKebabCaseToTitleCase(pokemonName),
        name: pokemonName,
        value: dexNumber, // the value property we use as [id] in pokemon page dynamic routes
        pokemonId: pokemonId, // this is the regional dex number
        variantId: variantId, // for variant forms of pokemon we use this as the [id] in pokemon page dynamic routes
        versionGroup: versionGroup,
        generationString: generationString,
      };
    });

    return (
      <>
        <AutocompleteBase
          options={pokemonOptions}
          onSelect={onPokemonSelect}
          hasImageOptions={true}
        />
      </>
    );
  };

export default PokemonSelector;
