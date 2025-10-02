"use client";
import { Suspense } from "react";
import Header from "@/components/header/Header";
import Footer from "./Footer";
import LoadingSpinner from "./LoadingSpinner";
import styles from "./Layout.module.css";

type LayoutProps = {
  children: React.ReactNode;
};

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <>
      <div className={`${styles.container}`}>
        <Header />
        <Suspense
          fallback={
            <main className="w-full flex justify-center items-center min-h-[400px]">
              <LoadingSpinner size="md" />
            </main>
          }
        >
          {children}
        </Suspense>
        <Footer />
      </div>
    </>
  );
};
