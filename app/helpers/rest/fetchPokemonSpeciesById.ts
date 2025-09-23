import { MAX_SPECIES_ID } from "@/constants/numOfPokemonByGen";

export async function fetchPokemonSpeciesById(id: number) {
  if (id > MAX_SPECIES_ID) {
    throw new Error(
      `Pokemon species ID ${id} is greater than the maximum species ID`
    );
  }

  const response = await fetch(
    `https://pokeapi.co/api/v2/pokemon-species/${id}`,
    {
      headers: {
        Accept: "application/json",
        "User-Agent": "Pokemechanics/1.0",
      },
    }
  );

  if (!response.ok) {
    throw new Error(`Failed to fetch Pokemon species data: ${response.status}`);
  }

  return response.json();
}
