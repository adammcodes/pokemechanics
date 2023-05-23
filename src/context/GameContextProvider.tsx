import { GameContext } from "./_context";
import useLocalStorageState from "../hooks/useLocalStorageState";

type GameContextProps = {
  children: React.ReactNode;
};

export const GameContextProvider: React.FC<GameContextProps> = ({
  children,
}) => {
  // default selected version group is Red Blue
  const [game, setGame] = useLocalStorageState<string>("game", "red-blue");
  // default font index is 0 (RBY font)
  const [font, setFont] = useLocalStorageState<number>("font", 0);

  return (
    <GameContext.Provider value={{ game, setGame, font, setFont }}>
      {children}
    </GameContext.Provider>
  );
};

export default GameContext;
