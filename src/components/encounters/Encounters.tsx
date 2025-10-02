"use client";
import convertKebabCaseToTitleCase from "@/utils/convertKebabCaseToTitleCase";
import { useQuery, gql } from "@apollo/client";
import VersionChip from "@/components/common/VersionChip";
import { groupEncountersByLocation } from "./groupEncountersByLocation";
import Tooltip from "@/components/common/Tooltip";
import {
  LocationAreaEncounters,
  VersionDetails,
  EncounterDetails,
} from "@/app/pokemon/[id]/LocationsForVersionGroupServer";
import toTitleCase from "@/utils/toTitleCase";

const GetPokemonLocationsForVersion = gql`
  query GetPokemonLocationsForVersion(
    $version: String!
    $pokemonSpeciesId: Int!
    $evolutionChainId: Int!
  ) {
    pokemon_v2_version(where: { name: { _eq: $version } }) {
      name
      pokemon_v2_versiongroup {
        id
        name
        pokemon_v2_generation {
          id
          name
          pokemon_v2_versiongroups {
            name
            generation_id
            pokemon_v2_versions {
              name
              version_group_id
              pokemon_v2_encounters(
                where: {
                  pokemon_v2_pokemon: {
                    pokemon_species_id: { _eq: $pokemonSpeciesId }
                  }
                }
              ) {
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
              }
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
    pokemon_v2_evolutionchain(where: { id: { _eq: $evolutionChainId } }) {
      id
      baby_trigger_item_id
      pokemon_v2_item {
        name
      }
      pokemon_v2_pokemonspecies {
        id
        name
        evolves_from_species_id
        generation_id
        is_baby
        is_legendary
        is_mythical
      }
    }
  }
`;

type EncountersProps = {
  version: string; // e.g. "ruby"
  pokemonSpeciesId: number; // national dex number
  evolutionData: any;
  locationAreaEncounters: LocationAreaEncounters[];
};

type PokemonV2Species = {
  evolves_from_species_id: number;
  generation_id: number;
  id: number;
  is_baby: boolean;
  is_legendary: boolean;
  is_mythical: boolean;
  name: string;
};

type PokemonV2EvolutionChain = {
  baby_trigger_item_id: number | null;
  id: number;
  pokemon_v2_item: any;
  pokemon_v2_pokemonspecies: PokemonV2Species[];
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

// Transform server data to match Encounter format
const transformLocationAreaEncountersToEncounters = (
  locationAreaEncounters: LocationAreaEncounters[],
  version: string,
  pokemonSpeciesId: number
): Encounter[] => {
  const encounters: Encounter[] = [];
  let encounterId = 1;

  locationAreaEncounters.forEach((locationArea) => {
    const versionDetails = locationArea.version_details.find(
      (vd) => vd.version.name.toLowerCase() === version.toLowerCase()
    );

    if (!versionDetails) return;

    versionDetails.encounter_details.forEach((encounterDetail) => {
      // Extract location name from the location_area name
      const locationName = locationArea.location_area.name;

      encounters.push({
        id: encounterId++,
        version_id: 0, // Not available in server data
        location_area_id: 0, // Not available in server data
        min_level: encounterDetail.min_level,
        max_level: encounterDetail.max_level,
        pokemon_id: pokemonSpeciesId, // Using species ID as fallback
        encounter_slot_id: 0, // Not available in server data
        pokemon_v2_locationarea: {
          name: locationName,
          location_id: 0, // Not available in server data
          pokemon_v2_location: {
            name: locationName,
            id: 0, // Not available in server data
            region_id: 0, // Not available in server data
            pokemon_v2_region: {
              name: "Unknown", // Not available in server data
            },
          },
        },
        pokemon_v2_encounterslot: {
          rarity: encounterDetail.chance,
          slot: null, // Not available in server data
          version_group_id: 0, // Not available in server data
        },
        pokemon_v2_pokemon: {
          pokemon_species_id: pokemonSpeciesId,
          id: pokemonSpeciesId, // Using species ID as fallback
          name: "Unknown", // Not available in server data
        },
        pokemon_v2_encounterconditionvaluemaps: [], // Not available in server data
      });
    });
  });

  return encounters;
};

type Version = {
  name: string;
  pokemon_v2_versiongroup: {
    name: string;
    pokemon_v2_generation: {
      id: number;
      name: string;
      pokemon_v2_versiongroups: {
        name: string;
        generation_id: number;
        pokemon_v2_versions: {
          __typename: string;
          name: string;
          version_group_id: number;
          pokemon_v2_encounters: {
            pokemon_v2_locationarea: PokemonV2LocationArea;
          }[];
        }[];
      }[];
    };
  };
};

type EncountersData = {
  pokemon_v2_version: Version[];
  pokemon_v2_encounter: Encounter[];
  pokemon_v2_evolutionchain: PokemonV2EvolutionChain[];
};

const Encounters: React.FC<EncountersProps> = ({
  version,
  pokemonSpeciesId,
  locationAreaEncounters,
  evolutionData,
}) => {
  const formatName = convertKebabCaseToTitleCase;

  const { loading, error, data } = useQuery(GetPokemonLocationsForVersion, {
    variables: {
      version: version.toLowerCase(),
      pokemonSpeciesId,
      evolutionChainId: evolutionData.id,
    },
    errorPolicy: "all",
    fetchPolicy: "cache-first",
    notifyOnNetworkStatusChange: false,
  });

  if (loading) return null;
  if (error) {
    console.error(error);
    return null;
  }

  if (!data) return null;

  const { pokemon_v2_encounter, pokemon_v2_version } = data as EncountersData;

  const locationEncounters = groupEncountersByLocation(
    pokemon_v2_encounter,
    locationAreaEncounters,
    version.toLowerCase()
  );

  // console.log(locationEncounters, "locationEncounters");
  // console.log(pokemon_v2_encounter, "pokemon_v2_encounter");

  // const generationId =
  //   pokemon_v2_version[0].pokemon_v2_versiongroup.pokemon_v2_generation.id;

  const evolutionChainData = data.pokemon_v2_evolutionchain[0];

  const thisPokemon: PokemonV2Species =
    evolutionChainData?.pokemon_v2_pokemonspecies.find(
      (pokemon: PokemonV2Species) => pokemon.id === pokemonSpeciesId
    );

  const evolvesFromPokemonSpeciesId = thisPokemon?.evolves_from_species_id;

  const evolvesFromPokemon = evolutionChainData.pokemon_v2_pokemonspecies.find(
    (p: PokemonV2) => p.id === evolvesFromPokemonSpeciesId
  );

  const versionGroups =
    pokemon_v2_version[0].pokemon_v2_versiongroup.pokemon_v2_generation
      .pokemon_v2_versiongroups;

  // Filter the other versions in this generation that have encounters for this pokemon
  const otherVersionsWithEncounters = versionGroups
    .flatMap((group) => group.pokemon_v2_versions)
    .filter((v) => {
      const isSameVersion = v.name === version;
      return !isSameVersion && v.pokemon_v2_encounters.length > 0;
    });

  // We assuming if there are no encounters and no evolutions, the pokemon is obtainable only by an event
  const isMythical = thisPokemon?.is_mythical;

  const dedupeEncounterMethods = (encounterMethods: EncounterDetails[]) => {
    return encounterMethods.filter(
      (method, index, self) =>
        index === self.findIndex((t) => t.method.name === method.method.name)
    );
  };

  return (
    <>
      <VersionChip versionName={version} />
      {locationEncounters.length === 0 && (
        <p className="text-base leading-none">
          {evolvesFromPokemon &&
            `Evolve ${formatName(evolvesFromPokemon.name)}`}
          {!evolvesFromPokemon &&
            !isMythical &&
            `Trade from ${otherVersionsWithEncounters
              .map((v) => formatName(v.name))
              .join(", ")}`}
          {isMythical && `Event Only`}
        </p>
      )}

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
                        .map((method) => toTitleCase(method.method.name))
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

export default Encounters;
