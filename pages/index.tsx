// React
import { useContext } from "react";
// Next
import Head from "next/head";
import Image from "next/image";
// Media
import styles from "../styles/Home.module.css";
import { fonts } from "../src/fonts";
// Components
import Nav from "../src/components/Nav";
import GenSelector from "../src/components/GenSelector";
// Hooks
import useVersionGroups from "../src/hooks/useVersionGroups";
import useGameVersion from "../src/hooks/useGameVersion";
// Context
import GameContext from "../src/context/GameContextProvider";

const logoSize: number = 80;

export default function Home() {
  // Get list of game generations from poke-api
  const gens = useVersionGroups();
  // Get currently selected game for it's version url
  const { game } = useContext(GameContext);
  // Get versionGroup data for the game
  const versionGroup = useGameVersion(game);
  // Get theme for selected version

  // the default font used will be based on version selected
  let fontIndex: number = 0;
  let fontAdjust: number = 1;

  // Change the font based on version selected
  if (versionGroup.data) {
    const version = versionGroup.data;
    // Gens: 1 and 2 (RBY, GSC)
    if (version.id > 4 && version.id < 8) {
      fontIndex = 1;
    }
    // Gens: 3 and 4 (RSE FR/LG)
    if (version.id >= 8 && version.id < 11) {
      fontIndex = 2;
      fontAdjust = 1.3;
    }
    // Gens: 5 and 6 (DPP BW)
    if (version.id >= 11) {
      fontIndex = 3;
      fontAdjust = 1.3;
    }
  }

  return (
    <div className={`${styles.container} ${fonts[fontIndex].className}`}>
      <Head>
        <title>Pokémechanics</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <header className={styles.head}>
        <Image
          src="/images/dudelax.png"
          width={logoSize}
          height={logoSize}
          alt="Munchlax"
          priority={true}
        />
        {versionGroup.isLoading && null}
        {versionGroup.data && (
          <>
            <h1>POKEMECHANICS</h1>
            <Nav />
          </>
        )}
      </header>

      <main>
        {versionGroup.isLoading && null}
        {versionGroup.data && (
          <p className="mb-4">WHICH GAME ARE YOU PLAYING?</p>
        )}
        {gens.data && <GenSelector gens={gens.data} />}
      </main>

      <footer>
        {versionGroup.isLoading && null}
        {versionGroup.data && (
          <>
            POKEMON AND ALL RESPECTIVE NAMES ARE TRADEMARK AND © OF NINTENDO
            1996-2023
          </>
        )}
      </footer>

      <style jsx>{`
        * {
          font-size: ${fontAdjust}em;
        }
        main {
          padding: 5rem 0;
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
        }
        footer {
          width: 100%;
          height: 100px;
          border-top: 1px solid #eaeaea;
          display: flex;
          justify-content: center;
          align-items: center;
        }
        footer img {
          margin-left: 0.5rem;
        }
        footer a {
          display: flex;
          justify-content: center;
          align-items: center;
          text-decoration: none;
          color: inherit;
        }
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
    </div>
  );
}
