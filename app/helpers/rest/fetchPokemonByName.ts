import { cache } from "react";
import { POKEAPI_REST_ENDPOINT } from "@/constants/apiConfig";
import { fetchWithRetry } from "@/utils/api";

// Wrap with React cache() to deduplicate requests during the same render pass
export const fetchPokemonByName = cache(async (name: string) => {
  // Try fetching by name first
  let response = await fetchWithRetry(
    `${POKEAPI_REST_ENDPOINT}/pokemon/${name}`,
    {
      headers: {
        Accept: "application/json",
        "User-Agent": "Pokemechanics/1.0",
      },
    }
  );

  // If 404, this Pokemon might have a form-suffixed name (e.g., "tornadus-incarnate")
  // Fetch the species to get the default variety name and retry
  if (response.status === 404) {
    try {
      const speciesResponse = await fetchWithRetry(
        `${POKEAPI_REST_ENDPOINT}/pokemon-species/${name}`,
        {
          headers: {
            Accept: "application/json",
            "User-Agent": "Pokemechanics/1.0",
          },
        }
      );

      if (speciesResponse.ok) {
        const speciesData = await speciesResponse.json();
        // Get the default variety's Pokemon name
        const defaultVariety = speciesData.varieties.find(
          (v: any) => v.is_default
        );

        if (defaultVariety) {
          const varietyName = defaultVariety.pokemon.name;
          // Retry with the variety name
          response = await fetchWithRetry(
            `${POKEAPI_REST_ENDPOINT}/pokemon/${varietyName}`,
            {
              headers: {
                Accept: "application/json",
                "User-Agent": "Pokemechanics/1.0",
              },
            }
          );
        }
      }
    } catch (error) {
      // If species fetch fails, continue with original 404 error
    }
  }

  if (!response.ok) {
    throw new Error(`Failed to fetch Pokemon data: ${response.status}`);
  }

  return response.json();
});
