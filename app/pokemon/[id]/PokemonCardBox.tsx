"use client";
import { useContext } from "react";
// import PokeballSpans from "@/components/common/PokeballSpans";
import styles from "@/styles/PokemonCard.module.css";

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
      className={`${styles.card__border} w-full mx-auto lg:max-w-[825px] p-[1em] flex flex-col justify-center items-center`}
    >
      <table className="w-full">
        <tbody>
          <tr>
            <td className="w-1/2">
              <div className="w-full flex justify-center p-2">
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
              <div className="mx-auto flex justify-around items-center">
                <Types
                  generationId={generationId}
                  pokemonId={props.pokemonId}
                />
              </div>
            </td>
            <td className="w-1/2 flex-col justify-center items-center pl-5">
              <div className="text-2xl leading-[24px] mb-5">
                {pokemonName.split(" ")[0]}
                {pokemonName.split(" ")[1] && (
                  <span className="text-xl mb-5 leading-[24px]">
                    <br />
                    {pokemonName.split(" ")[1]}
                  </span>
                )}
              </div>
              <div className="mb-5">{pokemonGenus}</div>
              <div className="mb-5">
                No.
                <span>&nbsp;&nbsp;</span>
                {p.id}
              </div>
              <table className="w-1/2">
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
