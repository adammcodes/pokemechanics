import { useContext } from "react";
import { GameContext } from "../src/context/_context";
import useGameVersion from "../src/hooks/useGameVersion";
// import { GenerationContextProvider } from "../src/context/GenerationContextProvider";
import { PokedexContextProvider } from "../src/context/PokedexContextProvider";
import Dex from "../src/components/Dex";

type Pokedex = {
  name: string;
  url: string;
};

export default function Pokedex() {
  // Get currently selected game for it's version url
  const { game } = useContext(GameContext);
  // Get versionGroup data for the game
  const versionGroup = useGameVersion(game);
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
    <main className="flex-row w-full justify-around items-start px-5">
      {versionGroup.isLoading && "Loading..."}
      {pokedexes.length > 0 && mappedDexes}
    </main>
  );
}
