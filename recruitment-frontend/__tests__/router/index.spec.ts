/**
 * @file index.spec.ts
 * @description Unit tests for the application router configuration.
 *
 * This file tests the router setup including route definitions,
 * navigation guards, and route handling.
 *
 * Test scenarios:
 * - routes resolve correctly
 * - navigation guards trigger properly
 * - protected routes require authentication
 *
 * @module router
 */

import { describe, it, expect, vi, beforeEach } from 'vitest'

// shared mock object
const mockAuthStore = {
  isLoggedIn: false,
  user: null as null | { role_id: number },
}

vi.mock('@/stores/authStore', () => ({
  useAuthStore: () => mockAuthStore,
}))

import { authGuard } from '@/router/index'

describe('authGuard', () => {
  const from = {} as any
  const next = vi.fn()

  beforeEach(() => {
    next.mockReset()
    mockAuthStore.isLoggedIn = false
    mockAuthStore.user = null
  })

  it('requiresAuth + not logged in -> /login', () => {
    const to = { meta: { requiresAuth: true } } as any
    authGuard(to, from, next)
    expect(next).toHaveBeenCalledWith('/login')
  })

  it('guestOnly + logged in recruiter -> /recruiter', () => {
    mockAuthStore.isLoggedIn = true
    mockAuthStore.user = { role_id: 1 }

    const to = { meta: { guestOnly: true } } as any
    authGuard(to, from, next)
    expect(next).toHaveBeenCalledWith('/recruiter')
  })

  it('guestOnly + logged in applicant -> /profile', () => {
    mockAuthStore.isLoggedIn = true
    mockAuthStore.user = { role_id: 2 }

    const to = { meta: { guestOnly: true } } as any
    authGuard(to, from, next)
    expect(next).toHaveBeenCalledWith('/profile')
  })

  it('role mismatch -> /login', () => {
    mockAuthStore.isLoggedIn = true
    mockAuthStore.user = { role_id: 2 }

    const to = { meta: { role: 1 } } as any
    authGuard(to, from, next)
    expect(next).toHaveBeenCalledWith('/login')
  })

  it('allowed navigation calls next()', () => {
    mockAuthStore.isLoggedIn = true
    mockAuthStore.user = { role_id: 2 }

    const to = { meta: { requiresAuth: true, role: 2 } } as any
    authGuard(to, from, next)
    expect(next).toHaveBeenCalledWith()
  })

  it('guestOnly + logged in unknown role falls through to next()', () => {
    mockAuthStore.isLoggedIn = true
    mockAuthStore.user = { role_id: 999 }

    const to = { meta: { guestOnly: true } } as any
    authGuard(to, from, next)
    expect(next).toHaveBeenCalledWith()
  })
})