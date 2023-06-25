import usePokemonClient from "../hooks/usePokemonClient";
import { useQuery } from "react-query";
import findSpritesForVersion from "../utils/findSpritesForVersion";

// Component that renders the pokemon sprite for the current generation
const PokemonSpriteForGen = ({
  pokemonId,
  game,
}: {
  pokemonId: string | undefined;
  game: string;
}) => {
  if (!pokemonId) return <p>Sprite not available</p>;

  // If there is no sprite for the current generation, use the official artwork
  let sprite = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemonId}.png`;

  // Use pokemonId to fetch the pokemon data for the pokemon using the PokemonClient
  // This will give us all the sprites for the pokemon
  const api = usePokemonClient();
  const fetchPokemon = (pokemonId: string) => {
    return api
      .getPokemonById(Number(pokemonId))
      .then((data) => data)
      .catch((err) => {
        throw err;
      });
  };

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
    () => fetchPokemon(pokemonId),
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

  // If the pokemon/species data is loading, return a loading message
  if (pokemonQuery.isLoading || pokemonSpeciesQuery.isLoading)
    return <div>Loading sprite...</div>;
  // If there is an error, return an error message
  if (pokemonQuery.isError || pokemonSpeciesQuery.isError)
    return <div>Error loading sprite</div>;

  if (pokemonQuery.data && pokemonSpeciesQuery.data) {
    // Figure out which version of the sprite to use based on the game region
    console.log(pokemonSpeciesQuery.data);

    // Render the pokemon sprite for the current generation
    const allSprites = pokemonQuery.data.sprites;
    // Use the sprite for the generation if it exists, otherwise use the default official artwork sprite
    sprite = findSpritesForVersion(allSprites, game).front_default ?? sprite;
  }

  const spriteSize = 80;
  const spriteAltText = `Pokemon sprite`;
  const spriteStyle = {
    width: `${spriteSize}px`,
    // height: `${spriteSize}px`,
  };

  return (
    <img
      // className="w-20 h-20"
      src={sprite}
      alt={spriteAltText}
      style={spriteStyle}
    />
  );
};

export default PokemonSpriteForGen;
