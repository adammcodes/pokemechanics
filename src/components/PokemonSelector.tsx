// Next
import { useRouter } from "next/router";
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

type Option = {
  label: string;
  value: number;
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

    const pokemonOptions: Option[] = pokemon_entries.map((entry) => {
      return {
        label: convertKebabCaseToTitleCase(entry.pokemon_species.name),
        value: Number(entry.pokemon_species.url.split("/").at(-2)),
      };
    });

    return (
      <>
        <Select options={pokemonOptions} onSelect={onPokemonSelect} />
      </>
    );
  };

export default PokemonSelector;
