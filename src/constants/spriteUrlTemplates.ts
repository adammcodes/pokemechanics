import { POKEAPI_SPRITE_BASE_URL } from "./apiConfig";

// Determine the correct template for sprite URLs based on the version group and generation string and pokemon id
interface SpriteUrlTemplate {
  versionGroup: string; // e.g. "red-blue", "gold-silver", "ruby-sapphire", "diamond-pearl", "black-white", "x-y", "omega-ruby-alpha-sapphire", "sun-moon", "sword-shield"
  generation: string; // e.g. "i", "ii", "iii", "iv", "v", "vi", "vii", "viii"
  pokemonId: number | string; // 1 or "1"
  version?: string;
}

export default function getSpriteUrl({
  versionGroup,
  generation,
  pokemonId,
  version,
}: SpriteUrlTemplate): string {
  // after sun-moon the sprite url template changes
  if (Number(pokemonId) >= 722)
    return `${POKEAPI_SPRITE_BASE_URL}/${pokemonId}.png`;

  let spriteUrlTemplate: string =
    `${POKEAPI_SPRITE_BASE_URL}/versions/generation-`;
  switch (versionGroup) {
    case "red-blue":
      spriteUrlTemplate += `${generation}/${versionGroup}/transparent/${pokemonId}.png`;
      break;
    case "yellow":
      spriteUrlTemplate += `${generation}/${versionGroup}/transparent/${pokemonId}.png`;
      break;
    case "gold-silver":
      spriteUrlTemplate += `${generation}/${
        version || "silver"
      }/transparent/${pokemonId}.png`;
      break;
    case "crystal":
      spriteUrlTemplate += `${generation}/${versionGroup}/transparent/${pokemonId}.png`;
      break;
    case "colosseum":
      spriteUrlTemplate += `v/black-white/${pokemonId}.png`;
      break;
    case "xd":
      spriteUrlTemplate += `v/black-white/${pokemonId}.png`;
      break;
    case "black-2-white-2":
      spriteUrlTemplate += `v/black-white/${pokemonId}.png`;
      break;
    case "omega-ruby-alpha-sapphire":
      spriteUrlTemplate += `vi/omegaruby-alphasapphire/${pokemonId}.png`;
      break;
    case "sun-moon":
      spriteUrlTemplate += `vii/ultra-sun-ultra-moon/${pokemonId}.png`;
      break;
    case "lets-go-pikachu-lets-go-eevee":
      return `${POKEAPI_SPRITE_BASE_URL}/${pokemonId}.png`;
    case "sword-shield":
      return `${POKEAPI_SPRITE_BASE_URL}/${pokemonId}.png`;
    case "the-isle-of-armor":
      return `${POKEAPI_SPRITE_BASE_URL}/${pokemonId}.png`;
    case "the-crown-tundra":
      return `${POKEAPI_SPRITE_BASE_URL}/${pokemonId}.png`;
    case "brilliant-diamond-and-shining-pearl":
      return `${POKEAPI_SPRITE_BASE_URL}/${pokemonId}.png`;
    case "legends-arceus":
      return `${POKEAPI_SPRITE_BASE_URL}/${pokemonId}.png`;
    case "scarlet-violet":
      return `${POKEAPI_SPRITE_BASE_URL}/${pokemonId}.png`;
    default:
      // This default template works with all games after crystal except for above cases
      spriteUrlTemplate += `${generation}/${versionGroup}/${pokemonId}.png`;
      break;
  }

  return spriteUrlTemplate;
}
