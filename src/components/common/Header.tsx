import styles from "./Header.module.css";
import HeaderTitle from "./HeaderTitle";
import HeaderSelect from "./HeaderSelect";
import HeaderOptions from "./HeaderOptions";

export default function Header() {
  return (
    <div className="w-full flex">
      <header className={styles.header}>
        <HeaderTitle />

        <HeaderSelect />

        <HeaderOptions />
      </header>
    </div>
  );
}
