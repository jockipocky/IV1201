/**
 * @file registerStore.spec.ts
 * @description Unit tests for the registerStore Pinia store.
 *
 * This file tests registration state management and API integration.
 * API modules are mocked so no real network calls occur.
 *
 * Test scenarios:
 * - submits registration successfully
 * - handles registration errors
 * - manages registration form state
 */

import { describe, it, expect, beforeEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useRegisterStore } from '../../src/stores/registerStore'

vi.mock('@/api/authApi', () => ({
  register: vi.fn()
}))

import { register } from '@/api/authApi'

describe('registerStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.clearAllMocks()
  })

  describe('initial state', () => {
    it('has registeringResult as null initially', () => {
      const store = useRegisterStore()
      expect(store.registeringResult).toBeNull()
    })

    it('has error as null initially', () => {
      const store = useRegisterStore()
      expect(store.error).toBeNull()
    })
  })

  describe('register action', () => {
    it('registers user successfully', async () => {
      const mockResponse = { data: { person_id: 1, username: 'newuser' } }
      ;(register as ReturnType<typeof vi.fn>).mockResolvedValue(mockResponse)

      const store = useRegisterStore()
      await store.register('John', 'Doe', 'john@test.com', '199001011234', 'newuser', 'password123')

      expect(register).toHaveBeenCalledWith('John', 'Doe', 'john@test.com', '199001011234', 'newuser', 'password123')
      expect(store.registeringResult).toEqual(mockResponse.data)
    })

    it('throws error on failure', async () => {
      ;(register as ReturnType<typeof vi.fn>).mockRejectedValue(new Error('Registration failed'))

      const store = useRegisterStore()
      await expect(store.register('John', 'Doe', 'john@test.com', '199001011234', 'newuser', 'password123'))
        .rejects.toThrow('Registration failed')
    })
  })
})
