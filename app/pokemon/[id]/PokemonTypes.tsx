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

  return (
    <div className="flex mt-2 flex-col lg:flex-row gap-2">{mappedTypes}</div>
  );
};

export default PokemonTypes;
