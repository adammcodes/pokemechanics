"use client";
import convertKebabCaseToTitleCase from "@/utils/convertKebabCaseToTitleCase";
import { useQuery } from "@tanstack/react-query";
import VersionChip from "@/components/common/VersionChip";
import { groupEncountersByLocation } from "./groupEncountersByLocation";
import Tooltip from "@/components/common/Tooltip";
import {
  LocationAreaEncounters,
  EncounterDetails,
} from "./LocationsForVersionGroup";
import toTitleCase from "@/utils/toTitleCase";
import { fetchFromGraphQL } from "@/utils/api";

const GRAPHQL_QUERY = `
  query GetPokemonLocationsForVersion(
    $version: String!
    $pokemonSpeciesId: Int!
    $evolutionChainId: Int!
  ) {
    version(where: { name: { _eq: $version } }) {
      name
      versiongroup {
        id
        name
        generation {
          id
          name
          versiongroups {
            name
            generation_id
            versions {
              name
              version_group_id
              encounters(
                where: {
                  pokemon: {
                    pokemon_species_id: { _eq: $pokemonSpeciesId }
                  }
                }
              ) {
                locationarea {
                  name
                  location_id
                  location {
                    name
                    id
                    region_id
                    region {
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
    encounter(
      where: {
        version: { name: { _eq: $version } }
        pokemon: { pokemon_species_id: { _eq: $pokemonSpeciesId } }
      }
    ) {
      id
      version_id
      location_area_id
      min_level
      max_level
      pokemon_id
      encounter_slot_id
      locationarea {
        name
        location_id
        location {
          name
          id
          region_id
          region {
            name
          }
        }
      }
      encounterslot {
        rarity
        slot
        version_group_id
      }
      pokemon {
        pokemon_species_id
        id
        name
      }
      encounterconditionvaluemaps {
        encounter_condition_value_id
        encounterconditionvalue {
          name
          is_default
          encountercondition {
            name
            id
          }
        }
      }
    }
    evolutionchain(where: { id: { _eq: $evolutionChainId } }) {
      id
      baby_trigger_item_id
      item {
        name
      }
      pokemonspecies {
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
  item: any;
  pokemonspecies: PokemonV2Species[];
};

type PokemonV2LocationArea = {
  name: string;
  location_id: number;
  location: {
    name: string; // e.g. "kanto-route-24"
    id: number;
    region_id: number;
    region: {
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
  encounterconditionvalue: {
    name: string;
    is_default: boolean;
    encountercondition: {
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
  locationarea: PokemonV2LocationArea;
  encounterslot: PokemonV2EncounterSlot;
  pokemon: PokemonV2;
  encounterconditionvaluemaps: EncounterConditionalValue[];
};

type Version = {
  name: string;
  versiongroup: {
    name: string;
    generation: {
      id: number;
      name: string;
      versiongroups: {
        name: string;
        generation_id: number;
        versions: {
          __typename: string;
          name: string;
          version_group_id: number;
          encounters: {
            locationarea: PokemonV2LocationArea;
          }[];
        }[];
      }[];
    };
  };
};

type EncountersData = {
  version: Version[];
  encounter: Encounter[];
  evolutionchain: PokemonV2EvolutionChain[];
};

const Encounters: React.FC<EncountersProps> = ({
  version,
  pokemonSpeciesId,
  locationAreaEncounters,
  evolutionData,
}) => {
  const formatName = convertKebabCaseToTitleCase;

  const { isLoading, error, data } = useQuery<EncountersData>({
    queryKey: ["pokemonLocations", version, pokemonSpeciesId, evolutionData.id],
    queryFn: async () => {
      const result = await fetchFromGraphQL<EncountersData>({
        query: GRAPHQL_QUERY,
        variables: {
          version: version.toLowerCase(),
          pokemonSpeciesId,
          evolutionChainId: evolutionData.id,
        },
        endpoint: "/api/graphql", // Use Next.js API route to avoid CORS in client component
      });
      return result.data!;
    },
    staleTime: 1000 * 60 * 60, // 1 hour
    gcTime: 1000 * 60 * 60 * 24, // 24 hours (garbage collection time)
  });

  if (isLoading) return null;
  if (error) {
    console.error(error);
    return null;
  }

  if (!data) return null;

  const { encounter, version: versionData } = data;

  const locationEncounters = groupEncountersByLocation(
    encounter,
    locationAreaEncounters,
    version.toLowerCase()
  );

  // console.log(locationEncounters, "locationEncounters");
  // console.log(encounter, "encounter");

  // const generationId =
  //   versionData[0].versiongroup.generation.id;

  const evolutionChainData = data.evolutionchain[0];

  const thisPokemon: PokemonV2Species | undefined =
    evolutionChainData?.pokemonspecies.find(
      (pokemon: PokemonV2Species) => pokemon.id === pokemonSpeciesId
    );

  if (!thisPokemon) return null;

  const evolvesFromPokemonSpeciesId = thisPokemon?.evolves_from_species_id;

  const evolvesFromPokemon = evolutionChainData.pokemonspecies.find(
    (p: PokemonV2Species) => p.id === evolvesFromPokemonSpeciesId
  );

  const versionGroups = versionData[0].versiongroup.generation.versiongroups;

  // Filter the other versions in this generation that have encounters for this pokemon
  const otherVersionsWithEncounters = versionGroups
    .flatMap((group) => group.versions)
    .filter((v) => {
      const isSameVersion = v.name === version;
      return !isSameVersion && v.encounters.length > 0;
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
