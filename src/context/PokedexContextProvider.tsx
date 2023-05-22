import { PokedexContext } from "./_context";
import { useQuery } from "react-query";
import useGameClient from "../hooks/useGameClient";

type PokedexContextProps = {
  children: React.ReactNode;
  dexName: string;
};

export const PokedexContextProvider: React.FC<PokedexContextProps> = ({
  children,
  dexName,
}) => {
  const fetchPokedex = (dexName: string) => {
    const api = useGameClient();

    return api
      .getPokedexByName(dexName)
      .then((data) => data)
      .catch((error) => error);
  };

  const dexQuery = useQuery(["pokedex", dexName], () => fetchPokedex(dexName), {
    refetchOnWindowFocus: false,
    enabled: Boolean(dexName),
  });

  return (
    <PokedexContext.Provider value={{ dexQuery }}>
      {children}
    </PokedexContext.Provider>
  );
};

export default PokedexContext;
