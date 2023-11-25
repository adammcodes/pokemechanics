import styles from "@/styles/Footer.module.css";

export default function Footer() {
  return (
    <footer className={styles.footer}>
      POKEMON AND ALL RESPECTIVE NAMES ARE TRADEMARK AND © OF NINTENDO 1996-2023
      <br />
      <p>
        Credit goes to&nbsp;
        <a
          href="https://codepen.io/raubaca/pen/xbZKvY"
          target="_blank"
          className="underline"
        >
          Raúl Barrera
        </a>
        &nbsp;for the pokeball animation.
      </p>
    </footer>
  );
}
