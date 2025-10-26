import { GraphQLPokemonMove } from "@/types/graphql";
import convertKebabCaseToTitleCase from "@/utils/convertKebabCaseToTitleCase";
import styles from "./Moves.module.css";
import { Move } from "./Move";

const filterMovesByMethod = (moves: GraphQLPokemonMove[], method: string) => {
  return moves.filter((m: GraphQLPokemonMove) => {
    return m.movelearnmethod.name === method;
  });
};

// Create an array of unique move_learn_methods for this gen
const getLearnMethods = (moves: GraphQLPokemonMove[]) => {
  return moves
    .map((m) => m.movelearnmethod.name)
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

const sortMachinesByMachineNumber = (
  moveA: GraphQLPokemonMove,
  moveB: GraphQLPokemonMove
) => {
  // If the moves are not machine moves, return 0
  if (
    moveA.movelearnmethod.name !== "machine" ||
    moveB.movelearnmethod.name !== "machine"
  ) {
    return 0;
  }
  // If the moves are machine moves, sort by machine number
  const machineNumberA = moveA.move.machines[0].machine_number;
  const machineNumberB = moveB.move.machines[0].machine_number;
  return machineNumberA - machineNumberB; // ascending order
};

export const Moves = ({
  moves,
  game,
  generationString,
}: {
  moves: GraphQLPokemonMove[];
  game: string;
  generationString: string;
}) => {
  const formatName = convertKebabCaseToTitleCase;
  const moveLearnMethods = getLearnMethods(moves).sort(sortMoveMethods);
  return (
    <div className={`mt-10 w-full ${styles.container}`}>
      {moveLearnMethods
        .filter((method) => method !== "n/a")
        .map((method, i) => {
          return (
            <div key={i} className="w-full">
              <figure className={styles.wrapper}>
                <table className="w-full">
                  <thead>
                    <tr>
                      <th
                        className="sticky top-0 bg-[#e0ebeb] z-10"
                        colSpan={10}
                      >
                        <header
                          className={`py-1 w-full text-left px-2 lg:text-center ${styles.header}`}
                        >
                          {formatName(method)}
                        </header>
                      </th>
                    </tr>
                    <tr>
                      <th className="sticky top-7 bg-[#e0ebeb] z-10 px-2 py-2 text-left">
                        {method === "machine" && <>Machine</>}
                        {method !== "machine" && <>Level</>}
                      </th>
                      <th className="sticky top-7 bg-[#e0ebeb] z-10 px-2 py-2 text-left">
                        Attack Name
                      </th>
                      <th className="sticky top-7 bg-[#e0ebeb] z-10 px-2 py-2">
                        Type
                      </th>
                      <th className="sticky top-7 bg-[#e0ebeb] z-10 px-2 py-2">
                        Class
                      </th>
                      <th className="sticky top-7 bg-[#e0ebeb] z-10 px-2 py-2">
                        Power
                      </th>
                      <th className="sticky top-7 bg-[#e0ebeb] z-10 px-2 py-2">
                        Accuracy
                      </th>
                      <th className="sticky top-7 bg-[#e0ebeb] z-10 px-2 py-2">
                        PP
                      </th>
                      <th className="sticky top-7 bg-[#e0ebeb] z-10 px-2 py-2">
                        Effect %
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filterMovesByMethod(moves, method)
                      .sort(sortMachinesByMachineNumber)
                      .map((m, index) => {
                        return (
                          <Move
                            key={index}
                            m={m}
                            method={method}
                            game={game}
                            generationString={generationString}
                          />
                        );
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
