import { useContext } from "react";
import { useQuery } from "react-query";
import { PokemonContext } from "../context/_context";
import { Region, PokemonSpeciesVariety } from "pokenode-ts";
import usePokemonClient from "../hooks/usePokemonClient";
import { PokemonCardVariant } from "./PokemonCardVariant";
import { PokemonCard } from "./PokemonCard";

type PokemonVarietyProps = {
  name: string;
  regions: Region[];
  varieties: PokemonSpeciesVariety[];
};
export const PokemonVariety: React.FC<PokemonVarietyProps> = ({
  varieties,
  regions,
}) => {
  const api = usePokemonClient();
  const p = useContext(PokemonContext);
  // If the pokemon's non-default variety matches the name of the region for this game
  // Then we will fetch that pokemon variety by id
  const pokemonVarietyForRegion: PokemonSpeciesVariety | undefined = varieties
    .filter((variety) => !variety.is_default)
    .find((variety) => {
      return variety.pokemon.name.includes(regions[0].name);
    });

  const pokemonVarietyId: number | undefined = Number(
    pokemonVarietyForRegion?.pokemon.url.split("/").at(-2)
  );

  const fetchVarietyForRegion = (id: number) => {
    return api
      .getPokemonById(id)
      .then((data) => data)
      .catch((err) => {
        throw err;
      });
  };

  // Fetch other varieties of this pokemon if there is multiple
  const pokemonVarietyForRegionQuery = useQuery(
    ["pokemonVarietyForRegion", p.name],
    () => fetchVarietyForRegion(pokemonVarietyId),
    {
      enabled: varieties.length > 1 && Boolean(pokemonVarietyId),
    }
  );

  console.log(p);
  console.log(pokemonVarietyForRegionQuery.data);
  console.log(varieties);
  return (
    <main className="w-full">
      {pokemonVarietyForRegionQuery.isLoading && "Loading variant..."}
      {pokemonVarietyForRegionQuery.data && (
        <PokemonCardVariant {...pokemonVarietyForRegionQuery.data} />
      )}
      {!Boolean(pokemonVarietyId) && <PokemonCard />}
    </main>
  );
};
