// poke-api
import { GameClient } from "pokenode-ts"; // import the GameClient that is auto-cached

export default function useGameClient() {
  // create a GameClient
  const api = new GameClient(); 

  return api;
};