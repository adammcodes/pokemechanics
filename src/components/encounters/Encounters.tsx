import convertKebabCaseToTitleCase from "@/utils/convertKebabCaseToTitleCase";
import { useQuery, gql } from "@apollo/client";
import VersionChip from "@/components/common/VersionChip";
import { groupEncountersByLocation } from "./groupEncountersByLocation";

const GetPokemonLocationsForVersion = gql`
  query GetPokemonLocationsForVersion(
    $version: String!
    $pokemonSpeciesId: Int!
  ) {
    pokemon_v2_version(where: { name: { _eq: $version } }) {
      name
      pokemon_v2_versiongroup {
        name
        pokemon_v2_generation {
          name
          pokemon_v2_versiongroups {
            name
            pokemon_v2_versions {
              name
            }
          }
        }
      }
    }
    pokemon_v2_encounter(
      where: {
        pokemon_v2_version: { name: { _eq: $version } }
        pokemon_v2_pokemon: { pokemon_species_id: { _eq: $pokemonSpeciesId } }
      }
    ) {
      id
      version_id
      location_area_id
      min_level
      max_level
      pokemon_id
      encounter_slot_id
      pokemon_v2_locationarea {
        name
        location_id
        pokemon_v2_location {
          name
          id
          region_id
          pokemon_v2_region {
            name
          }
        }
      }
      pokemon_v2_encounterslot {
        rarity
        slot
        version_group_id
      }
      pokemon_v2_pokemon {
        pokemon_species_id
        id
        name
      }
      pokemon_v2_encounterconditionvaluemaps {
        encounter_condition_value_id
        pokemon_v2_encounterconditionvalue {
          name
          is_default
          pokemon_v2_encountercondition {
            name
            id
          }
        }
      }
    }
  }
`;

type EncountersProps = {
  version: string; // e.g. "ruby"
  pokemonSpeciesId: number; // national dex number
};

type PokemonV2LocationArea = {
  name: string;
  location_id: number;
  pokemon_v2_location: {
    name: string; // e.g. "kanto-route-24"
    id: number;
    region_id: number;
    pokemon_v2_region: {
      name: string;
    };
  };
};

type PokemonV2EncounterSlot = {
  rarity: number;
  slot: number | null;
  version_group_id: number;
};

type PokemonV2 = {
  pokemon_species_id: number;
  id: number;
  name: string;
};

type EncounterConditionalValue = {
  encounter_condition_value_id: number;
  pokemon_v2_encounterconditionvalue: {
    name: string;
    is_default: boolean;
    pokemon_v2_encountercondition: {
      name: string;
      id: number;
    };
  };
};

export type Encounter = {
  id: number;
  version_id: number;
  location_area_id: number;
  min_level: number;
  max_level: number;
  pokemon_id: number;
  encounter_slot_id: number;
  pokemon_v2_locationarea: PokemonV2LocationArea;
  pokemon_v2_encounterslot: PokemonV2EncounterSlot;
  pokemon_v2_pokemon: PokemonV2;
  pokemon_v2_encounterconditionvaluemaps: EncounterConditionalValue[];
};

type Version = {
  name: string;
  pokemon_v2_versiongroup: {
    name: string;
    pokemon_v2_generation: {
      name: string;
      pokemon_v2_versiongroups: {
        name: string;
        pokemon_v2_versions: {
          __typename: string;
          name: string;
        }[];
      }[];
    };
  };
};

type EncountersData = {
  pokemon_v2_version: Version[];
  pokemon_v2_encounter: Encounter[];
};

const Encounters: React.FC<EncountersProps> = ({
  version,
  pokemonSpeciesId,
}) => {
  const formatName = convertKebabCaseToTitleCase;
  const { loading, error, data } = useQuery(GetPokemonLocationsForVersion, {
    variables: {
      version: version.toLowerCase(),
      pokemonSpeciesId,
    },
  });

  if (loading) return null;
  if (error) {
    console.error(error);
    return null;
  }

  if (!data) return null;

  console.log(data);

  const { pokemon_v2_encounter, pokemon_v2_version } = data as EncountersData;

  const locationEncounters = groupEncountersByLocation(pokemon_v2_encounter);

  const versionName = formatName(version);

  const versionGroups =
    pokemon_v2_version[0].pokemon_v2_versiongroup.pokemon_v2_generation
      .pokemon_v2_versiongroups;

  const otherVersionsInGroups = versionGroups
    .flatMap((group) => {
      return group.pokemon_v2_versions.map((version) => version.name);
    })
    .filter((v) => v !== version);

  console.log(otherVersionsInGroups);

  return (
    <>
      <VersionChip versionName={version} />
      {locationEncounters.length === 0 && (
        <p className="text-xl">
          Trade from{" "}
          {otherVersionsInGroups.map((v) => formatName(v)).join(", ")}.
        </p>
      )}

      {locationEncounters.length > 0 &&
        locationEncounters.map((location) => (
          <div key={location.locationName}>
            <h3 className="text-2xl border-b-2">
              {formatName(location.locationName)}:
            </h3>
            <p className="text-xl leading-[1em]">
              Min. Level: {location.minLevel}
            </p>
            <p className="text-xl leading-[1em]">
              Max. Level: {location.maxLevel}
            </p>
            <p className="text-xl leading-[1em]">
              Rate: {location.encounterRate}%
            </p>
          </div>
        ))}
    </>
  );
};

export default Encounters;
