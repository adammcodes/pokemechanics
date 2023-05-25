import { PokemonContext } from "./_context";

type PokemonContextProps = {
  pokemonData: any;
  speciesData: any;
  versionData: any;
  children: React.ReactNode;
};

export const PokemonContextProvider: React.FC<PokemonContextProps> = ({
  children,
  pokemonData,
  speciesData,
  versionData,
}) => {
  const data = {
    ...pokemonData,
    ...speciesData,
    regions: versionData.regions,
  };
  return (
    <PokemonContext.Provider value={data}>{children}</PokemonContext.Provider>
  );
};

export default PokemonContext;
