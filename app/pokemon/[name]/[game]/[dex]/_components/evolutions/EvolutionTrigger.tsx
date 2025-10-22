import { EvolutionDetail } from "pokenode-ts";
import convertKebabCaseToTitleCase from "@/utils/convertKebabCaseToTitleCase";
import relativeAttackAndDefense from "@/lib/relativeAttackAndDefence";

const EvolutionTrigger = ({ details }: { details: EvolutionDetail }) => {
  const formatName = convertKebabCaseToTitleCase;
  const trigger = details?.trigger.name;
  const level = details?.min_level;
  const item = details?.item;
  const heldItem = details?.held_item;
  const knownMove = details?.known_move;
  const knownMoveType = details?.known_move_type;
  const location = details?.location;
  // const minAffection = details.min_affection;
  const minBeauty = details?.min_beauty;
  const minHappiness = details?.min_happiness;
  // const needsOverworldRain = details[0].needs_overworld_rain;
  // const partySpecies = details[0].party_species;
  // const partyType = details[0].party_type;
  const relativePhysicalStats =
    details?.relative_physical_stats &&
    relativeAttackAndDefense(details.relative_physical_stats);
  const timeOfDay = details?.time_of_day;
  // const tradeSpecies = details[0].trade_species;
  const turnUpsideDown = details?.turn_upside_down;
  const locationName = location?.name;

  return (
    <div className="mt-auto flex flex-col justify-center items-center text-center p-3 max-w-[150px]">
      {trigger === "level-up" && (
        <small>
          {level && `Lv. ${level}`}
          <br />
          {formatName(trigger)}
          {minBeauty && (
            <>
              <br />
              with
              <br />
              {`${minBeauty === 171 ? "Max" : minBeauty} Beauty`}
            </>
          )}
          {minHappiness && (
            <>
              <br />
              {`with ${minHappiness} happiness`}
            </>
          )}
          {timeOfDay && (
            <>
              <br />
              {`during ${formatName(timeOfDay)}`}
            </>
          )}
          {relativePhysicalStats && (
            <>
              <br />
              {relativePhysicalStats}
            </>
          )}
          {locationName && (
            <>
              <br />
              {`at ${formatName(locationName)}`}
            </>
          )}
          {turnUpsideDown && (
            <>
              <br />
              {`while the console is turned upside down`}
            </>
          )}
          {heldItem && (
            <>
              <br />
              while holding
              <br />
              {formatName(heldItem.name)}
            </>
          )}
          {knownMove && (
            <>
              <br />
              knowing
              <br />
              {formatName(knownMove.name)}
            </>
          )}
          {knownMoveType && (
            <>
              <br />
              {`knowing a ${formatName(knownMoveType.name)} move`}
            </>
          )}
        </small>
      )}
      {trigger === "use-item" && item && (
        <small>
          Use {formatName(item.name)}
          {timeOfDay && (
            <>
              <br />
              {`during ${formatName(timeOfDay)}`}
            </>
          )}
        </small>
      )}
      {trigger === "trade" && (
        <small>
          Trade{" "}
          {heldItem && (
            <>
              holding <br />
              {formatName(heldItem.name)}
            </>
          )}
        </small>
      )}
      {trigger === "known-move" && knownMove && (
        <small>
          Knows {formatName(knownMove.name)}{" "}
          {knownMoveType && ` of type ${formatName(knownMoveType.name)}`}
        </small>
      )}
      {trigger === "strong-style-move" && knownMove && (
        <small>
          Used the strong-style move {formatName(knownMove.name)} 20 times in
          battle
        </small>
      )}
      {trigger === "agile-style-move" && knownMove && (
        <small>
          Used the agile-style move {formatName(knownMove.name)} 20 times in
          battle
        </small>
      )}
      {trigger === "recoil-damage" && (
        <small>
          Received
          <br /> recoil damage
        </small>
      )}
      {trigger && <span>⇒</span>}
      {!trigger && <small>{`No evolution trigger in this game`}</small>}
      {!trigger && <span className="font-bold">&times;</span>}
    </div>
  );
};

export default EvolutionTrigger;
