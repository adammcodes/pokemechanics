import { Pokedex } from "@/types/index";
import { POKEAPI_REST_ENDPOINT } from "@/constants/apiConfig";
import { fetchWithRetry } from "@/utils/api";

export async function fetchPokedexByName(name: string): Promise<Pokedex> {
  const response = await fetchWithRetry(
    `${POKEAPI_REST_ENDPOINT}/pokedex/${name}`,
    {
      headers: {
        Accept: "application/json",
        "User-Agent": "Pokemechanics/1.0",
      },
    }
  );

  if (!response.ok) {
    throw new Error(`Failed to fetch Pokedex data: ${response.status}`);
  }

  return response.json();
}
