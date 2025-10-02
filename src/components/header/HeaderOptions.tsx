"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import "@/styles/slider.css";
import styles from "./Header.module.css";
import { usePathname, useSearchParams } from "next/navigation";

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

const NavLink = ({
  href,
  children,
  closeNav,
}: {
  href: string;
  children: string;
  closeNav: () => void;
}) => {
  return (
    <li>
      <Link onClick={closeNav} href={href}>
        {children}
      </Link>
      <i></i>
    </li>
  );
};

const Nav = ({
  darkMode,
  onDarkModeChange,
  setIsNavOpen,
}: {
  darkMode: boolean;
  onDarkModeChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  setIsNavOpen: (value: boolean) => void;
}) => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const gameSearchParam = searchParams.get("game");
  // Get the "game" page path either from the search params "game" or from the pathname from /pokedex/[game]
  const game = gameSearchParam || pathname.split("/")[2];
  const gamePath = game && game !== "undefined" ? `/${game}` : "";

  const closeNav = () => {
    setIsNavOpen(false);
  };

  const navLinks = [
    { href: "/pokedex" + gamePath, text: "Pokédex" },
    // { href: "/bag" + gamePath, text: "Bag" },
    // { href: "/map" + gamePath, text: "Map" },
    { href: "/", text: "Select Version" },
  ];

  return (
    <nav className={styles.nav}>
      <ul className={styles.menu}>
        {navLinks.map((link) => (
          <NavLink key={link.href} href={link.href} closeNav={closeNav}>
            {link.text}
          </NavLink>
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

export default function HeaderOptions() {
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

  return (
    <>
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
    </>
  );
}
