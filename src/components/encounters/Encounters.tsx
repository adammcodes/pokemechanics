import convertKebabCaseToTitleCase from "@/utils/convertKebabCaseToTitleCase";
import { useQuery, gql } from "@apollo/client";
import VersionChip from "@/components/common/VersionChip";
import { groupEncountersByLocation } from "./groupEncountersByLocation";
import { Tooltip, Stack, Text } from "@chakra-ui/react";

const GetPokemonLocationsForVersion = gql`
  query GetPokemonLocationsForVersion(
    $version: String!
    $pokemonSpeciesId: Int!
    $evolutionChainId: Int!
  ) {
    pokemon_v2_version(where: { name: { _eq: $version } }) {
      name
      pokemon_v2_versiongroup {
        name
        pokemon_v2_generation {
          id
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

type Version = {
  name: string;
  pokemon_v2_versiongroup: {
    name: string;
    pokemon_v2_generation: {
      id: number;
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
  pokemon_v2_evolutionchain: PokemonV2EvolutionChain[];
};

const Encounters: React.FC<EncountersProps> = ({
  version,
  pokemonSpeciesId,
  evolutionData,
}) => {
  const formatName = convertKebabCaseToTitleCase;
  const { loading, error, data } = useQuery(GetPokemonLocationsForVersion, {
    variables: {
      version: version.toLowerCase(),
      pokemonSpeciesId,
      evolutionChainId: evolutionData.id,
    },
  });

  if (loading) return null;
  if (error) {
    console.error(error);
    return null;
  }

  if (!data) return null;

  // console.log(data);

  const { pokemon_v2_encounter, pokemon_v2_version } = data as EncountersData;

  const locationEncounters = groupEncountersByLocation(pokemon_v2_encounter);

  const generationId =
    pokemon_v2_version[0].pokemon_v2_versiongroup.pokemon_v2_generation.id;

  const evolutionChainData = data.pokemon_v2_evolutionchain[0];

  const thisPokemon: PokemonV2Species =
    evolutionChainData?.pokemon_v2_pokemonspecies
      .filter(
        (species: PokemonV2Species) => species.generation_id === generationId
      )
      .find((pokemon: PokemonV2Species) => pokemon.id === pokemonSpeciesId);

  const evolvesFromPokemonSpeciesId = thisPokemon?.evolves_from_species_id;

  const evolvesFromPokemon = evolutionChainData.pokemon_v2_pokemonspecies.find(
    (p: PokemonV2) => p.id === evolvesFromPokemonSpeciesId
  );

  const versionGroups =
    pokemon_v2_version[0].pokemon_v2_versiongroup.pokemon_v2_generation
      .pokemon_v2_versiongroups;

  const otherVersionsInGroups = versionGroups
    .flatMap((group) => {
      return group.pokemon_v2_versions.map((version) => version.name);
    })
    .filter((v) => v !== version);

  return (
    <>
      <VersionChip versionName={version} />
      {locationEncounters.length === 0 && (
        <p className="text-base leading-none">
          {evolvesFromPokemon &&
            `Evolve ${formatName(evolvesFromPokemon.name)}`}
          {!evolvesFromPokemon &&
            `Trade from ${otherVersionsInGroups
              .map((v) => formatName(v))
              .join(", ")}`}
        </p>
      )}

      <div className="flex flex-wrap">
        {locationEncounters.length > 0 &&
          locationEncounters.map((location, i, arr) => (
            <div
              className="inline-block cursor-pointer mr-1"
              style={{ lineHeight: "10px" }}
              key={location.locationName}
            >
              <Tooltip
                label={
                  <Stack>
                    <Text>Min. Level: {location.minLevel}</Text>
                    <Text>Max. Level: {location.maxLevel}</Text>
                    <Text>Rate: {location.encounterRate}%</Text>
                  </Stack>
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
