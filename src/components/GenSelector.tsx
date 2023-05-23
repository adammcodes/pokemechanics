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
  number: number;
};

type GenSelectorProps = {
  gens: VersionGroup[];
};

// Component for selecting a Version Group: e.g. "Red/Blue", "Yellow", "Silver/Gold", etc
const GenSelector: React.FC<GenSelectorProps> = function GenSelector({ gens }) {
  const { setGame, game, setFont } = useContext(GameContext);

  const genOptions: Option[] = gens.map((gen, index) => {
    return {
      label: convertKebabCaseToTitleCase(gen.name),
      name: gen.name,
      value: gen.name,
      number: index + 1,
    };
  });

  const handleSelect = (value: string | number, number: number) => {
    setGame(value);
    if (number <= 4) {
      setFont(0);
    }
    if (number > 4 && number < 8) {
      setFont(1);
    }
    if (number >= 8) {
      setFont(2);
    }
  };

  return (
    <>
      <Select
        options={genOptions}
        onSelect={handleSelect}
        defaultValue={game}
      />
    </>
  );
};

export default GenSelector;
