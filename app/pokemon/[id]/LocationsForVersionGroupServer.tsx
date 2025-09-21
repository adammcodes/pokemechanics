import Encounters from "@/components/encounters/Encounters";
import Box from "@/components/common/Box";

type LocationsForVersionGroupServerProps = {
  versions: string[]; // e.g. ["red", "blue"]
  pokemonSpeciesId: number; // national dex number
  evolutionData: any;
};

const LocationsForVersionGroupServer: React.FC<
  LocationsForVersionGroupServerProps
> = ({ versions, pokemonSpeciesId, evolutionData }) => {
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
            evolutionData={evolutionData}
          />
        ))}
    </Box>
  );
};

export default LocationsForVersionGroupServer;
