import { useContext } from "react";
import { PokedexContext } from "@/context/_context";
import PokemonSelector from "./PokemonSelector";

type DexNationalProps = {
  generation: string; // e.g. generation-i
  upperLimitNumber: number;
};

export const DexNational: React.FC<DexNationalProps> = ({
  generation,
  upperLimitNumber,
}) => {
  const { dexQuery } = useContext(PokedexContext);
  const formatName = (name: string) => {
    const splitName = name.split("-");
    const genNumerals = splitName[1].toUpperCase();
    return `Gen ${genNumerals}`;
  };

  return (
    <section className="mb-10">
      {dexQuery.isLoading && "Loading..."}
      {dexQuery.data && (
        <>
          <header className="mb-5">
            National Dex -{" "}
            <span>
              {formatName(generation)} (#001 - {upperLimitNumber})
            </span>
          </header>
          <div className="max-w-sm">
            <PokemonSelector
              pokemon_entries={dexQuery.data.pokemon_entries.slice(
                0,
                upperLimitNumber
              )}
            />
          </div>
        </>
      )}
    </section>
  );
};
