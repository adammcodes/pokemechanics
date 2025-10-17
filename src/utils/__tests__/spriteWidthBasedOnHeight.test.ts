import { describe, it, expect } from 'vitest'
import spriteWidthBasedOnHeight from '../spriteWidthBasedOnHeight'

describe('spriteWidthBasedOnHeight', () => {
  it('should return minimum width for very small heights', () => {
    expect(spriteWidthBasedOnHeight(0)).toBe(50) // 100 * 0.5 = 50
    expect(spriteWidthBasedOnHeight(50)).toBe(50) // clamped to minWidth 100, then * 0.5
    expect(spriteWidthBasedOnHeight(99)).toBe(50) // clamped to minWidth 100
  })

  it('should scale heights within min-max range', () => {
    expect(spriteWidthBasedOnHeight(100)).toBe(50) // 100 * 0.5 = 50
    expect(spriteWidthBasedOnHeight(120)).toBe(60) // 120 * 0.5 = 60
    expect(spriteWidthBasedOnHeight(140)).toBe(70) // 140 * 0.5 = 70
    expect(spriteWidthBasedOnHeight(160)).toBe(80) // 160 * 0.5 = 80
  })

  it('should clamp to maximum width for very large heights', () => {
    expect(spriteWidthBasedOnHeight(180)).toBe(90) // 180 * 0.5 = 90
    expect(spriteWidthBasedOnHeight(200)).toBe(90) // clamped to maxWidth 180, then * 0.5
    expect(spriteWidthBasedOnHeight(500)).toBe(90) // clamped to maxWidth 180
    expect(spriteWidthBasedOnHeight(1000)).toBe(90) // clamped to maxWidth 180
  })

  it('should round to nearest integer for pixel-perfect sprites', () => {
    expect(spriteWidthBasedOnHeight(101)).toBe(51) // 101 * 0.5 = 50.5, rounds to 51
    expect(spriteWidthBasedOnHeight(103)).toBe(52) // 103 * 0.5 = 51.5, rounds to 52
    expect(spriteWidthBasedOnHeight(105)).toBe(53) // 105 * 0.5 = 52.5, rounds to 53
  })

  it('should handle typical Pokemon heights', () => {
    // Pikachu is about 40cm tall
    expect(spriteWidthBasedOnHeight(40)).toBe(50) // clamped to min 100

    // Charizard is about 170cm tall
    expect(spriteWidthBasedOnHeight(170)).toBe(85) // 170 * 0.5 = 85

    // Snorlax is about 210cm tall
    expect(spriteWidthBasedOnHeight(210)).toBe(90) // clamped to max 180
  })

  it('should apply the 0.5 multiplier correctly', () => {
    expect(spriteWidthBasedOnHeight(100)).toBe(50)
    expect(spriteWidthBasedOnHeight(120)).toBe(60)
    expect(spriteWidthBasedOnHeight(140)).toBe(70)
    expect(spriteWidthBasedOnHeight(160)).toBe(80)
    expect(spriteWidthBasedOnHeight(180)).toBe(90)
  })

  it('should handle boundary values', () => {
    // At minWidth boundary (100)
    expect(spriteWidthBasedOnHeight(100)).toBe(50)

    // At maxWidth boundary (180)
    expect(spriteWidthBasedOnHeight(180)).toBe(90)
  })
})
