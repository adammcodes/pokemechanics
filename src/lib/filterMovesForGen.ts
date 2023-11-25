import { PokemonMoveVersion, VersionGroupDetails } from "@/types/index";

export default function filterMovesForGen(
  moves: PokemonMoveVersion[],
  gen: string
) {
  // 1. filter from moves all moves that are not in the given gen version
  const movesForVersion: PokemonMoveVersion[] = moves.filter(
    (m: PokemonMoveVersion) => {
      // check if the move exists for the gen
      const moveExistsInVersion = m.version_group_details.find(
        (version: VersionGroupDetails) => {
          const versionGroup = version.version_group.name;
          // Keep all moves that are in scarlet-violet so they aren't filtered out for legends-arceus
          if (versionGroup === "scarlet-violet") return true;
          // Otherwise, filter out all moves that are not in the given gen
          return versionGroup === gen;
        }
      );
      // return value is this move or undefined
      return moveExistsInVersion;
    }
  );

  return movesForVersion;
}
