import DynamicImage from "@/components/common/DynamicImage";
import getSpriteIconUrl from "@/constants/spriteIconUrlTemplate";

type SpriteProps = {
  id: number | string;
  size: number;
  game: string;
  gen: string;
};

export const Sprite: React.FC<SpriteProps> = ({ id, size, gen, game }) => {
  const spriteIconSrc = getSpriteIconUrl({
    pokemonId: id,
    generation: gen,
    versionGroup: game,
  });

  return (
    <>
      <DynamicImage
        game={game}
        width={size}
        height={size}
        src={spriteIconSrc}
        alt={"icon sprite"}
      />
    </>
  );
};
