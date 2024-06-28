"use client";
import { useContext } from "react";

import convertHeightToCmOrM from "@/utils/convertHeightToCmOrM";
import convertWeightToGramsOrKg from "@/utils/convertWeightToGramsOrKg";

import { spriteSizesByVersion } from "@/constants/spriteSizesByVersion";
import getSpriteUrl from "@/constants/spriteUrlTemplates";

import DynamicImage from "@/components/common/DynamicImage";
import DualDynamicImages from "./DualDynamicImages";
import Types from "@/components/types/Types";

// types
import { Genus, PokemonSprites, PokemonType } from "pokenode-ts";

// context
import { GameContext, PokemonContext } from "@/context/_context";
import useGameVersion from "@/hooks/useGameVersion";

// styles
// import PokeballSpans from "@/components/common/PokeballSpans";
import styles from "./PokemonCard.module.css";

type PokemonCardBoxProps = {
  name: string; // required
  pokemonId: number;
  is_variant: boolean;
  types: PokemonType[];
  sprites: PokemonSprites;
  height: number;
  weight: number;
  genNumber: string;
};

const PokemonCardBox: React.FC<PokemonCardBoxProps> = (props) => {
  const p = useContext(PokemonContext);
  const { game } = useContext(GameContext);
  const versionGroup = useGameVersion(game);
  const generationIdString: string | undefined =
    versionGroup.data?.generation.url.split("/")[6]; // e.g. url = "https://pokeapi.co/api/v2/generation/1/", generationId = 1
  const generationId: number = parseInt(generationIdString || "1");

  const spriteSize: number = spriteSizesByVersion[game];
  const pokemonGenus: string | undefined = p.genera
    ? p.genera.find((g: Genus) => {
        return g.language.name === "en";
      })?.genus
    : "";

  const pokemonName = props.name;

  return (
    <div
      className={`${styles.card__border} w-full mx-auto lg:max-w-[400px] p-[0.5em] flex flex-col justify-center items-center`}
    >
      <table className="w-full table-auto">
        <tbody>
          <tr>
            <td className="w-full text-center font-bold" colSpan={3}>
              <div className="text-2xl leading-[24px]">
                {pokemonName.split(" ")[0]}
                {pokemonName.split(" ")[1] && (
                  <span className="text-xl mb-5 leading-[24px]">
                    &nbsp;{pokemonName.split(" ")[1]}
                  </span>
                )}
              </div>
            </td>
          </tr>
          <tr>
            <td colSpan={3}>
              <div className="w-full flex justify-center">
                {game === "gold-silver" && (
                  <DualDynamicImages
                    labelLeft={"Gold"}
                    labelRight={"Silver"}
                    srcLeft={getSpriteUrl({
                      versionGroup: game,
                      pokemonId: props.pokemonId,
                      generation: props.genNumber,
                      version: "gold",
                    })}
                    srcRight={getSpriteUrl({
                      versionGroup: game,
                      pokemonId: props.pokemonId,
                      generation: props.genNumber,
                      version: "silver",
                    })}
                    altLeft={`${pokemonName}-gold`}
                    altRight={`${pokemonName}-silver`}
                    width={150}
                    height={150}
                    priority={true}
                  />
                )}
                {game !== "gold-silver" && (
                  <DynamicImage
                    src={getSpriteUrl({
                      versionGroup: game,
                      pokemonId: props.pokemonId,
                      generation: props.genNumber,
                    })}
                    width={spriteSize}
                    height={spriteSize}
                    alt={pokemonName || "Pokemon sprite"}
                    priority={true}
                  />
                )}
              </div>
              <div className="mx-auto flex justify-around items-center mb-2">
                <Types
                  generationId={generationId}
                  pokemonId={props.pokemonId}
                />
              </div>
            </td>
          </tr>
          <tr className="flex flex-col md:flex-row lg:flex items-center justify-center w-full">
            <td className="w-full lg:w-1/3 text-center flex justify-center items-center lg:justify-start items-center">
              <div>{pokemonGenus}</div>
            </td>
            <td className="w-full lg:w-1/3 text-center flex justify-center items-center">              
              No.
              <span>&nbsp;</span>
              {p.id}
            </td>
            <td className="w-full lg:w-1/3 text-center flex justify-center lg:justify-end items-center">
              <table className="w-[100px]">
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
        </tbody>
      </table>
      {/* <PokeballSpans /> */}
    </div>
  );
};

export default PokemonCardBox;
