import PokedexById from "@/app/pokedex/[gen]/PokedexById";
import NationalDex from "@/app/pokedex/[gen]/NationalDex";

export default function HeaderSelect({
  pokemonId,
  dexId,
  game,
  generationString,
}: {
  pokemonId: string;
  dexId: string;
  game: string;
  generationString: string;
}) {
  const isNationalDex = dexId === "1";
  const isPokemonPage = dexId && pokemonId && generationString;
  return (
    <>
      {isPokemonPage && !isNationalDex && (
        <PokedexById
          dexId={parseInt(dexId)}
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
