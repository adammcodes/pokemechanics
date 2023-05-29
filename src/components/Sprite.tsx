import { useQuery } from "react-query";
import DynamicImage from "./DynamicImage";
import usePokemonClient from "../hooks/usePokemonClient";

type SpriteProps = {
  id: number | string;
  size: number;
};

export const Sprite: React.FC<SpriteProps> = ({ id, size }) => {
  const api = usePokemonClient();
  const p = useQuery(
    ["pokemonSprite", id],
    () => {
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

  const iconSrc = p.data
    ? p.data.sprites.versions["generation-vii"].icons.front_default
    : "";

  return (
    <>
      {p.data && (
        <DynamicImage
          width={size}
          height={size}
          src={iconSrc}
          alt={"icon sprite"}
          priority={false}
        />
      )}
    </>
  );
};
