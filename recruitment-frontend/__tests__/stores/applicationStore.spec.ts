/**
 * @file applicationsStore.spec.ts
 * @description Unit tests for the applicationsStore Pinia store.
 *
 * This file tests recruiter-side application list fetching and status updates.
 * API modules are mocked so no real network calls occur.
 *
 * Test scenarios:
 * - fetches applications list successfully
 * - updates application status successfully
 * - handles API failures gracefully
 */

import { describe, it, expect, beforeEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useApplicationStore } from '../../src/stores/applicationStore'
import { useAuthStore } from '../../src/stores/authStore'

vi.mock('@/api/applicationApi', () => ({
  submitApplication: vi.fn(),
  fetchApplication: vi.fn(),
  submitPI: vi.fn()
}))

vi.mock('@/api/authApi', () => ({
  fetchUser: vi.fn()
}))

import { submitApplication, fetchApplication, submitPI } from '@/api/applicationApi'
import { fetchUser } from '@/api/authApi'

describe('applicationStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.clearAllMocks()
  })

  describe('initial state', () => {
    it('has empty competences array', () => {
      const store = useApplicationStore()
      expect(store.competences).toEqual([])
    })

    it('has empty availability array', () => {
      const store = useApplicationStore()
      expect(store.availability).toEqual([])
    })

    it('has empty personalInfo', () => {
      const store = useApplicationStore()
      expect(store.personalInfo).toEqual({
        firstName: '',
        lastname: '',
        email: '',
        personalNumber: '',
        person_id: ''
      })
    })

    it('has handlingState as unhandled', () => {
      const store = useApplicationStore()
      expect(store.handlingState).toBe('unhandled')
    })

    it('has error as null', () => {
      const store = useApplicationStore()
      expect(store.error).toBeNull()
    })

    it('hasApplication is false', () => {
      const store = useApplicationStore()
      expect(store.hasApplication).toBe(false)
    })
  })

  describe('actions - competences', () => {
    it('adds empty competence', () => {
      const store = useApplicationStore()
      store.addEmptyCompetence()
      expect(store.competences).toHaveLength(1)
      expect(store.competences[0]).toEqual({ competenceType: '', competenceTime: '' })
    })

    it('limits competences to 3', () => {
      const store = useApplicationStore()
      store.addEmptyCompetence()
      store.addEmptyCompetence()
      store.addEmptyCompetence()
      store.addEmptyCompetence()
      expect(store.competences).toHaveLength(3)
    })

    it('updates competence at index', () => {
      const store = useApplicationStore()
      store.addEmptyCompetence()
      store.updateCompetence(0, { competenceType: 'Java', competenceTime: '5' })
      expect(store.competences[0].competenceType).toBe('Java')
      expect(store.competences[0].competenceTime).toBe('5')
    })

    it('removes competence at index', () => {
      const store = useApplicationStore()
      store.addEmptyCompetence()
      store.addEmptyCompetence()
      store.removeCompetence(0)
      expect(store.competences).toHaveLength(1)
    })
  })

  describe('actions - availability', () => {
    it('adds empty availability', () => {
      const store = useApplicationStore()
      store.addEmptyAvailability()
      expect(store.availability).toHaveLength(1)
      expect(store.availability[0]).toEqual({ from: null, to: null })
    })

    it('limits availability to 3', () => {
      const store = useApplicationStore()
      store.addEmptyAvailability()
      store.addEmptyAvailability()
      store.addEmptyAvailability()
      store.addEmptyAvailability()
      expect(store.availability).toHaveLength(3)
    })

    it('removes availability at index', () => {
      const store = useApplicationStore()
      store.addEmptyAvailability()
      store.addEmptyAvailability()
      store.removeAvailability(0)
      expect(store.availability).toHaveLength(1)
    })

    it('formats date to SQL format', () => {
      const store = useApplicationStore()
      const date = new Date('2024-01-15')
      const formatted = store.formatDateToSQL(date)
      expect(formatted).toBe('2024-01-15')
    })
  })

  describe('getters', () => {
    it('getAvailabilityRange returns dates for index', () => {
      const store = useApplicationStore()
      store.availability = [{ from: '2024-01-01', to: '2024-06-01' }]
      const result = store.getAvailabilityRange(0)
      expect(result[0]).toEqual(new Date('2024-01-01'))
      expect(result[1]).toEqual(new Date('2024-06-01'))
    })

    it('getAvailabilityRange returns empty for invalid index', () => {
      const store = useApplicationStore()
      const result = store.getAvailabilityRange(99)
      expect(result).toEqual([])
    })
  })

  describe('actions - fetchUserInfo', () => {
    it('fetches user info from authStore when user exists', async () => {
      const authStore = useAuthStore()
      authStore.user = {
        username: 'testuser',
        person_id: '123',
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        personalNumber: '19900101-1234'
      }

      const store = useApplicationStore()
      await store.fetchUserInfo()

      expect(store.personalInfo).toEqual({
        firstName: 'John',
        lastname: 'Doe',
        email: 'john@example.com',
        personalNumber: '19900101-1234',
        person_id: '123'
      })
    })

    it('fetches user from API when not in store', async () => {
      const authStore = useAuthStore()
      ;(fetchUser as ReturnType<typeof vi.fn>).mockResolvedValue({
        data: { user: { username: 'testuser', person_id: '456', firstName: 'Jane', lastName: 'Smith', email: 'jane@example.com', personalNumber: '19900102-5678' } }
      })

      const store = useApplicationStore()
      await store.fetchUserInfo()

      expect(fetchUser).toHaveBeenCalled()
      expect(store.personalInfo.firstName).toBe('Jane')
    })

    it('sets error when user not logged in', async () => {
      const authStore = useAuthStore()
      ;(fetchUser as ReturnType<typeof vi.fn>).mockResolvedValue({ data: {} })

      const store = useApplicationStore()
      await store.fetchUserInfo()

      expect(store.error).toBe('User not logged in')
    })
  })

  describe('actions - submitApplicationForm', () => {
    it('submits application successfully', async () => {
      const store = useApplicationStore()
      store.personalInfo.person_id = '123'
      store.competences = [{ competenceType: 'Ticket Sales', competenceTime: '2' }]
      store.availability = [{ from: '2026-01-01', to: '2026-02-01' }]

      ;(submitApplication as ReturnType<typeof vi.fn>).mockResolvedValue({
        data: { success: true }
      })

      const result = await store.submitApplicationForm()

      expect(submitApplication).toHaveBeenCalledWith({
        competenceProfile: store.competences,
        availability: store.availability,
        person_id: '123'
      })
      expect(store.hasApplication).toBe(true)
      expect(result).toBe(true)
    })

    it('handles submission failure', async () => {
      const store = useApplicationStore()
      store.personalInfo.person_id = '123'

      ;(submitApplication as ReturnType<typeof vi.fn>).mockResolvedValue({
        data: { success: false }
      })

      const result = await store.submitApplicationForm()

      expect(store.hasApplication).toBe(false)
      expect(result).toBe(false)
    })

    it('handles submission error', async () => {
      const store = useApplicationStore()
      store.personalInfo.person_id = '123'

      ;(submitApplication as ReturnType<typeof vi.fn>).mockRejectedValue(new Error('Network error'))

      const result = await store.submitApplicationForm()

      expect(store.hasApplication).toBe(false)
      expect(result).toBe(false)
    })
  })

  describe('actions - submitPersonalInfo', () => {
    it('submits personal info successfully', async () => {
      const store = useApplicationStore()
      store.personalInfo = {
        firstName: 'John',
        lastname: 'Doe',
        email: 'john@example.com',
        personalNumber: '19900101-1234',
        person_id: '123'
      }

      ;(submitPI as ReturnType<typeof vi.fn>).mockResolvedValue({
        data: { success: true }
      })

      await store.submitPersonalInfo()

      expect(submitPI).toHaveBeenCalledWith({
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        personalNumber: '19900101-1234',
        person_id: '123'
      })
      expect(store.successMessage).toContain('sparats')
      expect(store.error).toBeNull()
    })

    it('handles submission failure', async () => {
      const store = useApplicationStore()

      ;(submitPI as ReturnType<typeof vi.fn>).mockResolvedValue({
        data: { success: false }
      })

      await store.submitPersonalInfo()

      expect(store.error).toBe('Något gick fel')
    })

    it('handles submission error', async () => {
      const store = useApplicationStore()

      ;(submitPI as ReturnType<typeof vi.fn>).mockRejectedValue(new Error('Network error'))

      await store.submitPersonalInfo()

      expect(store.error).toBe('kunde inte spara profilen')
    })
  })

  describe('actions - fetchApplication', () => {
    it('fetches application successfully', async () => {
      const store = useApplicationStore()
      store.personalInfo.person_id = '123'

      ;(fetchApplication as ReturnType<typeof vi.fn>).mockResolvedValue({
        data: {
          success: true,
          competenceProfile: [{ competenceType: 'Ticket Sales', competenceTime: '2' }],
          availability: [{ from_date: '2026-01-01T00:00:00Z', to_date: '2026-02-01T00:00:00Z' }]
        }
      })

      await store.fetchApplication()

      expect(store.hasApplication).toBe(true)
      expect(store.application).toEqual({
        competences: [{ name: 'Ticket Sales', yearsOfExperience: 2 }],
        availability: [{ fromDate: '2026-01-01', toDate: '2026-02-01' }]
      })
    })

    it('handles no application found', async () => {
      const store = useApplicationStore()
      store.personalInfo.person_id = '123'

      ;(fetchApplication as ReturnType<typeof vi.fn>).mockResolvedValue({
        data: { success: false }
      })

      await store.fetchApplication()

      expect(store.hasApplication).toBe(false)
      expect(store.application).toBeNull()
    })

    it('does nothing when person_id is missing', async () => {
      const store = useApplicationStore()
      store.personalInfo.person_id = ''

      await store.fetchApplication()

      expect(fetchApplication).not.toHaveBeenCalled()
    })

    it('handles API error', async () => {
      const store = useApplicationStore()
      store.personalInfo.person_id = '123'

      ;(fetchApplication as ReturnType<typeof vi.fn>).mockRejectedValue(new Error('Network error'))

      await store.fetchApplication()

      expect(store.hasApplication).toBe(false)
      expect(store.application).toBeNull()
    })
  })
})
