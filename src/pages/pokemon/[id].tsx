// hooks
import { useContext } from "react";
import { useRouter } from "next/router";
import { useQuery } from "react-query";
import usePokemonClient from "@/hooks/usePokemonClient";
import useGameVersion from "@/hooks/useGameVersion";
// Components
import Pokedexes from "@/pages/pokedex/components/Pokedexes";
import PokemonVariety from "@/pages/pokemon/components/PokemonVariety";
import { GameContext } from "@/context/_context";
import { PokemonContextProvider } from "@/context/PokemonContextProvider";
import { PokedexContextProvider } from "@/context/PokedexContextProvider";

export default function Pokemon() {
  const router = useRouter();
  // Access the dynamic route parameter value, which is the pokemon id and dexId
  const { id, dexId } = router.query as { id: string; dexId: string };

  // Check the game the user has selected
  const { game } = useContext(GameContext);
  const version = useGameVersion(game);

  const pokemonId: number = Number(id);

  const fetchPokemonById = async (id: number) => {
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

  const fetchPokemonSpeciesById = async (id: number) => {
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

  return (
    <main className="w-full">
      <Pokedexes />
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
