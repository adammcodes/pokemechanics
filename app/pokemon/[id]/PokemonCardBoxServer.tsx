import { romanToNumber } from "@/utils/romanToNumber";
import convertHeightToCmOrM from "@/utils/convertHeightToCmOrM";
import spriteWidthBasedOnHeight from "@/utils/spriteWidthBasedOnHeight";
import convertWeightToGramsOrKg from "@/utils/convertWeightToGramsOrKg";
import { spriteSizesByVersion } from "@/constants/spriteSizesByVersion";
import getSpriteUrl from "@/constants/spriteUrlTemplates";
import DynamicImage from "@/components/common/DynamicImage";
import DualDynamicImages from "./DualDynamicImages";
import Types from "@/components/types/Types";
import { Genus, PokemonSprites, PokemonType } from "pokenode-ts";

type PokemonCardBoxServerProps = {
  name: string;
  pokemonId: number;
  is_variant: boolean;
  types: PokemonType[];
  sprites: PokemonSprites;
  height: number;
  weight: number;
  genNumber: string;
  game: string;
  genera: Genus[];
  nationalId: number;
};

const PokemonCardBoxServer: React.FC<PokemonCardBoxServerProps> = (props) => {
  const selectedGame = props.game || "red-blue";
  const generationIdString: string | undefined = props.genNumber; // e.g. "i", "ii", etc.
  const generationId: number = romanToNumber(generationIdString || "i");
  const spriteSize: number =
    selectedGame === "x-y"
      ? spriteWidthBasedOnHeight(props.height * 10)
      : spriteSizesByVersion[selectedGame];

  console.log("spriteSize", spriteSize);

  const pokemonGenus: string | undefined = props.genera
    ? props.genera.find((g: Genus) => {
        return g.language.name === "en";
      })?.genus
    : "";

  const pokemonName = props.name;

  return (
    <div
      className={`card__border w-full mx-auto p-3 flex flex-col justify-center items-center`}
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
              <div className="w-full flex justify-center p-3">
                {selectedGame === "gold-silver" && (
                  <DualDynamicImages
                    labelLeft={"Gold"}
                    labelRight={"Silver"}
                    srcLeft={getSpriteUrl({
                      versionGroup: selectedGame,
                      pokemonId: props.pokemonId,
                      generation: props.genNumber,
                      version: "gold",
                    })}
                    srcRight={getSpriteUrl({
                      versionGroup: selectedGame,
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
                {selectedGame !== "gold-silver" && (
                  <DynamicImage
                    game={selectedGame}
                    src={getSpriteUrl({
                      versionGroup: selectedGame,
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
              {props.nationalId}
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
    </div>
  );
};

export default PokemonCardBoxServer;
