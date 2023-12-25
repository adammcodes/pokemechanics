import usePokemonClient from "../../hooks/usePokemonClient";
import { useQuery } from "react-query";
import useGameVersion from "../../hooks/useGameVersion";
import findSpritesForVersion from "../../lib/findSpritesForVersion";
import findVarietyForRegion from "../../lib/findVarietyForRegion";
import { PokemonSpeciesVariety } from "pokenode-ts";
import PokemonSpriteById from "./PokemonSpriteById";

// Component that renders the pokemon sprite for the current generation
const PokemonSpriteForGen = ({
  pokemonId,
  game,
}: {
  pokemonId: string | undefined;
  game: string;
}) => {
  // If there is no pokemonId, return a message
  if (!pokemonId) return <p>Sprite not available</p>;
  // Set the sprite size, alt text, and style
  const spriteSize = 80;
  const spriteAltText = `Pokemon sprite`;
  const spriteStyle = {
    width: `${spriteSize}px`,
  };
  // Get the current game version
  const version = useGameVersion(game);
  // Initialize the pokemonVarietyId
  let pokemonVarietyId: number | undefined;
  // Use officialSpriteById to get the official artwork sprite
  const officialSpriteById = (id: number | string) =>
    `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`;

  // If there is no sprite for the current generation, use the official artwork
  let sprite = officialSpriteById(pokemonId);

  // Use pokemonId to fetch the pokemon data for the pokemon using the PokemonClient
  // This will give us all the sprites for the pokemon
  const api = usePokemonClient();
  const fetchPokemon = (pokemonId: number) => {
    return api
      .getPokemonById(Number(pokemonId))
      .then((data) => data)
      .catch((err) => {
        throw err;
      });
  };

  // Get the pokemon species data for the pokemon using the PokemonClient, this will give us all varieties for the pokemon
  const fetchPokemonSpecies = (pokemonId: string) => {
    return api
      .getPokemonSpeciesById(Number(pokemonId))
      .then((data) => data)
      .catch((err) => {
        throw err;
      });
  };

  // Use react-query to fetch the pokemon data
  const pokemonQuery = useQuery(
    ["pokemonEvolutionSprite", pokemonId],
    () => fetchPokemon(Number(pokemonId)),
    {
      enabled: Boolean(pokemonId),
      refetchOnMount: false,
      refetchOnWindowFocus: false,
    }
  );

  // Use react-query to fetch the pokemon species data
  const pokemonSpeciesQuery = useQuery(
    ["pokemonSpeciesEvolutionSprite", pokemonId],
    () => fetchPokemonSpecies(pokemonId),
    {
      enabled: Boolean(pokemonId),
      refetchOnMount: false,
      refetchOnWindowFocus: false,
    }
  );

  const regions = version.data.regions;
  const varieties = pokemonSpeciesQuery.data?.varieties;

  // If the pokemon/species data is loading, return a loading message
  if (pokemonQuery.isLoading || pokemonSpeciesQuery.isLoading)
    return <div>Loading sprite...</div>;
  // If there is an error, return an error message
  if (pokemonQuery.isError || pokemonSpeciesQuery.isError)
    return <div>Error loading sprite</div>;

  if (
    pokemonQuery.data &&
    pokemonSpeciesQuery.data &&
    version.data &&
    varieties
  ) {
    // Figure out which version of the sprite to use based on the game region
    const pokemonVarietyForRegion: PokemonSpeciesVariety | undefined =
      findVarietyForRegion(varieties, regions);
    // If there is a matching pokemon variety for this game region, use that pokemon variety's id
    pokemonVarietyId = Number(
      pokemonVarietyForRegion?.pokemon.url.split("/").at(-2)
    );

    // Render the pokemon sprite for the current generation
    const allSprites = pokemonQuery.data.sprites;
    // Use the sprite for the generation if it exists, otherwise use the default official artwork sprite
    sprite = findSpritesForVersion(allSprites, game).front_default ?? sprite;
  }

  // If there is a pokemonVarietyId, use the PokemonSpriteById component to render the regional variant sprite
  if (pokemonVarietyId) {
    return <PokemonSpriteById pokemonId={pokemonVarietyId} game={game} />;
  }

  // Otherwise, return the sprite
  return <img src={sprite} alt={spriteAltText} style={spriteStyle} />;
};

export default PokemonSpriteForGen;
