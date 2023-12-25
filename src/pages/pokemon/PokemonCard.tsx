import styles from "@/styles/PokemonCard.module.css";
// hooks & context
import { useContext } from "react";
import {
  GameContext,
  PokedexContext,
  PokemonContext,
} from "@/context/_context";
import EvolutionContextProvider from "@/context/EvolutionContextProvider";

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

import splitKebabCase from "@/utils/splitKebabCase";

// import { spriteSizesByVersion } from "@/constants/spriteSizesByVersion";
// shared components

import PokeballSpans from "@/components/common/PokeballSpans";
// components
import { PokemonCardBox } from "./PokemonCardBox";
import { FlavorText } from "./FlavorText";
import { DualFlavorText } from "./DualFlavorText";

import { Moves } from "@/components/moves/Moves";
import ForwardBack from "@/pages/pokemon/ForwardBack";
import Evolutions from "@/components/evolutions/Evolutions";

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

export const PokemonCard: React.FC<PokemonCardProps> = (props) => {
  // props has all the variant specific data
  // p from PokemonContext has all the other generic species data
  const p = useContext(PokemonContext);
  const { game } = useContext(GameContext);
  const dex = useContext(PokedexContext);
  let formatName = convertKebabCaseToTitleCase;
  const pokemonName = formatName(p.name);
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
    <div
      className={`${styles.card__container} w-full flex flex-col items-center justify-center`}
    >
      {/* Card Box with meta info - Name, Sprites, Types, Height, Weight, etc */}
      <PokemonCardBox
        name={name}
        is_variant={props.is_variant}
        types={types}
        sprites={sprites}
        height={pokemonHeight}
        weight={pokemonWeight}
      />
      <div className={`pokeball-box w-1/4 ${styles.box}`}>
        {flavorTextForVersion && (
          <FlavorText flavorTextForVersion={flavorTextForVersion} />
        )}
        {flavorTextForVersions && (
          <DualFlavorText flavorTextForVersions={flavorTextForVersions} />
        )}
        {!flavorTextForVersion && !flavorTextForVersions.length && (
          <div>
            <p className="leading-5">
              There is no flavour text on {name} for{" "}
              {convertKebabCaseToTitleCase(game)}.
            </p>
          </div>
        )}
        <PokeballSpans />
      </div>
      <EvolutionContextProvider url={pokemonEvolveChainUrl}>
        <Evolutions />
      </EvolutionContextProvider>
      {dex.dexQuery.data ? <ForwardBack /> : <p>Loading dex data...</p>}
      <Moves moves={pokemonMoves} />
    </div>
  );
};
