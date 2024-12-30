import styles from "./Layout.module.css";

type LayoutProps = {
  children: React.ReactNode;
};

export const LayoutSkeleton: React.FC<LayoutProps> = ({ children }) => {
  return (
    <>
      <div className={`${styles.container}`}>
        <main>{children}</main>
      </div>
    </>
  );
};
