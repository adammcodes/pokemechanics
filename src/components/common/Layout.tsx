import Head from "next/head";
import Header from "./Header";
import Footer from "./Footer";
import styles from "@/styles/Home.module.css";
import { fonts } from "@/constants/fonts";

type LayoutProps = {
  children: React.ReactNode;
};

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  let fontIndex = 2;

  return (
    <>
      <Head>
        <meta
          name="format-detection"
          content="telephone=no, date=no, email=no, address=no"
        />
      </Head>
      <div className={`${styles.container}`}>
        <Header />
        {children}
        <Footer />
        <style jsx>
          {`
            * {
              font-size: ${fontIndex >= 2 ? 1.5 : 1}em;
              line-height: 1em;
              font-family: ${fonts[fontIndex].style.fontFamily};
            }
          `}
        </style>
      </div>
    </>
  );
};
