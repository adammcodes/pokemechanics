import { useQuery } from "@tanstack/react-query";
import { getVersionGroup } from "@/app/helpers/graphql/getVersionGroup";

export default function useGameVersion(versionGroupName: string) {
  const fetchGameVersion = async (versionGroupName: string) => {
    return await getVersionGroup(versionGroupName);
  };

  // Get selected game version by name e.g. "red-blue"
  const version = useQuery({
    queryKey: ["version", versionGroupName],
    queryFn: () => fetchGameVersion(versionGroupName),
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    enabled: Boolean(versionGroupName),
  });

  return version;
}
