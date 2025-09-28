// "use client";
// import { PokedexContext } from "./_context";
// import { useQuery } from "react-query";
// import useGameClient from "@/hooks/useGameClient";

// type PokedexContextProps = {
//   children: React.ReactNode;
//   dexId: number;
//   dexData?: any;
// };

// export const PokedexContextProvider: React.FC<PokedexContextProps> = ({
//   children,
//   dexId,
//   dexData,
// }) => {
//   const fetchPokedex = async (dexId: number) => {
//     const api = useGameClient();

//     return api
//       .getPokedexById(dexId)
//       .then((data) => data)
//       .catch((error) => error);
//   };

//   const dexQuery = useQuery(["pokedex", dexId], () => fetchPokedex(dexId), {
//     refetchOnWindowFocus: false,
//     refetchOnMount: false,
//     enabled: Boolean(dexId),
//     initialData: dexData,
//   });

//   return (
//     <PokedexContext.Provider value={{ dexQuery }}>
//       {children}
//     </PokedexContext.Provider>
//   );
// };

// export default PokedexContext;
