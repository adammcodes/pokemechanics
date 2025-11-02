// Components
import GenSelector from "app/GenSelector";
// Utils
import { fetchFromGraphQL } from "@/utils/api";
// Styles
import styles from "@/styles/TypingText.module.css";
import { Metadata } from "next";
import { EXCLUDED_VERSION_GROUPS } from "@/constants/excludedVersionGroups";

// Enable ISR - revalidate every 7 days (604800 seconds)
// Version groups never change, so long cache time is safe
export const revalidate = 604800;

// SEO metadata for homepage
export const metadata: Metadata = {
  title: "Pokémechanics - Complete Pokédex Database for All Pokémon Games",
  description:
    "Comprehensive Pokémon database with detailed stats, moves, abilities, evolution chains, and regional Pokédex entries for every game from Gen 1 (Red/Blue) to Gen 9 (Scarlet/Violet). Explore all 1025 Pokémon across 25+ game versions.",
  alternates: {
    canonical: "https://www.pokemechanics.app",
  },
  openGraph: {
    title: "Pokémechanics - Complete Pokédex Database for All Pokémon Games",
    description:
      "Comprehensive Pokémon database with detailed stats, moves, abilities, evolution chains, and regional Pokédex entries for every game from Gen 1 (Red/Blue) to Gen 9 (Scarlet/Violet). Explore all 1025 Pokémon across 25+ game versions.",
    url: "https://www.pokemechanics.app",
    siteName: "Pokémechanics",
    images: [
      {
        url: "https://www.pokemechanics.app/images/dudelax.webp",
        width: 400,
        height: 400,
        alt: "Pokémechanics mascot - Munchlax",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Pokémechanics - Complete Pokédex Database",
    description:
      "Comprehensive Pokémon database with stats, moves, abilities, and evolution data for all 1025 Pokémon across every game generation.",
    images: ["https://www.pokemechanics.app/images/dudelax.webp"],
  },
};

type Gen = {
  name: string;
  url: string;
};

type VersionGroup = {
  id: number;
  name: string;
  generation_id: number;
};

async function getVersionGroups(): Promise<Gen[]> {
  const query = `
    query GetVersionGroups {
      versiongroup {
        id
        name
        generation_id
      }
    }
  `;

  try {
    const { data } = await fetchFromGraphQL({
      query,
      // Cache version groups for 7 days - they never change
      next: { revalidate: 604800 },
    });

    // Transform the GraphQL response to match the expected Gen[] format
    return data.versiongroup
      .filter(
        (versionGroup: VersionGroup) =>
          !EXCLUDED_VERSION_GROUPS.includes(versionGroup.name)
      )
      .sort(
        (a: VersionGroup, b: VersionGroup) => a.generation_id - b.generation_id
      )
      .map((versionGroup: VersionGroup) => {
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
