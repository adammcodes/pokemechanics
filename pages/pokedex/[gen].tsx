import type { InferGetServerSidePropsType } from "next";
import useGameClient from "../../src/hooks/useGameClient";
import { PokedexContextProvider } from "../../src/context/PokedexContextProvider";
import { DexNational } from "../../src/components/DexNational";
import Dex from "../../src/components/Dex";
import { numOfPokemonByGen } from "../../constants/numOfPokemonByGen";
import { NamedAPIResource } from "pokenode-ts";
import styles from "../../styles/Pokedexes.module.css";

// use getServerSideProps to fetch the game version for the selected generation
export async function getServerSideProps(context: any) {
  // Get the selected generation from the URL query params
  // e.g. /pokedex/red-blue
  // gen = red-blue
  const { gen } = context.query as { gen: string };

  // if no gen is provided, redirect to the index page
  if (!gen) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  // fetch the version group for the selected generation
  const api = useGameClient();
  const versionGroup = await api
    .getVersionGroupByName(gen)
    .then((data: any) => data)
    .catch((error: any) => error);

  // genNumberString is a string "generation" and the number roman numeral as a string e.g. "generation-i"
  const genNumberString: string = versionGroup.generation.name;
  // pokedexes is an array of pokedexes for the selected generation
  const pokedexes: NamedAPIResource[] = versionGroup.pokedexes;

  return {
    props: {
      versionGroup,
      genNumberString,
      pokedexes,
    },
  };
}

// create a Pokedex page for each generation
export default function Pokedex({
  genNumberString,
  pokedexes,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  return (
    <main className="flex-row w-full justify-around items-start px-5">
      <div className="flex flex-wrap w-full justify-around items-start px-5">
        {/* render the national dex */}
        <PokedexContextProvider dexId={1}>
          <DexNational
            generation={genNumberString}
            upperLimitNumber={numOfPokemonByGen[genNumberString]}
          />
        </PokedexContextProvider>
        <div
          className={`${styles.pokedexes} flex flex-wrap w-full justify-around items-start px-5`}
        >
          {/* render each pokedex in the generation */}
          {pokedexes.length > 0 &&
            pokedexes.map((dex: NamedAPIResource) => {
              const dexId: number = Number(dex.url.split("/").at(-2));
              return (
                <PokedexContextProvider key={dex.url} dexId={dexId}>
                  <Dex />
                </PokedexContextProvider>
              );
            })}
        </div>
      </div>
    </main>
  );
}
