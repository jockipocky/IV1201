/**
 * @file router.spec.ts
 * @description Unit tests for router helper utilities.
 *
 * This file tests small pure helpers related to routing/navigation logic.
 *
 * Test scenarios:
 * - returns expected results for given route meta inputs
 * - handles edge cases safely
 */

import { describe, it, expect } from 'vitest'
import { router } from '../../src/router/index'

describe('router configuration', () => {
  it('has login route defined', () => {
    const loginRoute = router.getRoutes().find(r => r.path === '/login')
    expect(loginRoute).toBeDefined()
  })

  it('has register route defined', () => {
    const registerRoute = router.getRoutes().find(r => r.path === '/register')
    expect(registerRoute).toBeDefined()
  })

  it('has upgrade route defined', () => {
    const upgradeRoute = router.getRoutes().find(r => r.path === '/upgrade')
    expect(upgradeRoute).toBeDefined()
  })

  it('has recruiter route defined', () => {
    const recruiterRoute = router.getRoutes().find(r => r.path === '/recruiter')
    expect(recruiterRoute).toBeDefined()
  })

  it('has applicant route defined', () => {
    const applicantRoute = router.getRoutes().find(r => r.path === '/applicant')
    expect(applicantRoute).toBeDefined()
  })

  it('has applicationform route defined', () => {
    const applicationFormRoute = router.getRoutes().find(r => r.path === '/applicationform')
    expect(applicationFormRoute).toBeDefined()
  })

  it('has profile route defined', () => {
    const profileRoute = router.getRoutes().find(r => r.path === '/profile')
    expect(profileRoute).toBeDefined()
  })

  it('login route has guestOnly meta', () => {
    const loginRoute = router.getRoutes().find(r => r.path === '/login')
    expect(loginRoute?.meta.guestOnly).toBe(true)
  })

  it('register route has guestOnly meta', () => {
    const registerRoute = router.getRoutes().find(r => r.path === '/register')
    expect(registerRoute?.meta.guestOnly).toBe(true)
  })

  it('recruiter route requires authentication', () => {
    const recruiterRoute = router.getRoutes().find(r => r.path === '/recruiter')
    expect(recruiterRoute?.meta.requiresAuth).toBe(true)
  })

  it('applicant route requires authentication', () => {
    const applicantRoute = router.getRoutes().find(r => r.path === '/applicant')
    expect(applicantRoute?.meta.requiresAuth).toBe(true)
  })

  it('recruiter route has role 1 requirement', () => {
    const recruiterRoute = router.getRoutes().find(r => r.path === '/recruiter')
    expect(recruiterRoute?.meta.role).toBe(1)
  })

  it('applicant route has role 2 requirement', () => {
    const applicantRoute = router.getRoutes().find(r => r.path === '/applicant')
    expect(applicantRoute?.meta.role).toBe(2)
  })
})
