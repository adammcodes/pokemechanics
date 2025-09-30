import Header from "@/components/header/Header";
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
        {children}
        <Footer />
      </div>
    </>
  );
};
