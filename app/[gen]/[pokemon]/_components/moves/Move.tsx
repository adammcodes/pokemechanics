import { GraphQLPokemonMove } from "@/types/graphql";
import convertKebabCaseToTitleCase from "@/utils/convertKebabCaseToTitleCase";
import replaceNewlinesAndFeeds from "@/utils/replaceNewlinesAndFeeds";
import { MoveMachine } from "./MoveMachine";
import PokemonTypeChip from "@/components/common/PokemonTypeChip";

type MoveProps = {
  m: GraphQLPokemonMove;
  method: string;
  game: string;
  generationString: string;
};

export const Move: React.FC<MoveProps> = async ({
  m,
  method,
  game,
  generationString,
}) => {
  const formatName = convertKebabCaseToTitleCase;

  const isStartingMove = m.level === 1 || m.level === 0;
  const level = isStartingMove ? "--" : m.level;

  const move = {
    name: m.move.name,
    type: {
      name: m.move.type.name,
      id: m.move.type.id,
    },
    damage_class: m.move.movedamageclass
      ? { name: m.move.movedamageclass.name }
      : null,
    power: m.move.power,
    accuracy: m.move.accuracy,
    pp: m.move.pp,
    effect_chance: m.move.move_effect_chance,
    machines: m.move.machines.map((machine) => ({
      item_name: machine.item.name,
      machine_number: machine.machine_number,
    })),
  };
  // Use short_effect as the move description
  // The full effect text can be shown on hover
  const moveEffectTexts = m.move.moveeffect?.moveeffecteffecttexts;
  const moveTypeId = m.move.type.id;
  const { short_effect, effect } =
    moveEffectTexts && moveEffectTexts.length > 0
      ? moveEffectTexts[0]
      : { short_effect: null, effect: null };
  // Find and replace all the instance of the substring $effect_chance% with the value of effect_chance
  const effectTextsWithEffectChance = [short_effect, effect].map((effect) => {
    return effect
      ? effect.replace(
          /\$effect_chance%/g,
          move.effect_chance ? `${move.effect_chance}%` : ""
        )
      : "";
  });
  const processedEffectTexts = effectTextsWithEffectChance
    .filter((effect) => effect !== "")
    .map((effect) => replaceNewlinesAndFeeds(effect));

  // On the pokemon page, we will only show the short effect text
  // The full effect text we can show on a dedicated page for the move, in the future.
  const [shortEffectText, fullEffectText] = processedEffectTexts;

  return (
    <>
      <tr>
        <td rowSpan={2}>
          <div className="px-2 py-2 flex items-center">
            {method === "machine" && move.machines.length > 0 && (
              <MoveMachine item_name={move.machines[0].item_name} />
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
          <div className="flex flex-row justify-center px-2 h-[2.3rem] items-center rounded-md bg-[#a7bcb9]">
            <PokemonTypeChip
              typeName={move.type.name}
              typeId={moveTypeId}
              versionGroup={game}
              generationString={generationString}
            />
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
          {processedEffectTexts.length > 0 && (
            <div className="px-2 py-1 rounded-md bg-[#a7bcb9]">
              {replaceNewlinesAndFeeds(shortEffectText)}
            </div>
          )}
        </td>
      </tr>
    </>
  );
};
