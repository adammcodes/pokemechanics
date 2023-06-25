import Link from "next/link";
import { Sprite } from "./Sprite";
import { useContext } from "react";
import {
  GameContext,
  PokedexContext,
  PokemonContext,
} from "../context/_context";
import { Pokedex } from "pokenode-ts";
import convertKebabCaseToTitleCase from "../utils/convertKebabCaseToTitleCase";
import useGameVersion from "../hooks/useGameVersion";
import { numOfPokemonByGen } from "../../constants/numOfPokemonByGen";
import addPrecedingZeros from "../utils/addPrecedingZeros";

type PokedexEntry = {
  entry_number: number;
  pokedex: Pokedex;
};

export default function ForwardBack() {
  const formatName = convertKebabCaseToTitleCase;
  const { game } = useContext(GameContext);
  const version = useGameVersion(game);
  const gen = version.data.generation.name;
  const lastDexEntryNum = numOfPokemonByGen[gen];
  const d = useContext(PokedexContext);
  const p = useContext(PokemonContext);
  const dex = d.dexQuery.data;
  const currentPokemonEntry: PokedexEntry = p.pokedex_numbers.find(
    (entry: PokedexEntry) => {
      return entry.pokedex.name === dex.name;
    }
  );
  // Get entry numbers of current, 1 before, 1 after
  const currentEntryNum: number = currentPokemonEntry.entry_number;
  const prevEntryNum: number = Math.max(currentEntryNum - 1, 1); // don't go below 1
  const nextEntryNum: number = Math.min(currentEntryNum + 1, lastDexEntryNum); // don't go above the national dex

  // Get pokemon entry before and after
  const prevPokemonEntry = dex.pokemon_entries[prevEntryNum - 1];
  const nextPokemonEntry = dex.pokemon_entries[nextEntryNum - 1];

  // Get national dex Ids
  const prevPokemonId = prevPokemonEntry.pokemon_species.url.split("/").at(-2);
  const nextPokemonId = nextPokemonEntry?.pokemon_species.url.split("/").at(-2);

  // Get regional dex numbers with preceeding zeros
  const prevRegionalDexNum = addPrecedingZeros(
    prevPokemonEntry.entry_number,
    lastDexEntryNum.toString().length
  );
  const nextRegionalDexNum = nextPokemonId
    ? addPrecedingZeros(
        nextPokemonEntry.entry_number,
        lastDexEntryNum.toString().length
      )
    : 0;

  return (
    <div className="flex flex-row justify-between w-full px-5 py-5">
      {currentEntryNum !== prevEntryNum && (
        <Link href={`/pokemon/${prevPokemonId}?dexId=${dex.id}`}>
          &larr; #{prevRegionalDexNum} <Sprite id={prevPokemonId} size={50} />
          {formatName(prevPokemonEntry.pokemon_species.name)}
        </Link>
      )}
      {currentEntryNum === prevEntryNum && <div>&nbsp;</div>}
      {currentEntryNum !== nextEntryNum && nextPokemonId && (
        <Link href={`/pokemon/${nextPokemonId}?dexId=${dex.id}`}>
          #{nextRegionalDexNum} <Sprite id={nextPokemonId} size={50} />
          {formatName(nextPokemonEntry.pokemon_species.name)} &rarr;
        </Link>
      )}
      {currentEntryNum === nextEntryNum && <div>&nbsp;</div>}
    </div>
  );
}
