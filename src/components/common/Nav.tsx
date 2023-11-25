import Link from "next/link";

export default function Nav() {
  return (
    <nav>
      <ul className={`menu`}>
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
          <Link href="/">Switch Game</Link>
          <i></i>
        </li>
      </ul>
    </nav>
  );
}
