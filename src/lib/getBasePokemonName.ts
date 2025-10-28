/**
 * Extracts the base Pokemon name from a potentially variant name
 *
 * Regional variants have suffixes like:
 * - "rattata-alola" → "rattata"
 * - "sandshrew-alola" → "sandshrew"
 * - "typhlosion-hisui" → "typhlosion"
 * - "meowth-galar" → "meowth"
 *
 * @param pokemonName - Pokemon name that may include regional variant suffix
 * @returns Base Pokemon name without regional suffix
 *
 * @example
 * getBasePokemonName("rattata-alola") // Returns "rattata"
 * getBasePokemonName("pikachu") // Returns "pikachu"
 */
export function getBasePokemonName(pokemonName: string): string {
  // Regional variant suffixes
  const regionalSuffixes = [
    "-alola",
    "-galar",
    "-hisui",
    "-paldea",
  ];

  // Check if name has a regional suffix
  for (const suffix of regionalSuffixes) {
    if (pokemonName.endsWith(suffix)) {
      return pokemonName.replace(suffix, "");
    }
  }

  // No regional suffix, return as-is
  return pokemonName;
}
