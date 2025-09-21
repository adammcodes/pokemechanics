import { getVersionGroup } from "@/app/queries/getVersionGroup";
import findVarietyForRegion from "@/lib/findVarietyForRegion";
import { PokemonSpeciesVariety, SpeciesVariety } from "@/types/index";
import {
  PokemonAbility,
  PokemonSprites,
  NamedAPIResource,
  PokemonType,
} from "pokenode-ts";
import { FlavorTextForVersion } from "@/types/index";
import convertKebabCaseToTitleCase from "@/utils/convertKebabCaseToTitleCase";
import toTitleCase from "@/utils/toTitleCase";
import splitKebabCase from "@/utils/splitKebabCase";

// components
import PokemonCardBoxServer from "./PokemonCardBoxServer";
import PokemonFlavorText from "app/pokemon/[id]/PokemonFlavorText";
import EvolutionsServer from "./EvolutionsServer";
import ForwardBack from "app/pokemon/[id]/ForwardBack";
import { MovesServer } from "./MovesServer";
import Abilities from "@/components/abilities/Abilities";
import Stats from "@/components/stats/Stats";
import LocationsForVersionGroupServer from "./LocationsForVersionGroupServer";
import TypeEfficacyServer from "./TypeEfficacyServer";

// Server-side data fetching functions
async function fetchPokemonById(id: number) {
  const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`, {
    headers: {
      Accept: "application/json",
      "User-Agent": "Pokemechanics/1.0",
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch Pokemon data: ${response.status}`);
  }

  return response.json();
}

async function fetchEvolutionChainById(id: number) {
  const response = await fetch(
    `https://pokeapi.co/api/v2/evolution-chain/${id}`,
    {
      headers: {
        Accept: "application/json",
        "User-Agent": "Pokemechanics/1.0",
      },
    }
  );

  if (!response.ok) {
    throw new Error(`Failed to fetch evolution chain data: ${response.status}`);
  }

  return response.json();
}

type PokemonCardServerProps = {
  pokemonData: any;
  speciesData: {
    id: number;
    base_happiness: number;
    capture_rate: number;
    color: { name: string; url: string };
    egg_groups: { name: string; url: string }[];
    evolution_chain: { url: string };
    evolves_from_species: { name: string; url: string } | null;
    flavor_text_entries: FlavorTextForVersion[];
    form_descriptions: {
      description: string;
      language: { name: string; url: string };
    }[];
    forms_switchable: boolean;
    gender_rate: number;
    genera: { genus: string; language: { name: string; url: string } }[];
    generation: { name: string; url: string };
    growth_rate: { name: string; url: string };
    habitat: { name: string; url: string };
    has_gender_differences: boolean;
    hatch_counter: number;
    is_baby: boolean;
    is_mythical: boolean;
    is_legendary: boolean;
    name: string;
    names: { name: string; language: { name: string; url: string } }[];
    order: number;
    pal_park_encounters: {
      area: { name: string; url: string };
      base_score: number;
      rate: number;
    }[];
    pokedex_numbers: {
      entry_number: number;
      pokedex: { name: string; url: string };
    }[];
    shape: { name: string; url: string };
    varieties: {
      is_default: boolean;
      pokemon: { name: string; url: string };
    }[];
  };
  versionData: {
    id: number;
    name: string;
    order: number;
    regions: { name: string; id: number }[];
    generation: { name: string; id: number };
    versions: { name: string; id: number }[];
    pokedexes: { name: string; id: number }[];
  };
  dexData: {
    descriptions: {
      description: string;
      language: { name: string; url: string };
    }[];
    id: number;
    is_main_series: boolean;
    name: string;
    names: { name: string; language: { name: string; url: string } }[];
    pokemon_entries: {
      entry_number: number;
      pokemon_species: { name: string; url: string };
    }[];
    region: { name: string; url: string };
    version_groups: { name: string; url: string }[];
  };
  dexId: number; // e.g. 1
  game: string; // e.g. "red-blue"
};

export default async function PokemonCardServer({
  pokemonData,
  speciesData,
  versionData,
  dexData,
  dexId,
  game,
}: PokemonCardServerProps) {
  // console.log("=================== PokemonCardServer pokemonData ===================");
  // console.log(pokemonData);
  // console.log("=================== PokemonCardServer speciesData ===================");
  // console.log(speciesData);
  // console.log("=================== PokemonCardServer versionData ===================");
  // console.log(versionData);
  // console.log("=================== PokemonCardServer dexData ===================");
  // console.log(dexData);
  // console.log("=================== PokemonCardServer dexId ===================");
  // console.log(dexId);
  // console.log("=================== PokemonCardServer game ===================");
  // console.log(game);
  // Use region name of the Pokedex
  const regionName = dexData.region.name;
  // Find variety for region if there are multiple varieties
  const pokemonVarietyForRegion: SpeciesVariety | undefined =
    findVarietyForRegion(speciesData.varieties, regionName);

  // Fetch variant Pokemon data if needed
  let variantPokemonData = null;
  let isVariant = false;
  let variantName = speciesData.name;

  if (pokemonVarietyForRegion && speciesData.varieties.length > 1) {
    const pokemonVarietyId = Number(
      pokemonVarietyForRegion.pokemon.url.split("/").at(-2)
    );

    try {
      variantPokemonData = await fetchPokemonById(pokemonVarietyId);
      isVariant = true;
      variantName = variantPokemonData.name;
    } catch (error) {
      console.error("Failed to fetch variant Pokemon data:", error);
      // Fall back to default Pokemon data
    }
  }

  // Fetch evolution chain data
  const evolutionChainId = Number(
    speciesData.evolution_chain.url.split("/").at(-2)
  );
  let evolutionChainData = null;

  try {
    evolutionChainData = await fetchEvolutionChainById(evolutionChainId);
  } catch (error) {
    console.error("Failed to fetch evolution chain data:", error);
  }

  // Use variant data if available, otherwise use default Pokemon data
  const displayPokemonData =
    isVariant && variantPokemonData ? variantPokemonData : pokemonData;

  // Merge species data with Pokemon data for context compatibility
  const mergedData = {
    ...pokemonData,
    ...speciesData,
    regions: versionData.regions,
  };

  // Get version group data
  const versionGroupData = versionData;
  const genId: number = versionGroupData?.id || 1;
  const genNumber: string =
    versionGroupData?.generation.name.split("-")[1] || "i";
  const isGenOneOrTwo = genNumber === "i" || genNumber === "ii";

  // Format names
  let formatName = convertKebabCaseToTitleCase;
  const pokemonName = toTitleCase(speciesData.name);
  const pokemonId = displayPokemonData.id;
  const variantRegionName: string = isVariant
    ? formatName(displayPokemonData.name.split("-")[1])
    : regionName;
  const name =
    isVariant && variantRegionName
      ? `${pokemonName} (${variantRegionName})`
      : pokemonName;
  const versions = splitKebabCase(game ?? "red-blue");

  // Extract data from the Pokemon object
  const types: PokemonType[] = displayPokemonData.types;
  const sprites = displayPokemonData.sprites;
  const pokemonHeight = displayPokemonData.height;
  const pokemonWeight = displayPokemonData.weight;
  const pokemonMoves = displayPokemonData.moves;
  //const pokemonEvolveChainUrl: string = speciesData.evolution_chain.url;

  // Handle flavor text
  const flavorTextEntries = speciesData.flavor_text_entries;
  const flavorTextForLanguage = flavorTextEntries.filter((entry) => {
    return entry.language.name === "en";
  });

  const flavorTextForVersion = flavorTextForLanguage.find((text) => {
    return text.version.name === game;
  });

  const flavorTextForVersions = !flavorTextForVersion
    ? flavorTextForLanguage.filter((entry) => {
        return versions.includes(entry.version.name);
      })
    : null;

  const typeIds = types?.map((t: PokemonType) =>
    Number(t.type.url.split("type/")[1].split("/")[0])
  );

  return (
    <div className={`w-full flex flex-col items-center justify-center px-4`}>
      <div className="relative w-full">
        {/* ForwardBack navigation for the pokedex */}
        {dexData && game ? (
          <ForwardBack
            game={game}
            p={mergedData}
            d={{ dexQuery: { data: dexData } }}
            version={{ data: versionGroupData, isLoading: false }}
          />
        ) : (
          <p>Loading dex data...</p>
        )}
      </div>

      <div className="flex w-full max-w-[500px] mx-auto px-0">
        {/* Sprite + Types */}
        <PokemonCardBoxServer
          name={name}
          pokemonId={pokemonId}
          is_variant={isVariant}
          types={types}
          sprites={sprites}
          height={pokemonHeight}
          weight={pokemonWeight}
          genNumber={genNumber}
          game={game}
          genera={speciesData.genera}
          nationalId={speciesData.id}
        />
      </div>

      {/* Evolutions */}
      <EvolutionsServer
        evolutionChainData={evolutionChainData}
        game={game}
        generation={versionGroupData?.generation?.name || "generation-i"}
        dexId={dexId.toString()}
        regionName={variantRegionName}
      />
      <section
        className={`grid grid-cols-1 md:grid-cols-2 ${
          isGenOneOrTwo ? "lg:grid-cols-4" : "lg:grid-cols-5"
        } place-items-center gap-5`}
      >
        {/* Flavor Text */}
        <PokemonFlavorText
          name={name}
          game={game}
          flavorTextForVersion={flavorTextForVersion}
          flavorTextForVersions={flavorTextForVersions}
        />
        {/* Abilities */}
        {!isGenOneOrTwo && <Abilities pokemonName={variantName} />}
        {/* Stats */}
        <Stats pokemonName={variantName} />
        {/* Encounters */}
        {versionGroupData && (
          <LocationsForVersionGroupServer
            pokemonSpeciesId={pokemonId}
            versions={versionGroupData.versions.map((v) => v.name)}
            evolutionData={evolutionChainData}
          />
        )}
        {/* Type Efficacy */}
        {typeIds && typeIds.length > 0 && (
          <TypeEfficacyServer typeIds={typeIds} genId={genId} />
        )}
      </section>

      {/* Moves */}
      <MovesServer moves={pokemonMoves} game={game} />
    </div>
  );
}
