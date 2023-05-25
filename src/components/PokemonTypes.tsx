import { PokemonType } from "pokenode-ts";
import DynamicImage from "./DynamicImage";

type PokemonTypesProps = {
  types: PokemonType[];
};

export const PokemonTypes: React.FC<PokemonTypesProps> = ({ types }) => {
  const mappedTypes = types.map((t, i, arr) => {
    let typeName = t.type.name;
    return (
      <div className={`${i === 0 && arr.length > 1 ? "mr-2" : ""}`}>
        <DynamicImage
          width={32}
          height={12}
          src={`/images/types/${typeName}.gif`}
          alt={`${typeName} type`}
          priority={true}
        />
      </div>
    );
  });

  return <>{mappedTypes}</>;
};
