import convertKebabCaseToTitleCase from "@/utils/convertKebabCaseToTitleCase";
import { getPokedexById } from "@/app/helpers/graphql/getPokedexById";
import PokemonSelector from "./PokemonSelector";

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

export default async function PokedexById({
  dexId,
  game,
  generationString,
  pokemonId,
  includeHeader = true,
}: PokedexByIdProps) {
  const formatName = convertKebabCaseToTitleCase;

  const dex: Pokedex = await getPokedexById(dexId);

  if (!dex) {
    return <></>;
  }

  const regionName = dex.pokemon_v2_region.name;

  const defaultPokemon = dex.pokemon_v2_pokemondexnumbers.find(
    (p) => p.pokemon_species_id === pokemonId
  );

  const defaultRegionalDexId = defaultPokemon?.pokedex_number;

  const firstPokemonSpecies = dex.pokemon_v2_pokemondexnumbers[0];
  const lastPokemonSpecies = dex.pokemon_v2_pokemondexnumbers.slice(-1)[0];
  const pokedexIdRange = `${firstPokemonSpecies.pokemon_species_id} - ${lastPokemonSpecies.pokemon_species_id}`;

  return (
    <section className="flex flex-col justify-center">
      {includeHeader && (
        <header className="my-2 text-center">
          <h2>
            {formatName(dex.name)} Dex ({pokedexIdRange})
          </h2>
          <p className="text-[1rem]">
            {dex.pokemon_v2_pokedexdescriptions[0].description}
          </p>
        </header>
      )}

      <div className="lg:max-w-sm mx-auto">
        <PokemonSelector
          pokemon={dex.pokemon_v2_pokemondexnumbers}
          regionName={regionName}
          dexId={dexId}
          game={game}
          generationString={generationString}
          defaultPokemonId={defaultRegionalDexId || pokemonId}
          defaultPokemonName={defaultPokemon?.pokemon_v2_pokemonspecy.name}
        />
      </div>
    </section>
  );
}
