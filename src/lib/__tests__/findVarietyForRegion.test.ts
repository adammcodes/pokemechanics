import { describe, it, expect } from 'vitest'
import findVarietyForRegion from '../findVarietyForRegion'
import { SpeciesVariety } from '@/types/index'

describe('findVarietyForRegion', () => {
  it('should find regional variant matching region name', () => {
    const varieties: SpeciesVariety[] = [
      {
        is_default: true,
        pokemon: { name: 'meowth', url: 'https://pokeapi.co/api/v2/pokemon/52/' },
      },
      {
        is_default: false,
        pokemon: { name: 'meowth-alola', url: 'https://pokeapi.co/api/v2/pokemon/10161/' },
      },
    ]

    const result = findVarietyForRegion(varieties, 'alola')

    expect(result).toBeDefined()
    expect(result?.pokemon.name).toBe('meowth-alola')
  })

  it('should filter out default varieties', () => {
    const varieties: SpeciesVariety[] = [
      {
        is_default: true,
        pokemon: { name: 'vulpix', url: 'https://pokeapi.co/api/v2/pokemon/37/' },
      },
    ]

    const result = findVarietyForRegion(varieties, 'alola')

    expect(result).toBeUndefined()
  })

  it('should return undefined if no matching regional variant found', () => {
    const varieties: SpeciesVariety[] = [
      {
        is_default: true,
        pokemon: { name: 'pikachu', url: 'https://pokeapi.co/api/v2/pokemon/25/' },
      },
      {
        is_default: false,
        pokemon: { name: 'pikachu-rock-star', url: 'https://pokeapi.co/api/v2/pokemon/10080/' },
      },
    ]

    const result = findVarietyForRegion(varieties, 'alola')

    expect(result).toBeUndefined()
  })

  it('should handle case-insensitive region names', () => {
    const varieties: SpeciesVariety[] = [
      {
        is_default: false,
        pokemon: { name: 'rattata-alola', url: 'https://pokeapi.co/api/v2/pokemon/10091/' },
      },
    ]

    const result = findVarietyForRegion(varieties, 'ALOLA')

    expect(result).toBeDefined()
    expect(result?.pokemon.name).toBe('rattata-alola')
  })

  it('should handle Galarian forms', () => {
    const varieties: SpeciesVariety[] = [
      {
        is_default: true,
        pokemon: { name: 'ponyta', url: 'https://pokeapi.co/api/v2/pokemon/77/' },
      },
      {
        is_default: false,
        pokemon: { name: 'ponyta-galar', url: 'https://pokeapi.co/api/v2/pokemon/10162/' },
      },
    ]

    const result = findVarietyForRegion(varieties, 'galar')

    expect(result).toBeDefined()
    expect(result?.pokemon.name).toBe('ponyta-galar')
  })

  it('should handle Hisuian forms', () => {
    const varieties: SpeciesVariety[] = [
      {
        is_default: true,
        pokemon: { name: 'growlithe', url: 'https://pokeapi.co/api/v2/pokemon/58/' },
      },
      {
        is_default: false,
        pokemon: { name: 'growlithe-hisui', url: 'https://pokeapi.co/api/v2/pokemon/10229/' },
      },
    ]

    const result = findVarietyForRegion(varieties, 'hisui')

    expect(result).toBeDefined()
    expect(result?.pokemon.name).toBe('growlithe-hisui')
  })

  it('should handle Paldean forms', () => {
    const varieties: SpeciesVariety[] = [
      {
        is_default: true,
        pokemon: { name: 'tauros', url: 'https://pokeapi.co/api/v2/pokemon/128/' },
      },
      {
        is_default: false,
        pokemon: { name: 'tauros-paldea-combat', url: 'https://pokeapi.co/api/v2/pokemon/10249/' },
      },
    ]

    const result = findVarietyForRegion(varieties, 'paldea')

    expect(result).toBeDefined()
    expect(result?.pokemon.name).toBe('tauros-paldea-combat')
  })

  it('should only match non-default varieties', () => {
    const varieties: SpeciesVariety[] = [
      {
        is_default: true,
        pokemon: { name: 'sandshrew-alola', url: 'https://pokeapi.co/api/v2/pokemon/10099/' },
      },
      {
        is_default: false,
        pokemon: { name: 'sandshrew', url: 'https://pokeapi.co/api/v2/pokemon/27/' },
      },
    ]

    // Even though 'sandshrew-alola' contains 'alola', it's default so it's filtered out
    const result = findVarietyForRegion(varieties, 'alola')

    expect(result).toBeUndefined()
  })

  it('should return first match when multiple variants exist for region', () => {
    const varieties: SpeciesVariety[] = [
      {
        is_default: false,
        pokemon: { name: 'tauros-paldea-combat', url: 'https://pokeapi.co/api/v2/pokemon/10249/' },
      },
      {
        is_default: false,
        pokemon: { name: 'tauros-paldea-blaze', url: 'https://pokeapi.co/api/v2/pokemon/10250/' },
      },
    ]

    const result = findVarietyForRegion(varieties, 'paldea')

    expect(result).toBeDefined()
    expect(result?.pokemon.name).toBe('tauros-paldea-combat')
  })
})
