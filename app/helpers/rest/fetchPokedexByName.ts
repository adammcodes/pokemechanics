import { cache } from "react";
import { Pokedex } from "@/types/index";
import { POKEAPI_REST_ENDPOINT } from "@/constants/apiConfig";
import { fetchWithRetry } from "@/utils/api";

// Wrap with React cache() to deduplicate requests during the same render pass
export const fetchPokedexByName = cache(async (name: string): Promise<Pokedex> => {
  const response = await fetchWithRetry(
    `${POKEAPI_REST_ENDPOINT}/pokedex/${name}`,
    {
      headers: {
        Accept: "application/json",
        "User-Agent": "Pokemechanics/1.0",
      },
      // Cache Pokedex data for 7 days - this is static data
      next: { revalidate: 604800 },
    }
  );

  if (!response.ok) {
    throw new Error(`Failed to fetch Pokedex data: ${response.status}`);
  }

  return response.json();
});
