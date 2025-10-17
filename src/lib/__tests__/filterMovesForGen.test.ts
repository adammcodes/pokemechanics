import { describe, it, expect } from 'vitest'
import filterMovesForGen from '../filterMovesForGen'
import { PokemonMoveVersion } from '@/types/index'

describe('filterMovesForGen', () => {
  it('should filter moves for a specific generation', () => {
    const moves: PokemonMoveVersion[] = [
      {
        move: { name: 'tackle', url: '' },
        version_group_details: [
          { version_group: { name: 'red-blue', url: '' }, level_learned_at: 1, move_learn_method: { name: 'level-up', url: '' } },
        ],
      },
      {
        move: { name: 'thunderbolt', url: '' },
        version_group_details: [
          { version_group: { name: 'gold-silver', url: '' }, level_learned_at: 10, move_learn_method: { name: 'level-up', url: '' } },
        ],
      },
    ]

    const filteredMoves = filterMovesForGen(moves, 'red-blue')

    expect(filteredMoves).toHaveLength(1)
    expect(filteredMoves[0].move.name).toBe('tackle')
  })

  it('should keep moves that exist in the specified generation', () => {
    const moves: PokemonMoveVersion[] = [
      {
        move: { name: 'quick-attack', url: '' },
        version_group_details: [
          { version_group: { name: 'red-blue', url: '' }, level_learned_at: 1, move_learn_method: { name: 'level-up', url: '' } },
          { version_group: { name: 'gold-silver', url: '' }, level_learned_at: 1, move_learn_method: { name: 'level-up', url: '' } },
        ],
      },
    ]

    const filteredMoves = filterMovesForGen(moves, 'gold-silver')

    expect(filteredMoves).toHaveLength(1)
    expect(filteredMoves[0].move.name).toBe('quick-attack')
  })

  it('should always keep scarlet-violet moves for legends-arceus', () => {
    const moves: PokemonMoveVersion[] = [
      {
        move: { name: 'special-move', url: '' },
        version_group_details: [
          { version_group: { name: 'scarlet-violet', url: '' }, level_learned_at: 1, move_learn_method: { name: 'level-up', url: '' } },
        ],
      },
    ]

    const filteredMoves = filterMovesForGen(moves, 'legends-arceus')

    expect(filteredMoves).toHaveLength(1)
    expect(filteredMoves[0].move.name).toBe('special-move')
  })

  it('should keep scarlet-violet moves regardless of generation', () => {
    const moves: PokemonMoveVersion[] = [
      {
        move: { name: 'move-1', url: '' },
        version_group_details: [
          { version_group: { name: 'scarlet-violet', url: '' }, level_learned_at: 1, move_learn_method: { name: 'level-up', url: '' } },
        ],
      },
    ]

    const filteredMoves = filterMovesForGen(moves, 'red-blue')

    expect(filteredMoves).toHaveLength(1)
  })

  it('should filter out moves not in the generation', () => {
    const moves: PokemonMoveVersion[] = [
      {
        move: { name: 'old-move', url: '' },
        version_group_details: [
          { version_group: { name: 'red-blue', url: '' }, level_learned_at: 1, move_learn_method: { name: 'level-up', url: '' } },
        ],
      },
      {
        move: { name: 'new-move', url: '' },
        version_group_details: [
          { version_group: { name: 'sword-shield', url: '' }, level_learned_at: 1, move_learn_method: { name: 'level-up', url: '' } },
        ],
      },
    ]

    const filteredMoves = filterMovesForGen(moves, 'gold-silver')

    expect(filteredMoves).toHaveLength(0)
  })

  it('should return empty array if no moves match', () => {
    const moves: PokemonMoveVersion[] = [
      {
        move: { name: 'tackle', url: '' },
        version_group_details: [
          { version_group: { name: 'red-blue', url: '' }, level_learned_at: 1, move_learn_method: { name: 'level-up', url: '' } },
        ],
      },
    ]

    const filteredMoves = filterMovesForGen(moves, 'sword-shield')

    expect(filteredMoves).toHaveLength(0)
  })

  it('should handle moves with multiple version groups', () => {
    const moves: PokemonMoveVersion[] = [
      {
        move: { name: 'thunder-wave', url: '' },
        version_group_details: [
          { version_group: { name: 'red-blue', url: '' }, level_learned_at: 10, move_learn_method: { name: 'tm', url: '' } },
          { version_group: { name: 'gold-silver', url: '' }, level_learned_at: 15, move_learn_method: { name: 'tm', url: '' } },
          { version_group: { name: 'ruby-sapphire', url: '' }, level_learned_at: 20, move_learn_method: { name: 'tm', url: '' } },
        ],
      },
    ]

    const filteredMoves = filterMovesForGen(moves, 'ruby-sapphire')

    expect(filteredMoves).toHaveLength(1)
    expect(filteredMoves[0].move.name).toBe('thunder-wave')
  })
})
