import { useContext } from "react";
import { GameContext } from "../context/_context";
import useGameVersion from "../hooks/useGameVersion";
import { PokedexContextProvider } from "../context/PokedexContextProvider";
import Dex from "../components/Dex";
import { DexNational } from "./DexNational";
import styles from "../../styles/Pokedexes.module.css";
import { numOfPokemonByGen } from "../../constants/numOfPokemonByGen";

type Pokedex = {
  name: string;
  url: string;
};

export default function Pokedexes() {
  // Get currently selected game for it's version url
  const { game } = useContext(GameContext);
  // Get versionGroup data for the game
  const versionGroup = useGameVersion(game);
  const gen: string = versionGroup.data
    ? versionGroup.data.generation.name
    : "generation-ix";
  // The version group may have more than one pokedex
  const pokedexes: Pokedex[] = versionGroup.data
    ? versionGroup.data.pokedexes
    : [];

  // Map each pokedex to it's own data request and context provider
  const mappedDexes: JSX.Element[] = pokedexes.length
    ? pokedexes.map((dex: Pokedex) => {
        return (
          <PokedexContextProvider key={dex.url} dexName={dex.name}>
            <Dex />
          </PokedexContextProvider>
        );
      })
    : [];

  return (
    <div
      className={`${styles.pokedexes} flex flex-row w-full justify-around items-start px-5`}
    >
      {versionGroup.isLoading && "Loading..."}
      <PokedexContextProvider
        key="https://pokeapi.co/api/v2/pokedex/1/"
        dexName="national"
      >
        <DexNational
          versionGroupName={game}
          upperLimitNumber={numOfPokemonByGen[gen]}
        />
      </PokedexContextProvider>
      {pokedexes.length > 0 && mappedDexes}
    </div>
  );
}
