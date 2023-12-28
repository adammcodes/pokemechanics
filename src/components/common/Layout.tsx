import Header from "./Header";
import Footer from "./Footer";
import styles from "@/styles/Home.module.css";

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
