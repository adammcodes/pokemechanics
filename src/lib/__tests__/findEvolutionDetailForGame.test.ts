import { describe, it, expect, vi } from 'vitest'
import findEvolutionDetailForGame from '../findEvolutionDetailForGame'

// Mock the numOfPokemonByGen constant
vi.mock('@/constants/numOfPokemonByGen', () => ({
  numOfPokemonByGen: {
    'generation-i': 151,
    'generation-ii': 251,
    'generation-iii': 386,
    'generation-iv': 493,
    'generation-v': 649,
    'generation-vi': 721,
    'generation-vii': 809,
    'generation-viii': 905,
  },
}))

describe('findEvolutionDetailForGame', () => {
  it('should return first detail if only one evolution detail exists', () => {
    const evolutionDetails = [
      { min_level: 16, trigger: { name: 'level-up' } },
    ]

    const result = findEvolutionDetailForGame('squirtle', evolutionDetails, 'generation-i')

    expect(result).toEqual(evolutionDetails[0])
  })

  it('should return first detail by default when multiple exist', () => {
    const evolutionDetails = [
      { min_level: 16, trigger: { name: 'level-up' } },
      { min_level: 20, trigger: { name: 'level-up' } },
    ]

    const result = findEvolutionDetailForGame('eevee', evolutionDetails, 'generation-i')

    expect(result).toEqual(evolutionDetails[0])
  })

  it('should handle milotic special case for gen 5+', () => {
    const evolutionDetails = [
      { min_beauty: 170, trigger: { name: 'level-up' } },
      { trade_for: null, trigger: { name: 'trade' }, item: { name: 'prism-scale' } },
    ]

    // Gen 4 should use first detail (beauty)
    const gen4Result = findEvolutionDetailForGame('milotic', evolutionDetails, 'generation-iv')
    expect(gen4Result).toEqual(evolutionDetails[0])

    // Gen 5+ should use second detail (trade with prism scale)
    const gen5Result = findEvolutionDetailForGame('milotic', evolutionDetails, 'generation-v')
    expect(gen5Result).toEqual(evolutionDetails[1])
  })

  it('should handle glaceon evolution details by generation', () => {
    const evolutionDetails = [
      { location: { name: 'eterna-forest' } }, // Gen 4: location
      { location: { name: 'twist-mountain' } }, // Gen 5: location
      { known_move_type: { name: 'ice' } }, // Gen 6-7: knows ice move
      { item: null }, // Gen 8+: other
      { item: { name: 'ice-stone' } }, // Gen 8+: ice stone
    ]

    expect(findEvolutionDetailForGame('glaceon', evolutionDetails, 'generation-iv')).toEqual(evolutionDetails[0])
    expect(findEvolutionDetailForGame('glaceon', evolutionDetails, 'generation-v')).toEqual(evolutionDetails[1])
    expect(findEvolutionDetailForGame('glaceon', evolutionDetails, 'generation-vi')).toEqual(evolutionDetails[2])
    expect(findEvolutionDetailForGame('glaceon', evolutionDetails, 'generation-vii')).toEqual(evolutionDetails[2])
    expect(findEvolutionDetailForGame('glaceon', evolutionDetails, 'generation-viii')).toEqual(evolutionDetails[4])
  })

  it('should handle leafeon evolution details by generation', () => {
    const evolutionDetails = [
      { location: { name: 'eterna-forest' } }, // Gen 4
      { location: { name: 'pinwheel-forest' } }, // Gen 5
      { known_move_type: { name: 'grass' } }, // Gen 6-7
      { item: null }, // Gen 8+: other
      { item: { name: 'leaf-stone' } }, // Gen 8+: leaf stone
    ]

    expect(findEvolutionDetailForGame('leafeon', evolutionDetails, 'generation-iv')).toEqual(evolutionDetails[0])
    expect(findEvolutionDetailForGame('leafeon', evolutionDetails, 'generation-v')).toEqual(evolutionDetails[1])
    expect(findEvolutionDetailForGame('leafeon', evolutionDetails, 'generation-vi')).toEqual(evolutionDetails[2])
    expect(findEvolutionDetailForGame('leafeon', evolutionDetails, 'generation-vii')).toEqual(evolutionDetails[2])
    expect(findEvolutionDetailForGame('leafeon', evolutionDetails, 'generation-viii')).toEqual(evolutionDetails[4])
  })

  it('should handle generation numbering correctly', () => {
    const evolutionDetails = [
      { min_level: 16, trigger: { name: 'level-up' } },
    ]

    // Test that generation numbering works
    const gen1 = findEvolutionDetailForGame('charmander', evolutionDetails, 'generation-i')
    expect(gen1).toBeDefined()

    const gen8 = findEvolutionDetailForGame('sobble', evolutionDetails, 'generation-viii')
    expect(gen8).toBeDefined()
  })

  it('should handle empty evolution details array', () => {
    const evolutionDetails: any[] = []

    // Should still work with empty array, returns undefined
    const result = findEvolutionDetailForGame('pokemon', evolutionDetails, 'generation-i')

    expect(result).toBeUndefined()
  })

  it('should handle regular pokemon without special cases', () => {
    const evolutionDetails = [
      { min_level: 36, trigger: { name: 'level-up' } },
      { min_level: 40, trigger: { name: 'level-up' } },
    ]

    const result = findEvolutionDetailForGame('pidgeotto', evolutionDetails, 'generation-i')

    expect(result).toEqual(evolutionDetails[0])
  })
})
