import Encounters from "./Encounters";
import Box from "@/components/common/Box";

type LocationsForVersionGroupProps = {
  versions: string[]; // e.g. ["red", "blue"]
  pokemonSpeciesId: number; // national dex number
  evolutionData: any;
  locationAreaEncountersUrl: string;
};

export type LocationAreaEncounters = {
  location_area: {
    name: string;
    url: string;
  };
  version_details: VersionDetails[];
};

export type VersionDetails = {
  encounter_details: EncounterDetails[];
  max_chance: number;
  version: { name: string; url: string };
};

export type EncounterDetails = {
  chance: number;
  condition_values: any[];
  max_level: number;
  method: {
    name: string;
    url: string;
  };
  min_level: number;
};

const fetchLocationAreaEncounters = async (url: string) => {
  const response = await fetch(url);
  return response.json();
};

const LocationsForVersionGroup: React.FC<
  LocationsForVersionGroupProps
> = async ({
  versions,
  pokemonSpeciesId,
  evolutionData,
  locationAreaEncountersUrl,
}) => {
  const locationAreaEncounters = await fetchLocationAreaEncounters(
    locationAreaEncountersUrl
  );
  if (!evolutionData) return <div className="p-5">Loading...</div>;

  return (
    <Box headingText="Encounters:">
      {evolutionData &&
        versions.length &&
        versions.map((version) => (
          <Encounters
            key={version}
            version={version}
            pokemonSpeciesId={pokemonSpeciesId}
            locationAreaEncounters={locationAreaEncounters}
            evolutionData={evolutionData}
          />
        ))}
    </Box>
  );
};

export default LocationsForVersionGroup;
