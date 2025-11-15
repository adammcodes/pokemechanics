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
  // variant substrings
  const suffixes = [
    "-alola",
    "-galar",
    "-hisui",
    "-paldea",
    "-kalos-cap", // for pikachu-kalos-cap
    "-land", // for shaymin-land
    "-sky", // for shaymin-sky
    "-attack", // for deoxys-attack
    "-defense", // for deoxys-defense
    "-speed", // for deoxys-speed
    "-normal", // for deoxys-normal
    "-special", // for deoxys-special
    "-gmax", // for gmax pokemon
    "-mega", // for mega pokemon
    "-primal", // for primal pokemon
    "-totem", // for totem pokemon
  ];

  // Check if name has a regional suffix
  for (const suffix of suffixes) {
    if (pokemonName.includes(suffix)) {
      return pokemonName.split(suffix)[0];
    }
  }

  // No regional suffix, return as-is
  return pokemonName;
}
