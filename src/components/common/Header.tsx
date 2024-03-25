import Image from "next/image";
import Link from "next/link";
import { useContext } from "react";
import { GameContext } from "@/context/_context";
import convertKebabCaseToTitleCase from "@/utils/convertKebabCaseToTitleCase";
import useGameVersion from "@/hooks/useGameVersion";
import styles from "./Header.module.css";

const logoSize: number = 80;

const Nav = () => {
  return (
    <nav>
      <ul className={styles.menu}>
        <li>
          <Link href="/pokedex">Pokédex</Link>
          <i></i>
        </li>
        <li>
          <Link href="/bag">Bag</Link>
          <i></i>
        </li>
        <li>
          <Link href="/map">Map</Link>
          <i></i>
        </li>
        <li>
          <Link href="/">Select Version</Link>
          <i></i>
        </li>
      </ul>
    </nav>
  );
};

export default function Header() {
  const { game } = useContext(GameContext);
  const formatName = convertKebabCaseToTitleCase;
  const versionGroup = useGameVersion(game);
  const genNumber =
    versionGroup.data && versionGroup.data.generation?.name.split("-")[1];

  return (
    <div className="w-full">
      <header className={styles.header}>
        <div className="flex flex-row justify-center items-center">
          <Link href="/">
            <Image
              src="/images/dudelax.png"
              width={logoSize}
              height={logoSize}
              alt="Munchlax"
              priority={true}
            />
          </Link>
          <div>
            <Link href="/">
              <h1>POKEMECHANICS</h1>
            </Link>
            {game && versionGroup.data && (
              <span className="text-[0.9em] lg:text-[1em]">
                <span className="hidden lg:inline">&nbsp;-</span>{" "}
                {formatName(game)}{" "}
                <span className="inline lg:hidden">
                  <br />
                </span>
                {genNumber && <>(Gen {genNumber.toUpperCase()})</>}
              </span>
            )}
          </div>
        </div>
      </header>
      <input className={styles.menuBtn} type="checkbox" id="menu-btn" />
      <label className={styles.menuIcon} htmlFor="menu-btn">
        <span className="navicon"></span>
      </label>
      <Nav />
    </div>
  );
}
