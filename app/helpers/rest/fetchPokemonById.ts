export async function fetchPokemonById(id: number) {
  const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`, {
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
