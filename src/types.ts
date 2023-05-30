import { Language, Version, MoveLearnMethod } from "pokenode-ts";

// Option types are used for Autocomplete and Select components
export type GameOption = {
  label: string;
  name: string;
  value: string;
  number: number;
}

export type PokemonOption = {
  label: string;
  name: string;
  value: number | string;
  number: number;
}

export type FlavorTextForVersion = {
  flavor_text: string;
  language: Language;
  version: Version;
}

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
}

export type VersionGroup = {
  name: string;
  url: string;
}

export type MachineVersion = {
  machine: Machine;
  version_group: VersionGroup
};

export type VersionGroupDetails = {
  level_learned_at: number;
  move_learn_method: MoveLearnMethod;
  version_group: VersionGroup;
}

export type PokemonMoveVersion = {
  move: PokemonMove;
  version_group_details: VersionGroupDetails[]
};