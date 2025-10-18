"use client";
import { useEffect } from "react";
import { GameContext } from "./_context";
import useCookieState from "@/hooks/useCookieState";
import useGameVersion from "@/hooks/useGameVersion";

type GameContextProps = {
  children: React.ReactNode;
  selectedGame: string; // comes from the page search params or URL path
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

  // When selectedGame changes (e.g., user navigates to /pokedex/x-y),
  // update the game context and cookie to match the URL
  useEffect(() => {
    if (selectedGame && selectedGame !== game) {
      setGame(selectedGame);
    }
  }, [selectedGame, game, setGame]);

  const versionGroup = useGameVersion(game);
  // e.g. "generation-i"
  const generationString = versionGroup.data?.generation.name;

  return (
    <GameContext.Provider
      value={{
        game,
        setGame,
        versionGroup,
        generationString,
      }}
    >
      {children}
    </GameContext.Provider>
  );
};

export default GameContext;
