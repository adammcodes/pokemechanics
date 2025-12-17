import { GraphQLEncounter } from "@/types/graphql";

export type LocationEncounter = {
  locationAreaName: string;
  locationName: string;
  minLevel: number;
  maxLevel: number;
  encounterRate: number;
  encounterMethods: {
    methodName: string;
  }[];
};

/**
 * Groups GraphQL encounters by location area
 * Aggregates encounter rates and calculates min/max levels per location
 *
 * @param encounters - Array of GraphQL encounters from getPokemonComplete query
 * @param version - Version name to filter encounters (e.g., "red", "blue")
 * @returns Array of location encounters with aggregated data
 */
export const groupGraphQLEncountersByLocation = (
  encounters: GraphQLEncounter[],
  version: string
): LocationEncounter[] => {
  let locationAreas: LocationEncounter[] = [];

  // Filter encounters for the specific version
  const encountersForVersion = encounters.filter(
    (encounter) => encounter.version.name === version
  );

  // For each encounter, group by unique location name with encounter rate summed and min/max levels
  encountersForVersion.forEach((encounter) => {
    // Skip encounters without location data
    if (!encounter.locationarea) return;

    const locationAreaName = encounter.locationarea.name;
    const locationName = encounter.locationarea.location.name;
    const existingLocationArea = locationAreas.find(
      (location) => location.locationAreaName === locationAreaName
    );

    const encounterRate = encounter.encounterslot.rarity;
    const minLevel = encounter.min_level;
    const maxLevel = encounter.max_level;
    const methodName = encounter.encounterslot.encountermethod.name;

    if (existingLocationArea) {
      // Update the min/max levels for the existing location
      if (minLevel < existingLocationArea.minLevel) {
        existingLocationArea.minLevel = minLevel;
      }
      if (maxLevel > existingLocationArea.maxLevel) {
        existingLocationArea.maxLevel = maxLevel;
      }

      // Add encounter method if not already present
      if (
        !existingLocationArea.encounterMethods.some(
          (method) => method.methodName === methodName
        )
      ) {
        existingLocationArea.encounterMethods.push({ methodName });
      }
    } else {
      locationAreas.push({
        locationAreaName,
        locationName,
        minLevel,
        maxLevel,
        encounterRate,
        encounterMethods: [{ methodName }],
      });
    }
  });

  return locationAreas;
};
