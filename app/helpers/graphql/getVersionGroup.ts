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
    pokemon_v2_versiongroup(where: {name: {_eq: $name}}) {
      id
      name
      order
      pokemon_v2_versions {
        name
        id
      }
      pokemon_v2_versiongroupregions {
        pokemon_v2_region {
          name
          id
        }
      }
      pokemon_v2_generation {
        name
      }
      pokemon_v2_pokedexversiongroups {
        pokemon_v2_pokedex {
          id
          name
        }
      }
    }
  }
`;

// fetch the game version for the selected generation
export async function getVersionGroup(gen: string): Promise<VersionGroup> {
  try {
    const response = await fetchFromGraphQL(query, { name: gen });

    if (!response.data?.pokemon_v2_versiongroup?.[0]) {
      throw new Error(`Version group '${gen}' not found`);
    }

    const versionGroup = response.data.pokemon_v2_versiongroup[0];

    // Transform the GraphQL response to match the expected VersionGroup interface
    return {
      id: versionGroup.id,
      name: versionGroup.name,
      order: versionGroup.order,
      versions: versionGroup.pokemon_v2_versions.map((v: NamedAPIResource) => ({
        name: v.name,
        id: v.id,
      })),
      regions: versionGroup.pokemon_v2_versiongroupregions.map(
        (region: { pokemon_v2_region: NamedAPIResource }) => ({
          name: region.pokemon_v2_region.name,
          id: region.pokemon_v2_region.id,
        })
      ),
      generation: {
        name: versionGroup.pokemon_v2_generation.name,
        id: versionGroup.pokemon_v2_generation.id,
      },
      pokedexes: versionGroup.pokemon_v2_pokedexversiongroups.map(
        (pokedexVersionGroup: { pokemon_v2_pokedex: NamedAPIResource }) => ({
          name: pokedexVersionGroup.pokemon_v2_pokedex.name,
          id: pokedexVersionGroup.pokemon_v2_pokedex.id,
        })
      ),
    };
  } catch (error: any) {
    console.error("Error fetching version group:", error);
    return { error } as VersionGroup;
  }
}
