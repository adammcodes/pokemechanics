"use client";
import { useState } from "react";
import { GameContext } from "./_context";
import useCookieState from "@/hooks/useCookieState";
import useGameVersion from "@/hooks/useGameVersion";

type GameContextProps = {
  children: React.ReactNode;
  selectedGame: string; // comes from the page search params
  initialGame: string; // comes from server-side cookies
};

export const GameContextProvider: React.FC<GameContextProps> = ({
  children,
  selectedGame,
  initialGame,
}) => {
  // Use selectedGame as fallback, then initialGame from cookies
  const fallbackGame = selectedGame || initialGame;
  const [game, setGame] = useCookieState<string>("game", fallbackGame);
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
