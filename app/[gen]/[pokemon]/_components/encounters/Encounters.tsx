import convertKebabCaseToTitleCase from "@/utils/convertKebabCaseToTitleCase";
import toTitleCase from "@/utils/toTitleCase";
import VersionChip from "@/components/common/VersionChip";
import Tooltip from "@/components/common/Tooltip";
import { GraphQLEncounter } from "@/types/graphql";
import { groupGraphQLEncountersByLocation } from "./groupGraphQLEncountersByLocation";
import { PokemonSpecies } from "@/types/index";

type EncountersNewProps = {
  version: string; // e.g. "ruby"
  encounters: GraphQLEncounter[]; // Pre-fetched GraphQL encounters
  speciesData: PokemonSpecies;
};

/**
 * Server component that displays Pokemon encounters for a specific version
 * Uses pre-fetched GraphQL encounter data from getPokemonComplete query
 */
const EncountersNew: React.FC<EncountersNewProps> = ({
  version,
  encounters,
  speciesData,
}) => {
  const formatName = convertKebabCaseToTitleCase;

  // Group encounters by location for this version
  const locationEncounters = groupGraphQLEncountersByLocation(
    encounters,
    version.toLowerCase()
  );

  // Get other versions in the same generation that have encounters for this Pokemon
  const otherVersionsWithEncounters = getOtherVersionsWithEncounters(
    encounters,
    version
  );

  // Deduplicate encounter methods by name
  const dedupeEncounterMethods = (methods: { methodName: string }[]) => {
    return methods.filter(
      (method, index, self) =>
        index === self.findIndex((t) => t.methodName === method.methodName)
    );
  };

  const isMythical = speciesData.is_mythical;
  const evolvesFromSpecies = speciesData.evolves_from_species;
  const isBaby = speciesData.is_baby;

  return (
    <>
      <VersionChip versionName={version} />

      {/* Show message when no encounters exist */}
      {locationEncounters.length === 0 && (
        <p className="text-base leading-none">
          {otherVersionsWithEncounters.length > 0 &&
            `Trade from ${otherVersionsWithEncounters
              .map((v) => formatName(v))
              .join(", ")}`}
          {evolvesFromSpecies &&
            otherVersionsWithEncounters.length === 0 &&
            `Evolve ${formatName(evolvesFromSpecies.name)}`}
          {isBaby && `Breed from evolved species`}
          {isMythical && `Event Only`}
          {!evolvesFromSpecies &&
            !isBaby &&
            !isMythical &&
            otherVersionsWithEncounters.length === 0 &&
            `Not available in this version`}
        </p>
      )}

      {/* Display location encounters with tooltips */}
      <div className="flex flex-wrap">
        {locationEncounters.length > 0 &&
          locationEncounters.map((location, i, arr) => (
            <div
              className="inline-block cursor-pointer mr-1"
              style={{ lineHeight: "10px" }}
              key={`${location.locationName}-${i}`}
            >
              <Tooltip
                label={
                  <div className="flex flex-col gap-1">
                    <p>Min. Level: {location.minLevel}</p>
                    <p>Max. Level: {location.maxLevel}</p>
                    <p>Rate: {location.encounterRate}%</p>
                    <p>
                      Method:{" "}
                      {dedupeEncounterMethods(location.encounterMethods)
                        .map((method) => toTitleCase(method.methodName))
                        .join(", ")}
                    </p>
                  </div>
                }
              >
                <span className="text-base leading-none">
                  {formatName(location.locationName)}
                  {i === arr.length - 1 ? `.` : `, `}
                </span>
              </Tooltip>
            </div>
          ))}
      </div>
    </>
  );
};

/**
 * Helper function to get other versions that have encounters for this Pokemon
 */
function getOtherVersionsWithEncounters(
  encounters: GraphQLEncounter[],
  currentVersion: string
): string[] {
  const versions = new Set<string>();

  encounters.forEach((encounter) => {
    const versionName = encounter.version.name;
    if (versionName !== currentVersion.toLowerCase()) {
      versions.add(versionName);
    }
  });

  return Array.from(versions);
}

export default EncountersNew;
