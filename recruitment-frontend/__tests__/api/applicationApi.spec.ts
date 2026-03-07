/**
 * @file applicationApi.spec.ts
 * @description Unit tests for the applicationApi API wrapper module.
 *
 * This file tests the application API wrapper functions that call the HTTP client.
 * It mocks the HTTP client module to avoid real network requests.
 *
 * Test scenarios:
 * - sends GET request to /applications/:person_id
 * - throws error when application not found
 * - sends POST request to /applications with payload
 * - throws error on submission failure
 * - sends POST request to /applications/personal-info with payload
 * - throws error on personal info submission failure
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
  }
}))

import { fetchApplication, submitApplication, submitPI } from '../../src/api/profileApi'
import apiClient from '../../src/api/http'


describe('applicationApi', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('fetchApplication', () => {
    it('sends GET request to /applications/:person_id', async () => {
      mockedApiClient.get.mockResolvedValueOnce({ 
        data: { application: { person_id: 1, status: 'PENDING' } } 
      })

      const result = await fetchApplication('1')

      expect(apiClient.get).toHaveBeenCalledWith('/applications/1')
      expect(result.data.application.person_id).toBe(1)
    })

    it('throws error when application not found', async () => {
      mockedApiClient.get.mockRejectedValueOnce(new Error('Application not found'))

      await expect(fetchApplication('999')).rejects.toThrow('Application not found')
    })
  })

  describe('submitApplication', () => {
    it('sends POST request to /applications with payload', async () => {
      mockedApiClient.post.mockResolvedValueOnce({ 
        data: { success: true, applicationId: 123 } 
      })

      const payload = {
        competenceProfile: [
          { competenceType: 'JavaScript', competenceTime: '2 years' }
        ],
        availability: [
          { from: '2026-01-01', to: '2026-12-31' }
        ],
        person_id: '1'
      }

      const result = await submitApplication(payload)

      expect(apiClient.post).toHaveBeenCalledWith('/applications', payload)
      expect(result.data.success).toBe(true)
    })

    it('throws error on submission failure', async () => {
      mockedApiClient.post.mockRejectedValueOnce(new Error('Validation failed'))

      const payload = {
        competenceProfile: [],
        availability: [],
        person_id: '1'
      }

      await expect(submitApplication(payload)).rejects.toThrow('Validation failed')
    })
  })

  describe('submitPI', () => {
    it('sends POST request to /applications/personal-info with payload', async () => {
      mockedApiClient.post.mockResolvedValueOnce({ 
        data: { success: true } 
      })

      const payload = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        personalNumber: '19900101-1234',
        person_id: '1'
      }

      const result = await submitPI(payload)

      expect(apiClient.post).toHaveBeenCalledWith('/applications/personal-info', payload)
      expect(result.data.success).toBe(true)
    })

    it('throws error on personal info submission failure', async () => {
      mockedApiClient.post.mockRejectedValueOnce(new Error('Invalid personal number'))

      const payload = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        personalNumber: 'invalid',
        person_id: '1'
      }

      await expect(submitPI(payload)).rejects.toThrow('Invalid personal number')
    })
  })
})
