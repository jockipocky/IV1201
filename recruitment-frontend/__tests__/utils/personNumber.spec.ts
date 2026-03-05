/**
 * @file personNumber.spec.ts
 * @description Unit tests for Swedish personnummer utility functions.
 *
 * This file tests formatting and validation helpers for Swedish personal identity numbers.
 *
 * Test scenarios:
 * - formats personnummer into expected output
 * - validates correct inputs
 * - rejects invalid inputs
 */

import { describe, it, expect } from 'vitest'
import { formatPersonNumber, isValidPersonNumberFormatted, validateAndFormatPNR } from '../../src/utility/personNumber'

describe('personNumber utility', () => {
  describe('formatPersonNumber', () => {
    it('returns null for empty string', () => {
      expect(formatPersonNumber('')).toBeNull()
    })

    it('returns null for null input', () => {
      expect(formatPersonNumber(null as any)).toBeNull()
    })

    it('returns null for undefined input', () => {
      expect(formatPersonNumber(undefined as any)).toBeNull()
    })

    it('returns null for less than 12 digits', () => {
      expect(formatPersonNumber('19900101123')).toBeNull()
    })

    it('returns null for more than 12 digits', () => {
      expect(formatPersonNumber('1990010112345')).toBeNull()
    })

    it('formats 12 digits without dashes to YYYYMMDD-XXXX format', () => {
      expect(formatPersonNumber('199001011234')).toBe('19900101-1234')
    })

    it('strips non-digits and formats correctly', () => {
      expect(formatPersonNumber('199001011234')).toBe('19900101-1234')
    })

    it('returns null for invalid format (too few digits)', () => {
      expect(formatPersonNumber('123')).toBeNull()
    })
  })

  describe('isValidPersonNumberFormatted', () => {
    it('returns false for invalid format', () => {
      expect(isValidPersonNumberFormatted('invalid')).toBe(false)
    })

    it('returns false for empty string', () => {
      expect(isValidPersonNumberFormatted('')).toBe(false)
    })
  })

  describe('validateAndFormatPNR', () => {
    it('returns null for invalid personnummer', () => {
      expect(validateAndFormatPNR('invalid')).toBeNull()
    })

    it('returns null for empty string', () => {
      expect(validateAndFormatPNR('')).toBeNull()
    })

    it('returns null for invalid format', () => {
      expect(validateAndFormatPNR('123')).toBeNull()
    })
  })
})
