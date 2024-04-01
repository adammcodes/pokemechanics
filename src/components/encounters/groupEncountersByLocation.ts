import { Encounter } from "./Encounters";

type LocationEncounter = {
  locationName: string;
  minLevel: number;
  maxLevel: number;
  encounterRate: number;
};

export const groupEncountersByLocation = (encounters: Encounter[]) => {
  let locationEncounters: LocationEncounter[] = [];

  // For each encounter, group by unique location name with encounter rate summed and min/max levels for each location
  encounters.forEach((encounter) => {
    const locationName =
      encounter.pokemon_v2_locationarea.pokemon_v2_location.name;
    const existingLocation = locationEncounters.find(
      (location) => location.locationName === locationName
    );
    const encounterRate = encounter.pokemon_v2_encounterslot.rarity;
    const minLevel = encounter.min_level;
    const maxLevel = encounter.max_level;

    if (existingLocation) {
      // increment the encounter rate for the existing location
      existingLocation.encounterRate += encounterRate;
      // update the min/max levels for the existing location
      if (minLevel < existingLocation.minLevel) {
        existingLocation.minLevel = minLevel;
      }
      if (maxLevel > existingLocation.maxLevel) {
        existingLocation.maxLevel = maxLevel;
      }
    } else {
      locationEncounters.push({
        locationName,
        minLevel,
        maxLevel,
        encounterRate,
      });
    }
  });

  return locationEncounters;
};
