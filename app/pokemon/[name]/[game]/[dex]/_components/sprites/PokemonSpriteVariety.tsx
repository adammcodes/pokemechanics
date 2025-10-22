import findSpritesForVersion from "@/lib/findSpritesForVersion";
import { PokemonSprite } from "./PokemonSprite";
import splitKebabCase from "@/utils/splitKebabCase";
import toTitleCase from "@/utils/toTitleCase";
import { fetchPokemonById } from "@/app/helpers/rest/fetchPokemonById";
import { POKEAPI_SPRITE_BASE_URL } from "@/constants/apiConfig";

// Component that renders the pokemon sprite for the current generation
const PokemonSpriteVariety = async ({
  pokemonName,
  pokemonVarietyId,
  game,
  dexName,
}: {
  pokemonName: string | undefined;
  pokemonVarietyId: number;
  game: string;
  dexName: string;
}) => {
  // Early return for missing pokemonName
  if (!pokemonName) {
    return (
      <div className="flex flex-col items-center p-4">
        <p className="text-gray-500">Sprite not available</p>
      </div>
    );
  }

  // Default to official artwork sprite
  let sprite = `${POKEAPI_SPRITE_BASE_URL}/other/official-artwork/${pokemonVarietyId}.png`;
  let speciesName = "Unknown";
  let regionTitle = "";

  try {
    // Fetch Pokemon data using the existing helper function
    const pokemonData = await fetchPokemonById(Number(pokemonVarietyId));

    if (pokemonData?.sprites) {
      // Use the sprite for the generation if it exists, otherwise use the default official artwork sprite
      const versionSprites = findSpritesForVersion(pokemonData.sprites, game);
      sprite = versionSprites?.front_default ?? sprite;
    }

    // Extract species name and region from Pokemon name
    if (pokemonData?.name) {
      const [extractedSpeciesName, extractedRegionName] = splitKebabCase(
        pokemonData.name
      );
      speciesName = extractedSpeciesName || "Unknown";
      regionTitle = extractedRegionName ? toTitleCase(extractedRegionName) : "";
    }
  } catch (error) {
    console.error("Error in PokemonSpriteVariety:", error);

    // Return error UI instead of crashing
    return (
      <div className="flex flex-col items-center p-4">
        <div className="bg-gray-200 rounded-lg flex items-center justify-center mb-2 px-4">
          <span className="text-gray-500 text-sm">Error loading sprite</span>
        </div>
        <p className="text-gray-500 text-sm">Failed to load Pokemon data</p>
      </div>
    );
  }

  return (
    <PokemonSprite
      pokemonName={pokemonName}
      dexName={dexName}
      game={game}
      speciesName={
        regionTitle ? `${speciesName} (${regionTitle})` : speciesName
      }
      sprite={sprite}
    />
  );
};

export default PokemonSpriteVariety;
