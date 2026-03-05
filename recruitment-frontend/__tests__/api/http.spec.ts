/**
 * @file http.spec.ts
 * @description Smoke tests for the HTTP client module.
 *
 * This file verifies that the HTTP client module exports the expected request methods.
 * It does not perform real network requests.
 *
 * Test scenarios:
 * - module can be imported successfully
 * - exposes expected request methods (get/post/put/delete)
 *
 * @module api
 */

import { describe, it, expect } from 'vitest'

describe('http client configuration', () => {
  it('apiClient module exports successfully', async () => {
    const apiClient = await import('../../src/api/http')
    expect(apiClient.default).toBeDefined()
  })

  it('apiClient has get method', async () => {
    const apiClient = await import('../../src/api/http')
    expect(typeof apiClient.default.get).toBe('function')
  })

  it('apiClient has post method', async () => {
    const apiClient = await import('../../src/api/http')
    expect(typeof apiClient.default.post).toBe('function')
  })

  it('apiClient has put method', async () => {
    const apiClient = await import('../../src/api/http')
    expect(typeof apiClient.default.put).toBe('function')
  })

  it('apiClient has delete method', async () => {
    const apiClient = await import('../../src/api/http')
    expect(typeof apiClient.default.delete).toBe('function')
  })
})
