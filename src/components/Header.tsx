import Image from "next/image";
import Link from "next/link";
import Nav from "./Nav";
// Media
import styles from "../../styles/Header.module.css";

const logoSize: number = 80;

export default function Header() {
  return (
    <header className={styles.head}>
      <Link href="/">
        <Image
          src="/images/dudelax.png"
          width={logoSize}
          height={logoSize}
          alt="Munchlax"
          priority={true}
        />
      </Link>
      {/* {versionGroup.isLoading && null}
      {versionGroup.data && ( */}
      <>
        <Link href="/">
          <h1>POKEMECHANICS</h1>
        </Link>
        <Nav />
      </>
    </header>
  );
}
