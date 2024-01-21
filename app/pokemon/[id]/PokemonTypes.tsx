import PokemonTypeChip from "@/components/common/PokemonTypeChip";
import { PokemonType } from "pokenode-ts";

type PokemonTypesProps = {
  types: PokemonType[];
};

const PokemonTypes: React.FC<PokemonTypesProps> = ({ types }) => {
  const mappedTypes = types.map((t, i, arr) => {
    let typeName = t.type.name;

    return <PokemonTypeChip key={typeName} typeName={typeName} />;
  });

  return <div className="flex gap-x-2">{mappedTypes}</div>;
};

export default PokemonTypes;
