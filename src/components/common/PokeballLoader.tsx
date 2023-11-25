// import PokeballLoader css module
import styles from "../../styles/PokeballLoader.module.css";

export default function PokeballLoader() {
  return (
    <div className={styles.container}>
      <div className={styles.pokeball}></div>
    </div>
  );
}
