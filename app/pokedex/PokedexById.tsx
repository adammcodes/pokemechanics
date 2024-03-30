"use client";
import convertKebabCaseToTitleCase from "@/utils/convertKebabCaseToTitleCase";
import { getPokedexById } from "./PokedexByIdQuery";
import { useEffect, useState } from "react";
import PokemonSelector from "./PokemonSelector";
// import PokeballLoader from "@/components/common/PokeballLoader";

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
  pokemonId?: number; // optional to set the default selected pokemon
  generationString?: string; // e.g. "generation-i"
  versionGroup?: string; // e.g. "red-blue"
  key?: string;
  includeHeader?: boolean;
};

export default function PokedexById({
  dexId,
  pokemonId,
  versionGroup,
  generationString,
  includeHeader = true,
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

  if (loading) return null;

  if (error) {
    console.log(error);
    return null;
  }

  const regionName =
    dex.pokemon_v2_pokedexversiongroups.length > 0
      ? dex.pokemon_v2_pokedexversiongroups[0].pokemon_v2_versiongroup
          .pokemon_v2_versiongroupregions[0].pokemon_v2_region.name
      : "National";

  const defaultPokemon = dex.pokemon_v2_pokemondexnumbers.find(
    (p) => p.pokemon_species_id === pokemonId
  );

  const defaultRegionalDexId = defaultPokemon?.pokedex_number;

  const firstPokemonSpecies = dex.pokemon_v2_pokemondexnumbers[0];
  const lastPokemonSpecies = dex.pokemon_v2_pokemondexnumbers.slice(-1)[0];
  const pokedexIdRange = `${firstPokemonSpecies.pokemon_species_id} - ${lastPokemonSpecies.pokemon_species_id}`;
  return (
    <section className="max-w-[340px]">
      {includeHeader && (
        <header className="mt-10 mb-2 text-center">
          <h2>
            {formatName(dex.name)} Dex ({pokedexIdRange})
          </h2>
          <p className="text-[1rem]">
            {dex.pokemon_v2_pokedexdescriptions[0].description}
          </p>
        </header>
      )}

      <div className="max-w-sm mx-auto">
        <PokemonSelector
          dexId={dexId}
          defaultPokemonId={defaultRegionalDexId || pokemonId}
          defaultPokemonName={defaultPokemon?.pokemon_v2_pokemonspecy.name}
          pokemon={dex.pokemon_v2_pokemondexnumbers}
          versionGroup={versionGroup}
          generationString={generationString}
          regionName={regionName}
        />
      </div>
    </section>
  );
}
