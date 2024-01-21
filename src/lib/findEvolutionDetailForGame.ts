import { EvolutionDetail } from "pokenode-ts";
import { numOfPokemonByGen } from "@/constants/numOfPokemonByGen";

// This function recieves an array of evolution details and a generation name and returns the evolution detail for that game
export default function findEvolutionDetailForGame(
  speciesName: string,
  evolution_details: any,
  generation: string
): EvolutionDetail {
  const genNumber = Object.keys(numOfPokemonByGen).indexOf(generation) + 1;
  // console.log(genNumber);
  // console.log(speciesName);
  // console.log(evolution_details);

  // If there is only one evolution detail, return it
  if (evolution_details.length === 1) return evolution_details[0];

  // by default return the first evolution detail
  let detailForGen: EvolutionDetail = evolution_details[0];

  // Special cases where there is no other way to tell which evolution detail to use
  if (speciesName === "milotic" && genNumber >= 5) {
    detailForGen = evolution_details[1];
  } else if (speciesName === "glaceon" || speciesName === "leafeon") {
    if (genNumber === 4) return evolution_details[0];
    if (genNumber === 5) return evolution_details[1];
    if (genNumber === 6 || genNumber === 7) return evolution_details[2];
    if (genNumber > 7) return evolution_details[4];
  }

  return detailForGen;
}
