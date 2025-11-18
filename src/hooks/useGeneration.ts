import { useQuery } from "@tanstack/react-query";
import { getGenerationVersions } from "@/app/helpers/graphql/getGenerationVersions";

export default function useGeneration(genName: string) {
  const fetchGeneration = async (genName: string) => {
    return await getGenerationVersions(genName);
  };

  // Get selected game version by name e.g. "red-blue"
  const generation = useQuery({
    queryKey: ["generation", genName],
    queryFn: () => fetchGeneration(genName),
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    enabled: Boolean(genName),
  });

  return generation;
}
