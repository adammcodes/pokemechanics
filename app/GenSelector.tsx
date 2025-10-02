"use client";
import { useContext } from "react";
import { GameOption } from "../src/types";
// Components
import AutocompleteBase from "@/components/common/AutocompleteBase";
// Utils
import convertKebabCaseToTitleCase from "../src/utils/convertKebabCaseToTitleCase";
// Context
import GameContext from "../src/context/GameContextProvider";

type VersionGroup = {
  name: string;
  url: string;
};

type GenSelectorProps = {
  gens: VersionGroup[];
};

// Component for selecting a Version Group: e.g. "Red/Blue", "Yellow", "Silver/Gold", etc
const GenSelector: React.FC<GenSelectorProps> = function GenSelector({ gens }) {
  const { setGame, game } = useContext(GameContext);

  const genOptions: GameOption[] = gens.map((gen, index) => {
    return {
      label: convertKebabCaseToTitleCase(gen.name),
      name: gen.name,
      value: gen.name,
      number: index + 1,
    };
  });

  const handleSelect = (value: string | number) => {
    setGame(value);
    // Navigation will be handled by Link components in AutocompleteBase
  };

  return (
    <AutocompleteBase
      options={genOptions}
      onSelect={handleSelect}
      defaultValue={convertKebabCaseToTitleCase(game || "red-blue")}
      hasImageOptions={false}
      linkTemplate="/pokedex/{value}"
    />
  );
};

export default GenSelector;
