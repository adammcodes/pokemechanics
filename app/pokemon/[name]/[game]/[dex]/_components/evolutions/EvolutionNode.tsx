import PokemonSpriteForGen from "../sprites/PokemonSpriteForGen";
import { SpeciesVariety } from "@/types/index";
import findVarietyForRegion from "@/lib/findVarietyForRegion";
import PokemonSpriteVariety from "../sprites/PokemonSpriteVariety";
import getSpriteUrl from "@/constants/spriteUrlTemplates";
import { fetchPokemonSpeciesById } from "@/app/helpers/rest/fetchPokemonSpeciesById";
import { POKEAPI_SPRITE_BASE_URL } from "@/constants/apiConfig";

const EvolutionNode = async ({
  pokemonDexNumber,
  dexName,
  game,
  regionName,
  generation,
  species,
}: {
  pokemonDexNumber: number;
  dexName: string;
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
  let pokemonVariantName: string | undefined;

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

    pokemonVariantName = pokemonVarietyForRegion?.pokemon.name;

    sprite = getSpriteUrl({
      versionGroup: game,
      pokemonId: pokemonVarietyId || pokemonDexNumber,
      generation: generation.split("-")[1],
    });
  }

  // If there is a pokemonVarietyId, use the PokemonSpriteById component to render the regional variant sprite
  if (pokemonVarietyId && pokemonVariantName) {
    return (
      <PokemonSpriteVariety
        pokemonName={pokemonVariantName}
        pokemonVarietyId={Number(pokemonVarietyId)}
        game={game}
        dexName={dexName}
      />
    );
  }

  return (
    <PokemonSpriteForGen
      pokemonName={species.name}
      sprite={sprite}
      game={game}
      dexName={dexName}
      speciesName={species.name}
    />
  );
};

export { EvolutionNode };
