import { useQuery } from "react-query";
import DynamicImage from "../common/DynamicImage";
import usePokemonClient from "@/hooks/usePokemonClient";
import getSpriteUrl from "@/constants/spriteUrlTemplates";

type SpriteProps = {
  id: number | string;
  size: number;
  versionGroup: string;
  gen: string;
};

export const Sprite: React.FC<SpriteProps> = ({
  id,
  size,
  gen,
  versionGroup,
}) => {
  const api = usePokemonClient();
  const p = useQuery(
    ["pokemonSprite", id],
    async () => {
      return api
        .getPokemonById(Number(id))
        .then((data) => data)
        .catch((err) => {
          throw err;
        });
    },
    {
      refetchOnMount: false,
      refetchOnWindowFocus: false,
      enabled: Boolean(id),
    }
  );

  const iconSrc =
    p.data && p.data.sprites.versions["generation-vii"].icons.front_default;

  const spriteSrc = getSpriteUrl({
    pokemonId: id,
    generation: gen.split("-")[1],
    versionGroup,
  });

  return (
    <>
      {p.data && (
        <DynamicImage
          width={size}
          height={size}
          src={iconSrc || spriteSrc}
          alt={"icon sprite"}
          priority={false}
        />
      )}
    </>
  );
};
