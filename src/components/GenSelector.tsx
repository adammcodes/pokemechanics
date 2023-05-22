import { useContext } from "react";
// Components
import Select from "./Select";
// Utils
import convertKebabCaseToTitleCase from "../utils/convertKebabCaseToTitleCase";
// Context
import GameContext from "../context/GameContextProvider";

type VersionGroup = {
  name: string;
  url: string;
};

type Option = {
  label: string;
  name: string;
  value: string;
};

type GenSelectorProps = {
  gens: VersionGroup[];
};

// Component for selecting a Version Group: e.g. "Red/Blue", "Yellow", "Silver/Gold", etc
const GenSelector: React.FC<GenSelectorProps> = function GenSelector({ gens }) {
  const { setGame } = useContext(GameContext);

  const genOptions: Option[] = gens.map((gen) => {
    return {
      label: convertKebabCaseToTitleCase(gen.name),
      name: gen.name,
      value: gen.url,
    };
  });

  return (
    <>
      <Select options={genOptions} onSelect={setGame} />
    </>
  );
};

export default GenSelector;
