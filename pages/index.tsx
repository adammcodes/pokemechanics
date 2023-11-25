import { useContext } from "react";
import GameContext from "../src/context/GameContextProvider";
// Next
import Head from "next/head";
import type { InferGetStaticPropsType, GetStaticProps } from "next";
import { Gen } from "../src/types";
import { GameClient } from "pokenode-ts"; // import the GameClient that is auto-cached
// Components
import GenSelector from "../src/components/GenSelector";
import PokeballLoader from "../src/components/PokeballLoader";
// Styles
import styles from "../styles/TypingText.module.css";

export const getStaticProps: GetStaticProps<{
  gens: Gen[];
}> = async () => {
  const api = new GameClient();
  return await api
    .listVersionGroups(0, 25) // right now supporting up to scarlet-violet
    .then((data: any) => {
      return { props: { gens: data.results } };
    })
    .catch((error: any) => error);
};

export default function Home({
  gens,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  const { loading } = useContext(GameContext);

  return (
    <>
      <Head>
        <title>
          Pokémechanics - A complete Pokémon resource for the video game series
        </title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {loading && (
        <main>
          {/* Shaking Pokeball animation */}
          <PokeballLoader />
        </main>
      )}

      {!loading && (
        <main>
          <div className={styles.typing}>
            WHICH GAME ARE YOU PLAYING?<span className={styles.cursor}>_</span>
          </div>
          {gens && <GenSelector gens={gens} />}
        </main>
      )}

      <style jsx>{`
        code {
          background: #fafafa;
          border-radius: 5px;
          padding: 0.75rem;
          font-size: 1.1rem;
          font-family: Menlo, Monaco, Lucida Console, Liberation Mono,
            DejaVu Sans Mono, Bitstream Vera Sans Mono, Courier New, monospace;
        }
      `}</style>

      <style jsx global>{`
        html,
        body {
          padding: 0;
          margin: 0;
          font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto,
            Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue,
            sans-serif;
        }
        * {
          box-sizing: border-box;
        }
      `}</style>
    </>
  );
}
