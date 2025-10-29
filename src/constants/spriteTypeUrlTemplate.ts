import { POKEAPI_TYPE_SPRITE_BASE_URL } from "./apiConfig";
import { romanToNumber } from "../utils/romanToNumber";

// The fairy type (type id 18) should only be requested from generation-vi onwards.
// Images exist from generation-iii onwards.
export default function getSpriteTypeUrl({
  type,
  generationString,
  versionGroup,
}: {
  type: number;
  generationString: string;
  versionGroup: string;
}): string | null {
  let validVersionGroups: string[] = [];
  // Add type guards to prevent invalid urls
  switch (generationString) {
    case "generation-iii":
      validVersionGroups = [
        "ruby-sapphire",
        "emerald",
        "firered-leafgreen",
        "colosseum",
        "xd",
      ];
      break;
    case "generation-iv":
      validVersionGroups = [
        "diamond-pearl",
        "platinum",
        "heartgold-soulsilver",
      ];
      break;
    case "generation-v":
      validVersionGroups = ["black-white", "black-2-white-2"];
      break;
    case "generation-vi":
      validVersionGroups = ["x-y", "omega-ruby-alpha-sapphire"];
      break;
    case "generation-vii":
      validVersionGroups = [
        "sun-moon",
        "ultra-sun-ultra-moon",
        "lets-go-pikachu-lets-go-eevee",
      ];
      break;
    case "generation-viii":
      validVersionGroups = [
        "brilliant-diamond-and-shining-pearl",
        "legends-arceus",
        "sword-shield",
        "the-isle-of-armor",
        "the-crown-tundra",
      ];
      break;
    case "generation-ix":
      validVersionGroups = [
        "scarlet-violet",
        "the-indigo-disk",
        "the-teal-mask",
        "legends-za",
      ];
      break;
    default:
      // return generation-iii/emerald url type urls for generation-i and generation-ii
      return `${POKEAPI_TYPE_SPRITE_BASE_URL}/generation-iii/emerald/${type}.png`;
  }

  if (!validVersionGroups.includes(versionGroup)) {
    console.warn(
      `Invalid version group: "${versionGroup}" for generation "${generationString}".\n
      Must be one of: ${validVersionGroups.join(", ")}.`
    );
    return null;
  }

  const genRomanNumeral: string = generationString.split("-")[1];
  const generationNumber: number = romanToNumber(genRomanNumeral);

  let validType = type;
  if (type === 18 && generationNumber < 6) {
    // Fairy type (type id 18) only exists from generation-vi onwards. Changing type id to 1 (Normal).
    validType = 1;
  }

  if (
    versionGroup === "the-isle-of-armor" ||
    versionGroup === "the-crown-tundra"
  ) {
    return `${POKEAPI_TYPE_SPRITE_BASE_URL}/generation-viii/sword-shield/${type}.png`;
  }

  let spriteTypeUrlTemplate: string = `${POKEAPI_TYPE_SPRITE_BASE_URL}/${generationString}/${versionGroup}/${validType}.png`;
  return spriteTypeUrlTemplate;
}
