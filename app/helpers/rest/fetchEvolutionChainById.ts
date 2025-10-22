import { POKEAPI_REST_ENDPOINT } from "@/constants/apiConfig";
import { fetchWithRetry } from "@/utils/api";

export async function fetchEvolutionChainById(id: number) {
  const response = await fetchWithRetry(
    `${POKEAPI_REST_ENDPOINT}/evolution-chain/${id}`,
    {
      headers: {
        Accept: "application/json",
        "User-Agent": "Pokemechanics/1.0",
      },
    }
  );

  if (!response.ok) {
    throw new Error(`Failed to fetch evolution chain data: ${response.status}`);
  }

  return response.json();
}
