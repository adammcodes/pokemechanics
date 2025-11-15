import { PokemonSpecies } from "@/types/index";

export default function findGenusForLanguage(
  pokemonSpecies: PokemonSpecies,
  language?: string | null
) {
  const defaultLanguage = "en";
  const generaForLang = pokemonSpecies.genera.find(
    (genera) => genera.language.name === (language || defaultLanguage)
  );

  return generaForLang?.genus ?? "";
}
