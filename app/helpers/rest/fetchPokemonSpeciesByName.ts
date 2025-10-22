import { POKEAPI_REST_ENDPOINT } from "@/constants/apiConfig";
import { fetchWithRetry } from "@/utils/api";

export async function fetchPokemonSpeciesByName(name: string) {
  const response = await fetchWithRetry(
    `${POKEAPI_REST_ENDPOINT}/pokemon-species/${name}`,
    {
      headers: {
        Accept: "application/json",
        "User-Agent": "Pokemechanics/1.0",
      },
    }
  );

  if (!response.ok) {
    throw new Error(`Failed to fetch Pokemon species data: ${response.status}`);
  }

  return response.json();
}
