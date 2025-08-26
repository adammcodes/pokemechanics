// poke-api
// import { PokemonClient } from 'pokenode-ts'; // import the PokemonClient

export default function usePokemonClient() {
  // create a PokemonClient
  // const api = new PokemonClient();

  const api = {
    getPokemonById: async (id: number) => {
      const response = await fetch(`/api/rest?endpoint=pokemon&id=${id}`);
      if (!response.ok) {
        throw new Error("Failed to fetch Pokemon data");
      }
      return response.json();
    },

    getPokemonSpeciesById: async (id: number) => {
      const response = await fetch(
        `/api/rest?endpoint=pokemon-species&id=${id}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch Pokemon species data");
      }
      return response.json();
    },
  };

  return api;
}
