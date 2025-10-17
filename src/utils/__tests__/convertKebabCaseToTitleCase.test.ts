import { describe, it, expect } from 'vitest'
import convertKebabCaseToTitleCase from '../convertKebabCaseToTitleCase'

describe('convertKebabCaseToTitleCase', () => {
  it('should convert simple kebab-case to Title Case', () => {
    expect(convertKebabCaseToTitleCase('hello-world')).toBe('Hello World')
    expect(convertKebabCaseToTitleCase('red-blue')).toBe('Red Blue')
  })

  it('should convert multi-word kebab-case', () => {
    expect(convertKebabCaseToTitleCase('the-quick-brown-fox')).toBe('The Quick Brown Fox')
    expect(convertKebabCaseToTitleCase('pokemon-red-blue-yellow')).toBe('Pokemon Red Blue Yellow')
  })

  it('should handle single words without dashes', () => {
    expect(convertKebabCaseToTitleCase('pokemon')).toBe('Pokemon')
    expect(convertKebabCaseToTitleCase('pikachu')).toBe('Pikachu')
  })

  it('should handle empty string', () => {
    expect(convertKebabCaseToTitleCase('')).toBe('')
  })

  it('should throw error for non-string input', () => {
    expect(() => convertKebabCaseToTitleCase(123 as any)).toThrow('Invalid Input. convertKebabCaseToTitleCase expects a string.')
    expect(() => convertKebabCaseToTitleCase(null as any)).toThrow('Invalid Input. convertKebabCaseToTitleCase expects a string.')
    expect(() => convertKebabCaseToTitleCase(undefined as any)).toThrow('Invalid Input. convertKebabCaseToTitleCase expects a string.')
  })

  it('should capitalize each word after dash', () => {
    expect(convertKebabCaseToTitleCase('ultra-ball')).toBe('Ultra Ball')
    expect(convertKebabCaseToTitleCase('master-ball')).toBe('Master Ball')
    expect(convertKebabCaseToTitleCase('great-ball')).toBe('Great Ball')
  })

  it('should handle single letter words', () => {
    expect(convertKebabCaseToTitleCase('a-b-c')).toBe('A B C')
    expect(convertKebabCaseToTitleCase('x-y')).toBe('X Y')
  })

  it('should not lowercase remaining letters', () => {
    // Unlike toTitleCase, this function preserves case after first letter
    expect(convertKebabCaseToTitleCase('HELLO-WORLD')).toBe('HELLO WORLD')
  })

  it('should handle Pokemon version names', () => {
    expect(convertKebabCaseToTitleCase('red-blue')).toBe('Red Blue')
    expect(convertKebabCaseToTitleCase('gold-silver')).toBe('Gold Silver')
    expect(convertKebabCaseToTitleCase('ruby-sapphire')).toBe('Ruby Sapphire')
    expect(convertKebabCaseToTitleCase('diamond-pearl')).toBe('Diamond Pearl')
  })
})
