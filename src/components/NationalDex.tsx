import { useContext } from "react";
import useGameVersion from "../hooks/useGameVersion";
import { GameContext } from "../context/_context";

export default function NationalDex() {
  // Get currently selected game for it's version url
  const { game } = useContext(GameContext);
  // Get versionGroup data for the game
  const versionGroup = useGameVersion(game);

  return (
    <div className="w-full flex justify-center">
      {versionGroup.isLoading && "Loading..."}
      {versionGroup.data && "Loading..."}
      hello
    </div>
  );
}
