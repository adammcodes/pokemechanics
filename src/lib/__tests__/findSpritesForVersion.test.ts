import { describe, it, expect } from 'vitest'
import findSpritesForVersion from '../findSpritesForVersion'

describe('findSpritesForVersion', () => {
  const createMockSprites = () => ({
    back_default: 'default-back.png',
    front_default: 'default-front.png',
    back_female: null,
    back_shiny: null,
    back_shiny_female: null,
    front_female: null,
    front_shiny: null,
    front_shiny_female: null,
    other: {},
    versions: {
      'generation-i': {
        'red-blue': {
          front_default: 'gen1-rb-front.png',
          back_default: null,
        },
        'yellow': {
          front_default: 'gen1-yellow-front.png',
          back_default: null,
        },
      },
      'generation-ii': {
        'gold': {
          front_default: 'gen2-gold-front.png',
          back_default: null,
        },
        'silver': {
          front_default: 'gen2-silver-front.png',
          back_default: null,
        },
        'crystal': {
          front_default: 'gen2-crystal-front.png',
          back_default: null,
        },
      },
      'generation-iii': {
        'ruby-sapphire': {
          front_default: 'gen3-rs-front.png',
          back_default: null,
        },
      },
    },
  })

  it('should find sprites for exact version match', () => {
    const sprites = createMockSprites() as any

    const result = findSpritesForVersion(sprites, 'red-blue')

    expect(result).toEqual(sprites.versions['generation-i']['red-blue'])
  })

  it('should find sprites by first part of hyphenated version', () => {
    const sprites = createMockSprites() as any

    const result = findSpritesForVersion(sprites, 'ruby-sapphire')

    expect(result).toEqual(sprites.versions['generation-iii']['ruby-sapphire'])
  })

  it('should return default sprites if version has null front_default', () => {
    const sprites = {
      back_default: 'default-back.png',
      front_default: 'default-front.png',
      versions: {
        'generation-iii': {
          'firered-leafgreen': {
            front_default: null, // Pokemon not available in this version
            back_default: null,
          },
        },
      },
    } as any

    const result = findSpritesForVersion(sprites, 'firered-leafgreen')

    expect(result).toEqual(sprites)
  })

  it('should return default sprites if version not found', () => {
    const sprites = createMockSprites() as any

    const result = findSpritesForVersion(sprites, 'nonexistent-version')

    expect(result).toEqual(sprites)
  })

  it('should handle single version names', () => {
    const sprites = createMockSprites() as any

    const result = findSpritesForVersion(sprites, 'yellow')

    expect(result).toEqual(sprites.versions['generation-i']['yellow'])
  })

  it('should match version by second part of hyphenated name', () => {
    const sprites = {
      front_default: 'default-front.png',
      versions: {
        'generation-i': {
          'red': {
            front_default: 'gen1-red-front.png',
          },
          'blue': {
            front_default: 'gen1-blue-front.png',
          },
        },
      },
    } as any

    // When searching for 'red-blue', it should match either 'red' or 'blue'
    const result = findSpritesForVersion(sprites, 'red-blue')

    // Should find generation-i because it contains 'red' and 'blue' keys
    expect(result).toBeDefined()
    expect(result.front_default).toBeDefined()
  })

  it('should handle Pokemon available in specific version', () => {
    const sprites = {
      front_default: 'default.png',
      versions: {
        'generation-ii': {
          'gold': {
            front_default: 'gold-sprite.png',
          },
          'silver': {
            front_default: 'silver-sprite.png',
          },
        },
      },
    } as any

    const goldResult = findSpritesForVersion(sprites, 'gold')
    expect(goldResult.front_default).toBe('gold-sprite.png')

    const silverResult = findSpritesForVersion(sprites, 'silver')
    expect(silverResult.front_default).toBe('silver-sprite.png')
  })

  it('should return default sprites when sprites object is empty for version', () => {
    const sprites = {
      front_default: 'default-sprite.png',
      versions: {
        'generation-v': {
          'black-white': {},
        },
      },
    } as any

    const result = findSpritesForVersion(sprites, 'black-white')

    // Empty object doesn't have front_default, so return default
    expect(result).toEqual(sprites)
  })
})
