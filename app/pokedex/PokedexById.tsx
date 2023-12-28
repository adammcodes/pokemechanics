"use client";
import convertKebabCaseToTitleCase from "@/utils/convertKebabCaseToTitleCase";
import { getPokedexById } from "./PokedexByIdQuery";
import { useEffect, useState } from "react";
import PokemonSelector from "./PokemonSelector";

export type PokedexPokemon = {
  pokedex_number: number;
  pokemon_species_id: number;
  pokemon_v2_pokemonspecy: {
    name: string;
    pokemon_v2_pokemons: {
      name: string;
      is_default: boolean;
      pokemon_v2_pokemonsprites: {
        id: number;
      }[];
    }[];
  };
};

type VersionGroup = {
  name: string;
  pokemon_v2_versiongroupregions: {
    pokemon_v2_region: {
      name: string;
    };
  }[];
};

type Pokedex = {
  name: string;
  pokemon_v2_pokemondexnumbers: PokedexPokemon[];
  pokemon_v2_pokedexversiongroups: {
    pokemon_v2_versiongroup: VersionGroup;
  }[];
  pokemon_v2_pokedexdescriptions: {
    description: string;
    language: {
      name: string;
      url: string;
    };
  }[];
};

type PokedexByIdProps = {
  dexId: number;
  generationString?: string;
  versionGroup?: string;
  key?: string;
};

export default function PokedexById({
  dexId,
  versionGroup,
  generationString,
}: PokedexByIdProps) {
  const formatName = convertKebabCaseToTitleCase;
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<unknown>(null);
  const [dex, setPokedex] = useState({} as Pokedex);

  useEffect(() => {
    async function fetchPokedexData() {
      try {
        const data = await getPokedexById(dexId);
        setPokedex(data);
      } catch (error) {
        console.error(error);
        setError(error);
      } finally {
        setLoading(false);
      }
    }

    fetchPokedexData();
  }, [dexId]);

  if (loading) return <div>Loading...</div>;

  if (error)
    return (
      <div>
        An error occurred fetching Pokédex data. Please try again later.
      </div>
    );

  const regionName =
    dex.pokemon_v2_pokedexversiongroups[0].pokemon_v2_versiongroup
      .pokemon_v2_versiongroupregions[0].pokemon_v2_region.name;
  const firstPokemonSpecies = dex.pokemon_v2_pokemondexnumbers[0];
  const lastPokemonSpecies = dex.pokemon_v2_pokemondexnumbers.slice(-1)[0];
  const pokedexIdRange = `${firstPokemonSpecies.pokemon_species_id} - ${lastPokemonSpecies.pokemon_species_id}`;
  return (
    <section className="mb-10 max-w-[340px]">
      <header className="mb-2 text-center">
        <h2>
          {formatName(dex.name)} Dex ({pokedexIdRange})
        </h2>
        <p className="text-[1rem]">
          {dex.pokemon_v2_pokedexdescriptions[0].description}
        </p>
      </header>

      <div className="max-w-sm mx-auto">
        <PokemonSelector
          dexId={dexId}
          pokemon={dex.pokemon_v2_pokemondexnumbers}
          versionGroup={versionGroup}
          generationString={generationString}
          regionName={regionName}
        />
      </div>
    </section>
  );
}