/**
 * @file applicationsApi.spec.ts
 * @description Unit tests for the applicationsApi API wrapper module.
 *
 * This file tests the recruiter/admin applications API wrapper functions.
 * It mocks the HTTP client module to avoid real network requests.
 *
 * Test scenarios:
 * - sends GET request to /applications/all
 * - sends PUT request to update application status to ACCEPTED
 * - sends PUT request to update application status to REJECTED
 * - throws error when status update fails
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

import { getApplications, handleApplicationRequest } from '../../src/api/applicationsApi'
import apiClient from '../../src/api/http'

describe('applicationsApi', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.spyOn(console, 'log').mockImplementation(() => {})
  })

  describe('getApplications', () => {
    it('sends GET request to /applications/all', async () => {
      mockedApiClient.get.mockResolvedValueOnce({ 
        data: { applications: [{ person_id: 1 }, { person_id: 2 }] } 
      })

      const result = await getApplications()

      expect(apiClient.get).toHaveBeenCalledWith('/applications/all')
      expect(result.data.applications).toHaveLength(2)
    })

    it('throws error when fetch fails', async () => {
      mockedApiClient.get.mockRejectedValueOnce(new Error('Network error'))

      await expect(getApplications()).rejects.toThrow('Network error')
    })
  })

  describe('handleApplicationRequest', () => {
    it('sends PUT request to /applications/:person_id/status with ACCEPTED status', async () => {
      mockedApiClient.put.mockResolvedValueOnce({ 
        data: { success: true } 
      })

      const result = await handleApplicationRequest(1, 'accept')

      expect(apiClient.put).toHaveBeenCalledWith('/applications/1/status', {
        status: 'ACCEPTED'
      })
      expect(result.data.success).toBe(true)
    })

    it('sends PUT request to /applications/:person_id/status with REJECTED status', async () => {
      mockedApiClient.put.mockResolvedValueOnce({ 
        data: { success: true } 
      })

      const result = await handleApplicationRequest(1, 'decline')

      expect(apiClient.put).toHaveBeenCalledWith('/applications/1/status', {
        status: 'REJECTED'
      })
      expect(result.data.success).toBe(true)
    })

    it('throws error when update fails', async () => {
      mockedApiClient.put.mockRejectedValueOnce(new Error('Conflict'))

      await expect(handleApplicationRequest(1, 'accept')).rejects.toThrow('Conflict')
    })

    it('throws error when application not found', async () => {
      mockedApiClient.put.mockRejectedValueOnce(new Error('Application not found'))

      await expect(handleApplicationRequest(999, 'accept')).rejects.toThrow('Application not found')
    })
  })
})
