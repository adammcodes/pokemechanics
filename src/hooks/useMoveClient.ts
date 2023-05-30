import { MoveClient } from 'pokenode-ts';

export default function useMoveClient() {
  const api = new MoveClient();

  return api;
}