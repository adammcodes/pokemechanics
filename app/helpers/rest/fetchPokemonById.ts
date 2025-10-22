import { POKEAPI_REST_ENDPOINT } from "@/constants/apiConfig";
import { fetchWithRetry } from "@/utils/api";

export async function fetchPokemonById(id: number) {
  const response = await fetchWithRetry(
    `${POKEAPI_REST_ENDPOINT}/pokemon/${id}`,
    {
      headers: {
        Accept: "application/json",
        "User-Agent": "Pokemechanics/1.0",
      },
    }
  );

  if (!response.ok) {
    throw new Error(`Failed to fetch Pokemon data: ${response.status}`);
  }

  return response.json();
}
