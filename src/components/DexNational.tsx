import { useContext } from "react";
import { PokedexContext } from "../context/_context";
import PokemonSelector from "./PokemonSelector";
import convertKebabCaseToTitleCase from "../utils/convertKebabCaseToTitleCase";

type DexNationalProps = {
  versionGroupName: string;
  upperLimitNumber: number;
};

export const DexNational: React.FC<DexNationalProps> = ({
  versionGroupName,
  upperLimitNumber,
}) => {
  const { dexQuery } = useContext(PokedexContext);
  const formatName = convertKebabCaseToTitleCase;

  return (
    <section className="mb-10">
      {dexQuery.isLoading && "Loading..."}
      {dexQuery.data && (
        <>
          <header className="mb-5">
            National Dex -{" "}
            <span>
              {formatName(versionGroupName)} (#001 - {upperLimitNumber})
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
