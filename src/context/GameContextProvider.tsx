"use client";
import { useState } from "react";
import { GameContext } from "./_context";
import useLocalStorageState from "@/hooks/useLocalStorageState";
import useGameVersion from "@/hooks/useGameVersion";

type GameContextProps = {
  children: React.ReactNode;
};

export const GameContextProvider: React.FC<GameContextProps> = ({
  children,
}) => {
  // default selected version group is Red Blue
  const [game, setGame] = useLocalStorageState<string>("game", "");
  const [loading, setLoading] = useState(false);

  const versionGroup = useGameVersion(game);
  const generationString = versionGroup.data?.generation.name;

  // console.log("game", game);
  // console.log("versionGroup", versionGroup);
  // console.log("generationString", generationString);

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
