/**
 * GraphQL response types for Pokemon data
 * Maps to the comprehensive GraphQL query for fetching all Pokemon data
 */

export type GraphQLPokemonComplete = {
  pokemon: GraphQLPokemon[];
};

export type GraphQLPokemon = {
  id: number;
  pokemon_species_id: number;
  name: string;
  is_default: boolean;
  base_experience: number | null;
  height: number;
  weight: number;
  pokemonspecy: GraphQLPokemonSpecies;
  pokemonsprites: GraphQLPokemonSprites[];
  pokemonabilities: GraphQLPokemonAbility[];
  pokemonstats: GraphQLPokemonStat[];
  encounters: GraphQLEncounter[];
  pokemontypes: GraphQLPokemonType[];
  pokemontypepasts: GraphQLPokemonType[];
  pokemoncries: GraphQLPokemonCries[];
  pokemonforms: GraphQLPokemonForm[];
  pokemonmoves: GraphQLPokemonMove[];
};

export type GraphQLPokemonSpecies = {
  gender_rate: number;
  generation_id: number;
  hatch_counter: number;
  is_baby: boolean;
  forms_switchable: boolean;
  base_happiness: number | null;
  is_legendary: boolean;
  is_mythical: boolean;
  capture_rate: number;
  evolves_from_species_id: number | null;
  evolution_chain_id: number;
};

export type GraphQLPokemonSprites = {
  sprites: any; // JSON object containing sprite URLs
};

export type GraphQLPokemonAbility = {
  pokemon_id: number;
  is_hidden: boolean;
  ability: {
    name: string;
    is_main_series: boolean;
    generation_id: number;
    abilityeffecttexts: {
      effect: string;
      short_effect: string;
      language: {
        name: string;
      };
    }[];
  };
};

export type GraphQLPokemonStat = {
  base_stat: number;
  effort: number;
  stat: {
    name: string;
  };
};

export type GraphQLEncounter = {
  version: {
    name: string;
  };
  locationarea: {
    name: string;
    location: {
      name: string;
    };
  } | null;
  encounterslot: {
    rarity: number;
    encountermethod: {
      name: string;
    };
  };
  min_level: number;
  max_level: number;
  encounterconditionvaluemaps: {
    encounter_id: number;
    encounterconditionvalue: {
      name: string;
      id: number;
    };
  }[];
};

export type GraphQLPokemonType = {
  type: {
    name: string;
    id: number;
    generation_id: number;
    TypeefficaciesByTargetTypeId: {
      damage_factor: number;
      damage_type_id: number;
      target_type_id: number;
      type: {
        name: string;
        id: number;
        generation_id: number;
      };
    }[];
    typeefficacypasts: {
      damage_factor: number;
      damage_type_id: number;
      target_type_id: number;
      generation_id: number;
      generation: {
        name: string;
        id: number;
      };
      type: {
        name: string;
        id: number;
        generation_id: number;
      };
    }[];
  };
};

export type GraphQLPokemonCries = {
  cries: any; // JSON object containing cry URLs
};

export type GraphQLPokemonForm = {
  form_name: string | null;
  is_mega: boolean;
  pokemonformsprites: {
    sprites: any; // JSON object containing form sprite URLs
  }[];
};

export type GraphQLPokemonMove = {
  move_id: number;
  level: number;
  movelearnmethod: {
    name: string;
  };
  move: {
    name: string;
    move_effect_chance: number | null;
    accuracy: number | null;
    power: number | null;
    pp: number | null;
    machines: {
      item: {
        name: string;
      };
      machine_number: number;
    }[];
    movedamageclass: {
      name: string;
    } | null;
    type: {
      id: number;
      name: string;
    };
    moveeffect: {
      moveeffecteffecttexts: {
        effect: string;
        short_effect: string;
      }[];
    } | null;
  };
};
