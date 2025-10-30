import PokemonSpriteForGen from "../sprites/PokemonSpriteForGen";
// import { SpeciesVariety } from "@/types/index";
// import findVarietyForRegion from "@/lib/findVarietyForRegion";
import getSpriteUrl from "@/constants/spriteUrlTemplates";
// import { fetchPokemonSpeciesById } from "@/app/helpers/rest/fetchPokemonSpeciesById";
import { Pokemon } from "@/types/index";

const EvolutionNode = async ({
  pokemonDexNumber,
  // pagePokemonData,
  dexName,
  game,
  // regionName,
  generation,
  species,
}: {
  pokemonDexNumber: number;
  pagePokemonData: Pokemon;
  dexName: string;
  game: string;
  regionName: string;
  generation: string;
  species: { name: string; url: string };
}) => {
  // If there is no pokemonId, return a message
  if (!pokemonDexNumber) return <p>Sprite not available</p>;
  // let nodeSpeciesData = null;

  // const pagePokemonSprite = pagePokemonData.sprites.front_default;
  // const pagePokemonSpeciesId =
  //   pagePokemonData.species.url.split("/").at(-2) ?? "";
  // const pagePokemonIsVariant = !pagePokemonData.is_default;
  // const pagePokemonNameContainsRegion = pagePokemonData.name.includes(
  //   regionName.toLowerCase()
  // );

  // // If this evolution node is the same as the page pokemon, use the page pokemon sprite
  // if (pokemonDexNumber.toString() === pagePokemonSpeciesId) {
  //   return (
  //     <PokemonSpriteForGen
  //       pokemonName={species.name}
  //       sprite={pagePokemonSprite}
  //       game={game}
  //       dexName={dexName}
  //       speciesName={species.name}
  //     />
  //   );
  // }

  // Default sprite for the node species
  let sprite = getSpriteUrl({
    versionGroup: game,
    pokemonId: pokemonDexNumber,
    generation: generation.split("-")[1],
  });

  // This node is not the page pokemon, and it is a variant, so fetch the species data
  // if (
  //   pagePokemonIsVariant &&
  //   pagePokemonNameContainsRegion &&
  //   pokemonDexNumber.toString() !== pagePokemonSpeciesId
  // ) {
  //   nodeSpeciesData = await fetchPokemonSpeciesById(Number(pokemonDexNumber));
  // }

  // // Initialize the pokemonVarietyId
  // let nodeSpeciesId: number | undefined;
  // let nodeSpeciesName: string | undefined;
  // const varieties = nodeSpeciesData?.varieties;

  // if (nodeSpeciesData && varieties) {
  //   // Figure out which version of the sprite to use based on the game region
  //   const pokemonVarietyForRegion: SpeciesVariety | undefined =
  //     findVarietyForRegion(varieties, regionName);

  //   // If there is a matching pokemon variety for this game region, use that pokemon variety's id
  //   nodeSpeciesId = Number(
  //     pokemonVarietyForRegion?.pokemon.url.split("/").at(-2)
  //   );

  //   nodeSpeciesName = pokemonVarietyForRegion?.pokemon.name;

  //   sprite = getSpriteUrl({
  //     versionGroup: game,
  //     pokemonId: nodeSpeciesId || pokemonDexNumber,
  //     generation: generation.split("-")[1],
  //   });
  // }

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
