import {
  Language,
  Version,
  MoveLearnMethod,
  NamedAPIResource,
  EvolutionDetail,
} from "pokenode-ts";

// Option types are used for Autocomplete and Select components
export type GameOption = {
  label: string;
  name: string;
  value: string;
  number: number;
  variantId?: number;
};

// export type PokemonOption = {
//   label: string;
//   name: string;
//   value: number | string;
//   number: number;
// }

export type FlavorTextForVersion = {
  flavor_text: string;
  language: Language;
  version: Version;
};

export type PokemonMove = {
  name: string;
  url: string;
};

export type PokemonMoveByMethod = {
  move: PokemonMove;
  move_learn_method: string;
  level_learned_at: number;
};

export type Machine = {
  url: string;
};

export type VersionGroup = {
  name: string;
  url: string;
};

export type MachineVersion = {
  machine: Machine;
  version_group: VersionGroup;
};

export type VersionGroupDetails = {
  level_learned_at: number;
  move_learn_method: MoveLearnMethod;
  version_group: VersionGroup;
};

export type PokemonMoveVersion = {
  move: PokemonMove;
  version_group_details: VersionGroupDetails[];
};

export type Gen = {
  name: string;
  url: string;
};

export type Chain = {
  is_baby: boolean;
  species: NamedAPIResource;
  evolves_to: Chain[];
  evolution_details: EvolutionDetail[];
};

export type SpeciesVariety = {
  is_default: boolean;
  pokemon: { name: string; url: string };
};

export type PokemonSpeciesVariety = {
  base_happiness: number;
  capture_rate: number;
  color: {
    name: string;
    url: string;
  };
  egg_groups: { name: string; url: string }[];
  evolution_chain: { url: string };
  evolves_from_species: { name: string; url: string } | null;
  flavor_text_entries: {
    flavor_text: string;
    language: { name: string; url: string };
    version: { name: string; url: string };
  }[];
  form_descriptions: {
    description: string;
    language: { name: string; url: string };
  }[];
  forms_switchable: boolean;
  gender_rate: number;
  genera: { genus: string; language: { name: string; url: string } }[];
  generation: { name: string; url: string };
  growth_rate: { name: string; url: string };
  habitat: { name: string; url: string };
  has_gender_differences: boolean;
  hatch_counter: number;
  id: number;
  is_baby: boolean;
  is_legendary: boolean;
  is_mythical: boolean;
  name: string;
  names: { language: { name: string; url: string }; name: string }[];
  order: number;
  pal_park_encounters: {
    area: { name: string; url: string };
    base_score: number;
    rate: number;
  }[];
  pokedex_numbers: {
    entry_number: number;
    pokedex: { name: string; url: string };
  }[];
  shape: { name: string; url: string };
  varieties: { is_default: boolean; pokemon: { name: string; url: string } }[];
};
