import { describe, it, expect } from 'vitest'
import splitKebabCase from '../splitKebabCase'

describe('splitKebabCase', () => {
  it('should split two-word kebab-case string in half', () => {
    expect(splitKebabCase('red-blue')).toEqual(['red', 'blue'])
    expect(splitKebabCase('hello-world')).toEqual(['hello', 'world'])
  })

  it('should split multi-word kebab-case string in half', () => {
    // 4 words: split at index 2
    expect(splitKebabCase('one-two-three-four')).toEqual(['one-two', 'three-four'])

    // 3 words: split at index 1 (floor of 3/2)
    expect(splitKebabCase('red-blue-yellow')).toEqual(['red', 'blue-yellow'])
  })

  it('should handle odd number of words', () => {
    // 5 words: split at index 2 (floor of 5/2)
    expect(splitKebabCase('a-b-c-d-e')).toEqual(['a-b', 'c-d-e'])
  })

  it('should return original string if no dashes', () => {
    expect(splitKebabCase('pokemon')).toBe('pokemon')
    expect(splitKebabCase('hello')).toBe('hello')
  })

  it('should return original value if not a string', () => {
    expect(splitKebabCase(123 as any)).toBe(123)
    expect(splitKebabCase(null as any)).toBe(null)
    expect(splitKebabCase(undefined as any)).toBe(undefined)
  })

  it('should handle single dash', () => {
    expect(splitKebabCase('a-b')).toEqual(['a', 'b'])
  })

  it('should handle empty string', () => {
    expect(splitKebabCase('')).toBe('')
  })

  it('should split version group names correctly', () => {
    // Used for splitting version group names like "diamond-pearl" for display
    expect(splitKebabCase('diamond-pearl')).toEqual(['diamond', 'pearl'])
    expect(splitKebabCase('ruby-sapphire')).toEqual(['ruby', 'sapphire'])
    expect(splitKebabCase('black-white')).toEqual(['black', 'white'])
  })

  it('should handle generation names with multiple words', () => {
    // "ultra-sun-ultra-moon" has 4 words, splits to 2-2
    expect(splitKebabCase('ultra-sun-ultra-moon')).toEqual(['ultra-sun', 'ultra-moon'])
  })
})
