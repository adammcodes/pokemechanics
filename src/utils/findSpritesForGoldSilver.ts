import { PokemonSprites } from "pokenode-ts";

type GoldSilverSprites = {
  gold: PokemonSprites,
  silver: PokemonSprites,
  front_default: string;
}

function findSpritesForGoldSilver(sprites: PokemonSprites, version: string): GoldSilverSprites | undefined {
  const spriteGens = Object.values(sprites.versions);
  const spritesForVersion = spriteGens.find(gen => {
    const genVersions = Object.keys(gen);
    const splitVersionOne = version.split("-")[0];
    const splitVersionTwo = version.split("-")[1];
    return genVersions.includes(version) || genVersions.includes(splitVersionOne) || genVersions.includes(splitVersionTwo);
  });

  if (!spritesForVersion) return undefined;

  // You need to show both sprites if it is gold-silver because they are different in this gen
  return {
    "gold": spritesForVersion["gold"],
    "silver": spritesForVersion["silver"],
    "front_default": spritesForVersion["silver"]
  }
};
export default findSpritesForGoldSilver;