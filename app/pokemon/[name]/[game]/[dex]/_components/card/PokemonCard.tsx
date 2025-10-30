import {
  SpeciesVariety,
  Pokedex,
  Pokemon,
  PokemonSpecies,
} from "@/types/index";
import { GraphQLPokemon } from "@/types/graphql";
import { PokemonType } from "pokenode-ts";
import convertKebabCaseToTitleCase from "@/utils/convertKebabCaseToTitleCase";
import toTitleCase from "@/utils/toTitleCase";
import splitKebabCase from "@/utils/splitKebabCase";
import findVarietyForRegion from "@/lib/findVarietyForRegion";
import { fetchPokemonById } from "@/app/helpers/rest/fetchPokemonById";
import { fetchEvolutionChainById } from "@/app/helpers/rest/fetchEvolutionChainById";
import type { VersionGroup } from "@/app/helpers/graphql/getVersionGroup";

// components
import PokemonCardBox from "./PokemonCardBox";
import PokemonFlavorText from "../flavor-text/PokemonFlavorText";
import Evolutions from "../evolutions/Evolutions";
import ForwardBack from "../navigation/ForwardBack";
import { Moves } from "../moves/Moves";
import Abilities from "../abilities/Abilities";
import Stats from "../stats/Stats";
// import LocationsForVersionGroup from "../encounters/LocationsForVersionGroup";
import TypeEfficacy from "../type-efficacy/TypeEfficacy";
import HeaderSelect from "@/components/header/HeaderSelect";
import { romanToNumber } from "@/utils/romanToNumber";
import LocationsForVersionGroup from "../encounters/LocationsForVersionGroup";
import { GraphQLPokemonType } from "@/types/graphql";

type PokemonCardProps = {
  pokemonData: Pokemon;
  speciesData: PokemonSpecies;
  versionData: VersionGroup;
  dexData: Pokedex;
  dexName: string; // e.g. "national"
  game: string; // e.g. "red-blue"
  graphqlPokemonData: GraphQLPokemon | null;
};

export default async function PokemonCard({
  pokemonData,
  speciesData,
  versionData,
  dexData,
  dexName,
  game,
  graphqlPokemonData,
}: PokemonCardProps) {
  const region = versionData.regions.length > 0 ? versionData.regions[0] : null;
  const dexRegion = dexData.region?.name || "";
  // Use region name of the Pokedex
  const regionName = dexName === "national" ? region?.name || "" : dexRegion;
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

    // Check if the pokemonData prop already has the correct variant
    // This avoids a duplicate fetch when the parent already fetched the variant
    if (pokemonData.id === pokemonVarietyId) {
      // We already have the correct variant data from the parent!
      variantPokemonData = pokemonData;
      isVariant = true;
      variantName = pokemonData.name;
    } else {
      // The parent fetched a different form, so we need to fetch the variant
      try {
        variantPokemonData = await fetchPokemonById(pokemonVarietyId);
        isVariant = true;
        variantName = variantPokemonData.name;
      } catch (error) {
        console.error("Failed to fetch variant Pokemon data:", error);
        // Fall back to default Pokemon data
      }
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
  const displayPokemonData: Pokemon =
    isVariant && variantPokemonData ? variantPokemonData : pokemonData;

  console.log("name (id): ", displayPokemonData.name, displayPokemonData.id);

  const nameSplitByDash = displayPokemonData.name.split("-");

  // Get version group data
  // const versionId: number = versionData?.id || 1;
  const genName: string = versionData?.generation.name || "generation-i";
  const genNumber: string = genName.split("-")[1] || "i";
  const generationId: number = romanToNumber(genNumber || "i");
  const isGenOneOrTwo = genNumber === "i" || genNumber === "ii";

  // Format names
  let formatName = convertKebabCaseToTitleCase;
  const pokemonName = toTitleCase(speciesData.name);
  const pokemonId = displayPokemonData.id;
  const variantRegionName: string = isVariant
    ? formatName(nameSplitByDash[nameSplitByDash.length - 1])
    : regionName;
  const name =
    isVariant && variantRegionName
      ? `${pokemonName} (${variantRegionName})`
      : pokemonName;
  const versions = splitKebabCase(game ?? "red-blue");

  // Extract data from the Pokemon object
  // const types: PokemonType[] = displayPokemonData.types;
  const sprites = displayPokemonData.sprites;
  const pokemonHeight = displayPokemonData.height;
  const pokemonWeight = displayPokemonData.weight;
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
          dexName={dexName}
          game={game}
          generationString={genName}
        />
        {/* Sprite + Types */}
        <PokemonCardBox
          name={name}
          pokemonId={pokemonId}
          is_variant={isVariant}
          types={
            graphqlPokemonData?.pokemontypes.map(
              (t: GraphQLPokemonType) => t.type
            ) || []
          }
          pokemontypepasts={
            graphqlPokemonData?.pokemontypepasts.map(
              (t: GraphQLPokemonType) => t.type
            ) || []
          }
          sprites={sprites}
          height={pokemonHeight}
          weight={pokemonWeight}
          generationString={genName}
          genNumber={genNumber}
          game={game}
          genera={speciesData.genera}
          nationalId={speciesData.id}
        />
      </div>

      {/* Evolutions */}
      <Evolutions
        evolutionChainData={evolutionChainData}
        pagePokemonData={displayPokemonData}
        game={game}
        generation={genName}
        dexName={dexName}
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
        {!isGenOneOrTwo && (
          <Abilities graphqlPokemonData={graphqlPokemonData} />
        )}
        {/* Stats */}
        <Stats graphqlPokemonData={graphqlPokemonData} />
        {/* Encounters */}
        {versionData && (
          <LocationsForVersionGroup
            speciesData={speciesData}
            encounters={graphqlPokemonData?.encounters || []}
            versions={versionData.versions.map((v) => v.name)}
          />
        )}
        {/* Type Efficacy */}
        {graphqlPokemonData?.pokemontypes &&
          graphqlPokemonData.pokemontypes.length > 0 && (
            <TypeEfficacy
              pokemonTypes={graphqlPokemonData.pokemontypes}
              pokemonTypePasts={graphqlPokemonData.pokemontypepasts}
              generationId={generationId}
              versionGroup={game}
              generationString={genName}
            />
          )}
      </section>

      {/* Moves */}
      {graphqlPokemonData?.pokemonmoves && (
        <Moves
          moves={graphqlPokemonData.pokemonmoves}
          game={game}
          generationString={genName}
        />
      )}
    </div>
  );
}
