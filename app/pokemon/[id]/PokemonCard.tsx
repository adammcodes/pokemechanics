"use client";
// hooks & context
import { useContext } from "react";
import {
  GameContext,
  PokedexContext,
  PokemonContext,
} from "@/context/_context";
import EvolutionContextProvider from "@/context/EvolutionContextProvider";
import useGameVersion from "@/hooks/useGameVersion";

// types
import {
  PokemonAbility,
  PokemonSprites,
  NamedAPIResource,
  PokemonType,
} from "pokenode-ts";
import { FlavorTextForVersion } from "@/types/index";
// utils, lib, constants
import convertKebabCaseToTitleCase from "@/utils/convertKebabCaseToTitleCase";
import toTitleCase from "@/utils/toTitleCase";
import splitKebabCase from "@/utils/splitKebabCase";

// components
import PokemonCardBox from "./PokemonCardBox";
import PokemonFlavorText from "app/pokemon/[id]/PokemonFlavorText";
import Evolutions from "@/components/evolutions/Evolutions";
import ForwardBack from "app/pokemon/[id]/ForwardBack";
import { Moves } from "@/components/moves/Moves";
import Abilities from "@/components/abilities/Abilities";
import Stats from "@/components/stats/Stats";
import LocationsForVersionGroup from "@/components/encounters/LocationsForVersionGroup";

type PokemonCardProps = {
  is_variant: boolean; // required
  name: string; // required
  id?: number; // the rest are optional
  base_experience?: number;
  height?: number;
  is_default?: boolean;
  order?: number;
  weight?: number;
  abilities?: PokemonAbility[];
  forms?: NamedAPIResource[];
  sprites?: PokemonSprites;
  types?: PokemonType[];
  moves?: any;
};

const PokemonCard: React.FC<PokemonCardProps> = (props) => {
  // props has all the variant specific data
  // p from PokemonContext has all the other generic species data
  const p = useContext(PokemonContext);
  const { game } = useContext(GameContext);
  const dex = useContext(PokedexContext);
  const versionGroup = useGameVersion(game);
  const genNumber =
    versionGroup.data && versionGroup.data.generation.name.split("-")[1];
  const isGenOneOrTwo = genNumber === "i" || genNumber === "ii";
  let formatName = convertKebabCaseToTitleCase;
  const variantName = props.is_variant ? props.name : p.name;
  const pokemonName = toTitleCase(p.name);
  const pokemonId = props.is_variant ? props.id : p.id;
  const regionName: string = props.is_variant
    ? formatName(props.name.split("-")[1])
    : p.regions.length > 0
    ? p.regions[0].name
    : "";
  const name =
    props.is_variant && regionName
      ? `${pokemonName} (${regionName})`
      : pokemonName;
  const versions = splitKebabCase(game);

  const types = props.is_variant ? props.types : p.types;
  // console.log(props.is_variant);
  // console.log(props.sprites);
  // console.log(p.sprites);
  const sprites = props.is_variant ? props.sprites : p.sprites;
  const pokemonHeight = props.is_variant ? props.height : p.height;
  const pokemonWeight = props.is_variant ? props.weight : p.weight;
  const pokemonMoves = props.is_variant ? props.moves : p.moves;
  const pokemonEvolveChainUrl: string = p.evolution_chain.url;

  const flavorTextEntries = p.flavor_text_entries;
  const flavorTextForLanguage = flavorTextEntries.filter((entry: any) => {
    return entry.language.name === "en";
  });
  // If the currently selected version group is a single game then flavorTextForVersion will be defined
  const flavorTextForVersion = flavorTextForLanguage.find(
    (text: FlavorTextForVersion) => {
      return text.version.name === game;
    }
  );
  // If the currently selected version group is a more than one game then flavorTextForVer
  const flavorTextForVersions = !flavorTextForVersion
    ? flavorTextForLanguage.filter((entry: FlavorTextForVersion) => {
        return versions.includes(entry.version.name);
      })
    : null;

  return (
    <div className={`w-full flex flex-col items-center justify-center gap-y-6`}>
      {/* Card Box with meta info - Name, Sprites, Types, Height, Weight, etc */}

      <div className="px-3 w-full mx-auto">
        <PokemonCardBox
          name={name}
          pokemonId={pokemonId}
          is_variant={props.is_variant}
          types={types}
          sprites={sprites}
          height={pokemonHeight}
          weight={pokemonWeight}
          genNumber={genNumber}
        />
      </div>

      <section className="flex flex-col justify-center lg:flex-row gap-6 px-[0.5em] lg:px-[1em]">
        {/* Abilities */}
        {!isGenOneOrTwo && <Abilities pokemonName={variantName} />}
        {/* Stats */}
        <Stats pokemonName={variantName} />
        {/* Flavor Text */}
        <PokemonFlavorText
          name={name}
          game={game}
          flavorTextForVersion={flavorTextForVersion}
          flavorTextForVersions={flavorTextForVersions}
        />

        <LocationsForVersionGroup
          pokemonSpeciesId={pokemonId}
          versions={versionGroup.data.versions.map(
            (v: NamedAPIResource) => v.name
          )}
        />
      </section>
      {/* Evolutions */}
      <EvolutionContextProvider url={pokemonEvolveChainUrl}>
        <Evolutions />
      </EvolutionContextProvider>
      {/* ForwardBack navigation for the pokedex */}
      {dex.dexQuery.data ? <ForwardBack /> : <p>Loading dex data...</p>}
      {/* Moves */}
      <Moves moves={pokemonMoves} />
    </div>
  );
};

export default PokemonCard;
