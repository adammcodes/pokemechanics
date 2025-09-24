import { Pokedex } from "@/types/index";

export async function fetchPokedexById(id: number): Promise<Pokedex> {
  const response = await fetch(`https://pokeapi.co/api/v2/pokedex/${id}`, {
    headers: {
      Accept: "application/json",
      "User-Agent": "Pokemechanics/1.0",
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch Pokedex data: ${response.status}`);
  }

  return response.json();
}
