/**
 * API Configuration Constants
 * Centralized configuration for external API endpoints
 *
 * Configuration is environment-based for easy switching between:
 * - Production: Public PokeAPI (default)
 * - Development: Self-hosted PokeAPI instance
 *
 * To use local API for builds, create .env.local with:
 * NEXT_PUBLIC_POKEAPI_GRAPHQL_URL=http://localhost:8080/v1/graphql
 * NEXT_PUBLIC_POKEAPI_REST_URL=http://localhost/api/v2
 */

/**
 * PokéAPI GraphQL endpoint
 * Production: https://graphql.pokeapi.co/v1beta2
 * Local: http://localhost:8080/v1/graphql (Hasura)
 */
export const POKEAPI_GRAPHQL_ENDPOINT =
  process.env.NEXT_PUBLIC_POKEAPI_GRAPHQL_URL ||
  "https://graphql.pokeapi.co/v1beta2";

/**
 * PokéAPI REST endpoint
 * Production: https://pokeapi.co/api/v2
 * Local: http://localhost/api/v2
 */
export const POKEAPI_REST_ENDPOINT =
  process.env.NEXT_PUBLIC_POKEAPI_REST_URL ||
  "https://pokeapi.co/api/v2";

/**
 * PokéAPI Sprite base URL
 * Base URL for Pokémon sprite images hosted on GitHub
 * @see https://github.com/PokeAPI/sprites
 */
export const POKEAPI_SPRITE_BASE_URL =
  "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon";

/**
 * PokéAPI Type Sprite base URL
 * Base URL for Pokémon type sprite images hosted on GitHub
 * @see https://github.com/PokeAPI/sprites
 */
export const POKEAPI_TYPE_SPRITE_BASE_URL =
  "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/types";
