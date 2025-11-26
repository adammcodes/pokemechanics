import Encounters from "./Encounters";
import Box from "@/components/common/Box";
import { GraphQLEncounter } from "@/types/graphql";
import { PokemonSpecies } from "@/types/index";

type LocationsForVersionGroupProps = {
  speciesData: PokemonSpecies;
  versions: string[]; // e.g. ["red", "blue"]
  encounters: GraphQLEncounter[]; // Pre-fetched GraphQL encounters
};

/**
 * Server component that displays Pokemon encounters for each version in a version group
 * Uses pre-fetched GraphQL encounter data from getPokemonComplete query
 */
const LocationsForVersionGroup: React.FC<
  LocationsForVersionGroupProps
> = async ({ speciesData, versions, encounters }) => {
  return (
    <Box headingText="Encounters:">
      {versions.map((version) => (
        <Encounters
          key={version}
          version={version}
          encounters={encounters}
          speciesData={speciesData}
        />
      ))}
    </Box>
  );
};

export default LocationsForVersionGroup;
