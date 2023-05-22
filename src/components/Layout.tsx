import { useContext } from "react";
import { GameContext } from "../context/_context";
import useGameVersion from "../hooks/useGameVersion";
import Header from "./Header";
import Footer from "./Footer";
import styles from "../../styles/Home.module.css";
import { fonts } from "../../src/fonts";

type LayoutProps = {
  children: React.ReactNode;
};

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  // Get currently selected game for it's version url
  const { game } = useContext(GameContext);
  // Get versionGroup data for the game
  const versionGroup = useGameVersion(game);

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
    if (version.id >= 8) {
      fontIndex = 2;
      fontAdjust = 1.3;
    }
  }

  return (
    <div className={`${styles.container} ${fonts[fontIndex].className}`}>
      <Header />
      {children}
      <Footer />
      <style jsx>
        {`
          * {
            font-size: ${fontAdjust}em;
            line-height: 1em;
          }
        `}
      </style>
    </div>
  );
};
