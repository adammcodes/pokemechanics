import { Language, Version } from "pokenode-ts";

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