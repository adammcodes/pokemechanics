// react-query
import { useQuery } from 'react-query';
import useGameClient from './useGameClient';

export default function useGameVersion(versionGroupName: string) {
  // reuse instance of GameClient from PokeApi
  const api: any = useGameClient();
  
  // const versionId: number = Number(gameUrl.split("/").at(-2));

  const fetchGameVersion = async (versionGroupName: string) => {
    return await api
      .getVersionGroupByName(versionGroupName)
      .then((data: any) => data)
      .catch((error: any) => error);
  };

  // Get selected game version by id
  const version = useQuery(
    ['version', versionGroupName],
    () => fetchGameVersion(versionGroupName),
    {
      refetchOnWindowFocus: false,
      enabled: Boolean(versionGroupName)
    }
  );

  return version;
};