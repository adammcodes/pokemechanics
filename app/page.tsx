import { GameClient, NamedAPIResourceList } from "pokenode-ts"; // import the GameClient that is auto-cached
// Components
import GenSelector from "app/GenSelector";
// Styles
import styles from "@/styles/TypingText.module.css";

type Gen = {
  name: string;
  url: string;
};

// async function getVersionGroups(): Promise<Gen[]> {
//   const api = new GameClient();
//   return await api
//     .listVersionGroups(0, 25) // right now supporting up to scarlet-violet
//     .then((data: NamedAPIResourceList) => {
//       return data.results;
//     })
//     .catch((error: any) => error);
// }

// This is the "/" route
export default async function HomePage() {
  // const gens = await getVersionGroups();

  // // if there is an error, show an error page
  // if (gens instanceof Error) {
  //   return (
  //     <main>
  //       <h1>There was an error</h1>
  //       <p>{gens.message}</p>
  //     </main>
  //   );
  // }

  return (
    <main className="w-full">
      <h2 className={styles.typing}>
        WHICH GAME ARE YOU PLAYING?<span className={styles.cursor}>_</span>
      </h2>
      {/* <div className="max-w-sm mx-auto">
        {gens && <GenSelector gens={gens} />}
      </div> */}
    </main>
  );
}
