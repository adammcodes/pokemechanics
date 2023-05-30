import styles from "../../styles/PokemonCard.module.css";
// hooks
import { useContext } from "react";
import { GameContext } from "../context/_context";
import { PokemonContext } from "../context/_context";
// components
import DynamicImage from "./DynamicImage";
import {
  Genus,
  PokemonAbility,
  PokemonSprites,
  NamedAPIResource,
  PokemonType,
} from "pokenode-ts";
// utils
import convertKebabCaseToTitleCase from "../utils/convertKebabCaseToTitleCase";
import convertHeightToCmOrM from "../utils/convertHeightToCmOrM";
import convertWeightToGramsOrKg from "../utils/convertWeightToGramsOrKg";
import splitKebabCase from "../utils/splitKebabCase";
import findSpritesForVersion from "../utils/findSpritesForVersion";
import DualDynamicImages from "./DualDynamicImages";
import findSpritesForGoldSilver from "../utils/findSpritesForGoldSilver";
import { FlavorTextForVersion, PokemonMoveVersion } from "../types";
import { FlavorText } from "./FlavorText";
import { DualFlavorText } from "./DualFlavorText";
import PokeballSpans from "./PokeballSpans";
import { PokemonTypes } from "./PokemonTypes";
import { spriteSizesByVersion } from "../../constants/spriteSizesByVersion";
import { Moves } from "./Moves";
import ForwardBack from "./ForwardBack";

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
  moves?: PokemonMoveVersion[];
};

export const PokemonCard: React.FC<PokemonCardProps> = (props) => {
  // props has all the variant specific data
  // p from PokemonContext has all the other generic species data
  const p = useContext(PokemonContext);
  const { game } = useContext(GameContext);
  let formatName = convertKebabCaseToTitleCase;
  const pokemonName = formatName(p.name);
  const regionName: string = props.is_variant
    ? formatName(props.name.split("-")[1])
    : p.regions[0].name;
  const name =
    props.is_variant && regionName
      ? `${pokemonName} (${regionName})`
      : pokemonName;
  const versions = splitKebabCase(game);
  const sprites = props.is_variant ? props.sprites : p.sprites;
  const pokemonH = props.is_variant ? props.height : p.height;
  const pokemonW = props.is_variant ? props.weight : p.weight;
  const pokemonMoves = props.is_variant ? props.moves : p.moves;

  const spriteSize: number = spriteSizesByVersion[game];
  const pokemonGenus: string | undefined = p.genera
    ? p.genera.find((g: Genus) => {
        return g.language.name === "en";
      })?.genus
    : "";
  const types = props.is_variant ? props.types : p.types;

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

  const pokemonSprites = findSpritesForVersion(sprites, game);
  const pokemonSpritesGoldSilver = findSpritesForGoldSilver(sprites, game);

  return (
    <div
      className={`${styles.card__container} w-full flex flex-col items-center justify-center`}
    >
      <div className={`${styles.card}`}>
        <table className="w-full">
          <tbody>
            <tr>
              <td className="w-1/2">
                <div className="w-full flex justify-center p-2">
                  {game === "gold-silver" && (
                    <DualDynamicImages
                      labelLeft={"Gold"}
                      labelRight={"Silver"}
                      srcLeft={
                        pokemonSpritesGoldSilver?.gold.front_default ||
                        pokemonSprites.front_default
                      }
                      srcRight={
                        pokemonSpritesGoldSilver?.silver.front_default ||
                        pokemonSprites.front_default
                      }
                      altLeft={`${name}-gold`}
                      altRight={`${name}-silver`}
                      width={100}
                      height={100}
                      priority={true}
                    />
                  )}
                  {game !== "gold-silver" && (
                    <DynamicImage
                      src={pokemonSprites.front_default}
                      width={spriteSize}
                      height={spriteSize}
                      alt={name || "Pokemon sprite"}
                      priority={true}
                    />
                  )}
                </div>
                <div className="mx-auto w-24 flex flex-row justify-around items-center">
                  <PokemonTypes types={types} />
                </div>
              </td>
              <td className="w-1/2 flex-col justify-center items-center pl-5">
                <div className="mb-5">{name}</div>
                <div className="mb-5">{pokemonGenus}</div>
                <div className="mb-5">
                  No.
                  <span>&nbsp;&nbsp;</span>
                  {p.id}
                </div>
                <table className="w-full">
                  <tbody>
                    <tr>
                      <td>HT</td>
                      <td>{convertHeightToCmOrM(pokemonH)}</td>
                    </tr>
                    <tr>
                      <td>WT</td>
                      <td>{convertWeightToGramsOrKg(pokemonW)}</td>
                    </tr>
                  </tbody>
                </table>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
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
      <ForwardBack />
      <Moves moves={pokemonMoves} />
    </div>
  );
};
