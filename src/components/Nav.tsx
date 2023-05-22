import styles from "../../styles/Nav.module.css";

export default function Nav() {
  return (
    <nav className={styles.menu}>
      <ul className={styles.nav__list}>
        <li>item</li>
        <li>item</li>
        <li>item</li>
        <li>item</li>
      </ul>
    </nav>
  );
}
