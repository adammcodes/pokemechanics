import { useRouter } from "next/router";
import { useQuery } from "react-query";
import usePokemonClient from "../../src/hooks/usePokemonClient";
import { PokemonCard } from "../../src/components/PokemonCard";

export default function Pokemon() {
  const router = useRouter();
  // Access the dynamic route parameter value, which is the pokemon name
  const { id } = router.query as { id: number | string };

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

  return (
    <main className="w-full">
      {pokemonQuery.isLoading ||
        (pokemonSpeciesQuery.isLoading && "Loading...")}
      {pokemonQuery.data && pokemonSpeciesQuery.data && (
        <>
          <PokemonCard {...pokemonQuery.data} {...pokemonSpeciesQuery.data} />
        </>
      )}
    </main>
  );
}
