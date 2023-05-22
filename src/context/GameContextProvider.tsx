import { useState } from "react";
import { GameContext } from "./_context";

type GameContextProps = {
  children: React.ReactNode;
};

export const GameContextProvider: React.FC<GameContextProps> = ({
  children,
}) => {
  // default selected version group is Red Blue
  const [game, setGame] = useState<string>(
    "https://pokeapi.co/api/v2/version-group/1/"
  );

  return (
    <GameContext.Provider value={{ game, setGame }}>
      {children}
    </GameContext.Provider>
  );
};

export default GameContext;
