import { useRouter } from "next/router";
import { useQuery } from "react-query";
import usePokemonClient from "../../src/hooks/usePokemonClient";
import { useContext } from "react";
import { GameContext } from "../../src/context/_context";
import useGameVersion from "../../src/hooks/useGameVersion";
import { PokemonVariety } from "../../src/components/PokemonVariety";
import { PokemonContextProvider } from "../../src/context/PokemonContextProvider";

export default function Pokemon() {
  const router = useRouter();
  // Access the dynamic route parameter value, which is the pokemon name
  const { id } = router.query as { id: number | string };
  // Check the game the user has selected
  const { game } = useContext(GameContext);
  const version = useGameVersion(game);

  const pokemonId: number | string = Number(id);

  const fetchPokemonById = (id: number) => {
    const api = usePokemonClient();
    return api
      .getPokemonById(id)
      .then((data) => data)
      .catch((err) => {
        throw err;
      });
  };

  const pokemonQuery = useQuery(
    ["pokemon", pokemonId],
    () => fetchPokemonById(pokemonId),
    {
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      enabled: Boolean(pokemonId),
    }
  );

  const fetchPokemonSpeciesById = (id: number) => {
    const api = usePokemonClient();
    return api
      .getPokemonSpeciesById(id)
      .then((data) => data)
      .catch((err) => {
        throw err;
      });
  };

  const pokemonSpeciesQuery = useQuery(
    ["pokemonSpecies", pokemonId],
    () => fetchPokemonSpeciesById(pokemonId),
    {
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      enabled: Boolean(pokemonId),
    }
  );

  const loading: boolean =
    pokemonSpeciesQuery.isLoading ||
    pokemonQuery.isLoading ||
    version.isLoading;

  const error =
    pokemonSpeciesQuery.isError || pokemonQuery.isError || version.isError;

  return (
    <main className="w-full">
      {error && "An error occurred..."}
      {loading && "Loading species..."}
      {pokemonQuery.data && pokemonSpeciesQuery.data && version.data && (
        <PokemonContextProvider
          pokemonData={pokemonQuery.data}
          speciesData={pokemonSpeciesQuery.data}
          versionData={version.data}
        >
          <PokemonVariety
            regions={version.data.regions}
            name={pokemonSpeciesQuery.data.name}
            varieties={pokemonSpeciesQuery.data.varieties}
          />
        </PokemonContextProvider>
      )}
    </main>
  );
}
