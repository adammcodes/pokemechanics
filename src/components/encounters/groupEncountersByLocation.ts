import {
  EncounterDetails,
  LocationAreaEncounters,
} from "@/app/pokemon/[id]/LocationsForVersionGroupServer";
import { Encounter } from "./Encounters";

type LocationEncounter = {
  locationAreaName: string;
  locationName: string;
  minLevel: number;
  maxLevel: number;
  encounterRate: number;
  encounterMethods: EncounterDetails[];
};

export const groupEncountersByLocation = (
  encounters: Encounter[],
  locationAreaEncounters: LocationAreaEncounters[],
  version: string
) => {
  let locationAreas: LocationEncounter[] = [];

  // For each encounter, group by unique location name with encounter rate summed and min/max levels for each location
  encounters.forEach((encounter) => {
    const locationAreaName = encounter.pokemon_v2_locationarea.name;
    const locationName =
      encounter.pokemon_v2_locationarea.pokemon_v2_location.name;
    const existingLocationArea = locationAreas.find(
      (location) => location.locationAreaName === locationAreaName
    );

    const encounterRate = encounter.pokemon_v2_encounterslot.rarity;
    const minLevel = encounter.min_level;
    const maxLevel = encounter.max_level;
    const encounterMethods = locationAreaEncounters
      .find((location) => location.location_area.name === locationAreaName)
      ?.version_details.find(
        (versionDetails) => versionDetails.version.name === version
      )?.encounter_details;

    if (existingLocationArea) {
      // increment the encounter rate for the existing location
      existingLocationArea.encounterRate += encounterRate;
      // update the min/max levels for the existing location
      if (minLevel < existingLocationArea.minLevel) {
        existingLocationArea.minLevel = minLevel;
      }
      if (maxLevel > existingLocationArea.maxLevel) {
        existingLocationArea.maxLevel = maxLevel;
      }
    } else {
      locationAreas.push({
        locationAreaName,
        locationName,
        minLevel,
        maxLevel,
        encounterRate,
        encounterMethods: encounterMethods ?? [],
      });
    }
  });

  return locationAreas;
};
