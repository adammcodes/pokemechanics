import PokedexById from "@/app/pokedex/[gen]/PokedexById";
import NationalDex from "@/app/pokedex/[gen]/NationalDex";

type HeaderSelectServerProps = {
  game: string;
  generationString: string;
  dexId: string | null;
  pokemonId: string | undefined;
};

export default function HeaderSelectServer({
  game,
  generationString,
  dexId,
  pokemonId,
}: HeaderSelectServerProps) {
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
