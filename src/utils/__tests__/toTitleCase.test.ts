import { describe, it, expect } from 'vitest'
import toTitleCase from '../toTitleCase'

describe('toTitleCase', () => {
  it('should convert single words to title case', () => {
    expect(toTitleCase('hello')).toBe('Hello')
    expect(toTitleCase('world')).toBe('World')
    expect(toTitleCase('POKEMON')).toBe('Pokemon')
  })

  it('should convert multiple words separated by spaces', () => {
    expect(toTitleCase('hello world')).toBe('Hello World')
    expect(toTitleCase('the quick brown fox')).toBe('The Quick Brown Fox')
  })

  it('should handle words separated by dashes', () => {
    expect(toTitleCase('ultra-ball')).toBe('Ultra-Ball')
    expect(toTitleCase('master-ball')).toBe('Master-Ball')
    expect(toTitleCase('red-blue')).toBe('Red-Blue')
  })

  it('should handle mixed spaces and dashes', () => {
    expect(toTitleCase('pokemon red-blue version')).toBe('Pokemon Red-Blue Version')
    expect(toTitleCase('ultra ball - rare candy')).toBe('Ultra Ball - Rare Candy')
  })

  it('should preserve dashes in output', () => {
    expect(toTitleCase('mega-evolution')).toBe('Mega-Evolution')
    expect(toTitleCase('x-scissor')).toBe('X-Scissor')
  })

  it('should handle multiple spaces', () => {
    expect(toTitleCase('hello  world')).toBe('Hello  World')
  })

  it('should handle already capitalized words', () => {
    expect(toTitleCase('Hello World')).toBe('Hello World')
    expect(toTitleCase('Title Case Text')).toBe('Title Case Text')
  })

  it('should handle empty string', () => {
    expect(toTitleCase('')).toBe('')
  })

  it('should lowercase letters after the first', () => {
    expect(toTitleCase('HELLO')).toBe('Hello')
    expect(toTitleCase('WORLD')).toBe('World')
    expect(toTitleCase('POKEMON TRAINER')).toBe('Pokemon Trainer')
  })

  it('should handle single character words', () => {
    expect(toTitleCase('a b c')).toBe('A B C')
    expect(toTitleCase('x')).toBe('X')
  })
})
