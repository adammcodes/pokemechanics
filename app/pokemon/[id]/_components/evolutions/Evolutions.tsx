import styles from "./Evolutions.module.css";
import PokemonEvolutionChain from "./PokemonEvolutionChain";

type EvolutionsProps = {
  evolutionChainData: any;
  game: string;
  generation: string;
  dexId: string;
  regionName: string;
  pokemonHeight: number;
};

export default function Evolutions({
  evolutionChainData,
  game,
  generation,
  dexId,
  regionName,
  pokemonHeight,
}: EvolutionsProps) {
  if (!evolutionChainData) return <div className="p-5">Loading...</div>;

  return (
    <div className={`${styles.evolutions} py-5`}>
      {evolutionChainData && generation && (
        <div className="flex justify-center">
          {PokemonEvolutionChain(evolutionChainData.chain, {
            game,
            generation,
            dexId,
            regionName,
            pokemonHeight,
          })}
        </div>
      )}
    </div>
  );
}
