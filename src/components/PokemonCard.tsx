import styles from "../../styles/PokemonCard.module.css";
import DynamicImage from "./DynamicImage";
import {
  Genus,
  PokemonAbility,
  PokemonPastType,
  PokemonHeldItem,
  FlavorText,
} from "pokenode-ts";
import { useContext } from "react";
import { GameContext } from "../context/_context";
// utils
import convertKebabCaseToTitleCase from "../utils/convertKebabCaseToTitleCase";
import convertHeightToCmOrM from "../utils/convertHeightToCmOrM";
import convertWeightToGramsOrKg from "../utils/convertWeightToGramsOrKg";
import splitKebabCase from "../utils/splitKebabCase";

type Form = {
  name: string;
  url: string;
};

type MoveLearnMethod = {
  name: string;
  url: string;
};

type VersionGroup = {
  name: string;
  url: string;
};

type VersionGroupDetails = {
  level_learned_at: number;
  move_learn_method: MoveLearnMethod;
  version_group: VersionGroup;
};

type MoveDetails = {
  name: string;
  url: string;
};

type Move = {
  move: MoveDetails;
  version_group_details: VersionGroupDetails[];
};

type Sprite = {
  back_default: string | null;
  back_female: string | null;
  back_shiny: string | null;
  back_shiny_female: string | null;
  front_default: string | null;
  front_female: string | null;
  front_shiny: string | null;
  front_shiny_female: string | null;
};

type Stat = {
  name: string;
  url: string;
};

type StatDetails = {
  stat: Stat;
  effort: number;
  base_stat: number;
};

type Type = {
  name: string;
  url: string;
};

type TypeDetails = {
  type: Type;
  slot: number;
};

type PokemonCardProps = {
  id: number;
  name: string;
  abilities: PokemonAbility[];
  base_experience: number;
  forms: Form[];
  height: number;
  weight: number;
  location_area_encounters: string;
  moves: Move[];
  sprites: Sprite;
  stats: StatDetails[];
  types: TypeDetails[];
  past_types: PokemonPastType[];
  held_items: PokemonHeldItem[];
  genera: Genus[];
  flavor_text_entries: FlavorText[];
};

export const PokemonCard: React.FC<PokemonCardProps> = (props) => {
  const { game } = useContext(GameContext);
  const spriteSize: number = 150;
  const name: string = convertKebabCaseToTitleCase(props.name);
  const versions = splitKebabCase(game);

  const pokemonGenus: string | undefined = props.genera
    ? props.genera.find((g: Genus) => {
        return g.language.name === "en";
      })?.genus
    : "";

  const flavorTextEntries = props.flavor_text_entries;
  const flavorTextForLanguage = flavorTextEntries.filter((entry) => {
    return entry.language.name === "en";
  });
  // If the currently selected version group is a single game then flavorTextForVersion will be defined
  const flavorTextForVersion = flavorTextForLanguage.find((text: any) => {
    return text.version.name === game;
  });
  // If the currently selected version group is a more than one game then flavorTextForVer
  const flavorTextForVersions = !flavorTextForVersion
    ? flavorTextForLanguage.filter((entry: any) => {
        return versions.includes(entry.version.name);
      })
    : null;

  return (
    <div className={`${styles.card}`}>
      <table className="w-full">
        <tbody>
          <tr>
            <td className="w-1/2 flex-col justify-center items-center">
              <div className="w-full flex justify-center">
                <DynamicImage
                  src={props.sprites.front_default}
                  width={spriteSize}
                  height={spriteSize}
                  alt={props.name}
                  priority={true}
                />
              </div>
              <div className="text-center">
                No.
                <span>&nbsp;&nbsp;</span>
                {props.id}
              </div>
            </td>
            <td className="w-1/2 flex-col justify-center items-center">
              <div className="mb-5">{name}</div>
              <div className="mb-5">{pokemonGenus}</div>
              <table className="w-full">
                <tbody>
                  <tr>
                    <td>HT</td>
                    <td>{convertHeightToCmOrM(props.height)}</td>
                  </tr>
                  <tr>
                    <td>WT</td>
                    <td>{convertWeightToGramsOrKg(props.weight)}</td>
                  </tr>
                </tbody>
              </table>
            </td>
          </tr>
          <tr>
            <td colSpan={2}>&nbsp;</td>
          </tr>
          <tr>
            <td colSpan={2} className="p-3">
              <div className="pokeball-box w-full">
                {flavorTextForVersion && (
                  <div>
                    <p className="leading-5">
                      {flavorTextForVersion.flavor_text}
                    </p>
                  </div>
                )}
                {flavorTextForVersions &&
                  flavorTextForVersions.map((text: any, i) => {
                    let desc: string = text.flavor_text;
                    return (
                      <div key={i}>
                        <p className={`${i !== 0 ? "mt-5" : ""} mb-5`}>
                          {text.version.name.toUpperCase()}
                        </p>
                        <p className="leading-5">{desc}</p>
                      </div>
                    );
                  })}
                <span className="pokeball top-left">
                  <span className="pokeball-upper"></span>
                </span>
                <span className="pokeball top-right">
                  <span className="pokeball-upper"></span>
                </span>
                <span className="pokeball bottom-left">
                  <span className="pokeball-upper"></span>
                </span>
                <span className="pokeball bottom-right">
                  <span className="pokeball-upper"></span>
                </span>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};
