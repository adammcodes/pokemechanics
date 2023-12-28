"use client";
import { useContext, useEffect } from "react";
import { useRouter } from "next/navigation";
import { GameContext } from "@/context/_context";

export default function Pokedex() {
  // Get currently selected version group
  const { game } = useContext(GameContext);
  const router = useRouter();

  useEffect(() => {
    // Check if the game generation value is available
    if (game) {
      // Redirect to the /pokedex/[gen] page
      router.push(`/pokedex/${game}`);
    } else {
      // Redirect to the index page
      router.push("/");
    }
  }, [game, router]);

  // Return jsx for Loading page
  return (
    <main className="flex-row w-full justify-around items-start px-5">
      <div className="flex flex-wrap w-full justify-around items-start px-5">
        <p className="mb-4">LOADING...</p>
      </div>
    </main>
  );
}
