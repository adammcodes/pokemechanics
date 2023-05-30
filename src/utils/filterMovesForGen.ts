import { VersionGroup, MoveLearnMethod } from "pokenode-ts";

type PokemonMove = {
  name: string;
  url: string;
}

type VersionGroupDetails = {
  level_learned_at: number;
  move_learn_method: MoveLearnMethod;
  version_group: VersionGroup;
}

type PokemonMoveVersion = {
  move: PokemonMove;
  version_group_details: VersionGroupDetails[]
};

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