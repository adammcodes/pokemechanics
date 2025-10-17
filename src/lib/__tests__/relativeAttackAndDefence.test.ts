import { describe, it, expect } from 'vitest'
import relativeAttackAndDefense from '../relativeAttackAndDefence'

describe('relativeAttackAndDefense', () => {
  it('should return "Att = Def" when number is 0', () => {
    expect(relativeAttackAndDefense(0)).toBe('Att = Def')
  })

  it('should return "Att > Def" for positive numbers', () => {
    expect(relativeAttackAndDefense(1)).toBe('Att > Def')
    expect(relativeAttackAndDefense(10)).toBe('Att > Def')
    expect(relativeAttackAndDefense(100)).toBe('Att > Def')
  })

  it('should return "Def > Att" for negative numbers', () => {
    expect(relativeAttackAndDefense(-1)).toBe('Def > Att')
    expect(relativeAttackAndDefense(-10)).toBe('Def > Att')
    expect(relativeAttackAndDefense(-100)).toBe('Def > Att')
  })

  it('should return null for falsy values other than 0', () => {
    expect(relativeAttackAndDefense(null as any)).toBe(null)
    expect(relativeAttackAndDefense(undefined as any)).toBe(null)
    expect(relativeAttackAndDefense(NaN)).toBe(null)
  })

  it('should handle Pokemon stat differences', () => {
    // Pikachu: Attack 55, Defense 40 (difference: +15)
    expect(relativeAttackAndDefense(15)).toBe('Att > Def')

    // Shuckle: Attack 10, Defense 230 (difference: -220)
    expect(relativeAttackAndDefense(-220)).toBe('Def > Att')

    // Equal stats
    expect(relativeAttackAndDefense(0)).toBe('Att = Def')
  })

  it('should handle small differences', () => {
    expect(relativeAttackAndDefense(1)).toBe('Att > Def')
    expect(relativeAttackAndDefense(-1)).toBe('Def > Att')
  })

  it('should handle large differences', () => {
    expect(relativeAttackAndDefense(999)).toBe('Att > Def')
    expect(relativeAttackAndDefense(-999)).toBe('Def > Att')
  })

  it('should handle decimal numbers', () => {
    expect(relativeAttackAndDefense(0.5)).toBe('Att > Def')
    expect(relativeAttackAndDefense(-0.5)).toBe('Def > Att')
  })
})
