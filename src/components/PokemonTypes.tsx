import { PokemonType } from "pokenode-ts";
import DynamicImage from "./common/DynamicImage";

type PokemonTypesProps = {
  types: PokemonType[];
};

export const PokemonTypes: React.FC<PokemonTypesProps> = ({ types }) => {
  const mappedTypes = types.map((t, i, arr) => {
    let typeName = t.type.name;
    return (
      <div key={i}>
        <DynamicImage
          width={32}
          height={12}
          src={`/images/types/${typeName}.png`}
          alt={`${typeName} type`}
          priority={true}
        />
      </div>
    );
  });

  return <>{mappedTypes}</>;
};
