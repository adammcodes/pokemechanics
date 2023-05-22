// react-query
import { useQuery } from 'react-query';
import useGameClient from './useGameClient';

export default function useGameVersion(gameUrl: string) {
  // reuse instance of GameClient from PokeApi
  const api: any = useGameClient(); 
  
  const versionId: number = Number(gameUrl.split("/").at(-2));

  const fetchGameVersion = async (id: number) => {
    return await api
      .getVersionGroupById(id)
      .then((data: any) => data)
      .catch((error: any) => error);
  };

  // Get selected game version by id
  const version = useQuery(
    ['version', versionId],
    () => fetchGameVersion(versionId)
  );

  return version;
};