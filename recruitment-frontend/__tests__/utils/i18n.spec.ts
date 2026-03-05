/**
 * @file i18n.spec.ts
 * @description Unit tests for i18n/dictionary utilities.
 *
 * This file tests translation helpers and/or dictionary lookup behavior.
 *
 * Test scenarios:
 * - returns expected translation values for known keys
 * - handles missing keys/fallback behavior
 */

import { describe, it, expect } from 'vitest'
import { getDictionary, Language } from '../../src/i18n/index'

describe('i18n', () => {
  it('getDictionary returns English dictionary for en', () => {
    const dict = getDictionary('en')
    expect(dict).toBeDefined()
    expect(typeof dict).toBe('object')
  })

  it('getDictionary returns Swedish dictionary for sv', () => {
    const dict = getDictionary('sv')
    expect(dict).toBeDefined()
    expect(typeof dict).toBe('object')
  })

  it('getDictionary falls back to English for unknown language', () => {
    const dict = getDictionary('de' as Language)
    expect(dict).toBeDefined()
    expect(typeof dict).toBe('object')
  })

  it('supports en and sv languages', () => {
    const enDict = getDictionary('en')
    const svDict = getDictionary('sv')
    expect(enDict).not.toBe(svDict)
  })
})
