import Image from "next/image";
import Link from "next/link";
import Nav from "./Nav";
// Media
import styles from "../../styles/Header.module.css";

const logoSize: number = 80;

export default function Header() {
  return (
    <div className="w-full">
      <header className="header">
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
          <Link href="/">
            <h1>POKEMECHANICS</h1>
          </Link>
        </div>
      </header>
      <input className="menu-btn" type="checkbox" id="menu-btn" />
      <label className="menu-icon" htmlFor="menu-btn">
        <span className="navicon"></span>
      </label>
      <Nav />
    </div>
  );
}
