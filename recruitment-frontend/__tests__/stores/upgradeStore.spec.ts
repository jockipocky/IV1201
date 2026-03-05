/**
 * @file upgradeStore.spec.ts
 * @description Unit tests for the upgradeStore Pinia store.
 *
 * This file tests upgrade-account state management and API integration.
 * API modules are mocked so no real network calls occur.
 *
 * Test scenarios:
 * - submits upgrade request successfully
 * - handles upgrade errors
 * - manages upgrade form state
 */

import { describe, it, expect, beforeEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useUpgradeStore } from '../../src/stores/upgradeStore'

vi.mock('@/api/authApi', () => ({
  upgradeAccount: vi.fn()
}))

import { upgradeAccount } from '@/api/authApi'

describe('upgradeStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.clearAllMocks()
  })

  describe('initial state', () => {
    it('has upgradeResult as null initially', () => {
      const store = useUpgradeStore()
      expect(store.upgradeResult).toBeNull()
    })

    it('has error as null initially', () => {
      const store = useUpgradeStore()
      expect(store.error).toBeNull()
    })
  })

  describe('upgrade action', () => {
    it('upgrades account successfully', async () => {
      const mockResponse = { data: { person_id: 1, username: 'upgraded' } }
      ;(upgradeAccount as ReturnType<typeof vi.fn>).mockResolvedValue(mockResponse)

      const store = useUpgradeStore()
      const result = await store.upgrade('test@test.com', '199001011234', 'UPGRADE123', 'newuser', 'password123')

      expect(upgradeAccount).toHaveBeenCalledWith('test@test.com', '199001011234', 'UPGRADE123', 'newuser', 'password123')
      expect(store.upgradeResult).toEqual(mockResponse.data)
      expect(store.error).toBeNull()
      expect(result).toEqual(mockResponse.data)
    })

    it('sets error on failure', async () => {
      ;(upgradeAccount as ReturnType<typeof vi.fn>).mockRejectedValue({
        response: { data: { message: 'Invalid upgrade code' } }
      })

      const store = useUpgradeStore()
      await expect(store.upgrade('test@test.com', '199001011234', 'INVALID', 'newuser', 'password123'))
        .rejects.toThrow()

      expect(store.error).toBe('Invalid upgrade code')
    })

    it('sets generic error when no message provided', async () => {
      ;(upgradeAccount as ReturnType<typeof vi.fn>).mockRejectedValue(new Error('Network error'))

      const store = useUpgradeStore()
      await expect(store.upgrade('test@test.com', '199001011234', 'CODE', 'user', 'pass'))
        .rejects.toThrow()

      expect(store.error).toBe('Registering failed, sorry')
    })
  })
})
