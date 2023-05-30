import { PokemonMoveVersion, VersionGroupDetails } from "../types";

export default function mapMoves(moves: PokemonMoveVersion[], gen: string) {
  return moves.map((m: PokemonMoveVersion) => {
    // Get the move for the gen
    const details = m.version_group_details.find((version: VersionGroupDetails) => {
      return version.version_group.name === gen;
    });

    return {
      move: m.move,
      move_learn_method: details?.move_learn_method.name || "n/a",
      level_learned_at: details?.level_learned_at || 0
    }
  });
}