import styles from "./Evolutions.module.css";
import PokemonEvolutionChain from "./PokemonEvolutionChain";
import { Pokemon } from "@/types/index";

type EvolutionsProps = {
  evolutionChainData: any;
  pagePokemonData: Pokemon;
  game: string;
  generation: string;
  dexName: string;
  regionName: string;
};

export default function Evolutions({
  evolutionChainData,
  pagePokemonData,
  game,
  generation,
  dexName,
  regionName,
}: EvolutionsProps) {
  if (!evolutionChainData) return <div className="p-5">Loading...</div>;

  const pagePokemonSprite = pagePokemonData.sprites.front_default;
  const pagePokemonSpeciesId =
    pagePokemonData.species.url.split("/").at(-2) ?? "";
  const pagePokemonIsVariant = !pagePokemonData.is_default;
  const pagePokemonNameContainsRegion = pagePokemonData.name.includes(
    regionName.toLowerCase()
  );

  return (
    <div className={`${styles.evolutions} py-5`}>
      {evolutionChainData && generation && (
        <div className="flex justify-center">
          {PokemonEvolutionChain(evolutionChainData.chain, pagePokemonData, {
            game,
            generation,
            dexName,
            regionName,
          })}
        </div>
      )}
    </div>
  );
}
