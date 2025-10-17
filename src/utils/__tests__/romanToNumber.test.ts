import { describe, it, expect } from 'vitest'
import { romanToNumber } from '../romanToNumber'

describe('romanToNumber', () => {
  it('should convert single digit roman numerals', () => {
    expect(romanToNumber('I')).toBe(1)
    expect(romanToNumber('V')).toBe(5)
    expect(romanToNumber('X')).toBe(10)
    expect(romanToNumber('L')).toBe(50)
    expect(romanToNumber('C')).toBe(100)
    expect(romanToNumber('D')).toBe(500)
    expect(romanToNumber('M')).toBe(1000)
  })

  it('should handle lowercase roman numerals', () => {
    expect(romanToNumber('i')).toBe(1)
    expect(romanToNumber('v')).toBe(5)
    expect(romanToNumber('x')).toBe(10)
  })

  it('should convert additive combinations', () => {
    expect(romanToNumber('II')).toBe(2)
    expect(romanToNumber('III')).toBe(3)
    expect(romanToNumber('VI')).toBe(6)
    expect(romanToNumber('VII')).toBe(7)
    expect(romanToNumber('VIII')).toBe(8)
  })

  it('should convert subtractive combinations', () => {
    expect(romanToNumber('IV')).toBe(4)
    expect(romanToNumber('IX')).toBe(9)
    expect(romanToNumber('XL')).toBe(40)
    expect(romanToNumber('XC')).toBe(90)
    expect(romanToNumber('CD')).toBe(400)
    expect(romanToNumber('CM')).toBe(900)
  })

  it('should convert complex roman numerals', () => {
    expect(romanToNumber('XIV')).toBe(14)
    expect(romanToNumber('XXIV')).toBe(24)
    expect(romanToNumber('XLIX')).toBe(49)
    expect(romanToNumber('XCIX')).toBe(99)
    expect(romanToNumber('CDXLIV')).toBe(444)
    expect(romanToNumber('MCMXCIV')).toBe(1994)
  })

  it('should convert large numbers', () => {
    expect(romanToNumber('MM')).toBe(2000)
    expect(romanToNumber('MMM')).toBe(3000)
    expect(romanToNumber('MMMCMXCIX')).toBe(3999)
  })

  it('should handle mixed case', () => {
    expect(romanToNumber('XiV')).toBe(14)
    expect(romanToNumber('mcmxciv')).toBe(1994)
  })
})
