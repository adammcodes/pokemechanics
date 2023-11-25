import { GameContext } from "./_context";
import useLocalStorageState from "@/hooks/useLocalStorageState";
import { useState } from "react";

type GameContextProps = {
  children: React.ReactNode;
};

export const GameContextProvider: React.FC<GameContextProps> = ({
  children,
}) => {
  // default selected version group is Red Blue
  const [game, setGame] = useLocalStorageState<string>("game", "");
  const [loading, setLoading] = useState(false);

  return (
    <GameContext.Provider value={{ game, setGame, loading, setLoading }}>
      {children}
    </GameContext.Provider>
  );
};

export default GameContext;
