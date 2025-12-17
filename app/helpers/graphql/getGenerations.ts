import { cache } from "react";
import { fetchFromGraphQL } from "@/utils/api";
import { EXCLUDED_VERSION_GROUPS } from "@/constants/excludedVersionGroups";

export type Generation = {
  id: number;
  name: string;
  versiongroups: VersionGroup[];
};

type VersionGroup = {
  id: number;
  name: string;
};

// Wrap with React cache() to deduplicate requests during the same render pass
// Generations are static data that rarely changes, so we cache for 7 days
export const getGenerations = cache(async (): Promise<Generation[]> => {
  const query = `
    query Gens {
      generation {
        id
        name
        versiongroups {
          id
          name
        }
      }
    }
  `;

  try {
    const { data } = await fetchFromGraphQL({
      query,
      // Cache version groups for 7 days - they never change
      next: { revalidate: 604800 },
    });

    return data.generation.map((generation: Generation) => {
      // Filter out excluded version groups
      const filteredVersionGroups = generation.versiongroups.filter(
        (vg) => !EXCLUDED_VERSION_GROUPS.includes(vg.name)
      );

      return {
        ...generation,
        versiongroups: filteredVersionGroups,
        url: `/pokedex/${generation.name}`,
      };
    });
  } catch (error) {
    console.error("Error fetching version groups:", error);
    throw error;
  }
});
