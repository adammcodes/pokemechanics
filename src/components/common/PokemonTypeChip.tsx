import getSpriteTypeUrl from "@/constants/spriteTypeUrlTemplate";
import { romanToNumber } from "@/utils/romanToNumber";

export default function PokemonTypeChip({
  typeId,
  typeName,
  versionGroup,
  generationString,
}: {
  typeId: number;
  typeName: string;
  versionGroup: string;
  generationString: string;
}) {
  const typeSpriteUrl = getSpriteTypeUrl({
    type: typeId,
    versionGroup,
    generationString,
  });

  const genNumber = romanToNumber(generationString.split("-")[1]);
  const isGenThreeSpinOff =
    versionGroup === "colosseum" || versionGroup === "xd";

  let width: string = "50px";

  if (isGenThreeSpinOff || genNumber === 4 || genNumber === 6) {
    width = "64px";
  } else if (genNumber === 7) {
    width = "75px";
  } else if (genNumber === 8) {
    width = "85px";
  } else if (genNumber === 9) {
    width = "90px";
  }

  return (
    <div className={`p-[0.15rem] h-auto`} style={{ width: width }}>
      <img src={typeSpriteUrl} alt={typeName} className="w-full h-auto" />
    </div>
  );
}
