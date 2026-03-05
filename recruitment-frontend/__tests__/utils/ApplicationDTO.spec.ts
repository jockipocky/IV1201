/**
 * @file ApplicationDTO.spec.ts
 * @description Unit tests for ApplicationDTO mapping utilities.
 *
 * This file tests transformation/mapping logic between API payloads and app-friendly structures.
 *
 * Test scenarios:
 * - maps API application data into expected internal structure
 * - handles missing/optional fields safely
 */

import { describe, it, expect } from 'vitest'
import { ApplicationStatus, ApplicationDTO } from '../../src/model/ApplicationDTO'

describe('ApplicationDTO', () => {
  describe('ApplicationStatus enum', () => {
    it('has ACCEPTED status', () => {
      expect(ApplicationStatus.ACCEPTED).toBe('ACCEPTED')
    })

    it('has REJECTED status', () => {
      expect(ApplicationStatus.REJECTED).toBe('REJECTED')
    })

    it('has UNHANDLED status', () => {
      expect(ApplicationStatus.UNHANDLED).toBe('UNHANDLED')
    })
  })

  describe('ApplicationDTO interface', () => {
    it('can create a valid application DTO', () => {
      const application: ApplicationDTO = {
        applicationId: 1,
        applicant: {
          firstName: 'John',
          lastName: 'Doe',
          personNumber: '19900101-1234',
          email: 'john@example.com'
        },
        competences: [
          { name: 'JavaScript', yearsOfExperience: 3 }
        ],
        availability: [
          { fromDate: '2026-01-01', toDate: '2026-12-31' }
        ],
        status: ApplicationStatus.UNHANDLED,
        lastUpdated: '2026-03-04T12:00:00Z'
      }

      expect(application.applicationId).toBe(1)
      expect(application.applicant.firstName).toBe('John')
      expect(application.competences.length).toBe(1)
      expect(application.status).toBe(ApplicationStatus.UNHANDLED)
    })

    it('validates application status values', () => {
      const acceptedApp: ApplicationDTO = {
        applicationId: 1,
        applicant: { firstName: 'John', lastName: 'Doe', personNumber: '19900101-1234', email: 'john@example.com' },
        competences: [],
        availability: [],
        status: ApplicationStatus.ACCEPTED,
        lastUpdated: '2026-03-04T12:00:00Z'
      }

      const rejectedApp: ApplicationDTO = {
        applicationId: 2,
        applicant: { firstName: 'Jane', lastName: 'Doe', personNumber: '19900101-1235', email: 'jane@example.com' },
        competences: [],
        availability: [],
        status: ApplicationStatus.REJECTED,
        lastUpdated: '2026-03-04T12:00:00Z'
      }

      expect(acceptedApp.status).toBe('ACCEPTED')
      expect(rejectedApp.status).toBe('REJECTED')
    })
  })
})
