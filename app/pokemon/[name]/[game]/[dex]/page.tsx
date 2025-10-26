import { Metadata } from "next";
import { redirect } from "next/navigation";
import { getVersionGroup } from "@/app/helpers/graphql/getVersionGroup";
import { getPokemonComplete } from "@/app/helpers/graphql/getPokemonComplete";
import { fetchPokemonSpeciesByName } from "@/app/helpers/rest/fetchPokemonSpeciesByName";
import { fetchPokemonByName } from "@/app/helpers/rest/fetchPokemonByName";
import { fetchPokedexByName } from "@/app/helpers/rest/fetchPokedexByName";
import PokemonCard from "./_components/card/PokemonCard";
import convertKebabCaseToTitleCase from "@/utils/convertKebabCaseToTitleCase";
import { romanToNumber } from "@/utils/romanToNumber";
import { fetchGenerationById } from "@/app/helpers/rest/fetchGenerationById";
import { numOfPokemonByGen } from "@/constants/numOfPokemonByGen";
import { PRIORITY_POKEMON } from "@/constants/priorityPokemon";
import getSpriteUrl from "@/constants/spriteUrlTemplates";
import findVarietyForRegion from "@/lib/findVarietyForRegion";
import { fetchPokemonById } from "@/app/helpers/rest/fetchPokemonById";

// Enable ISR - revalidate every 24 hours (86400 seconds)
// Pokemon data is static, so long cache times are safe
// Reduces API calls to PokeAPI significantly
export const revalidate = 86400;

// Generate static pages for popular Pokemon at build time
// This eliminates runtime API calls for these pages
// export async function generateStaticParams() {
//   // Pre-render top Pokemon for the most popular version groups
//   const popularVersionGroups = [
//     { game: "scarlet-violet", dex: "paldea" },
//     { game: "scarlet-violet", dex: "national" },
//     { game: "sword-shield", dex: "galar" },
//     { game: "sword-shield", dex: "national" },
//     { game: "red-blue", dex: "kanto" },
//     { game: "red-blue", dex: "national" },
//   ];

//   const params = [];

//   // Generate all combinations of priority Pokemon + popular version groups
//   for (const pokemon of PRIORITY_POKEMON) {
//     for (const vg of popularVersionGroups) {
//       params.push({
//         name: pokemon,
//         game: vg.game,
//         dex: vg.dex,
//       });
//     }
//   }

//   console.log(
//     `[StaticGen] Pre-rendering ${params.length} popular Pokemon pages`
//   );

//   return params;
// }

type PageProps = {
  params: {
    name: string;
    game: string;
    dex: string;
  };
};

// Generate metadata for SEO
export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { name, game, dex } = params;

  try {
    // Fetch all base data in parallel
    const [pokemonData, versionData, dexData, speciesData] = await Promise.all([
      fetchPokemonByName(name),
      getVersionGroup(game),
      fetchPokedexByName(dex),
      fetchPokemonSpeciesByName(name),
    ]);

    const pokemonName = speciesData?.name ?? "";
    const displayName =
      pokemonName.charAt(0).toUpperCase() + pokemonName.slice(1);
    const versionName = convertKebabCaseToTitleCase(versionData?.name ?? "");
    const dexDisplayName = convertKebabCaseToTitleCase(dex);

    // Check for regional variants (e.g., Alolan Raichu in sun-moon)
    const region = versionData?.regions?.[0] ?? null;
    const dexRegion = dexData?.region?.name || "";
    const regionName = dex === "national" ? region?.name || "" : dexRegion;

    // Find variety for region if there are multiple varieties
    const pokemonVarietyForRegion = findVarietyForRegion(
      speciesData.varieties,
      regionName
    );

    // Fetch variant Pokemon data if needed
    let variantPokemonData = null;
    let isVariant = false;
    let variantDisplayName = displayName;

    if (pokemonVarietyForRegion && speciesData.varieties.length > 1) {
      const pokemonVarietyId = Number(
        pokemonVarietyForRegion.pokemon.url.split("/").at(-2)
      );

      try {
        variantPokemonData = await fetchPokemonById(pokemonVarietyId);
        isVariant = true;
        const variantRegionName = convertKebabCaseToTitleCase(
          variantPokemonData.name.split("-")[1]
        );
        variantDisplayName = `${displayName} (${variantRegionName})`;
      } catch (error) {
        console.error("Failed to fetch variant Pokemon data:", error);
        // Fall back to default Pokemon data
      }
    }

    const displayPokemonData =
      isVariant && variantPokemonData ? variantPokemonData : pokemonData;

    const title = `${variantDisplayName} - ${versionName} (${dexDisplayName} Pokédex)`;
    const description = `Explore ${variantDisplayName} in ${versionName}. View complete stats, moves, abilities, types, and evolution information for the ${dexDisplayName} Pokédex.`;
    const canonicalUrl = `https://www.pokemechanics.app/pokemon/${name}/${game}/${dex}`;

    // Get game-specific Pokemon sprite for social media preview
    // Extract generation roman numeral from "generation-i" -> "i"
    const generationString = versionData?.generation?.name ?? "generation-i";
    const genRomanNumeral = generationString.replace("generation-", "");

    const spriteUrl = getSpriteUrl({
      versionGroup: game,
      pokemonId: displayPokemonData.id,
      generation: genRomanNumeral,
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
        siteName: "Pokémechanics",
        images: [
          {
            url: spriteUrl,
            width: 200,
            height: 200,
            alt: `${variantDisplayName} sprite from ${versionName}`,
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
      title: "Pokémon | Pokémechanics",
      description:
        "Complete Pokémon information, stats, moves, abilities, and evolution details.",
      alternates: {
        canonical: `https://www.pokemechanics.app/pokemon/${name}/${game}/${dex}`,
      },
      openGraph: {
        title: "Pokémon | Pokémechanics",
        description:
          "Complete Pokémon information, stats, moves, abilities, and evolution details.",
        url: `https://www.pokemechanics.app/pokemon/${name}/${game}/${dex}`,
        siteName: "Pokémechanics",
        locale: "en_US",
        type: "website",
      },
      twitter: {
        card: "summary",
        title: "Pokémon | Pokémechanics",
        description:
          "Complete Pokémon information, stats, moves, abilities, and evolution details.",
      },
    };
  }
}

export default async function Pokemon({ params }: PageProps) {
  const { name, game, dex } = params;

  if (!name || !game || !dex) {
    redirect("/pokedex");
  }

  try {
    // Fetch base Pokemon data using REST (for compatibility with existing components)
    // And fetch version group, pokedex, and species data in parallel
    const [pokemonData, versionData, dexData, speciesData] = await Promise.all([
      fetchPokemonByName(name),
      getVersionGroup(game),
      fetchPokedexByName(dex),
      fetchPokemonSpeciesByName(name),
    ]);

    // Extract version names for GraphQL query
    const versions = versionData.versions.map((v) => v.name);

    // Fetch Pokemon moves from GraphQL (this replaces 56+ individual move REST calls)
    const graphqlPokemonData = await getPokemonComplete({
      pokemonName: name,
      versionGroup: game,
      versions,
    });

    // Check if we have the required data
    if (!pokemonData || !speciesData || !versionData || !dexData) {
      return (
        <main className="w-full">
          <h1>Data Not Found</h1>
          <p>The requested Pokémon data could not be found.</p>
        </main>
      );
    }

    const generation = versionData.generation.name;
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
            {versionData.name
              .split("-")
              .map((w: string) => w.charAt(0).toUpperCase() + w.slice(1))
              .join(" ")}
            .
          </p>
          <a
            href={`/pokemon/${name}`}
            className="inline-block bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded"
          >
            Choose a valid game version
          </a>
        </main>
      );
    }

    return (
      <main className="w-full">
        <PokemonCard
          pokemonData={pokemonData}
          speciesData={speciesData}
          versionData={versionData}
          dexData={dexData}
          dexName={dex}
          game={game}
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
            <h1 className="text-2xl font-bold mb-4">Temporarily Unavailable</h1>
            <p className="mb-4">
              We're experiencing high traffic right now. Our database is
              temporarily rate-limited.
            </p>
            <p className="mb-4">
              This page will be cached soon. Please refresh in a few seconds.
            </p>
            <p className="text-sm text-gray-600">
              Most pages load instantly once cached. This is a temporary issue
              during high crawler activity.
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
