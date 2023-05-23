// import { useContext, useEffect } from "react";
// import { GameContext } from "../context/_context";
import Header from "./Header";
import Footer from "./Footer";
import styles from "../../styles/Home.module.css";
import { fonts } from "../../src/fonts";

type LayoutProps = {
  children: React.ReactNode;
};

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  // Get currently selected game for it's version url
  // const { font, setFont } = useContext(GameContext);

  // let fontIndex = font;
  let fontIndex = 2;

  // useEffect(() => {
  //   const storedFont = localStorage.getItem("font");
  //   if (storedFont) {
  //     const font = JSON.parse(storedFont);
  //     setFont(font);
  //     fontIndex = font;
  //   }
  // }, []);

  return (
    <div className={`${styles.container}`}>
      <Header />
      {children}
      <Footer />
      <style jsx>
        {`
          * {
            font-size: ${fontIndex >= 2 ? 1.5 : 1}em;
            line-height: 1em;
            font-family: ${fonts[fontIndex]
              ? fonts[fontIndex].style.fontFamily
              : fonts[0].style.fontFamily};
          }
        `}
      </style>
    </div>
  );
};
