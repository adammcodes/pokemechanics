import styles from "../../styles/PokemonCard.module.css";
// hooks
import { useContext } from "react";
import { GameContext, PokemonContext } from "../context/_context";
// components
import DynamicImage from "./DynamicImage";
import {
  Genus,
  PokemonAbility,
  NamedAPIResource,
  PokemonSprites,
} from "pokenode-ts";
// utils
import convertKebabCaseToTitleCase from "../utils/convertKebabCaseToTitleCase";
import convertHeightToCmOrM from "../utils/convertHeightToCmOrM";
import convertWeightToGramsOrKg from "../utils/convertWeightToGramsOrKg";
import splitKebabCase from "../utils/splitKebabCase";
import PokeballSpans from "./PokeballSpans";

type PokemonCardVariantProps = {
  id: number;
  name: string;
  base_experience: number;
  height: number;
  is_default: boolean;
  order: number;
  weight: number;
  abilities: PokemonAbility[];
  forms: NamedAPIResource[];
  sprites: PokemonSprites;
};

export const PokemonCardVariant: React.FC<PokemonCardVariantProps> = (
  props
) => {
  // props has all the variant specific data
  // p from PokemonContext has all the other generic species data
  const { game } = useContext(GameContext);
  const p = useContext(PokemonContext);

  const spriteSize: number = 150;
  const name: string = convertKebabCaseToTitleCase(p.name);
  const versions = splitKebabCase(game);

  // Get the pokemon genus, "The type of pokemon it is" e.g. Articuno is a "Freeze Pokemon"
  const pokemonGenus: string | undefined = p.genera
    ? p.genera.find((g: Genus) => {
        return g.language.name === "en";
      })?.genus
    : "";

  // Get the right flavor text for the version selected
  const flavorTextEntries = p.flavor_text_entries;
  const flavorTextForLanguage = flavorTextEntries.filter((entry: any) => {
    return entry.language.name === "en";
  });
  // If the currently selected version group is a single game then flavorTextForVersion will be defined
  const flavorTextForVersion = flavorTextForLanguage.find((text: any) => {
    return text.version.name === game;
  });
  // If the currently selected version group is a more than one game then flavorTextForVersions will have both
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
                {p.id}
              </div>
            </td>
            <td className="w-1/2 flex-col justify-center items-center">
              <div className="mb-5">
                {name} ({convertKebabCaseToTitleCase(props.name.split("-")[1])})
              </div>
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
                  flavorTextForVersions.map((text: any, i: number) => {
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
                <PokeballSpans />
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};
