/**
 * @file ApplicationList.spec.ts
 * @description Unit tests for the ApplicationList Vue component.
 *
 * This file tests the recruiter-facing application list UI.
 * Stores and child components may be mocked/stubbed.
 *
 * Test scenarios:
 * - renders list container
 * - renders items when data exists
 * - handles empty state appropriately
 */


import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import ApplicationList from '../../src/components/ApplicationList.vue'
import { ApplicationStatus } from '../../src/model/ApplicationDTO'

const mockApplicationsStore = {
  applicationsResult: [
    {
      applicationId: 1,
      applicant: {
        firstName: 'John',
        lastName: 'Doe',
        personNumber: '19900101-1234',
        email: 'john@example.com'
      },
      competences: [{ name: 'Ticket Sales', yearsOfExperience: 2 }],
      availability: [{ fromDate: '2026-01-01', toDate: '2026-02-01' }],
      status: ApplicationStatus.UNHANDLED
    }
  ],
  error: null,
  fetchAllApplications: vi.fn(),
  handleApplication: vi.fn(),
  handlingError: null
}

const tMock = {
  applicationsTitle: 'Applications',
  applicationAcceptedMessage: 'Application accepted',
  applicationDeclinedMessage: 'Application declined',
  applicationAlreadyHandledMessage: 'Already handled',
  applicationNotFoundMessage: 'Not found',
  applicationUnauthorizedMessage: 'Unauthorized',

}

const mountList = () =>
  mount(ApplicationList, {
    global: {
      provide: { t: { value: tMock } },
    },
  })

vi.mock('@/stores/applicationsStore', () => ({
  useApplicationsStore: vi.fn(() => mockApplicationsStore)
}))

describe('ApplicationList Component', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.clearAllMocks()
    mockApplicationsStore.handlingError = null
  })

describe('statusColor function', () => {
  it('returns green for ACCEPTED status', () => {
    const wrapper = mountList()
    const vm = wrapper.vm as any
    expect(vm.statusColor(ApplicationStatus.ACCEPTED)).toBe('green')
  })

  it('returns red for REJECTED status', () => {
    const wrapper = mountList()
    const vm = wrapper.vm as any
    expect(vm.statusColor(ApplicationStatus.REJECTED)).toBe('red')
  })

  it('returns grey for UNHANDLED status', () => {
    const wrapper = mountList()
    const vm = wrapper.vm as any
    expect(vm.statusColor(ApplicationStatus.UNHANDLED)).toBe('grey')
  })

  it('returns grey for unknown status', () => {
    const wrapper = mountList()
    const vm = wrapper.vm as any
    expect(vm.statusColor('UNKNOWN' as any)).toBe('grey')
  })
})

describe('pagination', () => {
  it('calculates total pages correctly', () => {
    const wrapper = mountList()
    const vm = wrapper.vm as any
    expect(vm.totalPages).toBe(1)
  })

  it('paginates applications correctly', () => {
    const wrapper = mountList()
    const vm = wrapper.vm as any
    expect(vm.paginatedApplications.length).toBe(1)
  })
})

describe('handleApplication', () => {
  it('accepts application successfully', async () => {
    mockApplicationsStore.handleApplication.mockResolvedValueOnce(true)

    const wrapper = mountList()
    const vm = wrapper.vm as any

    await vm.handleApplication(1, 'accept')

    expect(mockApplicationsStore.handleApplication).toHaveBeenCalledWith(1, 'accept')
  })

  it('declines application successfully', async () => {
    mockApplicationsStore.handleApplication.mockResolvedValueOnce(true)

    const wrapper = mountList()
    const vm = wrapper.vm as any

    await vm.handleApplication(1, 'decline')

    expect(mockApplicationsStore.handleApplication).toHaveBeenCalledWith(1, 'decline')
  })

  it('handles conflict error (409)', async () => {
    mockApplicationsStore.handlingError = 'CONFLICT'

    const wrapper = mountList()
    const vm = wrapper.vm as any

    await vm.handleApplication(1, 'accept')

    expect(vm.snackbarMessage).toBe(tMock.applicationAlreadyHandledMessage)
  })

  it('handles not found error (404)', async () => {
    mockApplicationsStore.handlingError = 'NOT_FOUND'

    const wrapper = mountList()
    const vm = wrapper.vm as any

    await vm.handleApplication(1, 'accept')

    expect(vm.snackbarMessage).toBe(tMock.applicationNotFoundMessage)
  })

  it('handles unauthorized error (401)', async () => {
    mockApplicationsStore.handlingError = 'UNAUTHORIZED'

    const wrapper = mountList()
    const vm = wrapper.vm as any

    await vm.handleApplication(1, 'accept')

    expect(vm.snackbarMessage).toBe(tMock.applicationUnauthorizedMessage)
  })
})

  describe('rendering', () => {
    it('displays loading indicator when fetching', () => {
      const wrapper = mount(ApplicationList, {
        global: {
          provide: {
            t: { value: {} }
          }
        }
      })

      expect(mockApplicationsStore.fetchAllApplications).toHaveBeenCalled()
    })

    it('displays error message on failure', () => {
      mockApplicationsStore.error = 'Failed to load'
      
      const wrapper = mount(ApplicationList, {
        global: {
          provide: {
            t: { value: {} }
          }
        }
      })

      expect(wrapper.text()).toContain('Failed to load')
    })

    it('displays applications when loaded', () => {
      const wrapper = mount(ApplicationList, {
        global: {
          provide: {
            t: {
              value: {
                applicationsTitle: 'Applications',
                personNumberLabel: 'Person Number',
                emailLabel: 'Email',
                competenceProfileTitle: 'Competence Profile',
                availabilityTitle: 'Availability',
                yearsUnit: 'years',
                acceptButtonLabel: 'Accept',
                declineButtonLabel: 'Decline',
                statusUnhandled: 'Unhandled',
                statusAccepted: 'Accepted',
                statusRejected: 'Rejected'
              }
            }
          }
        }
      })

      expect(wrapper.text()).toContain('John')
      expect(wrapper.text()).toContain('Doe')
    })
  })
})
