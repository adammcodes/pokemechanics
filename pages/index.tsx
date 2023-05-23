// React
import { useContext } from "react";
// Next
import Head from "next/head";
// Components
import GenSelector from "../src/components/GenSelector";
// Hooks
import useVersionGroups from "../src/hooks/useVersionGroups";
import useGameVersion from "../src/hooks/useGameVersion";
// Context
import GameContext from "../src/context/GameContextProvider";

export default function Home() {
  // Get list of game generations from poke-api
  const gens = useVersionGroups();
  // Get currently selected game for it's version url
  const { game } = useContext(GameContext);
  // Get versionGroup data for the game
  const versionGroup = useGameVersion(game);

  return (
    <>
      <Head>
        <title>Pokémechanics</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <p className="mb-4">WHICH GAME ARE YOU PLAYING?</p>
        {gens.data && <GenSelector gens={gens.data} />}
      </main>

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
