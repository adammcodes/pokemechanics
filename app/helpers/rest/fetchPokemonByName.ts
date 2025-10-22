import { cache } from "react";
import { POKEAPI_REST_ENDPOINT } from "@/constants/apiConfig";
import { fetchWithRetry } from "@/utils/api";

// Wrap with React cache() to deduplicate requests during the same render pass
export const fetchPokemonByName = cache(async (name: string) => {
  const response = await fetchWithRetry(
    `${POKEAPI_REST_ENDPOINT}/pokemon/${name}`,
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
});
