// Components
import GenSelector from "app/GenSelector";
// Utils
import { fetchFromGraphQL } from "@/utils/api";
// Styles
import styles from "@/styles/TypingText.module.css";

// Enable ISR - revalidate every 7 days (604800 seconds)
// Version groups never change, so long cache time is safe
export const revalidate = 604800;

type Gen = {
  name: string;
  url: string;
};

async function getVersionGroups(): Promise<Gen[]> {
  const query = `
    query GetVersionGroups {
      versiongroup(order_by: {generation_id: asc}) {
        id
        name
        generation_id
      }
    }
  `;

  try {
    const data = await fetchFromGraphQL({
      query,
      // Cache version groups for 7 days - they never change
      next: { revalidate: 604800 },
    });

    // Transform the GraphQL response to match the expected Gen[] format
    return data.data.versiongroup.map((versionGroup: any) => {
      return {
        name: versionGroup.name,
        url: `/pokedex/${versionGroup.generation_id}`,
      };
    });
  } catch (error) {
    console.error("Error fetching version groups:", error);
    throw error;
  }
}

// This is the "/" route
export default async function HomePage() {
  const gens = await getVersionGroups();

  // if there is an error, show an error page
  if (gens instanceof Error) {
    return (
      <main>
        <h1>There was an error</h1>
        <p>{gens.message}</p>
      </main>
    );
  }

  return (
    <main className="w-full h-full flex flex-col justify-start items-center">
      <h2 className={styles.typing}>
        WHICH GAME ARE YOU PLAYING?<span className={styles.cursor}>_</span>
      </h2>
      <div className="max-w-sm mx-auto">
        {gens && <GenSelector gens={gens} />}
      </div>
    </main>
  );
}
