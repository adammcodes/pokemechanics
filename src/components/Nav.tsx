import styles from "../../styles/Nav.module.css";
import Link from "next/link";

export default function Nav() {
  return (
    <nav className={styles.menu}>
      <ul className={styles.nav__list}>
        <li>
          <Link href="/pokedex">Pokédex</Link>
          <i></i>
        </li>
        <li>
          <Link href="/bag">Bag</Link>
          <i></i>
        </li>
        <li>
          <Link href="/locations">Locations</Link>
          <i></i>
        </li>
        <li>
          <Link href="/">Switch Game</Link>
          <i></i>
        </li>
      </ul>
    </nav>
  );
}
