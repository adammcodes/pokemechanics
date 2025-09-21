export async function fetchEvolutionChainById(id: number) {
  const response = await fetch(
    `https://pokeapi.co/api/v2/evolution-chain/${id}`,
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
