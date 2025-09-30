import {
  SpeciesVariety,
  Pokedex,
  Pokemon,
  PokemonSpecies,
} from "@/types/index";
import { PokemonType } from "pokenode-ts";
import convertKebabCaseToTitleCase from "@/utils/convertKebabCaseToTitleCase";
import toTitleCase from "@/utils/toTitleCase";
import splitKebabCase from "@/utils/splitKebabCase";
import findVarietyForRegion from "@/lib/findVarietyForRegion";
import { fetchPokemonById } from "@/app/helpers/rest/fetchPokemonById";
import { fetchEvolutionChainById } from "@/app/helpers/rest/fetchEvolutionChainById";
import type { VersionGroup } from "@/app/helpers/graphql/getVersionGroup";

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
import HeaderSelect from "@/components/header/HeaderSelect";

type PokemonCardServerProps = {
  pokemonData: Pokemon;
  speciesData: PokemonSpecies;
  versionData: VersionGroup;
  dexData: Pokedex;
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
  // console.log(
  //   "=================== PokemonCardServer pokemonData ==================="
  // );
  // console.log(pokemonData);
  // console.log(
  //   "=================== PokemonCardServer speciesData ==================="
  // );
  // console.log(speciesData);
  // console.log(
  //   "=================== PokemonCardServer versionData ==================="
  // );
  // console.log(versionData);
  // console.log(
  //   "=================== PokemonCardServer dexData ==================="
  // );
  // console.log(dexData);
  // console.log(
  //   "=================== PokemonCardServer dexId ==================="
  // );
  // console.log(dexId);
  // console.log("=================== PokemonCardServer game ===================");
  // console.log(game);
  // Use region name of the Pokedex
  const regionName =
    dexId === 1 ? versionData.regions[0].name : dexData.region.name;
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

  // // Merge species data with Pokemon data for context compatibility
  // const mergedData = {
  //   ...pokemonData,
  //   ...speciesData,
  //   regions: versionData.regions,
  // };

  // Get version group data
  const versionId: number = versionData?.id || 1;
  const genName: string = versionData?.generation.name || "generation-i";
  const genNumber: string = genName.split("-")[1] || "i";
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
            pokedexNumbers={speciesData.pokedex_numbers}
            d={dexData}
            version={versionData}
          />
        ) : (
          <p>Loading dex data...</p>
        )}
      </div>

      <div className="flex flex-col gap-y-2 w-full max-w-[500px] mx-auto px-0">
        <HeaderSelect
          pokemonId={pokemonId.toString()}
          dexId={dexId.toString()}
          game={game}
          generationString={genName}
        />
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
        generation={genName}
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
        {versionData && (
          <LocationsForVersionGroupServer
            locationAreaEncountersUrl={
              displayPokemonData.location_area_encounters
            }
            pokemonSpeciesId={pokemonId}
            versions={versionData.versions.map((v) => v.name)}
            evolutionData={evolutionChainData}
          />
        )}
        {/* Type Efficacy */}
        {typeIds && typeIds.length > 0 && (
          <TypeEfficacyServer typeIds={typeIds} versionId={versionId} />
        )}
      </section>

      {/* Moves */}
      <MovesServer moves={pokemonMoves} game={game} />
    </div>
  );
}
