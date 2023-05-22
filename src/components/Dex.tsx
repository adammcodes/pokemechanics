import { useContext } from "react";
import { PokedexContext } from "../context/_context";

export default function Dex() {
  const { dexQuery } = useContext(PokedexContext);

  console.log(dexQuery);

  return (
    <>
      {dexQuery.isLoading && "Loading..."}
      {dexQuery.data && <>Data</>}
    </>
  );
}
