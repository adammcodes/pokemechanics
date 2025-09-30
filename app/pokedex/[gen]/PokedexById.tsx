import convertKebabCaseToTitleCase from "@/utils/convertKebabCaseToTitleCase";
import { getPokedexById } from "@/app/helpers/graphql/getPokedexById";
import PokemonSelector from "../PokemonSelector";

export type PokedexPokemon = {
  pokedex_number: number;
  pokemon_species_id: number;
  pokemon_v2_pokemonspecy: {
    name: string;
    pokemon_v2_pokemons: {
      name: string;
      is_default: boolean;
      pokemon_v2_pokemonsprites: {
        id: number;
      }[];
    }[];
  };
};

type Pokedex = {
  name: string;
  pokemon_v2_pokemondexnumbers: PokedexPokemon[];
  pokemon_v2_region: {
    name: string;
  };
  pokemon_v2_pokedexdescriptions: {
    description: string;
    language: {
      name: string;
      url: string;
    };
  }[];
};

type PokedexByIdProps = {
  dexId: number;
  game: string;
  generationString: string;
  pokemonId?: number; // optional to set the default selected pokemon
  key?: string;
  includeHeader?: boolean;
};

// Display a Regional Pokedex by ID
// Use "dex.pokemon_v2_pokemondexnumbers -> pokedex_number" to get the regional dex pokemon id number
// The pokemonId property is the national dex id number
export default async function PokedexById({
  dexId,
  game,
  generationString,
  pokemonId,
  includeHeader = true,
}: PokedexByIdProps) {
  const formatName = convertKebabCaseToTitleCase;
  const regionalDex: Pokedex = await getPokedexById(dexId);

  if (!regionalDex) {
    return <></>;
  }
  const regionalDexNumbers = regionalDex.pokemon_v2_pokemondexnumbers;

  const regionName = regionalDex.pokemon_v2_region.name;

  const defaultPokemon = regionalDexNumbers.find(
    (p) => p.pokemon_species_id === pokemonId
  );

  const defaultRegionalDexPokemonId = defaultPokemon?.pokedex_number;

  const firstPokemonSpecies = regionalDexNumbers[0];
  const lastPokemonSpecies = regionalDexNumbers.slice(-1)[0];
  const pokedexIdRange = `${firstPokemonSpecies.pokedex_number} - ${lastPokemonSpecies.pokedex_number}`;

  return (
    <section className="flex flex-col justify-center">
      {includeHeader && (
        <header className="my-2 text-center">
          <h2>
            {formatName(regionalDex.name)} Dex ({pokedexIdRange})
          </h2>
          <p className="text-[1rem]">
            {regionalDex.pokemon_v2_pokedexdescriptions[0].description}
          </p>
        </header>
      )}

      <div className="lg:max-w-sm mx-auto">
        <PokemonSelector
          pokemon={regionalDexNumbers}
          regionName={regionName}
          dexId={dexId}
          game={game}
          generationString={generationString}
          defaultPokemonId={defaultRegionalDexPokemonId || pokemonId}
          defaultPokemonName={defaultPokemon?.pokemon_v2_pokemonspecy.name}
        />
      </div>
    </section>
  );
}
