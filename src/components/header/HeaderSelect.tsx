import PokedexById from "@/app/pokedex/[gen]/_components/PokedexById";
import NationalDex from "@/app/pokedex/[gen]/_components/NationalDex";

export default function HeaderSelect({
  pokemonId,
  dexName,
  game,
  generationString,
}: {
  pokemonId: string;
  dexName: string;
  game: string;
  generationString: string;
}) {
  const isNationalDex = dexName === "national";
  const isPokemonPage = dexName && pokemonId && generationString;

  return (
    <>
      {isPokemonPage && !isNationalDex && (
        <PokedexById
          dexId={parseInt(pokemonId)}
          dexName={dexName}
          pokemonId={parseInt(pokemonId)}
          includeHeader={false}
          game={game}
          generationString={generationString}
        />
      )}

      {isPokemonPage && isNationalDex && (
        <NationalDex
          includeHeader={false}
          game={game}
          generationString={generationString}
        />
      )}
    </>
  );
}
