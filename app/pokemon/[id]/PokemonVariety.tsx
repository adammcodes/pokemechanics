"use client";
// THIS COMPONENT IS NOT USED
import { useContext } from "react";
import { useQuery } from "react-query";
import { PokemonSpeciesVariety, SpeciesVariety } from "@/types/index";
import PokemonCardServer from "./PokemonCardServer";
import { PokemonContext } from "@/context/_context";
import findVarietyForRegion from "@/lib/findVarietyForRegion";
import usePokemonClient from "@/hooks/usePokemonClient";

type PokemonVarietyProps = {
  name: string;
  regions: { name: string; id: number }[];
  varieties: PokemonSpeciesVariety["varieties"];
};

const PokemonVariety: React.FC<PokemonVarietyProps> = ({
  varieties,
  regions,
}) => {
  const api = usePokemonClient();
  const p = useContext(PokemonContext);
  const regionName = regions[0].name;

  // If the pokemon's non-default variety matches the name of the region for this game
  // Then we will fetch that pokemon variety by id
  const pokemonVarietyForRegion: SpeciesVariety | undefined =
    findVarietyForRegion(varieties, regionName);

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
      enabled: varieties.length > 1 && Boolean(pokemonVarietyForRegion),
    }
  );

  return (
    <>
      {pokemonVarietyForRegionQuery.isLoading && "Loading variant..."}
      {pokemonVarietyForRegion && pokemonVarietyForRegionQuery.data && (
        <PokemonCardServer
          {...pokemonVarietyForRegionQuery.data}
          name={pokemonVarietyForRegionQuery.data.name}
          regionName={regionName}
        />
      )}
      {!Boolean(pokemonVarietyForRegion) && (
        <PokemonCardServer {...p} name={p.name} regionName={regionName} />
      )}
    </>
  );
};

export default PokemonVariety;
