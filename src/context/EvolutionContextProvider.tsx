"use client";
import { EvolutionContext } from "./_context";
import useEvolutionClient from "@/hooks/useEvolutionClient";
import { useQuery } from "react-query";

type EvolutionContextProps = {
  url: string;
  children: React.ReactNode;
};

const EvolutionContextProvider: React.FC<EvolutionContextProps> = ({
  children,
  url,
}) => {
  const api = useEvolutionClient();
  const evolutionChainId: number = Number(url.split("/").at(-2));

  const fetchEvolutionChain = (evolutionChainId: number) => {
    return api
      .getEvolutionChainById(evolutionChainId)
      .then((data) => data)
      .catch((err) => {
        throw err;
      });
  };

  const evolutionQuery = useQuery(
    ["evolutionChain", evolutionChainId],
    () => fetchEvolutionChain(evolutionChainId),
    {
      enabled: Boolean(evolutionChainId),
      refetchOnMount: false,
      refetchOnWindowFocus: false,
    }
  );

  return (
    <EvolutionContext.Provider value={evolutionQuery}>
      {children}
    </EvolutionContext.Provider>
  );
};

export default EvolutionContextProvider;
