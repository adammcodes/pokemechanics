import { describe, it, expect } from 'vitest'
import convertWeightToGramsOrKg from '../convertWeightToGramsOrKg'

describe('convertWeightToGramsOrKg', () => {
  it('should convert small weights using shorter representation', () => {
    // 1 hectogram = 100g or 0.1kg - "100g" is shorter
    expect(convertWeightToGramsOrKg(1)).toBe('100g')
    // 5 hectograms = 500g or 0.5kg - "500g" is shorter
    expect(convertWeightToGramsOrKg(5)).toBe('500g')
  })

  it('should choose shorter representation for small weights', () => {
    // 10 hectograms = 1000g or 1kg
    // "1kg" (3 chars) is shorter than "1000g" (5 chars)
    expect(convertWeightToGramsOrKg(10)).toBe('1kg')
  })

  it('should handle boundary around 1000 hectograms', () => {
    // Below 1000 hectograms - use shorter representation
    expect(convertWeightToGramsOrKg(999)).toBe('99.9kg')

    // At and above 1000 hectograms - use shorter representation
    expect(convertWeightToGramsOrKg(1000)).toBe('100kg')
    expect(convertWeightToGramsOrKg(1001)).toBe('100.1kg')
  })

  it('should convert large weights to kilograms', () => {
    expect(convertWeightToGramsOrKg(2000)).toBe('200kg')
    expect(convertWeightToGramsOrKg(5000)).toBe('500kg')
  })

  it('should remove trailing zeros', () => {
    // 100 hectograms = 10000g or 10kg
    expect(convertWeightToGramsOrKg(100)).toBe('10kg')

    // 500 hectograms = 50000g or 50kg
    expect(convertWeightToGramsOrKg(500)).toBe('50kg')
  })

  it('should handle decimal precision', () => {
    // 15 hectograms = 1500g or 1.5kg
    expect(convertWeightToGramsOrKg(15)).toBe('1.5kg')

    // 125 hectograms = 12500g or 12.5kg
    expect(convertWeightToGramsOrKg(125)).toBe('12.5kg')
  })

  it('should choose grams when it is shorter', () => {
    // For very small weights, grams might be shorter
    // 1 hectogram = 100g or 0.1kg
    // "100g" (4 chars) vs "0.1kg" (5 chars) - grams is shorter
    expect(convertWeightToGramsOrKg(1)).toBe('100g')
  })
})
