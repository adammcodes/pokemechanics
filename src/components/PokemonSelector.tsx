// Next
import { useRouter } from "next/router";
// Types
import { PokemonOption } from "../types";
// Components
import Select from "./Select";
// Utils
import convertKebabCaseToTitleCase from "../utils/convertKebabCaseToTitleCase";

type PokemonSpecies = {
  name: string;
  url: string;
};

type PokemonEntries = {
  entry_number: number;
  pokemon_species: PokemonSpecies;
};

type PokemonSelectorProps = {
  pokemon_entries: PokemonEntries[];
};

// Component for selecting a Version Group: e.g. "Red/Blue", "Yellow", "Silver/Gold", etc
const PokemonSelector: React.FC<PokemonSelectorProps> =
  function PokemonSelector({ pokemon_entries }) {
    const router = useRouter();

    const onPokemonSelect = (pokemonId: number | string) => {
      // Programmatically navigate to the pokemon page
      router.push(`/pokemon/${pokemonId}`);
    };

    const pokemonOptions: PokemonOption[] = pokemon_entries.map((entry) => {
      const dexNumber = Number(entry.pokemon_species.url.split("/").at(-2));
      return {
        label: convertKebabCaseToTitleCase(entry.pokemon_species.name),
        name: entry.pokemon_species.name,
        value: dexNumber,
        number: dexNumber,
      };
    });

    return (
      <>
        <Select
          options={pokemonOptions}
          onSelect={onPokemonSelect}
          defaultValue={0}
        />
      </>
    );
  };

export default PokemonSelector;
