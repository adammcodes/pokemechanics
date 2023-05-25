import { PokemonSprites } from "pokenode-ts";

function findSpritesForVersion(sprites: PokemonSprites, version: string): PokemonSprites {
  const spriteGens = Object.values(sprites.versions);
  const spritesForVersion = spriteGens.find(gen => {
    const genVersions = Object.keys(gen);
    const splitVersionOne = version.split("-")[0];
    const splitVersionTwo = version.split("-")[1];
    return genVersions.includes(version) || genVersions.includes(splitVersionOne) || genVersions.includes(splitVersionTwo);
  });

  return spritesForVersion ? spritesForVersion[version] : sprites;
};
export default findSpritesForVersion;