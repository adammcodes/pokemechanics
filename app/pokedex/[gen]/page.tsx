import { Metadata } from "next";
import { redirect } from "next/navigation";
import convertKebabCaseToTitleCase from "@/utils/convertKebabCaseToTitleCase";
import { getAllGenerations } from "@/app/helpers/getPokemonRoutes";
import { getGenerationVersions } from "@/app/helpers/graphql/getGenerationVersions";
import type {
  GenerationVersions,
  Pokedex,
} from "@/app/helpers/graphql/getGenerationVersions";
import { getGenVersionsString } from "@/utils/getGenVersionsString";
import { romanToNumber } from "@/utils/romanToNumber";
import PokedexHeader from "./_components/PokedexHeader";
import PokedexCard from "./_components/PokedexCard";
import { BASE_URL } from "@/constants/apiConfig";
// Force static generation
export const dynamic = "force-static";

// fetch the game version for the selected generation
type PageProps = {
  params: Promise<{
    gen: string;
  }>;
  searchParams?: Promise<{
    [key: string]: string | string[] | undefined;
  }>;
};

// Generate static params for all generations
export async function generateStaticParams() {
  // return [{ gen: "generation-i" }, { gen: "generation-ii" }];
  const generations = await getAllGenerations();
  return generations.map((gen: string) => ({ gen }));
}

// Generate metadata for SEO
export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { gen } = await params;
  const canonicalUrl = `${BASE_URL}/pokedex/${gen}`;
  const formattedGen = convertKebabCaseToTitleCase(gen);

  return {
    title: `Pokedex - ${formattedGen} | New Bark Town`,
    description: `Browse the complete Pokédex for ${formattedGen} with detailed stats, types, abilities, evolution chains, and move lists for all Pokémon in this generation.`,
    alternates: {
      canonical: canonicalUrl,
    },
  };
}

// create a Pokedex page for each generation
export default async function Page({ params }: PageProps) {
  // get the version group and pokedexes for the selected generation
  // Get the selected generation from the dynamic route params of the URL
  // e.g. /pokedex/generation-i
  // gen e.g. "generation-i"
  const { gen } = await params;

  // Log User-Agent for monitoring bot traffic and API usage patterns
  //const headersList = await headers();
  //const userAgent = headersList.get("user-agent") || "Unknown";
  //console.log(`[Request] /pokedex/${gen} | User-Agent: ${userAgent}`);

  // const versionGroup = await getVersionGroup(gen);
  const genVersions = await getGenerationVersions(gen);

  // If version group not found (e.g., /pokedex/971), redirect to main pokedex page
  if (genVersions.error) {
    redirect("/pokedex");
  }

  const generation = genVersions as GenerationVersions;

  const genVersionsString = getGenVersionsString(generation.versiongroups);

  // Build a map of pokedexes with their associated version groups
  const pokedexMap = new Map<
    number,
    { pokedex: Pokedex; versionGroups: string[] }
  >();

  generation.versiongroups.forEach((vg) => {
    vg.pokedexversiongroups.forEach((pvg) => {
      const dex = pvg.pokedex;
      if (pokedexMap.has(dex.id)) {
        // Add this version group to existing pokedex entry
        pokedexMap.get(dex.id)!.versionGroups.push(vg.name);
      } else {
        // Create new entry
        pokedexMap.set(dex.id, {
          pokedex: dex,
          versionGroups: [vg.name],
        });
      }
    });
  });

  const pokedexData = Array.from(pokedexMap.values());

  const genNumber = romanToNumber(gen.split("-")[1]);

  return (
    <section className="flex flex-col w-full h-full px-4 lg:px-8 py-6">
      <PokedexHeader
        genNumber={genNumber}
        genVersionsString={genVersionsString}
      />

      {/* 2-column grid of pokedex cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-6xl mx-auto [&>*:only-child]:md:col-span-full [&>*:only-child]:md:max-w-2xl [&>*:only-child]:md:mx-auto [&>*:last-child:nth-child(odd)]:md:col-span-full [&>*:last-child:nth-child(odd)]:md:max-w-2xl [&>*:last-child:nth-child(odd)]:md:mx-auto">
        {pokedexData.map(({ pokedex, versionGroups }) => (
          <PokedexCard
            key={pokedex.id}
            pokedex={pokedex}
            versionGroups={versionGroups}
            generation={gen}
            genNumber={genNumber}
          />
        ))}
      </div>
    </section>
  );
}
