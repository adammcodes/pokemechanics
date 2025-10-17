import { describe, it, expect } from 'vitest'
import mapMoves from '../mapMoves'
import { PokemonMoveVersion } from '@/types/index'

describe('mapMoves', () => {
  it('should map moves to simplified format for a generation', () => {
    const moves: PokemonMoveVersion[] = [
      {
        move: { name: 'tackle', url: 'https://pokeapi.co/api/v2/move/33/' },
        version_group_details: [
          {
            version_group: { name: 'red-blue', url: '' },
            level_learned_at: 1,
            move_learn_method: { name: 'level-up', url: '' }
          },
        ],
      },
    ]

    const mappedMoves = mapMoves(moves, 'red-blue')

    expect(mappedMoves).toHaveLength(1)
    expect(mappedMoves[0]).toEqual({
      move: { name: 'tackle', url: 'https://pokeapi.co/api/v2/move/33/' },
      move_learn_method: 'level-up',
      level_learned_at: 1,
    })
  })

  it('should use n/a for move_learn_method if not found', () => {
    const moves: PokemonMoveVersion[] = [
      {
        move: { name: 'tackle', url: '' },
        version_group_details: [
          {
            version_group: { name: 'gold-silver', url: '' },
            level_learned_at: 1,
            move_learn_method: { name: 'level-up', url: '' }
          },
        ],
      },
    ]

    const mappedMoves = mapMoves(moves, 'red-blue')

    expect(mappedMoves[0]).toEqual({
      move: { name: 'tackle', url: '' },
      move_learn_method: 'n/a',
      level_learned_at: 0,
    })
  })

  it('should use 0 for level_learned_at if not found', () => {
    const moves: PokemonMoveVersion[] = [
      {
        move: { name: 'thunderbolt', url: '' },
        version_group_details: [
          {
            version_group: { name: 'ruby-sapphire', url: '' },
            level_learned_at: 25,
            move_learn_method: { name: 'tm', url: '' }
          },
        ],
      },
    ]

    const mappedMoves = mapMoves(moves, 'red-blue')

    expect(mappedMoves[0].level_learned_at).toBe(0)
  })

  it('should find correct details for matching generation', () => {
    const moves: PokemonMoveVersion[] = [
      {
        move: { name: 'quick-attack', url: '' },
        version_group_details: [
          {
            version_group: { name: 'red-blue', url: '' },
            level_learned_at: 5,
            move_learn_method: { name: 'level-up', url: '' }
          },
          {
            version_group: { name: 'gold-silver', url: '' },
            level_learned_at: 10,
            move_learn_method: { name: 'level-up', url: '' }
          },
        ],
      },
    ]

    const mappedMoves = mapMoves(moves, 'gold-silver')

    expect(mappedMoves[0].level_learned_at).toBe(10)
  })

  it('should handle TM moves', () => {
    const moves: PokemonMoveVersion[] = [
      {
        move: { name: 'thunderbolt', url: '' },
        version_group_details: [
          {
            version_group: { name: 'red-blue', url: '' },
            level_learned_at: 0,
            move_learn_method: { name: 'machine', url: '' }
          },
        ],
      },
    ]

    const mappedMoves = mapMoves(moves, 'red-blue')

    expect(mappedMoves[0]).toEqual({
      move: { name: 'thunderbolt', url: '' },
      move_learn_method: 'machine',
      level_learned_at: 0,
    })
  })

  it('should handle multiple moves', () => {
    const moves: PokemonMoveVersion[] = [
      {
        move: { name: 'tackle', url: '' },
        version_group_details: [
          { version_group: { name: 'red-blue', url: '' }, level_learned_at: 1, move_learn_method: { name: 'level-up', url: '' } },
        ],
      },
      {
        move: { name: 'growl', url: '' },
        version_group_details: [
          { version_group: { name: 'red-blue', url: '' }, level_learned_at: 1, move_learn_method: { name: 'level-up', url: '' } },
        ],
      },
      {
        move: { name: 'vine-whip', url: '' },
        version_group_details: [
          { version_group: { name: 'red-blue', url: '' }, level_learned_at: 7, move_learn_method: { name: 'level-up', url: '' } },
        ],
      },
    ]

    const mappedMoves = mapMoves(moves, 'red-blue')

    expect(mappedMoves).toHaveLength(3)
    expect(mappedMoves[0].move.name).toBe('tackle')
    expect(mappedMoves[1].move.name).toBe('growl')
    expect(mappedMoves[2].move.name).toBe('vine-whip')
  })

  it('should handle egg moves', () => {
    const moves: PokemonMoveVersion[] = [
      {
        move: { name: 'charm', url: '' },
        version_group_details: [
          { version_group: { name: 'gold-silver', url: '' }, level_learned_at: 0, move_learn_method: { name: 'egg', url: '' } },
        ],
      },
    ]

    const mappedMoves = mapMoves(moves, 'gold-silver')

    expect(mappedMoves[0].move_learn_method).toBe('egg')
    expect(mappedMoves[0].level_learned_at).toBe(0)
  })
})
