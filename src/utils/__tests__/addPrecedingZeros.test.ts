import { describe, it, expect } from 'vitest'
import addPrecedingZeros from '../addPrecedingZeros'

describe('addPrecedingZeros', () => {
  it('should add zeros to single digit numbers', () => {
    expect(addPrecedingZeros(1, 3)).toBe('001')
    expect(addPrecedingZeros(5, 3)).toBe('005')
    expect(addPrecedingZeros(9, 3)).toBe('009')
  })

  it('should add zeros to two digit numbers', () => {
    expect(addPrecedingZeros(10, 4)).toBe('0010')
    expect(addPrecedingZeros(99, 4)).toBe('0099')
  })

  it('should not add zeros when number already has enough digits', () => {
    expect(addPrecedingZeros(100, 3)).toBe('100')
    expect(addPrecedingZeros(999, 3)).toBe('999')
    expect(addPrecedingZeros(1234, 4)).toBe('1234')
  })

  it('should not add zeros when number has more digits than requested', () => {
    expect(addPrecedingZeros(1000, 3)).toBe('1000')
    expect(addPrecedingZeros(12345, 3)).toBe('12345')
  })

  it('should handle zero', () => {
    expect(addPrecedingZeros(0, 3)).toBe('000')
    expect(addPrecedingZeros(0, 1)).toBe('0')
  })

  it('should handle Pokemon National Dex numbers', () => {
    // Pikachu is #025
    expect(addPrecedingZeros(25, 3)).toBe('025')

    // Bulbasaur is #001
    expect(addPrecedingZeros(1, 3)).toBe('001')

    // Mew is #151
    expect(addPrecedingZeros(151, 3)).toBe('151')

    // Modern Pokemon like Arceus #493
    expect(addPrecedingZeros(493, 3)).toBe('493')
  })

  it('should handle one digit target', () => {
    expect(addPrecedingZeros(1, 1)).toBe('1')
    expect(addPrecedingZeros(9, 1)).toBe('9')
  })

  it('should handle large digit targets', () => {
    expect(addPrecedingZeros(1, 10)).toBe('0000000001')
    expect(addPrecedingZeros(42, 10)).toBe('0000000042')
  })
})
