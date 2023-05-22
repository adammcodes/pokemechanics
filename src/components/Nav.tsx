import styles from "../../styles/Nav.module.css";

export default function Nav() {
  return (
    <nav className={styles.menu}>
      <ul className={styles.nav__list}>
        <li>Pokédex</li>
        <li>Moves</li>
        <li>Items</li>
        <li>Locations</li>
      </ul>
    </nav>
  );
}
