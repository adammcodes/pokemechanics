import { describe, it, expect } from 'vitest'
import findSpritesForGoldSilver from '../findSpritesForGoldSilver'

describe('findSpritesForGoldSilver', () => {
  const createMockSprites = () => ({
    back_default: 'default-back.png',
    front_default: 'default-front.png',
    versions: {
      'generation-ii': {
        gold: {
          front_default: 'gold-sprite.png',
          back_default: 'gold-back.png',
        },
        silver: {
          front_default: 'silver-sprite.png',
          back_default: 'silver-back.png',
        },
        crystal: {
          front_default: 'crystal-sprite.png',
          back_default: 'crystal-back.png',
        },
      },
    },
  })

  it('should return both gold and silver sprites', () => {
    const sprites = createMockSprites() as any

    const result = findSpritesForGoldSilver(sprites, 'gold-silver')

    expect(result).toBeDefined()
    expect(result?.gold).toEqual(sprites.versions['generation-ii'].gold)
    expect(result?.silver).toEqual(sprites.versions['generation-ii'].silver)
  })

  it('should set front_default to silver sprite', () => {
    const sprites = createMockSprites() as any

    const result = findSpritesForGoldSilver(sprites, 'gold-silver')

    expect(result?.front_default).toBe(sprites.versions['generation-ii'].silver)
  })

  it('should return undefined if generation not found', () => {
    const sprites = {
      front_default: 'default.png',
      versions: {
        'generation-i': {
          'red-blue': {
            front_default: 'rb-sprite.png',
          },
        },
      },
    } as any

    const result = findSpritesForGoldSilver(sprites, 'gold-silver')

    expect(result).toBeUndefined()
  })

  it('should match by first part of version name (gold)', () => {
    const sprites = createMockSprites() as any

    const result = findSpritesForGoldSilver(sprites, 'gold')

    expect(result).toBeDefined()
    expect(result?.gold).toBeDefined()
    expect(result?.silver).toBeDefined()
  })

  it('should match by second part of version name (silver)', () => {
    const sprites = createMockSprites() as any

    const result = findSpritesForGoldSilver(sprites, 'silver')

    expect(result).toBeDefined()
    expect(result?.gold).toBeDefined()
    expect(result?.silver).toBeDefined()
  })

  it('should work with full gold-silver version name', () => {
    const sprites = createMockSprites() as any

    const result = findSpritesForGoldSilver(sprites, 'gold-silver')

    expect(result).toBeDefined()
    expect(result?.gold.front_default).toBe('gold-sprite.png')
    expect(result?.silver.front_default).toBe('silver-sprite.png')
  })

  it('should handle case where sprites differ between gold and silver', () => {
    const sprites = {
      front_default: 'default.png',
      versions: {
        'generation-ii': {
          gold: {
            front_default: 'different-gold.png',
            back_default: null,
          },
          silver: {
            front_default: 'different-silver.png',
            back_default: null,
          },
        },
      },
    } as any

    const result = findSpritesForGoldSilver(sprites, 'gold-silver')

    expect(result?.gold.front_default).toBe('different-gold.png')
    expect(result?.silver.front_default).toBe('different-silver.png')
    // Verify they are different
    expect(result?.gold.front_default).not.toBe(result?.silver.front_default)
  })

  it('should return object with undefined sprites for non-gen-ii versions', () => {
    const sprites = {
      front_default: 'default.png',
      versions: {
        'generation-iii': {
          'ruby': { front_default: 'ruby.png' },
          'sapphire': { front_default: 'sapphire.png' },
        },
      },
    } as any

    const result = findSpritesForGoldSilver(sprites, 'ruby-sapphire')

    // Function finds the generation but returns undefined gold/silver sprites
    // since gen-iii doesn't have 'gold' or 'silver' keys
    expect(result).toBeDefined()
    expect(result?.gold).toBeUndefined()
    expect(result?.silver).toBeUndefined()
  })

  it('should handle empty versions object', () => {
    const sprites = {
      front_default: 'default.png',
      versions: {},
    } as any

    const result = findSpritesForGoldSilver(sprites, 'gold-silver')

    expect(result).toBeUndefined()
  })
})
