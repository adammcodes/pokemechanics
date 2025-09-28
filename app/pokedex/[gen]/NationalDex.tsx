import { getNationalDexByLimit } from "@/app/helpers/graphql/getNationalDexByLimit";
import PokemonSelector from "../PokemonSelector";
// type imports
import { PokedexPokemon } from "./PokedexById";
import { numOfPokemonByGen } from "@/constants/numOfPokemonByGen";

type NationalDexProps = {
  game: string;
  generationString: string;
  includeHeader?: boolean;
};

type Pokedex = {
  name: string;
  pokemon_v2_pokemondexnumbers: PokedexPokemon[];
  pokemon_v2_pokedexdescriptions: {
    description: string;
    language: {
      name: string;
      url: string;
    };
  }[];
};

// Display the National Dex for the selected game/generation
// Use "dex.pokemon_v2_pokemondexnumbers -> pokemon_species_id" to get the national dex number
export default async function NationalDex({
  game,
  generationString,
  includeHeader = true,
}: NationalDexProps) {
  const isFireRedLeafGreen = game === "firered-leafgreen";
  const limit = isFireRedLeafGreen ? 151 : numOfPokemonByGen[generationString];

  const dex: Pokedex = await getNationalDexByLimit(limit);

  if (!dex) {
    return <></>;
  }

  const firstPokemonSpecies = dex.pokemon_v2_pokemondexnumbers[0];
  const lastPokemonSpecies = dex.pokemon_v2_pokemondexnumbers.slice(-1)[0];
  const pokedexIdRange = `${firstPokemonSpecies.pokemon_species_id} - ${lastPokemonSpecies.pokemon_species_id}`;

  return (
    <section className="text-center">
      {includeHeader && (
        <header className="my-2">
          <span>National Dex ({pokedexIdRange})</span>
        </header>
      )}

      <div className="max-w-sm mx-auto">
        <PokemonSelector
          pokemon={dex.pokemon_v2_pokemondexnumbers}
          regionName="National"
          dexId={1}
          game={game}
          generationString={generationString}
        />
      </div>
    </section>
  );
}
