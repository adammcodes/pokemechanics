import { redirect } from "next/navigation";
import { cookies } from "next/headers";

export default function Pokedex() {
  // Check if there's a game value in the cookie store
  const cookieStore = cookies();
  const game = cookieStore.get("game")?.value;

  // If no game parameter, redirect to home page
  if (!game) {
    redirect("/");
  }

  // If there is a game parameter, redirect to the specific generation page
  redirect(`/pokedex/${game}`);
}
