// hooks
import { useRouter } from "next/router";
import { useQuery } from "react-query";
import usePokemonClient from "../../src/hooks/usePokemonClient";
import { useContext } from "react";
import { GameContext } from "../../src/context/_context";
import useGameVersion from "../../src/hooks/useGameVersion";
// Components
import Pokedexes from "../../src/components/Pokedexes";
import { PokemonVariety } from "../../src/components/PokemonVariety";
import { PokemonContextProvider } from "../../src/context/PokemonContextProvider";
import { PokedexContextProvider } from "../../src/context/PokedexContextProvider";

export default function Pokemon() {
  const router = useRouter();
  // Access the dynamic route parameter value, which is the pokemon id and dexId
  const { id, dexId } = router.query as { id: string; dexId: string };
  // Check the game the user has selected
  const { game } = useContext(GameContext);
  const version = useGameVersion(game);

  const pokemonId: number = Number(id);

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

  const error: boolean =
    pokemonSpeciesQuery.isError || pokemonQuery.isError || version.isError;

  return (
    <main className="w-full">
      <Pokedexes />
      {error && !dexId && "An error occurred..."}
      {loading && "Loading species..."}
      {pokemonQuery.data &&
        pokemonSpeciesQuery.data &&
        version.data &&
        dexId && (
          <PokedexContextProvider dexId={Number(dexId)}>
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
          </PokedexContextProvider>
        )}
    </main>
  );
}
