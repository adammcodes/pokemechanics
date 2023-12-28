"use client";
import convertKebabCaseToTitleCase from "@/utils/convertKebabCaseToTitleCase";
import { getNationalDexByLimit } from "./NationalDexQuery";
import { useEffect, useState } from "react";
import PokemonSelector from "./PokemonSelector";
// type imports
import { PokedexPokemon } from "./PokedexById";

type NationalDexProps = {
  limit: number;
  versionGroup: string;
  generationString: string;
};

type Pokedex = {
  name: string;
  pokemon_v2_pokemondexnumbers: PokedexPokemon[];
  pokemon_v2_pokedexdescriptions: {
    description: string;
    language: {
      name: string;
      url: string;
    };
  }[];
};

export default function NationalDex({
  limit,
  versionGroup,
  generationString,
}: NationalDexProps) {
  // The limit param is to limit the number of Pokémon returned that applies to the National Pokédex for that generation.
  // For example, in Generation 1, the National Pokédex only contains 151 Pokémon. So the limit param would be 151.
  const formatName = convertKebabCaseToTitleCase;
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<unknown>(null);
  const [dex, setPokedex] = useState({} as Pokedex);

  useEffect(() => {
    async function fetchPokedexData() {
      try {
        const data = await getNationalDexByLimit(limit);
        setPokedex(data);
      } catch (error) {
        console.error(error);
        setError(error);
      } finally {
        setLoading(false);
      }
    }

    fetchPokedexData();
  }, [limit]);

  if (loading) return <div>Loading...</div>;

  if (error)
    return (
      <div>
        An error occurred fetching Pokédex data. Please try again later.
      </div>
    );

  const firstPokemonSpecies = dex.pokemon_v2_pokemondexnumbers[0];
  const lastPokemonSpecies = dex.pokemon_v2_pokemondexnumbers.slice(-1)[0];
  const pokedexIdRange = `${firstPokemonSpecies.pokemon_species_id} - ${lastPokemonSpecies.pokemon_species_id}`;

  return (
    <section className="mb-10 text-center">
      <header className="mb-2">
        <span>National Dex ({pokedexIdRange})</span>
        <br />
        <span>{formatName(versionGroup)}</span>
      </header>

      <div className="max-w-sm mx-auto">
        <PokemonSelector
          dexId={1}
          pokemon={dex.pokemon_v2_pokemondexnumbers}
          versionGroup={versionGroup}
          generationString={generationString}
          regionName="National"
        />
      </div>
    </section>
  );
}
