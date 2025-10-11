import PokemonSpriteForGen from "../sprites/PokemonSpriteForGen";
import { SpeciesVariety } from "@/types/index";
import findVarietyForRegion from "@/lib/findVarietyForRegion";
import PokemonSpriteVariety from "../sprites/PokemonSpriteVariety";
import getSpriteUrl from "@/constants/spriteUrlTemplates";
import { fetchPokemonSpeciesById } from "@/app/helpers/rest/fetchPokemonSpeciesById";
import { POKEAPI_SPRITE_BASE_URL } from "@/constants/apiConfig";

const EvolutionNode = async ({
  pokemonDexNumber,
  dexId,
  game,
  regionName,
  generation,
  species,
}: {
  pokemonDexNumber: number;
  dexId: number;
  game: string;
  regionName: string;
  generation: string;
  species: { name: string; url: string };
}) => {
  // If there is no pokemonId, return a message
  if (!pokemonDexNumber) return <p>Sprite not available</p>;
  const pokemonSpecies = await fetchPokemonSpeciesById(
    Number(pokemonDexNumber)
  );

  // Initialize the pokemonVarietyId
  let pokemonVarietyId: number | undefined;

  // If there is no sprite for the current generation, use the official artwork
  let sprite = `${POKEAPI_SPRITE_BASE_URL}/other/official-artwork/${pokemonDexNumber}.png`;

  const varieties = pokemonSpecies.varieties;

  if (pokemonSpecies && varieties) {
    // Figure out which version of the sprite to use based on the game region
    const pokemonVarietyForRegion: SpeciesVariety | undefined =
      findVarietyForRegion(varieties, regionName);

    // If there is a matching pokemon variety for this game region, use that pokemon variety's id
    pokemonVarietyId = Number(
      pokemonVarietyForRegion?.pokemon.url.split("/").at(-2)
    );

    sprite = getSpriteUrl({
      versionGroup: game,
      pokemonId: pokemonVarietyId || pokemonDexNumber,
      generation: generation.split("-")[1],
    });
  }

  // If there is a pokemonVarietyId, use the PokemonSpriteById component to render the regional variant sprite
  if (pokemonVarietyId) {
    return (
      <PokemonSpriteVariety
        pokemonId={pokemonDexNumber}
        pokemonVarietyId={Number(pokemonVarietyId)}
        game={game}
        dexId={dexId}
      />
    );
  }

  return (
    <PokemonSpriteForGen
      pokemonId={pokemonDexNumber.toString()}
      sprite={sprite}
      game={game}
      dexId={dexId}
      speciesName={species.name}
    />
  );
};

export { EvolutionNode };
