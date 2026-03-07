/**
 * @file i18n.spec.ts
 * @description Unit tests for the internationalization configuration.
 *
 * This file verifies that translation functionality and language
 * switching works correctly.
 *
 * Test scenarios:
 * - loads translations correctly
 * - switches language
 * - returns correct translated strings
 *
 * @module utils
 */

import { describe, it, expect } from 'vitest'
import { getDictionary, Language } from '../../src/i18n/index'

describe('i18n', () => {
it('returns English translations for en', () => {
  const dict = getDictionary('en')
  expect(dict.loginButtonLabel).toBe('Login')
})

it('returns Swedish translations for sv', () => {
  const dict = getDictionary('sv')
  expect(dict.loginButtonLabel).toBe('Logga in')
})

it('falls back to English for unknown language', () => {
  const dict = getDictionary('de' as Language)
  expect(dict.loginButtonLabel).toBe('Login')
})

  it('getDictionary falls back to English for unknown language', () => {
    const dict = getDictionary('de' as Language)
    expect(dict).toBeDefined()
    expect(typeof dict).toBe('object')
  })

})
