import styles from "../../styles/PokemonCard.module.css";
import DynamicImage from "./DynamicImage";
import convertKebabCaseToTitleCase from "../utils/convertKebabCaseToTitleCase";
import convertHeightToCmOrM from "../utils/convertHeightToCmOrM";
import convertWeightToGramsOrKg from "../utils/convertWeightToGramsOrKg";
import { Genus, Language, PokemonAbility, Version } from "pokenode-ts";
import { useContext } from "react";
import { GameContext } from "../context/_context";

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

type VersionDetails = {
  rarity: number;
  version: Version;
};

type Item = {
  name: string;
  url: string;
};

type ItemDetails = {
  item: Item;
  version_details: VersionDetails;
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

type flavorTextForPokemon = {
  flavor_text: string;
  language: Language;
  version: Version;
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
  past_types: TypeDetails[];
  held_items: ItemDetails[];
  genera: Genus[];
  flavor_text_entries: flavorTextForPokemon[];
};

export const PokemonCard: React.FC<PokemonCardProps> = (props) => {
  const { game } = useContext(GameContext);
  const spriteSize: number = 150;
  const name: string = convertKebabCaseToTitleCase(props.name);

  const pokemonGenus: string | undefined = props.genera
    ? props.genera.find((g: Genus) => {
        return g.language.name === "en";
      })?.genus
    : "";

  console.log(game);
  // filter callback for getting flavour text from game versions that are included in the selected game version(s)
  //const filterByVersions =

  const flavorTextEntries = props.flavor_text_entries;
  const flavorTextForLanguage = flavorTextEntries.filter((entry) => {
    return entry.language.name === "en";
  });
  // If the currently selected version group is a single game then flavorTextForVersion will be defined
  const flavorTextForVersion = flavorTextForLanguage.find((text) => {
    return text.version.name === game;
  });
  // If the currently selected version group is a more than one game then flavorTextForVer
  const flavorTextForVersions = !flavorTextForVersion ? "" : [];

  console.log(flavorTextForVersion);
  console.log(flavorTextForVersions);

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
              <div className="text-center text-sm">
                No.
                <span>&nbsp;&nbsp;</span>
                {props.id}
              </div>
            </td>
            <td className="w-1/2 flex-col justify-center items-center">
              <div className="mb-5">{name}</div>
              <div className="mb-5 text-sm">{pokemonGenus}</div>
              <table className="w-full">
                <tbody>
                  <tr>
                    <td className="text-sm">HT</td>
                    <td className="text-sm">
                      {convertHeightToCmOrM(props.height)}
                    </td>
                  </tr>
                  <tr>
                    <td className="text-sm">WT</td>
                    <td className="text-sm">
                      {convertWeightToGramsOrKg(props.weight)}
                    </td>
                  </tr>
                </tbody>
              </table>
            </td>
          </tr>
          <tr>
            <td></td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};
