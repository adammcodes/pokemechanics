import { PokemonType } from "pokenode-ts";
// import DynamicImage from "../../../src/components/common/DynamicImage";
import { typeColours } from "@/constants/typeColours";

type PokemonTypesProps = {
  types: PokemonType[];
};

const PokemonTypes: React.FC<PokemonTypesProps> = ({ types }) => {
  const mappedTypes = types.map((t, i, arr) => {
    let typeName = t.type.name;
    let typeColour: string = typeColours[typeName.toLowerCase()];
    return (
      <div
        key={i}
        className={`shadow-lg rounded-sm uppercase px-2 flex items-center`}
        style={{ background: typeColour }}
      >
        <span className="text-[1rem] text-white">{typeName}</span>
        {/* <DynamicImage
          width={32}
          height={12}
          src={`/images/types/${typeName}.png`}
          alt={`${typeName} type`}
          priority={true}
        /> */}
      </div>
    );
  });

  return <div className="flex gap-x-2">{mappedTypes}</div>;
};

export default PokemonTypes;
