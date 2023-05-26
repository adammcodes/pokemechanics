// react-query
import { useQuery } from 'react-query';
import useGameClient from './useGameClient';

export default function useVersionGroups() {
  // create a GameClient
  const api: any = useGameClient();

  const fetchGenerations = async () => {
    return await api
      .listVersionGroups(0, 25) // right now supporting up to scarlet-violet
      .then((data: any) => {
        return data.results
      })
      .catch((error: any) => error);
  };

  // Get list of version groups from poke-api
  const gens = useQuery(
    'gens',
    () => fetchGenerations(),
    {
      refetchOnWindowFocus: false,
    }
  );

  return gens;
};