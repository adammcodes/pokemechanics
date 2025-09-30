import { redirect } from "next/navigation";

type PageProps = {
  searchParams?: {
    [key: string]: string | string[] | undefined;
  };
};

export default function Pokedex({ searchParams }: PageProps) {
  // Check if there's a game parameter in the URL
  const game = searchParams?.game;

  // If no game parameter, redirect to home page
  if (!game) {
    redirect("/");
  }

  // If there is a game parameter, redirect to the specific generation page
  redirect(`/pokedex/${game}`);
}
