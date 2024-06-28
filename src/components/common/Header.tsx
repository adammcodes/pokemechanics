"use client";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { useContext, useState, useEffect } from "react";
import { GameContext } from "@/context/_context";
import convertKebabCaseToTitleCase from "@/utils/convertKebabCaseToTitleCase";
import useGameVersion from "@/hooks/useGameVersion";
import styles from "./Header.module.css";
import "@/styles/slider.css";
import PokedexById from "@/app/pokedex/PokedexById";
import NationalDex from "@/app/pokedex/NationalDex";
import { numOfPokemonByGen } from "@/constants/numOfPokemonByGen";

const logoSize: number = 80;

const DarkModeToggle = ({
  darkMode,
  onDarkModeChange,
}: {
  darkMode: boolean;
  onDarkModeChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) => {
  return (
    <label className="toggle">
      <input
        onChange={onDarkModeChange}
        className="toggle-checkbox"
        type="checkbox"
        checked={darkMode}
      />
      <div className="toggle-switch"></div>
    </label>
  );
};

const NavLink = ({ href, children, closeNav }: { href: string; children: string, closeNav: () => void; }) => {
  return (
    <li>
      <Link onClick={closeNav} href={href}>{children}</Link>
      <i></i>
    </li>
  );
}

const Nav = ({
  darkMode,
  onDarkModeChange,
  setIsNavOpen,
}: {
  darkMode: boolean;
  onDarkModeChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  setIsNavOpen: (value: boolean) => void;
}) => {

  const closeNav = () => {
    setIsNavOpen(false);
  }

  const navLinks = [
    { href: "/pokedex", text: "Pokédex" },
    { href: "/bag", text: "Bag" },
    { href: "/map", text: "Map" },
    { href: "/", text: "Select Version" },
  ];

  return (
    <nav className={styles.nav} role="navigation">
      <ul className={styles.menu}>
        {navLinks.map((link) => (
          <NavLink key={link.href} href={link.href} closeNav={closeNav}>{link.text}</NavLink>
        ))}
        <li>
          <DarkModeToggle
            darkMode={darkMode}
            onDarkModeChange={onDarkModeChange}
          />
        </li>
      </ul>
    </nav>
  );
};

export default function Header() {
  const { game } = useContext(GameContext);
  const formatName = convertKebabCaseToTitleCase;
  const versionGroup = useGameVersion(game);
  const generationString = versionGroup.data?.generation.name;
  const genNumber =
    versionGroup.data && versionGroup.data.generation?.name.split("-")[1];
  const pathname = usePathname();
  const searchParams = useSearchParams();
  // Get pokemon id from the pathname; e.g. http://localhost:3000/pokemon/2?dexId=1
  const pokemonId: string | undefined = pathname.split("/")[2];
  // Get the dexId from the search params e.g. http://localhost:3000/pokemon/2?dexId=1
  const dexId: string | null = searchParams.get("dexId");

  const [darkMode, setDarkMode] = useState(true);
  const [isNavOpen, setIsNavOpen] = useState(false);

  const onDarkModeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const isDark = e.target.checked;
    setDarkMode(isDark);
    const theme = isDark ? "dark" : "light";
    document.cookie = `theme=${theme}; path=/; max-age=31536000;`; // 1 year
    localStorage.setItem("darkMode", theme);
    document.documentElement.setAttribute(
      "data-theme",
      e.target.checked ? "dark" : "light"
    );
  };

  useEffect(() => {
    const systemDarkMode = window.matchMedia("(prefers-color-scheme: dark)");
    const userTheme = localStorage.getItem("darkMode");

    const setTheme = (theme: string) => {
      setDarkMode(theme === "dark");
      document.documentElement.setAttribute("data-theme", theme);
      document.cookie = `theme=${theme}; path=/; max-age=31536000;`; // 1 year
    };

    if (userTheme) {
      setTheme(userTheme);
    } else {
      setTheme(systemDarkMode.matches ? "dark" : "light");
    }

    const handleSystemThemeChange = (e: MediaQueryListEvent) => {
      setTheme(e.matches ? "dark" : "light");
    };

    systemDarkMode.addEventListener("change", handleSystemThemeChange);

    return () => {
      systemDarkMode.removeEventListener("change", handleSystemThemeChange);
    };
  }, []);

  const isPokemonPage = dexId && pokemonId && generationString;
  const isNationalDex = dexId === "1";

  return (
    <div className="w-full flex">
      <header className={styles.header}>
        <div className="hidden lg:flex flex flex-row justify-center items-center">
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

        {isPokemonPage && !isNationalDex && (
          <PokedexById
            generationString={generationString}
            versionGroup={game}
            dexId={parseInt(dexId)}
            pokemonId={parseInt(pokemonId)}
            includeHeader={false}
          />
        )}

        {isPokemonPage && isNationalDex && (
          <NationalDex
            includeHeader={false}
            generationString={generationString}
            versionGroup={game}
            limit={numOfPokemonByGen[generationString]}
          />
        )}

        {/* Mobile Nav Menu */}
        <input 
          className={styles.menuInput} 
          type="checkbox" 
          id="menu-btn"
          checked={isNavOpen}
          onChange={() => setIsNavOpen(!isNavOpen)}
        />
        <label className={styles.menuIcon} htmlFor="menu-btn">
          <span className={styles.navicon}></span>
        </label>

        <Nav 
          darkMode={darkMode} 
          onDarkModeChange={onDarkModeChange} 
          setIsNavOpen={setIsNavOpen}
        />
      </header>
    </div>
  );
}
