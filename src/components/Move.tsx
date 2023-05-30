import useMoveClient from "../hooks/useMoveClient";
import { useQuery } from "react-query";
import { useContext } from "react";
import { PokemonMoveByMethod } from "../types";
import convertKebabCaseToTitleCase from "../utils/convertKebabCaseToTitleCase";
import DynamicImage from "./DynamicImage";
import { GameContext } from "../context/_context";
import replaceNewlinesAndFeeds from "../utils/replaceNewlinesAndFeeds";
import { MoveMachine } from "./MoveMachine";

type MoveProps = {
  m: PokemonMoveByMethod;
  method: string;
};

export const Move: React.FC<MoveProps> = ({ m, method }) => {
  const api = useMoveClient();
  const { game } = useContext(GameContext);
  const formatName = convertKebabCaseToTitleCase;
  const level =
    m.level_learned_at === 1 || m.level_learned_at === 0
      ? "--"
      : m.level_learned_at;
  const moveId = Number(m.move.url.split("/").at(-2));
  const fetchMove = (id: number) => {
    return api
      .getMoveById(id)
      .then((data) => data)
      .catch((e) => {
        throw e;
      });
  };

  const moveQ = useQuery(
    [`move-${m.move.name}`, moveId],
    () => fetchMove(moveId),
    {
      refetchOnMount: false,
      refetchOnWindowFocus: false,
      enabled: Boolean(moveId),
    }
  );

  const moveTextForGame = moveQ.data?.flavor_text_entries.find((entry: any) => {
    return entry.version_group.name === game && entry.language.name === "en";
  })?.flavor_text;

  const backupMoveText = moveQ.data?.flavor_text_entries.find((entry: any) => {
    return entry.language.name === "en";
  })?.flavor_text;

  const moveText = moveTextForGame || backupMoveText;

  return (
    <>
      {moveQ.data && (
        <>
          <tr>
            <td className="px-4 py-2" rowSpan={2}>
              {method === "machine" && (
                <MoveMachine machines={moveQ.data.machines} game={game} />
              )}
              {method !== "machine" && <>{level}</>}
            </td>
            <td className="px-2 py-2" rowSpan={2}>
              {formatName(m.move.name)}
            </td>
            <td>
              <div className="w-full flex flex-row justify-center">
                <DynamicImage
                  width={32}
                  height={12}
                  src={`/images/types/${moveQ.data.type.name}.png`}
                  alt={`${moveQ.data.type.name}`}
                  priority={false}
                />
              </div>
            </td>
            <td className="text-center px-4 py-2">
              {moveQ.data.power ? moveQ.data.power : "--"}
            </td>
            <td className="text-center px-4 py-2">
              {moveQ.data.accuracy ? moveQ.data.accuracy : "--"}
            </td>
            <td className="text-center px-4 py-2">
              {moveQ.data.pp ? moveQ.data.pp : "--"}
            </td>
            <td className="text-center px-4 py-2">
              {moveQ.data.effect_chance ? moveQ.data.effect_chance : "--"}
            </td>
          </tr>
          <tr>
            <td colSpan={8} className="px-2">
              {typeof moveText === "string" &&
                replaceNewlinesAndFeeds(moveText)}
            </td>
          </tr>
        </>
      )}
    </>
  );
};
