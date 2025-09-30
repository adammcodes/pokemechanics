"use client";
import styles from "./Header.module.css";
import HeaderTitle from "./HeaderTitle";
import HeaderOptions from "./HeaderOptions";

export default function Header() {
  return (
    <div className="w-full flex">
      <header className={styles.header}>
        <HeaderTitle />

        <HeaderOptions />
      </header>
    </div>
  );
}
