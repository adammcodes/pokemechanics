import { typeColours } from "@/constants/typeColours";

export default function PokemonTypeChip({ typeName }: { typeName: string }) {
  let typeColour: string = typeColours[typeName.toLowerCase()];
  return (
    <div
      className={`shadow-lg min-w-[3em] text-center rounded-sm uppercase px-2 flex justify-center items-center`}
      style={{ background: typeColour }}
    >
      <span className="text-[1rem] text-white">{typeName}</span>
    </div>
  );
}
