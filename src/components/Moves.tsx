import { useContext } from "react";
import { Move } from "./Move";
import { GameContext } from "@/context/_context";
import filterMovesForGen from "@/lib/filterMovesForGen";
import mapMoves from "@/lib/mapMoves";
import convertKebabCaseToTitleCase from "@/utils/convertKebabCaseToTitleCase";
import { PokemonMoveByMethod, PokemonMoveVersion } from "@/types/index";
import styles from "@/styles/Moves.module.css";

const filterMovesByMethod = (moves: PokemonMoveByMethod[], method: string) => {
  return moves.filter((m: PokemonMoveByMethod) => {
    return m.move_learn_method === method;
  });
};

// Create an array of unique move_learn_methods for this gen
const getLearnMethods = (moves: PokemonMoveByMethod[]) => {
  return moves
    .map((m) => m.move_learn_method)
    .filter((el, i, arr) => arr.indexOf(el) === i);
};

// sort callback for move_learn_methods
const sortMoveMethods = (a: string, b: string) => {
  const movesOrder = [
    "level-up",
    "machine",
    "tutor",
    "egg",
    "stadium-surfing-pikachu",
    "n/a",
  ];
  const aIndex = movesOrder.indexOf(a);
  const bIndex = movesOrder.indexOf(b);
  if (aIndex < bIndex) {
    return -1;
  }
  return 0;
};

type MovesProps = {
  moves: PokemonMoveVersion[];
};

export const Moves: React.FC<MovesProps> = ({ moves }) => {
  const formatName = convertKebabCaseToTitleCase;
  const { game } = useContext(GameContext);

  // Filter out moves that do not exist in the game
  const movesForGen = filterMovesForGen(moves, game);

  // Map only moves for the game into custom type PokemonMoveByMethod[]
  const allMoves: PokemonMoveByMethod[] = mapMoves(movesForGen, game).sort(
    (a, b) => a.level_learned_at - b.level_learned_at
  );
  // Create an array of unique move_learn_methods for this gen
  const moveLearnMethods = getLearnMethods(allMoves).sort(sortMoveMethods);

  console.log(moveLearnMethods);

  return (
    <div className={`mt-10 w-full ${styles.container}`}>
      {moveLearnMethods.map((method, i) => {
        return (
          <div key={i} className="w-full">
            <header className={`py-1 w-full text-center ${styles.header}`}>
              {formatName(method)}
            </header>
            <figure className={styles.wrapper}>
              <table className="overflow-x-scroll w-full border-separate border-spacing-1">
                <thead>
                  <tr>
                    <th className="px-2 py-2 text-left">
                      {method === "machine" && <>Machine</>}
                      {method !== "machine" && <>Level</>}
                    </th>
                    <th className="px-2 py-2 text-left">Attack Name</th>
                    <th className="px-2 py-2">Type</th>
                    <th className="px-2 py-2">Power</th>
                    <th className="px-2 py-2">Accuracy</th>
                    <th className="px-2 py-2">PP</th>
                    <th className="px-2 py-2">Effect %</th>
                  </tr>
                </thead>
                <tbody>
                  {filterMovesByMethod(allMoves, method).map((m, index) => {
                    return <Move key={index} m={m} method={method} />;
                  })}
                </tbody>
              </table>
            </figure>
          </div>
        );
      })}
    </div>
  );
};
