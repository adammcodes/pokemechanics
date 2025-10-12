import { PokemonMoveByMethod } from "@/types/index";
import convertKebabCaseToTitleCase from "@/utils/convertKebabCaseToTitleCase";
import replaceNewlinesAndFeeds from "@/utils/replaceNewlinesAndFeeds";
import { MoveMachine } from "./MoveMachine";
import PokemonTypeChip from "@/components/common/PokemonTypeChip";
import { POKEAPI_REST_ENDPOINT } from "@/constants/apiConfig";

// Server-side data fetching function
async function fetchMoveById(id: number) {
  const response = await fetch(`${POKEAPI_REST_ENDPOINT}/move/${id}`, {
    headers: {
      Accept: "application/json",
      "User-Agent": "Pokemechanics/1.0",
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch move data: ${response.status}`);
  }

  return response.json();
}

type MoveServerProps = {
  m: PokemonMoveByMethod;
  method: string;
  game: string;
  moveData?: any; // Pre-fetched move data
};

export const MoveServer: React.FC<MoveServerProps> = async ({
  m,
  method,
  game,
  moveData,
}) => {
  const formatName = convertKebabCaseToTitleCase;

  const level =
    m.level_learned_at === 1 || m.level_learned_at === 0
      ? "--"
      : m.level_learned_at;

  const moveId = Number(m.move.url.split("/").at(-2));

  // Use pre-fetched data if available, otherwise fetch it
  const move = moveData || (await fetchMoveById(moveId));

  const moveTextForGame = move?.flavor_text_entries.find((entry: any) => {
    return entry.version_group.name === game && entry.language.name === "en";
  })?.flavor_text;

  const backupMoveText = move?.flavor_text_entries.find((entry: any) => {
    return entry.language.name === "en";
  })?.flavor_text;

  const moveText = moveTextForGame || backupMoveText;

  if (!move) return null;

  return (
    <>
      <tr>
        <td rowSpan={2}>
          <div className="px-2 py-2 flex items-center">
            {method === "machine" && (
              <MoveMachine machines={move.machines} game={game} />
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
            <PokemonTypeChip typeName={move.type.name} />
          </div>
        </td>
        <td>
          <div className="flex flex-row justify-center px-2 py-2 rounded-md bg-[#a7bcb9]">
            {move.damage_class && <>{formatName(move.damage_class.name)}</>}
          </div>
        </td>
        <td className="text-center">
          <div className="px-2 py-2 rounded-md bg-[#a7bcb9]">
            {move.power ? move.power : "--"}
          </div>
        </td>
        <td className="text-center">
          <div className="px-2 py-2 rounded-md bg-[#a7bcb9]">
            {move.accuracy ? move.accuracy : "--"}
          </div>
        </td>
        <td className="text-center">
          <div className="px-2 py-2 rounded-md bg-[#a7bcb9]">
            {move.pp ? move.pp : "--"}
          </div>
        </td>
        <td className="text-center">
          <div className="px-2 py-2 rounded-md bg-[#a7bcb9]">
            {move.effect_chance ? move.effect_chance : "--"}
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
  );
};
