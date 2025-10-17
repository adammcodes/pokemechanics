import { describe, it, expect } from 'vitest'
import convertHeightToCmOrM from '../convertHeightToCmOrM'

describe('convertHeightToCmOrM', () => {
  it('should convert 0 decimeters to 0cm', () => {
    expect(convertHeightToCmOrM(0)).toBe('0cm')
  })

  it('should convert small heights to centimeters', () => {
    expect(convertHeightToCmOrM(1)).toBe('10cm')
    expect(convertHeightToCmOrM(5)).toBe('50cm')
    expect(convertHeightToCmOrM(9)).toBe('90cm')
  })

  it('should convert exactly 1 meter to 1m', () => {
    expect(convertHeightToCmOrM(10)).toBe('1m')
  })

  it('should convert heights >= 1 meter to meters with decimals', () => {
    expect(convertHeightToCmOrM(15)).toBe('1.5m')
    expect(convertHeightToCmOrM(20)).toBe('2m')
    expect(convertHeightToCmOrM(25)).toBe('2.5m')
  })

  it('should convert large heights to meters', () => {
    expect(convertHeightToCmOrM(100)).toBe('10m')
    expect(convertHeightToCmOrM(140)).toBe('14m')
  })

  it('should remove trailing zeros from meters', () => {
    expect(convertHeightToCmOrM(30)).toBe('3m')
    expect(convertHeightToCmOrM(50)).toBe('5m')
  })

  it('should remove trailing zeros from centimeters', () => {
    // 1 decimeter = 10cm, should show as 10cm not 10.0cm
    expect(convertHeightToCmOrM(1)).toBe('10cm')
  })

  it('should handle decimal precision in meters', () => {
    expect(convertHeightToCmOrM(12)).toBe('1.2m')
    expect(convertHeightToCmOrM(123)).toBe('12.3m')
  })
})
