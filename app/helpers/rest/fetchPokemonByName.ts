import { POKEAPI_REST_ENDPOINT } from "@/constants/apiConfig";

export async function fetchPokemonByName(name: string) {
  const response = await fetch(`${POKEAPI_REST_ENDPOINT}/pokemon/${name}`, {
    headers: {
      Accept: "application/json",
      "User-Agent": "Pokemechanics/1.0",
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch Pokemon data: ${response.status}`);
  }

  return response.json();
}
