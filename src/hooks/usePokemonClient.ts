import { PokemonClient } from 'pokenode-ts'; // import the PokemonClient

export default function usePokemonClient() {
  const api = new PokemonClient(); // create a PokemonClient

  return api;
}