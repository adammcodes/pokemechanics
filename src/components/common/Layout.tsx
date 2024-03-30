import Header from "./Header";
import Footer from "./Footer";
import styles from "./Layout.module.css";

type LayoutProps = {
  children: React.ReactNode;
};

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <>
      <div className={`${styles.container}`}>
        <Header />
        <main>{children}</main>
        <Footer />
      </div>
    </>
  );
};
