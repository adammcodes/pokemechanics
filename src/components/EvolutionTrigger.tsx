import convertKebabCaseToTitleCase from "../utils/convertKebabCaseToTitleCase";
import relativeAttackAndDefense from "../utils/relativeAttackAndDefence";

const EvolutionTrigger = ({ details }: any) => {
  console.log(details);
  const formatName = convertKebabCaseToTitleCase;
  const trigger = details[0].trigger.name;
  const level = details[0].min_level;
  const item = details[0].item;
  const heldItem = details[0].held_item;
  const knownMove = details[0].known_move;
  const knownMoveType = details[0].known_move_type;
  const location = details[0].location;
  const minAffection = details[0].min_affection;
  const minBeauty = details[0].min_beauty;
  const minHappiness = details[0].min_happiness;
  // const needsOverworldRain = details[0].needs_overworld_rain;
  // const partySpecies = details[0].party_species;
  // const partyType = details[0].party_type;
  const relativePhysicalStats = relativeAttackAndDefense(
    details[0].relative_physical_stats
  );
  const timeOfDay = details[0].time_of_day;
  // const tradeSpecies = details[0].trade_species;
  const turnUpsideDown = details[0].turn_upside_down;
  const locationName = location?.name;

  return (
    <div className="flex flex-col justify-center items-center text-center px-3 py-3 max-w-[150px]">
      {trigger === "level-up" && (
        <small>
          {level && `Lv. ${level}`}
          <br />
          {formatName(trigger)}
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
      {trigger === "use-item" && (
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
          Trade {heldItem && ` holding ${formatName(heldItem.name)}`}
        </small>
      )}
      {trigger === "known-move" && (
        <small>
          Knows {formatName(knownMove.name)}{" "}
          {knownMoveType && ` of type ${formatName(knownMoveType.name)}`}
        </small>
      )}
      {trigger === "strong-style-move" && (
        <small>
          Used the strong-style move {formatName(knownMove.name)} 20 times in
          battle
        </small>
      )}
      <span>⇒</span>
    </div>
  );
};

export default EvolutionTrigger;
