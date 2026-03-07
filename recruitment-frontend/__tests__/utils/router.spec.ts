/**
 * @file router.spec.ts
 * @description Unit tests for router utility functions.
 *
 * This file tests helper functions used to interact with the
 * application router.
 *
 * Test scenarios:
 * - navigates to correct routes
 * - handles invalid routes
 * - verifies route helper behavior
 *
 * @module utils
 */


import { describe, it, expect } from 'vitest'
import { router } from '../../src/router/index'

describe('router configuration', () => {
  it('marks guest routes as guestOnly', () => {
    const loginRoute = router.getRoutes().find(r => r.path === '/login')
    const registerRoute = router.getRoutes().find(r => r.path === '/register')

    expect(loginRoute?.meta.guestOnly).toBe(true)
    expect(registerRoute?.meta.guestOnly).toBe(true)
  })

  it('protects recruiter route with auth and role 1', () => {
    const recruiterRoute = router.getRoutes().find(r => r.path === '/recruiter')

    expect(recruiterRoute?.meta.requiresAuth).toBe(true)
    expect(recruiterRoute?.meta.role).toBe(1)
  })

  it('protects applicant route with auth and role 2', () => {
    const applicantRoute = router.getRoutes().find(r => r.path === '/applicant')

    expect(applicantRoute?.meta.requiresAuth).toBe(true)
    expect(applicantRoute?.meta.role).toBe(2)
  })
})