"use client";
// hooks
import { useContext } from "react";
import { useSearchParams } from "next/navigation";
import { useQuery } from "react-query";
import usePokemonClient from "@/hooks/usePokemonClient";
import useGameVersion from "@/hooks/useGameVersion";
import { GameContext } from "@/context/_context";
import { PokemonContextProvider } from "@/context/PokemonContextProvider";
import { PokedexContextProvider } from "@/context/PokedexContextProvider";
// Components
// import Pokedexes from "app/pokedex/Pokedexes";
import PokemonVariety from "app/pokemon/[id]/PokemonVariety";

export default function Pokemon({ params }: { params: any }) {
  // Access the dynamic route parameter value, which is the pokemon id and dexId
  // const { id, dexId } = router.query as { id: string; dexId: string };
  const { id } = params as { id: string };
  const searchParams = useSearchParams();
  // Get the 'dexId' query parameter
  const dexId = searchParams.get("dexId");

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
      {/* <Pokedexes /> */}
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
