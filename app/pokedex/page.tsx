import { redirect } from "next/navigation";

export default function Pokedex() {
  // Redirect to default game (Red/Blue)
  redirect("/pokedex/red-blue");
}
