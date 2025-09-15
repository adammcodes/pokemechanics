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
  // e.g. "generation-i"
  const generationString = versionGroup.data?.generation.name;

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
