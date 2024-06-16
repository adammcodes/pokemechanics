"use client";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { useContext, Suspense } from "react";
import { useState, useEffect } from "react";
import { GameContext } from "@/context/_context";
import convertKebabCaseToTitleCase from "@/utils/convertKebabCaseToTitleCase";
import useGameVersion from "@/hooks/useGameVersion";
import styles from "./Header.module.css";
import "@/styles/slider.css";
import PokedexById from "@/app/pokedex/PokedexById";
import NationalDex from "@/app/pokedex/NationalDex";
import { numOfPokemonByGen } from "@/constants/numOfPokemonByGen";
import PokeballLoader from "./PokeballLoader";

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

const Nav = ({
  darkMode,
  onDarkModeChange,
}: {
  darkMode: boolean;
  onDarkModeChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) => {
  return (
    <nav className={styles.nav} role="navigation">
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

  const onDarkModeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const isDark = e.target.checked;
    setDarkMode(isDark);

    document.documentElement.setAttribute(
      "data-theme",
      e.target.checked ? "dark" : "light"
    );
  };

  useEffect(() => {
    // On the client-side determine the user's system color scheme
    const systemDarkMode = window.matchMedia("(prefers-color-scheme: dark)");
    // Set the initial theme state for the toggle switch
    setDarkMode(systemDarkMode.matches);
    // Set the page data-theme attribute to the system's color scheme - this actually changes the theme
    if (systemDarkMode.matches) {
      document.documentElement.setAttribute("data-theme", "dark");
    } else {
      document.documentElement.setAttribute("data-theme", "light");
    }

    // Listen to changes in the system's color scheme and update the website theme accordingly
    const handleSystemThemeChange = (e: MediaQueryListEvent) => {
      setDarkMode(e.matches);
      document.documentElement.setAttribute(
        "data-theme",
        e.matches ? "dark" : "light"
      );
    };

    systemDarkMode.addEventListener("change", handleSystemThemeChange);

    // Cleanup function to remove the listener
    return () => {
      systemDarkMode.removeEventListener("change", handleSystemThemeChange);
    };
  }, []);

  const isPokemonPage = dexId && pokemonId && generationString;
  const isNationalDex = dexId === "1";

  return (
    <Suspense fallback={<PokeballLoader />}>
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
          <input className={styles.menuInput} type="checkbox" id="menu-btn" />
          <label className={styles.menuIcon} htmlFor="menu-btn">
            <span className={styles.navicon}></span>
          </label>

          <Nav darkMode={darkMode} onDarkModeChange={onDarkModeChange} />
        </header>
      </div>
    </Suspense>
  );
}
