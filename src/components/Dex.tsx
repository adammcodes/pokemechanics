import { useContext } from "react";
import { PokedexContext } from "../context/_context";
import PokemonSelector from "./PokemonSelector";
import convertKebabCaseToTitleCase from "../utils/convertKebabCaseToTitleCase";

type Language = {
  name: string;
  url: string;
};

type DexName = {
  language: Language;
  name: string;
};

type DexDesc = {
  description: string;
  language: Language;
};

export default function Dex() {
  const { dexQuery } = useContext(PokedexContext);
  const formatName = convertKebabCaseToTitleCase;

  const englishName: string = dexQuery.data
    ? dexQuery.data.names.find((n: DexName) => {
        return n.language.name === "en";
      }).name
    : [];

  const englishDesc: string = dexQuery.data
    ? dexQuery.data.descriptions.find((d: DexDesc) => {
        return d.language.name === "en";
      }).description
    : [];

  return (
    <section className="mb-10">
      {dexQuery.isLoading && "Loading..."}
      {dexQuery.data && (
        <>
          <header className="mb-5">
            {formatName(dexQuery.data.region.name)} Dex -{" "}
            <span>{englishDesc}</span>
          </header>
          <div className="max-w-sm mx-auto">
            <PokemonSelector pokemon_entries={dexQuery.data.pokemon_entries} />
          </div>
        </>
      )}
    </section>
  );
}
