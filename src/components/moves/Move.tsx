"use client";
import useMoveClient from "../../hooks/useMoveClient";
import { useQuery } from "react-query";
import { useContext } from "react";
import { PokemonMoveByMethod } from "../../types";
import convertKebabCaseToTitleCase from "../../utils/convertKebabCaseToTitleCase";
import { GameContext } from "../../context/_context";
import replaceNewlinesAndFeeds from "../../utils/replaceNewlinesAndFeeds";
import { MoveMachine } from "./MoveMachine";
import PokemonTypeChip from "../common/PokemonTypeChip";

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

  const fetchMove = async (id: number) => {
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
            <td rowSpan={2}>
              <div className="px-2 py-2 flex items-center">
                {method === "machine" && (
                  <MoveMachine machines={moveQ.data.machines} game={game} />
                )}
                {method !== "machine" && <>{level}</>}
              </div>
            </td>
            <td rowSpan={2}>
              <div className="px-2 py-2 flex items-center">
                {formatName(m.move.name)}
              </div>
            </td>
            <td>
              <div className="flex flex-row justify-center px-2 py-[13.4px] rounded-md bg-[#a7bcb9]">
                <PokemonTypeChip typeName={moveQ.data.type.name} />
              </div>
            </td>
            <td>
              <div className="flex flex-row justify-center px-2 py-2 rounded-md bg-[#a7bcb9]">
                {moveQ.data.damage_class && (
                  <>{formatName(moveQ.data.damage_class.name)}</>
                )}
              </div>
            </td>
            <td className="text-center">
              <div className="px-2 py-2 rounded-md bg-[#a7bcb9]">
                {moveQ.data.power ? moveQ.data.power : "--"}
              </div>
            </td>
            <td className="text-center">
              <div className="px-2 py-2 rounded-md bg-[#a7bcb9]">
                {moveQ.data.accuracy ? moveQ.data.accuracy : "--"}
              </div>
            </td>
            <td className="text-center">
              <div className="px-2 py-2 rounded-md bg-[#a7bcb9]">
                {moveQ.data.pp ? moveQ.data.pp : "--"}
              </div>
            </td>
            <td className="text-center">
              <div className="px-2 py-2 rounded-md bg-[#a7bcb9]">
                {moveQ.data.effect_chance ? moveQ.data.effect_chance : "--"}
              </div>
            </td>
          </tr>
          <tr>
            <td colSpan={7}>
              {moveText && (
                <div className="px-2 py-1 rounded-md bg-[#a7bcb9]">
                  {typeof moveText === "string" &&
                    replaceNewlinesAndFeeds(moveText)}
                </div>
              )}
            </td>
          </tr>
        </>
      )}
    </>
  );
};
