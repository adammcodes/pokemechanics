import { describe, it, expect } from 'vitest'
import replaceNewlinesAndFeeds from '../replaceNewlinesAndFeeds'

describe('replaceNewlinesAndFeeds', () => {
  it('should remove soft hyphens', () => {
    expect(replaceNewlinesAndFeeds('hello\u00ADworld')).toBe('helloworld')
    expect(replaceNewlinesAndFeeds('Poké\u00ADmon')).toBe('Pokémon')
  })

  it('should remove soft hyphen followed by newline', () => {
    expect(replaceNewlinesAndFeeds('hello­\nworld')).toBe('helloworld')
  })

  it('should remove soft hyphen followed by newline and form feed', () => {
    // The function replaces newlines between words with space
    expect(replaceNewlinesAndFeeds('hello­\n\fworld')).toBe('hello world')
  })

  it('should replace newlines between non-whitespace with space', () => {
    expect(replaceNewlinesAndFeeds('hello\nworld')).toBe('hello world')
    expect(replaceNewlinesAndFeeds('Pokémon\nTrainer')).toBe('Pokémon Trainer')
  })

  it('should replace form feeds between non-whitespace with space', () => {
    expect(replaceNewlinesAndFeeds('hello\fworld')).toBe('hello world')
  })

  it('should replace multiple newlines between non-whitespace with single space', () => {
    expect(replaceNewlinesAndFeeds('hello\n\nworld')).toBe('hello world')
    expect(replaceNewlinesAndFeeds('hello\n\n\nworld')).toBe('hello world')
  })

  it('should handle newline before punctuation', () => {
    expect(replaceNewlinesAndFeeds('hello\n.')).toBe('hello .')
    expect(replaceNewlinesAndFeeds('world\n,')).toBe('world ,')
  })

  it('should remove remaining newlines and form feeds', () => {
    expect(replaceNewlinesAndFeeds('hello\n')).toBe('hello')
    expect(replaceNewlinesAndFeeds('\nhello')).toBe('hello')
    expect(replaceNewlinesAndFeeds('hello\f')).toBe('hello')
  })

  it('should handle text with no newlines or feeds', () => {
    expect(replaceNewlinesAndFeeds('hello world')).toBe('hello world')
    expect(replaceNewlinesAndFeeds('Pokémon')).toBe('Pokémon')
  })

  it('should handle empty string', () => {
    expect(replaceNewlinesAndFeeds('')).toBe('')
  })

  it('should handle complex Pokemon flavor text', () => {
    const input = 'When several of\nthese POKéMON\ngather, their\felectricity could\nbuild and cause\flightning storms.'
    const expected = 'When several of these POKéMON gather, their electricity could build and cause lightning storms.'
    expect(replaceNewlinesAndFeeds(input)).toBe(expected)
  })

  it('should handle multiple consecutive newlines', () => {
    expect(replaceNewlinesAndFeeds('a\n\n\n\nb')).toBe('a b')
  })

  it('should preserve normal spaces', () => {
    expect(replaceNewlinesAndFeeds('hello world test')).toBe('hello world test')
  })
})
