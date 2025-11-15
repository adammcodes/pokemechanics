export type NamedAPIResource = {
  name: string;
  url: string;
};

// Option types are used for Autocomplete and Select components
export type GameOption = {
  label: string;
  name: string;
  value: string;
  number: number;
  variantId?: number;
};

export type EvolutionDetail = {
  item: NamedAPIResource | null;
  trigger: NamedAPIResource;
  gender: 1 | 2 | null; // 1 = female, 2 = male, null = no gender
  held_item: NamedAPIResource | null;
  known_move: NamedAPIResource | null;
  known_move_type: NamedAPIResource | null;
  location: NamedAPIResource | null;
  min_level: number;
  min_happiness: number | null;
  min_beauty: number | null;
  min_affection: number | null;
  needs_overworld_rain: boolean;
  party_species: NamedAPIResource | null;
  party_type: NamedAPIResource | null;
  relative_physical_stats: number | null;
  time_of_day: "";
  trade_species: NamedAPIResource | null;
  turn_upside_down: boolean;
  region_id: null;
  base_form_id: number | null;
};

export type FlavorTextForVersion = {
  flavor_text: string;
  language: NamedAPIResource;
  version: NamedAPIResource;
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

export type Gen = {
  name: string;
  url: string;
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

export type Pokedex = {
  descriptions: {
    description: string;
    language: { name: string; url: string };
  }[];
  id: number;
  is_main_series: boolean;
  name: string;
  names: { name: string; language: { name: string; url: string } }[];
  pokemon_entries: {
    entry_number: number;
    pokemon_species: { name: string; url: string };
  }[];
  region: { name: string; url: string } | null;
  version_groups: { name: string; url: string }[];
};

export type PokemonSpecies = {
  id: number;
  base_happiness: number;
  capture_rate: number;
  color: { name: string; url: string };
  egg_groups: { name: string; url: string }[];
  evolution_chain: { url: string };
  evolves_from_species: { name: string; url: string } | null;
  flavor_text_entries: FlavorTextForVersion[];
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
  is_baby: boolean;
  is_mythical: boolean;
  is_legendary: boolean;
  name: string;
  names: { name: string; language: { name: string; url: string } }[];
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
  varieties: {
    is_default: boolean;
    pokemon: { name: string; url: string };
  }[];
};

// data type from the /pokemon/:name endpoint from the pokeapi REST endpoint
export type RestPokemon = {
  abilities: {
    ability: NamedAPIResource;
    is_hidden: boolean;
    slot: number;
  }[];
  base_experience: number;
  cries: {
    latest: string; // url
    legacy: string; // url
  };
  forms: NamedAPIResource[];
  game_indices: {
    game_index: number;
    version: NamedAPIResource;
  }[];
  height: number;
  held_items: {
    item: NamedAPIResource;
    version_details: {
      rarity: number;
      version: NamedAPIResource;
    }[];
  }[];
  id: number;
  is_default: boolean;
  location_area_encounters: string; // url
  moves: {
    move: NamedAPIResource;
    version_group_details: {
      level_learned_at: number;
      move_learn_method: NamedAPIResource;
      order: number | null;
      version_group: NamedAPIResource;
    }[];
  }[];
  name: string;
  order: number;
  past_abilities: {
    abilities: {
      ability: null;
      is_hidden: boolean;
      slot: number;
    }[];
    generation: NamedAPIResource;
  }[];
  past_types: {
    generation: NamedAPIResource;
    types: {
      slot: number;
      type: NamedAPIResource;
    }[];
  }[];
  species: NamedAPIResource;
  sprites: {
    back_default: string | null;
    back_female: string | null;
    back_shiny: string | null;
    back_shiny_female: string | null;
    front_default: string | null;
    front_female: string | null;
    front_shiny: string | null;
    front_shiny_female: string | null;
    other: {
      dream_world: {
        front_default: string | null;
        front_female: string | null;
      };
      home: {
        front_default: string | null;
        front_female: string | null;
        front_shiny: string | null;
        front_shiny_female: string | null;
      };
      "official-artwork": {
        front_default: string | null;
        front_shiny: string | null;
      };
      showdown: {
        back_default: string | null;
        back_female: string | null;
        back_shiny: string | null;
        back_shiny_female: string | null;
        front_default: string | null;
        front_female: string | null;
        front_shiny: string | null;
        front_shiny_female: string | null;
      };
    };
    versions: {
      "generation-i": {
        "red-blue": {
          back_default: string | null;
          back_gray: string | null;
          back_transparent: string | null;
          front_default: string | null;
          front_gray: string | null;
          front_transparent: string | null;
        };
        yellow: {
          back_default: string | null;
          back_gray: string | null;
          back_transparent: string | null;
          front_default: string | null;
          front_gray: string | null;
          front_transparent: string | null;
        };
      };
      "generation-ii": {
        crystal: {
          back_default: string | null;
          back_shiny: string | null;
          back_shiny_transparent: string | null;
          back_transparent: string | null;
          front_default: string | null;
          front_shiny: string | null;
          front_shiny_transparent: string | null;
          front_transparent: string | null;
        };
        gold: {
          back_default: string | null;
          back_shiny: string | null;
          front_default: string | null;
          front_shiny: string | null;
          front_transparent: string | null;
        };
        silver: {
          back_default: string | null;
          back_shiny: string | null;
          front_default: string | null;
          front_shiny: string | null;
          front_transparent: string | null;
        };
      };
      "generation-iii": {
        emerald: {
          front_default: string | null;
          front_shiny: string | null;
        };
        "firered-leafgreen": {
          back_default: string | null;
          back_shiny: string | null;
          front_default: string | null;
          front_shiny: string | null;
        };
        "ruby-sapphire": {
          back_default: string | null;
          back_shiny: string | null;
          front_default: string | null;
          front_shiny: string | null;
        };
      };
      "generation-iv": {
        "diamond-pearl": {
          back_default: string | null;
          back_female: string | null;
          back_shiny: string | null;
          back_shiny_female: string | null;
          front_default: string | null;
          front_female: string | null;
          front_shiny: string | null;
          front_shiny_female: string | null;
        };
        "heartgold-soulsilver": {
          back_default: string | null;
          back_female: string | null;
          back_shiny: string | null;
          back_shiny_female: string | null;
          front_default: string | null;
          front_female: string | null;
          front_shiny: string | null;
          front_shiny_female: string | null;
        };
        platinum: {
          back_default: string | null;
          back_female: string | null;
          back_shiny: string | null;
          back_shiny_female: string | null;
          front_default: string | null;
          front_female: string | null;
          front_shiny: string | null;
          front_shiny_female: string | null;
        };
      };
      "generation-v": {
        "black-white": {
          animated: {
            back_default: string | null;
            back_female: string | null;
            back_shiny: string | null;
            back_shiny_female: string | null;
            front_default: string | null;
            front_female: string | null;
            front_shiny: string | null;
            front_shiny_female: string | null;
          };
          back_default: string | null;
          back_female: string | null;
          back_shiny: string | null;
          back_shiny_female: string | null;
          front_default: string | null;
          front_female: string | null;
          front_shiny: string | null;
          front_shiny_female: string | null;
        };
      };
      "generation-vi": {
        "omegaruby-alphasapphire": {
          front_default: string | null;
          front_female: string | null;
          front_shiny: string | null;
          front_shiny_female: string | null;
        };
        "x-y": {
          front_default: string | null;
          front_female: string | null;
          front_shiny: string | null;
          front_shiny_female: string | null;
        };
      };
      "generation-vii": {
        icons: {
          front_default: string | null;
          front_female: string | null;
        };
        "ultra-sun-ultra-moon": {
          front_default: string | null;
          front_female: string | null;
          front_shiny: string | null;
          front_shiny_female: string | null;
        };
      };
      "generation-viii": {
        icons: {
          front_default: string | null;
          front_female: string | null;
        };
      };
    };
  };
  stats: {
    base_stat: number;
    effort: number;
    stat: NamedAPIResource;
  }[];
  types: {
    slot: number;
    type: NamedAPIResource;
  }[];
  weight: number;
};
