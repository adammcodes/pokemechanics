"use client";
import Encounters from "./Encounters";
import { useContext } from "react";
import { EvolutionContext } from "@/context/_context";
import Box from "@/components/common/Box";

type LocationsForVersionGroupProps = {
  versions: string[]; // e.g. ["red", "blue"]
  pokemonSpeciesId: number; // national dex number
};

const LocationsForVersionGroup: React.FC<LocationsForVersionGroupProps> = ({
  versions,
  pokemonSpeciesId,
}) => {
  const e = useContext(EvolutionContext);

  if (e.isLoading) return <div className="p-5">Loading...</div>;

  return (
    <Box headingText="Encounters:">
      {e.data &&
        versions.length &&
        versions.map((version) => (
          <Encounters
            key={version}
            version={version}
            pokemonSpeciesId={pokemonSpeciesId}
            evolutionData={e.data}
          />
        ))}
    </Box>
  );
};

export default LocationsForVersionGroup;
