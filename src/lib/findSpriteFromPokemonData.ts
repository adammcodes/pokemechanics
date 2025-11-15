import getSpriteUrl from "@/constants/spriteUrlTemplates";
import { RestPokemon } from "../types";
import { romanToNumber } from "@/utils/romanToNumber";

export default function findSpriteFromPokemonData({
  pokemonData,
  generationName,
  versionGroup,
}: {
  pokemonData: RestPokemon | null;
  generationName: string; // e.g. "generation-i"
  versionGroup: string; // e.g. "red-blue"
}) {
  // unown-question ? sprite url
  let defaultSprite =
    "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/201-question.png";

  if (!pokemonData) {
    return defaultSprite;
  }

  const genNumber: string = generationName.split("-")[1] || "i";
  const generationId: number = romanToNumber(genNumber || "i");

  const spriteUrlFromTemplate = getSpriteUrl({
    versionGroup: versionGroup,
    pokemonId: pokemonData.id,
    generation: genNumber,
  });

  const spritesForGeneration =
    pokemonData.sprites.versions[
      generationName as keyof RestPokemon["sprites"]["versions"]
    ];

  if (!spritesForGeneration || generationId < 3 || generationId >= 9) {
    return spriteUrlFromTemplate;
  }

  const spritesForVersionGroup = spritesForGeneration[
    versionGroup as keyof typeof spritesForGeneration
  ] as { front_default: string | null };

  if (!spritesForVersionGroup) {
    return spriteUrlFromTemplate;
  }

  return spritesForVersionGroup.front_default ?? defaultSprite;
}
