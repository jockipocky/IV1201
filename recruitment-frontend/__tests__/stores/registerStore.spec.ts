/**
 * @file registerStore.spec.ts
 * @description Unit tests for the register store.
 *
 * This file tests the state management logic for user registration.
 *
 * Test scenarios:
 * - submits registration data
 * - updates registration state
 * - handles registration errors
 *
 * @module stores
 */

import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useRegisterStore } from '../../src/stores/registerStore'

vi.mock('@/api/authApi', () => ({
  register: vi.fn()
}))

import { register } from '@/api/authApi'

describe('registerStore', () => {
  let consoleLogSpy: ReturnType<typeof vi.spyOn>

  beforeEach(() => {
    setActivePinia(createPinia())
    vi.clearAllMocks()
    consoleLogSpy = vi.spyOn(console, 'log').mockImplementation(() => {})
  })

  afterEach(() => {
    consoleLogSpy.mockRestore()
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
