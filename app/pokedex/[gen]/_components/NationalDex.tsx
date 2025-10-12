import { getNationalDexByLimit } from "@/app/helpers/graphql/getNationalDexByLimit";
import PokemonSelector from "./PokemonSelector";
import { PokedexPokemon } from "./PokedexById";
import { numOfPokemonByGen } from "@/constants/numOfPokemonByGen";

type NationalDexProps = {
  game: string;
  generationString: string;
  includeHeader?: boolean;
};

type Pokedex = {
  name: string;
  pokemondexnumbers: PokedexPokemon[];
  pokedexdescriptions: {
    description: string;
    language: {
      name: string;
      url: string;
    };
  }[];
};

// Display the National Dex for the selected game/generation
// Use "dex.pokemondexnumbers -> pokemon_species_id" to get the national dex number
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

  const firstPokemonSpecies = dex.pokemondexnumbers[0];
  const lastPokemonSpecies = dex.pokemondexnumbers.slice(-1)[0];
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
          pokemon={dex.pokemondexnumbers}
          regionName="National"
          dexId={1}
          game={game}
          generationString={generationString}
        />
      </div>
    </section>
  );
}
