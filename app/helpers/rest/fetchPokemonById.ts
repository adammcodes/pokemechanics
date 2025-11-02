import { cache } from "react";
import { POKEAPI_REST_ENDPOINT } from "@/constants/apiConfig";
import { fetchWithRetry } from "@/utils/api";

// Wrap with React cache() to deduplicate requests during the same render pass
export const fetchPokemonById = cache(async (id: number) => {
  const response = await fetchWithRetry(
    `${POKEAPI_REST_ENDPOINT}/pokemon/${id}`,
    {
      headers: {
        Accept: "application/json",
        "User-Agent": "Pokemechanics/1.0",
      },
      // Cache Pokemon data for 7 days - this is static data
      next: { revalidate: 604800 },
    }
  );

  if (!response.ok) {
    throw new Error(`Failed to fetch Pokemon data: ${response.status}`);
  }

  return response.json();
});
