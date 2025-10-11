import { POKEAPI_SPRITE_BASE_URL } from "./apiConfig";

// Determine the correct template for sprite URLs based on the version group and generation string and pokemon id
interface SpriteIconUrlTemplate {
  versionGroup: string; // e.g. "red-blue", "gold-silver", "ruby-sapphire", "diamond-pearl", "black-white", "x-y", "omega-ruby-alpha-sapphire", "sun-moon", "sword-shield"
  generation: string; // e.g. "generation-i", "generation-ii", "generation-iii", "generation-iv", "generation-v", "generation-vi", "generation-vii", "generation-viii"
  pokemonId: number | string; // 1 or "1"
  version?: string;
}

export default function getSpriteIconUrl({
  versionGroup,
  generation,
  pokemonId,
  version,
}: SpriteIconUrlTemplate): string {
  // after sun-moon the sprite url template changes
  if (Number(pokemonId) >= 722)
    return `${POKEAPI_SPRITE_BASE_URL}/${pokemonId}.png`;

  let spriteUrlTemplate: string = `${POKEAPI_SPRITE_BASE_URL}/versions/generation-vii/icons/${pokemonId}.png`;

  return spriteUrlTemplate;
}
