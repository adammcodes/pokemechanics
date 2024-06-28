import PokemonTypeChip from "@/components/common/PokemonTypeChip";

export type PokemonType = {
  pokemon_v2_type: {
    name: string;
    generation_id: number;
  };
};

type PokemonTypesProps = {
  types: PokemonType[];
};

const PokemonTypes: React.FC<PokemonTypesProps> = ({ types }) => {
  const mappedTypes = types.map((t, i, arr) => {
    let typeName = t.pokemon_v2_type.name;

    return <PokemonTypeChip key={typeName} typeName={typeName} />;
  });

  return (
    <div className="flex mt-2 flex gap-2">{mappedTypes}</div>
  );
};

export default PokemonTypes;
