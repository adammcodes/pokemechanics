import { useRouter } from "next/router";
import { useQuery } from "react-query";
import usePokemonClient from "../../src/hooks/usePokemonClient";
import { PokemonCard } from "../../src/components/PokemonCard";

export default function Pokemon() {
  const router = useRouter();
  // Access the dynamic route parameter value, which is the pokemon name
  const { slug } = router.query as { slug: string };

  const pokemonName: string = slug;

  const fetchPokemonByName = (name: string) => {
    const api = usePokemonClient();
    return api
      .getPokemonByName(name)
      .then((data) => data)
      .catch((err) => err);
  };

  const pokemonQuery = useQuery(
    ["pokemon", slug],
    () => fetchPokemonByName(pokemonName),
    {
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      enabled: Boolean(pokemonName),
    }
  );

  const fetchPokemonSpeciesByName = (name: string) => {
    const api = usePokemonClient();
    return api
      .getPokemonSpeciesByName(name)
      .then((data) => data)
      .catch((err) => err);
  };

  const pokemonSpeciesQuery = useQuery(
    ["pokemonSpecies", slug],
    () => fetchPokemonSpeciesByName(pokemonName),
    {
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      enabled: Boolean(pokemonName),
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
