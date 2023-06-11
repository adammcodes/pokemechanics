import { EvolutionClient } from "pokenode-ts";

export default function useEvolutionClient() {
  const api = new EvolutionClient();

  return api;
}