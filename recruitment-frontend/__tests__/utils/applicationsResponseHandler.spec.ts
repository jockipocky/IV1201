/**
 * @file applicationsResponseHandler.spec.ts
 * @description Unit tests for applicationsResponseHandler utilities.
 *
 * This file tests helper logic that interprets application API responses (success/failure mapping).
 *
 * Test scenarios:
 * - returns expected output for successful responses
 * - returns expected output for failure/error responses
 */

import { describe, it, expect } from 'vitest'
import { mapApplicationsResponse } from '../../src/utility/applicationsResponseHandler'
import { ApplicationStatus } from '../../src/model/ApplicationDTO'

describe('applicationsResponseHandler utility', () => {
  describe('mapApplicationsResponse', () => {
    it('returns empty array when response is null', () => {
      const result = mapApplicationsResponse(null)
      expect(result).toEqual([])
    })

    it('returns empty array when response.data is undefined', () => {
      const result = mapApplicationsResponse({})
      expect(result).toEqual([])
    })

    it('returns empty array when applications array is missing', () => {
      const result = mapApplicationsResponse({ data: {} })
      expect(result).toEqual([])
    })

    it('maps single application correctly', () => {
      const response = {
        data: {
          result: {
            applications: [
              {
                person_id: 1,
                first_name: 'John',
                last_name: 'Doe',
                person_number: '19900101-1234',
                email: 'john@example.com',
                competences: [{ name: 'Java', yearsOfExperience: 5 }],
                availability: [{ fromDate: '2024-01-01', toDate: '2024-12-31' }],
                status: 'ACCEPTED'
              }
            ]
          }
        }
      }

      const result = mapApplicationsResponse(response)

      expect(result).toHaveLength(1)
      expect(result[0].applicationId).toBe(1)
      expect(result[0].applicant.firstName).toBe('John')
      expect(result[0].applicant.lastName).toBe('Doe')
      expect(result[0].applicant.personNumber).toBe('19900101-1234')
      expect(result[0].applicant.email).toBe('john@example.com')
      expect(result[0].competences).toHaveLength(1)
      expect(result[0].competences[0].name).toBe('Java')
      expect(result[0].competences[0].yearsOfExperience).toBe(5)
      expect(result[0].availability).toHaveLength(1)
      expect(result[0].status).toBe(ApplicationStatus.ACCEPTED)
    })

    it('maps multiple applications correctly', () => {
      const response = {
        data: {
          result: {
            applications: [
              { person_id: 1, first_name: 'John', last_name: 'Doe', person_number: '111', email: 'a@test.com', competences: [], availability: [], status: 'ACCEPTED' },
              { person_id: 2, first_name: 'Jane', last_name: 'Smith', person_number: '222', email: 'b@test.com', competences: [], availability: [], status: 'REJECTED' }
            ]
          }
        }
      }

      const result = mapApplicationsResponse(response)

      expect(result).toHaveLength(2)
      expect(result[0].applicationId).toBe(1)
      expect(result[1].applicationId).toBe(2)
      expect(result[0].status).toBe(ApplicationStatus.ACCEPTED)
      expect(result[1].status).toBe(ApplicationStatus.REJECTED)
    })

    it('handles missing competences and availability arrays', () => {
      const response = {
        data: {
          result: {
            applications: [
              { person_id: 1, first_name: 'John', last_name: 'Doe', person_number: '111', email: 'a@test.com' }
            ]
          }
        }
      }

      const result = mapApplicationsResponse(response)

      expect(result[0].competences).toEqual([])
      expect(result[0].availability).toEqual([])
    })

    it('defaults status to UNHANDLED for unknown status', () => {
      const response = {
        data: {
          result: {
            applications: [
              { person_id: 1, first_name: 'John', last_name: 'Doe', person_number: '111', email: 'a@test.com', competences: [], availability: [], status: 'UNKNOWN_STATUS' }
            ]
          }
        }
      }

      const result = mapApplicationsResponse(response)

      expect(result[0].status).toBe(ApplicationStatus.UNHANDLED)
    })

    it('defaults to UNHANDLED when status is missing', () => {
      const response = {
        data: {
          result: {
            applications: [
              { person_id: 1, first_name: 'John', last_name: 'Doe', person_number: '111', email: 'a@test.com', competences: [], availability: [] }
            ]
          }
        }
      }

      const result = mapApplicationsResponse(response)

      expect(result[0].status).toBe(ApplicationStatus.UNHANDLED)
    })
  })
})
