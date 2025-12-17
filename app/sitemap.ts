import { MetadataRoute } from "next";
import {
  getAllPokemonRoutes,
  getAllGenerations,
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

  // Add generation pokedex pages (/pokedex/[gen])
  const generations = await getAllGenerations();
  generations.forEach((gen) => {
    urls.push({
      url: `${baseUrl}/pokedex/${gen}`,
      lastModified: currentDate,
      changeFrequency: "monthly",
      priority: 0.8,
    });
  });

  // Add all Pokemon routes (new structure: /{gen}/{pokemon})
  try {
    const pokemonRoutes = await getAllPokemonRoutes();
    pokemonRoutes.forEach((route) => {
      urls.push({
        url: `${baseUrl}/${route.gen}/${route.pokemon}`,
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
