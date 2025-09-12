"use client";
import { useState } from "react";
import { GameContext } from "./_context";
import useLocalStorageState from "@/hooks/useLocalStorageState";
import useGameVersion from "@/hooks/useGameVersion";

type GameContextProps = {
  children: React.ReactNode;
  selectedGame: string; // comes from the page search params
};

export const GameContextProvider: React.FC<GameContextProps> = ({
  children,
  selectedGame,
}) => {
  // default selected version group is Red Blue
  const [game, setGame] = useLocalStorageState<string>("game", selectedGame);
  const [loading, setLoading] = useState(false);

  const versionGroup = useGameVersion(game);
  const generationString = versionGroup.data?.generation.name;

  // console.log("game", game);
  // console.log("versionGroup", versionGroup);
  // console.log("generationString", generationString);

  // If the game from local storage is not the same as the selected game, update the game in local storage
  // if (game !== selectedGame) {
  //   setGame(selectedGame);
  // }

  return (
    <GameContext.Provider
      value={{
        game,
        setGame,
        loading,
        setLoading,
        versionGroup,
        generationString,
      }}
    >
      {children}
    </GameContext.Provider>
  );
};

export default GameContext;
