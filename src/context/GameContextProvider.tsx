// import { useState } from "react";
import { GameContext } from "./_context";
import useLocalStorageState from "../hooks/useLocalStorageState";

type GameContextProps = {
  children: React.ReactNode;
};

export const GameContextProvider: React.FC<GameContextProps> = ({
  children,
}) => {
  // default selected version group is Red Blue
  // const [game, setGame] = useState<string>("red-blue");
  const [game, setGame] = useLocalStorageState<string>("game", "red-blue");

  return (
    <GameContext.Provider value={{ game, setGame }}>
      {children}
    </GameContext.Provider>
  );
};

export default GameContext;
