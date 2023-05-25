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