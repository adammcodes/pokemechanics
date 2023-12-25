import { useContext } from "react";
import { useQuery } from "react-query";
import { Region, PokemonSpeciesVariety } from "pokenode-ts";
import PokemonCard from "./PokemonCard";
import { PokemonContext } from "@/context/_context";
import findVarietyForRegion from "@/lib/findVarietyForRegion";
import usePokemonClient from "@/hooks/usePokemonClient";

type PokemonVarietyProps = {
  name: string;
  regions: Region[];
  varieties: PokemonSpeciesVariety[];
};

const PokemonVariety: React.FC<PokemonVarietyProps> = ({
  varieties,
  regions,
}) => {
  const api = usePokemonClient();
  const p = useContext(PokemonContext);

  // If the pokemon's non-default variety matches the name of the region for this game
  // Then we will fetch that pokemon variety by id
  const pokemonVarietyForRegion: PokemonSpeciesVariety | undefined =
    findVarietyForRegion(varieties, regions);

  const pokemonVarietyId: number | undefined = Number(
    pokemonVarietyForRegion?.pokemon.url.split("/").at(-2)
  );

  const fetchVarietyForRegion = async (id: number) => {
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

  return (
    <>
      {pokemonVarietyForRegionQuery.isLoading && "Loading variant..."}
      {pokemonVarietyForRegionQuery.data && (
        <PokemonCard
          {...pokemonVarietyForRegionQuery.data}
          is_variant={true}
          name={pokemonVarietyForRegionQuery.data.name}
        />
      )}
      {!Boolean(pokemonVarietyId) && (
        <PokemonCard is_variant={false} name={p.name} />
      )}
    </>
  );
};

export default PokemonVariety;
