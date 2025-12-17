import PokemonTypeChip from "@/components/common/PokemonTypeChip";

export type PokemonType = {
  type: {
    name: string;
    id: number;
    generation_id: number;
  };
};

type PokemonTypesProps = {
  types: PokemonType[];
  versionGroup: string; // e.g. "red-blue", "x-y", "omega-ruby-alpha-sapphire"
  generationString: string; // e.g. "generation-i", "generation-ii", "generation-iii", "generation-iv", "generation-v", "generation-vi", "generation-vii", "generation-viii"
};

const PokemonTypes: React.FC<PokemonTypesProps> = ({
  types,
  versionGroup,
  generationString,
}) => {
  const mappedTypes = types.map((t, i, arr) => {
    let typeId = t.type.id;
    let typeName = t.type.name;

    return (
      <PokemonTypeChip
        key={typeId}
        typeId={typeId}
        typeName={typeName}
        versionGroup={versionGroup}
        generationString={generationString}
      />
    );
  });

  return <div className="flex mt-2 flex gap-4">{mappedTypes}</div>;
};

export default PokemonTypes;
