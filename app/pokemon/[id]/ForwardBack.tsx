"use client";
import { Sprite } from "@/components/sprites/Sprite";
import { useContext } from "react";
import { useRouter } from "next/navigation";
import {
  GameContext,
  PokedexContext,
  PokemonContext,
} from "@/context/_context";
import { Pokedex } from "pokenode-ts";
import toTitleCase from "@/utils/toTitleCase";
import useGameVersion from "@/hooks/useGameVersion";
import { numOfPokemonByGen } from "@/constants/numOfPokemonByGen";
import addPrecedingZeros from "@/utils/addPrecedingZeros";

type PokedexEntry = {
  entry_number: number;
  pokedex: Pokedex;
};

export default function ForwardBack() {
  const router = useRouter();
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

  const onPokemonSelect = (path: string) => {
    // Navigate to the pokemon page
    router.push(path);
  };

  return (
    <div className="lg:absolute flex flex-row justify-between w-full px-5 pb-5 lg:py-0">
      {currentEntryNum !== prevEntryNum && (
        <a href={`/pokemon/${prevPokemonId}?dexId=${dex.id}`}>
          &larr; #{prevRegionalDexNum}{" "}
          <Sprite versionGroup={game} gen={gen} id={prevPokemonId} size={50} />
          {toTitleCase(prevPokemonEntry.pokemon_species.name)}
        </a>
      )}

      {currentEntryNum === prevEntryNum && <div>&nbsp;</div>}

      {currentEntryNum !== nextEntryNum && nextPokemonId && (
        <div
          className="hover:underline cursor-pointer"
          onClick={() =>
            onPokemonSelect(`/pokemon/${nextPokemonId}?dexId=${dex.id}`)
          }
        >
          #{nextRegionalDexNum}{" "}
          <Sprite versionGroup={game} gen={gen} id={nextPokemonId} size={50} />
          {toTitleCase(nextPokemonEntry.pokemon_species.name)} &rarr;
        </div>
      )}
      {currentEntryNum === nextEntryNum && <div>&nbsp;</div>}
    </div>
  );
}
