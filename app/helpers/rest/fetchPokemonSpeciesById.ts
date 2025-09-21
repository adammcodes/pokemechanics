export async function fetchPokemonSpeciesById(id: number) {
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
