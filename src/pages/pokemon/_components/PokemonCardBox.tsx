import { useContext } from "react";
import styles from "@/styles/PokemonCard.module.css";

import convertHeightToCmOrM from "@/utils/convertHeightToCmOrM";
import convertWeightToGramsOrKg from "@/utils/convertWeightToGramsOrKg";

import findSpritesForVersion from "@/lib/findSpritesForVersion";
import findSpritesForGoldSilver from "@/lib/findSpritesForGoldSilver";

import { spriteSizesByVersion } from "@/constants/spriteSizesByVersion";

import DynamicImage from "@/components/common/DynamicImage";
import DualDynamicImages from "./DualDynamicImages";
import PokemonTypes from "@/pages/pokemon/_components/PokemonTypes";

// types
import { Genus, PokemonSprites, PokemonType } from "pokenode-ts";

// context
import { GameContext, PokemonContext } from "@/context/_context";

type PokemonCardBoxProps = {
  name: string; // required
  is_variant: boolean;
  types: PokemonType[];
  sprites: PokemonSprites;
  height: number;
  weight: number;
};

const PokemonCardBox: React.FC<PokemonCardBoxProps> = (props) => {
  const p = useContext(PokemonContext);
  const { game } = useContext(GameContext);

  const spriteSize: number = spriteSizesByVersion[game];
  const pokemonGenus: string | undefined = p.genera
    ? p.genera.find((g: Genus) => {
        return g.language.name === "en";
      })?.genus
    : "";

  const pokemonSprites = findSpritesForVersion(props.sprites, game);
  const pokemonSpritesGoldSilver = findSpritesForGoldSilver(
    props.sprites,
    game
  );

  const pokemonName = props.name;

  return (
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
                    altLeft={`${pokemonName}-gold`}
                    altRight={`${pokemonName}-silver`}
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
                    alt={pokemonName || "Pokemon sprite"}
                    priority={true}
                  />
                )}
              </div>
              <div className="mx-auto w-24 flex flex-row justify-around items-center">
                <PokemonTypes types={props.types} />
              </div>
            </td>
            <td className="w-1/2 flex-col justify-center items-center pl-5">
              <div className="mb-5">{pokemonName}</div>
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
    </div>
  );
};

export default PokemonCardBox;
