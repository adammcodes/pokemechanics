import { Metadata } from "next";
// import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { getVersionGroup } from "@/app/helpers/graphql/getVersionGroup";
import { getPokemonComplete } from "@/app/helpers/graphql/getPokemonComplete";
import { fetchPokemonSpeciesByName } from "@/app/helpers/rest/fetchPokemonSpeciesByName";
import { fetchPokemonByName } from "@/app/helpers/rest/fetchPokemonByName";
import { fetchPokedexByName } from "@/app/helpers/rest/fetchPokedexByName";
import PokemonCard from "./_components/card/PokemonCard";
import convertKebabCaseToTitleCase from "@/utils/convertKebabCaseToTitleCase";
// import { romanToNumber } from "@/utils/romanToNumber";
// import { fetchGenerationById } from "@/app/helpers/rest/fetchGenerationById";
import { numOfPokemonByGen } from "@/constants/numOfPokemonByGen";
// import findVarietyForRegion from "@/lib/findVarietyForRegion";
// import { fetchPokemonById } from "@/app/helpers/rest/fetchPokemonById";
import { getVariantPokemonName } from "@/lib/getVariantPokemonName";
import findGenusForLanguage from "@/lib/findGenusForLanguage";
import { getAllPokemonRoutes } from "@/app/helpers/getPokemonRoutes";
import { RestPokemon } from "@/types/index";
import findSpriteFromPokemonData from "@/lib/findSpriteFromPokemonData";
import { romanToNumber } from "@/utils/romanToNumber";
import { getGenVersionsString } from "@/utils/getGenVersionsString";
import { getBaseSpeciesName } from "@/constants/unsupportedVariants";
import {
  GenerationVersions,
  getGenerationVersions,
} from "@/app/helpers/graphql/getGenerationVersions";
import { PokemonSpecies } from "@/types/index";
import { BASE_URL } from "@/constants/apiConfig";

// Force static generation for all pages
// Pokemon data is static, perfect for pre-rendering
export const dynamic = "force-static";

type PageProps = {
  params: Promise<{
    gen: string;
    pokemon: string;
  }>;
};

// Generate static paths for all Pokemon at build time
export async function generateStaticParams() {
  console.log("Generating static params for Pokemon pages...");
  // Return just a handful of test routes instead of all 9993
  const routes = await getAllPokemonRoutes();
  console.log(`Total routes to generate: ${routes.length}`);
  return routes;
}

// Generate metadata for SEO
export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { gen, pokemon } = await params;

  // Handle unsupported variants - use base species name instead
  const effectiveName = getBaseSpeciesName(pokemon);

  let pokemonData: RestPokemon | null = null;
  let speciesName = pokemon;
  try {
    // Fetch Pokemon data from REST API using the name from the URL
    // For unsupported variants, this will use the base species name
    pokemonData = await fetchPokemonByName(effectiveName);
    speciesName = pokemonData ? pokemonData.species.name : effectiveName;
  } catch (error) {
    console.error(
      "Error fetching Pokemon data for name:",
      effectiveName,
      error
    );
  }

  if (!pokemonData) {
    return {
      title: "Pokémon Not Found | New Bark Town",
      description: "The requested Pokémon could not be found.",
      alternates: {
        canonical: `${BASE_URL}/${gen}/${pokemon}`,
      },
    };
  }

  try {
    // Fetch version, dex, and species data first
    // IMPORTANT: fetchPokemonSpeciesByName must use base name (no regional suffix)
    const [genVersions, speciesData]: [GenerationVersions, PokemonSpecies] =
      await Promise.all([
        getGenerationVersions(gen),
        fetchPokemonSpeciesByName(speciesName), // ✅ Use species name (no variant names)
      ]);

    // Determine region and find correct variant name
    const generationString = genVersions?.name ?? "generation-i";
    const genNumber: string = generationString.split("-")[1] || "i";
    const generationId: number = romanToNumber(genNumber || "i");
    const region = genVersions.versiongroups[0].versiongroupregions[0].region;

    const actualPokemonName = getVariantPokemonName(
      speciesData,
      region.name,
      effectiveName
    );

    const versionGroupsString = getGenVersionsString(genVersions.versiongroups);

    const firstVersionGroup = genVersions.versiongroups[0];
    const speciesDisplayName =
      speciesName.charAt(0).toUpperCase() + speciesName.slice(1);
    const isDefaultForm = pokemonData.is_default;
    const variantNames = convertKebabCaseToTitleCase(
      actualPokemonName.slice(speciesName.length + 1) ?? ""
    );
    const displayName =
      isDefaultForm && effectiveName === actualPokemonName
        ? speciesDisplayName
        : `${speciesDisplayName} (${variantNames})`;

    // Get game-specific Pokemon sprite for social media preview
    const pokemonGenus = findGenusForLanguage(speciesData);

    const title = `${displayName} - Gen ${generationId}`;
    const description = `Explore ${displayName} ${
      pokemonGenus ? `the ${pokemonGenus}` : ""
    } in Gen ${generationId}. View Gen ${generationId} complete stats, moves, abilities, types, locations, and evolution information for the version groups: ${versionGroupsString}`;
    const canonicalUrl = `${BASE_URL}/${gen}/${pokemon}`;

    const spriteUrl = findSpriteFromPokemonData({
      pokemonData,
      generationName: generationString,
      versionGroup: firstVersionGroup.name,
    });

    return {
      title,
      description,
      alternates: {
        canonical: canonicalUrl,
      },
      robots: {
        index: true,
        follow: true,
      },
      openGraph: {
        title,
        description,
        url: canonicalUrl,
        siteName: "New Bark Town",
        images: [
          {
            url: spriteUrl,
            width: 200,
            height: 200,
            alt: `${speciesName} sprite from Gen ${generationId}`,
          },
        ],
        locale: "en_US",
        type: "website",
      },
      twitter: {
        card: "summary",
        title,
        description,
        images: [spriteUrl],
      },
    };
  } catch (error) {
    console.error("Error generating metadata:", error);

    // Return fallback metadata
    return {
      title: "Pokémon | New Bark Town",
      description:
        "Complete Pokémon information, stats, moves, abilities, and evolution details.",
      alternates: {
        canonical: `${BASE_URL}/${gen}/${pokemon}`,
      },
      openGraph: {
        title: "Pokémon | New Bark Town",
        description:
          "Complete Pokémon information, stats, moves, abilities, and evolution details.",
        url: `${BASE_URL}/${gen}/${pokemon}`,
        siteName: "New Bark Town",
        locale: "en_US",
        type: "website",
      },
      twitter: {
        card: "summary",
        title: "Pokémon | New Bark Town",
        description:
          "Complete Pokémon information, stats, moves, abilities, and evolution details.",
      },
    };
  }
}

export default async function Pokemon({ params }: PageProps) {
  const { gen, pokemon } = await params;

  // Log User-Agent for monitoring bot traffic and API usage patterns
  // const headersList = await headers();
  // const userAgent = headersList.get("user-agent") || "Unknown";
  // console.log(
  //   `[Request] /pokemon/${name}/${game}/${dex} | User-Agent: ${userAgent}`
  // );

  if (!gen || !pokemon) {
    redirect("/pokedex");
  }

  // Handle unsupported variants - use base species name instead
  const effectiveName = getBaseSpeciesName(pokemon);

  let pokemonData: RestPokemon | null = null;
  let speciesName = effectiveName;
  try {
    // Fetch Pokemon data from REST API using the name from the URL
    // For unsupported variants, this will use the base species name
    pokemonData = await fetchPokemonByName(effectiveName);
    speciesName = pokemonData ? pokemonData.species.name : effectiveName;
  } catch (error) {
    console.error(
      "Error fetching Pokemon data for name:",
      effectiveName,
      error
    );
  }

  try {
    // Fetch version, dex, and species data
    const [genVersions, speciesData]: [GenerationVersions, PokemonSpecies] =
      await Promise.all([
        getGenerationVersions(gen),
        fetchPokemonSpeciesByName(speciesName), // ✅ Use species name (no variant names)
      ]);

    const region = genVersions.versiongroups[0].versiongroupregions[0].region;
    // Determine region and find correct variant name
    // Including regional suffix
    const variantName = getVariantPokemonName(
      speciesData,
      region.name,
      effectiveName
    );

    // Extract version names for GraphQL query
    const versions = genVersions.versiongroups.flatMap((vg) =>
      vg.versions.map((v) => v.name)
    );

    console.log("versions: ", versions);

    // Fetch Pokemon moves from GraphQL using the correct variant name
    // This ensures encounters are fetched for the correct variant (e.g., "rattata-alola")
    const graphqlPokemonData = await getPokemonComplete({
      pokemonName: variantName,
      versionGroups: genVersions.versiongroups.map((vg) => vg.name),
      versions,
    });

    const generation = genVersions.name;
    const pokemonNationalDexNumber = speciesData.id;
    const maxDexNumberForGen = numOfPokemonByGen[generation];

    if (pokemonNationalDexNumber > maxDexNumberForGen) {
      const displayName =
        speciesData.name.charAt(0).toUpperCase() + speciesData.name.slice(1);
      return (
        <main className="w-full max-w-screen-sm mx-auto text-center p-8">
          <h1 className="text-2xl font-bold mb-4">Pokémon Not Available</h1>
          <p className="mb-4">
            {displayName} does not exist in{" "}
            {genVersions.name
              .split("-")
              .map((w: string) => w.charAt(0).toUpperCase() + w.slice(1))
              .join(" ")}
            .
          </p>
          <a
            href={`/${gen}/${pokemon}`}
            className="inline-block bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded"
          >
            Choose a valid game version
          </a>
        </main>
      );
    }

    // Check if we have the required data
    if (!pokemonData || !speciesData || !genVersions) {
      return (
        <main className="w-full">
          <h1>Data Not Found</h1>
          <p>The requested Pokémon data could not be found.</p>
        </main>
      );
    }

    return (
      <main className="w-full">
        <PokemonCard
          genVersions={genVersions}
          pokemonData={pokemonData}
          speciesData={speciesData}
          // versionData={
          //   genVersions.versiongroups[0].pokedexversiongroups[0].pokedex
          // }
          // dexData={dexData}
          dexName={"national"}
          game={genVersions.versiongroups[0].name}
          graphqlPokemonData={graphqlPokemonData}
        />
      </main>
    );
  } catch (error) {
    console.error("Error loading Pokémon data:", error);

    // Handle specific error types
    if (error instanceof Error) {
      // Rate limiting error - most common during high traffic
      if (error.message.includes("Rate limited")) {
        return (
          <main className="w-full max-w-screen-sm mx-auto text-center p-8">
            <h1 className="text-2xl font-bold mb-4">Please Try Again</h1>
            <p className="mb-4">
              We're experiencing high traffic right now. The Pokémon database is
              temporarily rate-limited.
            </p>
            <p className="mb-4">Please refresh this page in a few minutes.</p>
            <p className="text-sm text-gray-600">
              Once cached, this page will load instantly. This is a temporary
              issue during high traffic periods.
            </p>
          </main>
        );
      }

      if (error.message.includes("Failed to fetch")) {
        return (
          <main className="w-full">
            <h1>Network Error</h1>
            <p>
              Unable to connect to the Pokémon database. Please try again later.
            </p>
          </main>
        );
      }

      if (
        error.message.includes("not found") ||
        error.message.includes("404")
      ) {
        return (
          <main className="w-full max-w-screen-sm mx-auto text-center">
            <h1>Invalid Pokémon</h1>
            <p>The requested Pokémon could not be found.</p>
          </main>
        );
      }
    }

    // Generic error fallback
    return (
      <main className="w-full">
        <h1>Something went wrong</h1>
        <p>
          We encountered an error while loading the Pokémon data. Please try
          again.
        </p>
      </main>
    );
  }
}
