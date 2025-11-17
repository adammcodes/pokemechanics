import { MetadataRoute } from "next";
import {
  getAllPokemonRoutes,
  getAllVersionGroups,
} from "@/app/helpers/getPokemonRoutes";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://www.newbarktown.ca";
  const currentDate = new Date();

  const urls: MetadataRoute.Sitemap = [
    // Homepage
    {
      url: baseUrl,
      lastModified: currentDate,
      changeFrequency: "weekly",
      priority: 1.0,
    },

    // Pokedex index
    {
      url: `${baseUrl}/pokedex`,
      lastModified: currentDate,
      changeFrequency: "monthly",
      priority: 0.9,
    },
  ];

  // Add version group pages (/pokedex/[gen])
  const versionGroups = getAllVersionGroups();
  versionGroups.forEach((vg) => {
    urls.push({
      url: `${baseUrl}/pokedex/${vg}`,
      lastModified: currentDate,
      changeFrequency: "monthly",
      priority: 0.8,
    });
  });

  // Add all Pokemon routes
  try {
    const pokemonRoutes = await getAllPokemonRoutes();
    pokemonRoutes.forEach((route) => {
      urls.push({
        url: `${baseUrl}/pokemon/${route.name}/${route.game}/${route.dex}`,
        lastModified: currentDate,
        changeFrequency: "monthly",
        priority: 0.7,
      });
    });

    console.log(`Total sitemap URLs generated: ${urls.length}`);
  } catch (error) {
    console.error("Error generating sitemap:", error);
    // Fallback: at least include homepage and pokedex pages
    // (already added above)
  }

  return urls;
}
