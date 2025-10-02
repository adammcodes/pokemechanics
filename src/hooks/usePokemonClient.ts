export default function usePokemonClient() {
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
