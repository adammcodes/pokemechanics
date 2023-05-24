import { useContext } from "react";
// Components
// import Select from "./Select";
// Utils
import convertKebabCaseToTitleCase from "../utils/convertKebabCaseToTitleCase";
// Context
import GameContext from "../context/GameContextProvider";
import Autocomplete from "./Autocomplete";

type VersionGroup = {
  name: string;
  url: string;
};

type Option = {
  label: string;
  name: string;
  value: string;
  number: number;
};

type GenSelectorProps = {
  gens: VersionGroup[];
};

// Component for selecting a Version Group: e.g. "Red/Blue", "Yellow", "Silver/Gold", etc
const GenSelector: React.FC<GenSelectorProps> = function GenSelector({ gens }) {
  const { setGame, game } = useContext(GameContext);

  const genOptions: Option[] = gens.map((gen, index) => {
    return {
      label: convertKebabCaseToTitleCase(gen.name),
      name: gen.name,
      value: gen.name,
      number: index + 1,
    };
  });

  const handleSelect = (value: string | number) => {
    setGame(value);
  };

  return (
    <>
      {/* <Select
        options={genOptions}
        onSelect={handleSelect}
        defaultValue={game}
      /> */}
      <Autocomplete
        options={genOptions}
        onSelect={handleSelect}
        defaultValue={convertKebabCaseToTitleCase(game)}
      />
    </>
  );
};

export default GenSelector;
