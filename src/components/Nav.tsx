import styles from "../../styles/Nav.module.css";
import Link from "next/link";

export default function Nav() {
  return (
    <nav className={styles.menu}>
      <ul className={styles.nav__list}>
        <li>
          <Link href="/pokedex">Pokédex</Link>
        </li>
        <li>
          <Link href="/moves">Moves</Link>
        </li>
        <li>
          <Link href="/items">Items</Link>
        </li>
        <li>
          <Link href="/locations">Locations</Link>
        </li>
      </ul>
    </nav>
  );
}
