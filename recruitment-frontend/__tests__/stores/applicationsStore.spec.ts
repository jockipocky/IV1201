/**
 * @file applicationsStore.spec.ts
 * @description Unit tests for the applications store.
 *
 * This file tests the state management logic responsible for
 * retrieving and storing application data.
 *
 * Test scenarios:
 * - fetches applications from API
 * - updates store state correctly
 * - handles API errors
 *
 * @module stores
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useApplicationsStore } from '../../src/stores/applicationsStore'
import { ApplicationStatus } from '../../src/model/ApplicationDTO'

vi.mock('@/api/applicationsApi', () => ({
  getApplications: vi.fn(),
  handleApplicationRequest: vi.fn()
}))

import { getApplications, handleApplicationRequest } from '@/api/applicationsApi'

describe('applicationsStore', () => {
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
    it('has applicationsResult as null initially', () => {
      const store = useApplicationsStore()
      expect(store.applicationsResult).toBeNull()
    })

    it('has error as null initially', () => {
      const store = useApplicationsStore()
      expect(store.error).toBeNull()
    })

    it('has handlingError as null initially', () => {
      const store = useApplicationsStore()
      expect(store.handlingError).toBeNull()
    })
  })

  describe('fetchAllApplications action', () => {
    it('fetches and stores applications on success', async () => {
      const mockResponse = {
        data: {
          result: {
            applications: [
              {
                person_id: 1,
                first_name: 'John',
                last_name: 'Doe',
                person_number: '111',
                email: 'a@test.com',
                competences: [],
                availability: [],
                status: 'ACCEPTED'
              }
            ]
          }
        }
      }

      ;(getApplications as ReturnType<typeof vi.fn>).mockResolvedValue(mockResponse)

      const store = useApplicationsStore()
      await store.fetchAllApplications()

      expect(getApplications).toHaveBeenCalled()
      expect(store.applicationsResult).not.toBeNull()
      expect(store.applicationsResult).toHaveLength(1)
      expect(store.error).toBeNull()
    })

    it('sets error on failure', async () => {
      ;(getApplications as ReturnType<typeof vi.fn>).mockRejectedValue({
        response: { data: { message: 'Server error' } }
      })

      const store = useApplicationsStore()
      await store.fetchAllApplications()

      expect(getApplications).toHaveBeenCalled()
      expect(store.error).toBe('Server error')
      expect(store.applicationsResult).toBeNull()
    })

    it('sets generic error when no message provided', async () => {
      ;(getApplications as ReturnType<typeof vi.fn>).mockRejectedValue(new Error('Network error'))

      const store = useApplicationsStore()
      await store.fetchAllApplications()

      expect(store.error).toBe('Failed to fetch job applications from DB.')
    })
  })

  describe('handleApplication action', () => {
    beforeEach(() => {
      const store = useApplicationsStore()
      store.applicationsResult = [
        {
          applicationId: 1,
          applicant: {
            firstName: 'John',
            lastName: 'Doe',
            personNumber: '111',
            email: 'a@test.com'
          },
          competences: [],
          availability: [],
          status: ApplicationStatus.UNHANDLED,
          lastUpdated: ''
        }
      ]
    })

    it('accepts application successfully', async () => {
      ;(handleApplicationRequest as ReturnType<typeof vi.fn>).mockResolvedValue({})

      const store = useApplicationsStore()
      await store.handleApplication(1, 'accept')

      expect(handleApplicationRequest).toHaveBeenCalledWith(1, 'accept')
      expect(store.applicationsResult?.[0].status).toBe(ApplicationStatus.ACCEPTED)
      expect(store.handlingError).toBeNull()
    })

    it('rejects application successfully', async () => {
      ;(handleApplicationRequest as ReturnType<typeof vi.fn>).mockResolvedValue({})

      const store = useApplicationsStore()
      await store.handleApplication(1, 'decline')

      expect(handleApplicationRequest).toHaveBeenCalledWith(1, 'decline')
      expect(store.applicationsResult?.[0].status).toBe(ApplicationStatus.REJECTED)
      expect(store.handlingError).toBeNull()
    })

    it('handles 404 error', async () => {
      ;(handleApplicationRequest as ReturnType<typeof vi.fn>).mockRejectedValue({
        response: { status: 404 }
      })

      const store = useApplicationsStore()
      await store.handleApplication(999, 'accept')

      expect(store.handlingError).toBe('NOT_FOUND')
    })

    it('handles 401 error', async () => {
      ;(handleApplicationRequest as ReturnType<typeof vi.fn>).mockRejectedValue({
        response: { status: 401 }
      })

      const store = useApplicationsStore()
      await store.handleApplication(1, 'accept')

      expect(store.handlingError).toBe('UNAUTHORIZED')
    })

    it('handles 409 conflict error', async () => {
      ;(handleApplicationRequest as ReturnType<typeof vi.fn>).mockRejectedValue({
        response: { status: 409, data: { currentStatus: 'ACCEPTED' } }
      })

      const store = useApplicationsStore()
      await store.handleApplication(1, 'accept')

      expect(store.handlingError).toBe('CONFLICT')
      expect(store.applicationsResult?.[0].status).toBe(ApplicationStatus.ACCEPTED)
    })

    it('handles generic error', async () => {
      ;(handleApplicationRequest as ReturnType<typeof vi.fn>).mockRejectedValue({
        response: { status: 500 }
      })

      const store = useApplicationsStore()
      await store.handleApplication(1, 'accept')

      expect(store.handlingError).toBe('GENERIC')
    })
  })
})