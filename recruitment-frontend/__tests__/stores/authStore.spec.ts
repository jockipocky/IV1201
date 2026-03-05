/**
 * @file authStore.spec.ts
 * @description Unit tests for the authStore Pinia store.
 *
 * This file tests authentication state management and API integration (login/me/logout).
 * API modules are mocked so no real network calls occur.
 *
 * Test scenarios:
 * - logs in and stores user/session data
 * - fetches current user and updates state
 * - logs out and clears auth state
 * - handles authentication errors
 */

import { describe, it, expect, beforeEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useAuthStore } from '../../src/stores/authStore'

vi.mock('@/api/authApi', () => ({
  login: vi.fn(),
  fetchUser: vi.fn(),
  logout: vi.fn()
}))

vi.mock('@/router', () => ({
  router: {
    push: vi.fn()
  }
}))

import { login, fetchUser, logout } from '@/api/authApi'
import { router } from '@/router'

describe('authStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.clearAllMocks()
  })

  describe('initial state', () => {
    it('has user as null initially', () => {
      const store = useAuthStore()
      expect(store.user).toBeNull()
    })
  })

  describe('getters', () => {
    it('isLoggedIn returns false when user is null', () => {
      const store = useAuthStore()
      expect(store.isLoggedIn).toBe(false)
    })

    it('isLoggedIn returns true when user is set', () => {
      const store = useAuthStore()
      store.user = { username: 'testuser' }
      expect(store.isLoggedIn).toBe(true)
    })
  })

  describe('login action', () => {
    it('sets user on successful login', async () => {
      const mockUser = { username: 'testuser', person_id: 1 }
      ;(login as ReturnType<typeof vi.fn>).mockResolvedValue({
        data: { user: mockUser }
      })

      const store = useAuthStore()
      await store.login('testuser', 'password123')

      expect(login).toHaveBeenCalledWith('testuser', 'password123')
      expect(store.user).toEqual(mockUser)
    })

    it('does not throw on login failure', async () => {
      ;(login as ReturnType<typeof vi.fn>).mockRejectedValue(new Error('Network error'))

      const store = useAuthStore()
      await store.login('testuser', 'wrongpassword')

      expect(login).toHaveBeenCalled()
      expect(store.user).toBeNull()
    })
  })

  describe('fetchUser action', () => {
    it('sets user on successful fetch', async () => {
      const mockUser = { username: 'testuser', person_id: 1 }
      ;(fetchUser as ReturnType<typeof vi.fn>).mockResolvedValue({
        data: { user: mockUser }
      })

      const store = useAuthStore()
      await store.fetchUser()

      expect(fetchUser).toHaveBeenCalled()
      expect(store.user).toEqual(mockUser)
    })

    it('sets user to null on fetch failure', async () => {
      ;(fetchUser as ReturnType<typeof vi.fn>).mockRejectedValue(new Error('Unauthorized'))

      const store = useAuthStore()
      store.user = { username: 'olduser' }
      await store.fetchUser()

      expect(fetchUser).toHaveBeenCalled()
      expect(store.user).toBeNull()
    })
  })

  describe('logout action', () => {
    it('calls logout API', async () => {
      ;(logout as ReturnType<typeof vi.fn>).mockResolvedValue({})

      const store = useAuthStore()
      store.user = { username: 'testuser' }
      await store.logout()

      expect(logout).toHaveBeenCalled()
    })

    it('clears user state after logout', async () => {
      ;(logout as ReturnType<typeof vi.fn>).mockResolvedValue({})

      const store = useAuthStore()
      store.user = { username: 'testuser' }
      await store.logout()

      expect(store.user).toBeNull()
    })

    it('removes token from localStorage after logout', async () => {
      ;(logout as ReturnType<typeof vi.fn>).mockResolvedValue({})
      localStorage.setItem('token', 'some-token')

      const store = useAuthStore()
      await store.logout()

      expect(localStorage.getItem('token')).toBeNull()
    })

    it('navigates to login page after logout', async () => {
      ;(logout as ReturnType<typeof vi.fn>).mockResolvedValue({})

      const store = useAuthStore()
      await store.logout()

      expect(router.push).toHaveBeenCalledWith('/login')
    })
  })
})
