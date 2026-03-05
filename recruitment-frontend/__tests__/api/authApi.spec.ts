/**
 * @file authApi.spec.ts
 * @description Unit tests for the authApi API wrapper module.
 *
 * This file tests authentication-related API wrapper functions (login/register/me/logout/upgrade).
 * It mocks the HTTP client module to avoid real network requests.
 *
 * Test scenarios:
 * - sends POST request to /auth/login
 * - throws error when login fails
 * - sends POST request to /auth/register
 * - throws error when register fails
 * - sends GET request to /auth/me
 * - sends POST request to /auth/logout
 * - sends POST request to /auth/upgrade
 *
 * @module api
 */

import { describe, it, expect, vi, beforeEach } from 'vitest'

const mockedApiClient = vi.mocked(apiClient, true)


vi.mock('../../src/api/http', () => ({
  default: {
    get: vi.fn(() => Promise.resolve({ data: {} })),
    post: vi.fn(() => Promise.resolve({ data: {} })),
    put: vi.fn(() => Promise.resolve({ data: {} })),
    delete: vi.fn(() => Promise.resolve({ data: {} }))
  }
}))

import { login, register, fetchUser, logout, upgradeAccount } from '../../src/api/authApi'
import apiClient from '../../src/api/http'

describe('authApi', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('login', () => {
    it('sends POST request to /auth/login with credentials', async () => {
      mockedApiClient.post.mockResolvedValueOnce({ 
        data: { user: { username: 'testuser', person_id: 1 } } 
      })

      const result = await login('testuser', 'password123')

      expect(apiClient.post).toHaveBeenCalledWith('/auth/login', {
        username: 'testuser',
        password: 'password123'
      })
      expect(result.data.user.username).toBe('testuser')
    })

    it('throws error on login failure', async () => {
      mockedApiClient.post.mockRejectedValueOnce(new Error('Invalid credentials'))

      await expect(login('testuser', 'wrongpassword')).rejects.toThrow('Invalid credentials')
    })
  })

  describe('register', () => {
    it('sends POST request to /auth/register with user data', async () => {
      mockedApiClient.post.mockResolvedValueOnce({ 
        data: { success: true } 
      })

      const result = await register('John', 'Doe', 'john@example.com', '19900101-1234', 'johndoe', 'password123')

      expect(apiClient.post).toHaveBeenCalledWith('/auth/register', {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        personalNumber: '19900101-1234',
        username: 'johndoe',
        password: 'password123'
      })
      expect(result.data.success).toBe(true)
    })

    it('throws error on registration failure', async () => {
      mockedApiClient.post.mockRejectedValueOnce(new Error('User already exists'))

      await expect(
        register('John', 'Doe', 'john@example.com', '19900101-1234', 'johndoe', 'password123')
      ).rejects.toThrow('User already exists')
    })
  })

  describe('fetchUser', () => {
    it('sends GET request to /auth/me', async () => {
      mockedApiClient.get.mockResolvedValueOnce({ 
        data: { user: { username: 'testuser' } } 
      })

      const result = await fetchUser()

      expect(apiClient.get).toHaveBeenCalledWith('/auth/me')
      expect(result.data.user.username).toBe('testuser')
    })

    it('throws error when not authenticated', async () => {
      mockedApiClient.get.mockRejectedValueOnce(new Error('Unauthorized'))

      await expect(fetchUser()).rejects.toThrow('Unauthorized')
    })
  })

  describe('logout', () => {
    it('sends POST request to /auth/logout', async () => {
      mockedApiClient.post.mockResolvedValueOnce({ data: { success: true } })

      const result = await logout()

      expect(mockedApiClient.post).toHaveBeenCalledWith('/auth/logout')
      expect(result.data.success).toBe(true)
    })
  })

  describe('upgradeAccount', () => {
    it('sends POST request to /auth/upgrade with upgrade data', async () => {
      mockedApiClient.post.mockResolvedValueOnce({ 
        data: { success: true } 
      })

      const result = await upgradeAccount('john@example.com', '19900101-1234', 'UPGRADE123', 'johndoe', 'password123')

      expect(apiClient.post).toHaveBeenCalledWith('/auth/upgrade', {
        email: 'john@example.com',
        personalNumber: '19900101-1234',
        upgradeCode: 'UPGRADE123',
        username: 'johndoe',
        password: 'password123'
      })
      expect(result.data.success).toBe(true)
    })

    it('throws error on upgrade failure', async () => {
      mockedApiClient.post.mockRejectedValueOnce(new Error('Invalid upgrade code'))

      await expect(
        upgradeAccount('john@example.com', '19900101-1234', 'INVALID', 'johndoe', 'password123')
      ).rejects.toThrow('Invalid upgrade code')
    })
  })
})
