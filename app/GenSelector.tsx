"use client";
import { useContext } from "react";
import { GameOption } from "../src/types";
// Components
import AutocompleteBase from "@/components/common/AutocompleteBase";
// Utils
import convertKebabCaseToTitleCase from "../src/utils/convertKebabCaseToTitleCase";
// Context
import GenerationContext from "../src/context/GenerationProvider";
import type { Generation } from "./page";
import { romanToNumber } from "@/utils/romanToNumber";

type GenSelectorProps = {
  gens: Generation[];
};

// Component for selecting a Generation: e.g. "Generation I", "Generation II", "Generation III", etc
const GenSelector: React.FC<GenSelectorProps> = function GenSelector({ gens }) {
  const { setGeneration, generation } = useContext(GenerationContext);

  const genOptions: GameOption[] = gens.map((gen) => {
    const versionGroups = gen.versiongroups
      .map((vg) => convertKebabCaseToTitleCase(vg.name))
      .join(", ");
    const genNumberString = gen.name.split("-")[1];
    const genNumber = romanToNumber(genNumberString);
    return {
      label: `${genNumber}`,
      smallLabel: versionGroups,
      name: gen.name,
      value: gen.name,
      number: gen.id,
    };
  });

  const handleSelect = (value: string | number) => {
    setGeneration(value);
    // Navigation will be handled by Link components in AutocompleteBase
  };

  return (
    <AutocompleteBase
      options={genOptions}
      onSelect={handleSelect}
      defaultValue={convertKebabCaseToTitleCase(generation || "generation-i")}
      hasImageOptions={false}
      linkTemplate="/pokedex/{value}"
    />
  );
};

export default GenSelector;
