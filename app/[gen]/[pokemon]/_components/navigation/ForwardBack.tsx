import { numOfPokemonByGen } from "@/constants/numOfPokemonByGen";
import addPrecedingZeros from "@/utils/addPrecedingZeros";
import { VersionGroup } from "@/app/helpers/graphql/getVersionGroup";
import { Pokedex } from "@/types/index";
import { ForwardBackSprite } from "../sprites/ForwardBackSprite";

type PokedexNumber = {
  entry_number: number;
  pokedex: { name: string; url: string };
};

type PokemonEntry = {
  entry_number: number;
  pokemon_species: { name: string; url: string };
};

type ForwardBackProps = {
  game: string;
  pokedexNumbers: PokedexNumber[];
  d: Pokedex;
  version: VersionGroup;
};

export default function ForwardBack({
  game,
  pokedexNumbers,
  d,
  version,
}: ForwardBackProps) {
  const dex = d;
  const dexName = dex.name;

  const fallbackPokemonEntry = {
    entry_number: 0,
    pokemon_species: { name: "", url: "" },
  };

  const gen = version.generation?.name ?? "generation-i";

  const lastDexEntryNum = numOfPokemonByGen[gen];

  const currentPokemonEntry: PokedexNumber | undefined = pokedexNumbers.find(
    (entry: PokedexNumber) => {
      return entry.pokedex.name === dex.name;
    }
  );

  // Get entry numbers of current, 1 before, 1 after
  const currentEntryNum: number = currentPokemonEntry?.entry_number ?? 0;
  const prevEntryNum: number = Math.max(currentEntryNum - 1, 0); // don't go below 0
  const nextEntryNum: number = Math.min(currentEntryNum + 1, lastDexEntryNum); // don't go above the national dex for the generation

  // Get pokemon entry before and after
  const prevPokemonEntry =
    dex.pokemon_entries.find((entry: PokemonEntry) => {
      return entry.entry_number === prevEntryNum;
    }) ?? fallbackPokemonEntry;
  const nextPokemonEntry =
    dex.pokemon_entries.find((entry: PokemonEntry) => {
      return entry.entry_number === nextEntryNum;
    }) ?? fallbackPokemonEntry;

  // Get Pokemon names
  const prevPokemon = prevPokemonEntry?.pokemon_species;
  const nextPokemon = nextPokemonEntry?.pokemon_species;

  // Get regional dex numbers with preceeding zeros
  const prevRegionalDexNum = addPrecedingZeros(
    prevPokemonEntry.entry_number,
    lastDexEntryNum.toString().length
  );
  const nextRegionalDexNum = nextPokemon
    ? addPrecedingZeros(
        nextPokemonEntry.entry_number,
        lastDexEntryNum.toString().length
      )
    : 0;

  const isBlackWhite = game === "black-white" || game === "black-2-white-2";

  return (
    <div className="lg:absolute flex flex-row justify-between w-full px-5 pb-5 lg:py-0">
      {prevEntryNum === 0 && !isBlackWhite && <div>&nbsp;</div>}
      {currentEntryNum !== prevEntryNum && prevPokemon.name && (
        <ForwardBackSprite
          direction="back"
          pokemonUrl={`/pokemon/${prevPokemon.name}/${game}/${dexName}`}
          regionalDexNum={prevRegionalDexNum}
          pokemonEntry={prevPokemonEntry}
          game={game}
          gen={gen}
        />
      )}

      {/* Empty space between the previous and current pokemon */}
      {currentEntryNum === prevEntryNum && <div>&nbsp;</div>}

      {currentEntryNum !== nextEntryNum && nextPokemon.name && (
        <ForwardBackSprite
          direction="forward"
          pokemonUrl={`/pokemon/${nextPokemon.name}/${game}/${dexName}`}
          regionalDexNum={nextRegionalDexNum.toString()}
          pokemonEntry={nextPokemonEntry}
          game={game}
          gen={gen}
        />
      )}
      {currentEntryNum === nextEntryNum && <div>&nbsp;</div>}
    </div>
  );
}
