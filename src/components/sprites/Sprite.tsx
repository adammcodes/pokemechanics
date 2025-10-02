import { useQuery } from "react-query";
import DynamicImage from "../common/DynamicImage";
import usePokemonClient from "@/hooks/usePokemonClient";
import getSpriteUrl from "@/constants/spriteUrlTemplates";
import getSpriteIconUrl from "@/constants/spriteIconUrlTemplate";

type SpriteProps = {
  id: number | string;
  size: number;
  game: string;
  gen: string;
};

export const Sprite: React.FC<SpriteProps> = ({ id, size, gen, game }) => {
  // const api = usePokemonClient();
  // const p = useQuery(
  //   ["pokemonSprite", id],
  //   async () => {
  //     return api
  //       .getPokemonById(Number(id))
  //       .then((data) => data)
  //       .catch((err) => {
  //         throw err;
  //       });
  //   },
  //   {
  //     refetchOnMount: false,
  //     refetchOnWindowFocus: false,
  //     enabled: Boolean(id),
  //   }
  // );

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
