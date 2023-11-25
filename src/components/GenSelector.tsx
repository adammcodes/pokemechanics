import { useRouter } from "next/router";
import { useContext } from "react";
import { GameOption } from "../types";
// Components
import Autocomplete from "./common/Autocomplete";
// Utils
import convertKebabCaseToTitleCase from "../utils/convertKebabCaseToTitleCase";
// Context
import GameContext from "../context/GameContextProvider";

type VersionGroup = {
  name: string;
  url: string;
};

type GenSelectorProps = {
  gens: VersionGroup[];
};

// Component for selecting a Version Group: e.g. "Red/Blue", "Yellow", "Silver/Gold", etc
const GenSelector: React.FC<GenSelectorProps> = function GenSelector({ gens }) {
  const { setGame, game, setLoading } = useContext(GameContext);
  const router = useRouter();

  const genOptions: GameOption[] = gens.map((gen, index) => {
    return {
      label: convertKebabCaseToTitleCase(gen.name),
      name: gen.name,
      value: gen.name,
      number: index + 1,
    };
  });

  const handleSelect = (value: string | number) => {
    setLoading(true);
    setGame(value);
    router.push(`/pokedex/${value}`);
  };

  return (
    <>
      <Autocomplete
        options={genOptions}
        onSelect={handleSelect}
        defaultValue={convertKebabCaseToTitleCase(game || "red-blue")}
        isPokemonOption={false}
      />
    </>
  );
};

export default GenSelector;
