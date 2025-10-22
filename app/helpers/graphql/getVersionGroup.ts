import { cache } from "react";
import { fetchFromGraphQL } from "@/utils/api";

type NamedAPIResource = {
  name: string;
  id: number;
};

export type VersionGroup = {
  id: number;
  name: string;
  order: number;
  versions: NamedAPIResource[];
  regions: NamedAPIResource[];
  generation: NamedAPIResource;
  pokedexes: NamedAPIResource[];
  error?: any;
};

// The reason we're using a raw string query is because this can be called from a server component
// and we're using the fetchFromGraphQL function which is a wrapper around the fetch API.
// The fetch API doesn't support Apollo Client's gql template literal.
const query = `
  query GetVersionGroup($name: String!) {
    versiongroup(where: {name: {_eq: $name}}) {
      id
      name
      order
      versions {
        name
        id
      }
      versiongroupregions {
        region {
          name
          id
        }
      }
      generation {
        name
      }
      pokedexversiongroups {
        pokedex {
          id
          name
        }
      }
    }
  }
`;

// Wrap with React cache() to deduplicate requests during the same render pass
// This prevents duplicate calls between generateMetadata() and page component
export const getVersionGroup = cache(async (gen: string): Promise<VersionGroup> => {
  try {
    const response = await fetchFromGraphQL({
      query,
      variables: { name: gen },
    });

    if (!response.data?.versiongroup?.[0]) {
      throw new Error(`Version group '${gen}' not found`);
    }

    const versionGroup = response.data.versiongroup[0];

    // Transform the GraphQL response to match the expected VersionGroup interface
    return {
      id: versionGroup.id,
      name: versionGroup.name,
      order: versionGroup.order,
      versions: versionGroup.versions.map((v: NamedAPIResource) => ({
        name: v.name,
        id: v.id,
      })),
      regions: versionGroup.versiongroupregions.map(
        (region: { region: NamedAPIResource }) => ({
          name: region.region.name,
          id: region.region.id,
        })
      ),
      generation: {
        name: versionGroup.generation.name,
        id: versionGroup.generation.id,
      },
      pokedexes: versionGroup.pokedexversiongroups.map(
        (pokedexVersionGroup: { pokedex: NamedAPIResource }) => ({
          name: pokedexVersionGroup.pokedex.name,
          id: pokedexVersionGroup.pokedex.id,
        })
      ),
    };
  } catch (error: any) {
    console.error("Error fetching version group:", error);
    return { error } as VersionGroup;
  }
});
