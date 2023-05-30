import { PokemonMoveVersion, VersionGroupDetails } from "../types";

export default function filterMovesForGen(moves: PokemonMoveVersion[], gen: string) {
  // 1. filter from moves all moves that are not in the given gen version
  const movesForVersion: PokemonMoveVersion[] = moves.filter((m: PokemonMoveVersion) => {
    // check if the move exists for the gen
    const moveExistsInVersion = m.version_group_details.find((version: VersionGroupDetails) => {
      return version.version_group.name === gen;
    });
    // return value is this move or undefined
    return moveExistsInVersion;
  });

  return movesForVersion;
}