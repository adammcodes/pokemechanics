import Image from "next/image";
import Link from "next/link";
import Nav from "./Nav";
import { useContext } from "react";
import { GameContext } from "@/context/_context";
import convertKebabCaseToTitleCase from "@/utils/convertKebabCaseToTitleCase";
import useGameVersion from "@/hooks/useGameVersion";

const logoSize: number = 80;

export default function Header() {
  const { game } = useContext(GameContext);
  const formatName = convertKebabCaseToTitleCase;
  const versionGroup = useGameVersion(game);
  const genNumber =
    versionGroup.data && versionGroup.data.generation.name.split("-")[1];

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
          {game && versionGroup.data && (
            <section>
              &nbsp;- {formatName(game)}{" "}
              {genNumber && <>(Gen {genNumber.toUpperCase()})</>}
            </section>
          )}
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
