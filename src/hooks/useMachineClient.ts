import { MachineClient } from 'pokenode-ts';

export default function useMachineClient() {
  const api = new MachineClient();

  return api;
}