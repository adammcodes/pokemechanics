import { cache } from "react";
import { MAX_SPECIES_ID } from "@/constants/numOfPokemonByGen";
import { POKEAPI_REST_ENDPOINT } from "@/constants/apiConfig";
import { fetchWithRetry } from "@/utils/api";

// Wrap with React cache() to deduplicate requests during the same render pass
export const fetchPokemonSpeciesById = cache(async (id: number) => {
  if (id > MAX_SPECIES_ID) {
    throw new Error(
      `Pokemon species ID ${id} is greater than the maximum species ID`
    );
  }

  const response = await fetchWithRetry(
    `${POKEAPI_REST_ENDPOINT}/pokemon-species/${id}`,
    {
      headers: {
        Accept: "application/json",
        "User-Agent": "Pokemechanics/1.0",
      },
      // Cache Pokemon species for 7 days - this is static data
      next: { revalidate: 604800 },
    }
  );

  if (!response.ok) {
    throw new Error(`Failed to fetch Pokemon species data: ${response.status}`);
  }

  return response.json();
});
