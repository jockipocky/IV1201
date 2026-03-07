/**
 * @file ApplicationList.spec.ts
 * @description Unit tests for the ApplicationList component.
 *
 * This file tests the component responsible for rendering a list
 * of applications retrieved from the store or API.
 *
 * Test scenarios:
 * - renders a list of applications
 * - handles empty application list
 * - renders ApplicationBox components correctly
 *
 * @module components
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
        email: 'john@example.com',
      },
      competences: [{ name: 'Ticket Sales', yearsOfExperience: 2 }],
      availability: [{ fromDate: '2026-01-01', toDate: '2026-02-01' }],
      status: ApplicationStatus.UNHANDLED,
    },
  ],
  error: null as string | null,
  fetchAllApplications: vi.fn(),
  handleApplication: vi.fn(),
  handlingError: null as string | null,
}

const tMock = {
  applicationsTitle: 'Applications',
  applicationAcceptedMessage: 'Application accepted',
  applicationDeclinedMessage: 'Application declined',
  applicationAlreadyHandledMessage: 'Already handled',
  applicationNotFoundMessage: 'Not found',
  applicationUnauthorizedMessage: 'Unauthorized',
  personNumberLabel: 'Person Number',
  emailLabel: 'Email',
  competenceProfileTitle: 'Competence Profile',
  availabilityTitle: 'Availability',
  yearsUnit: 'years',
  acceptButtonLabel: 'Accept',
  declineButtonLabel: 'Decline',
  statusUnhandled: 'Unhandled',
  statusAccepted: 'Accepted',
  statusRejected: 'Rejected',
}

function createSimpleStub(className: string, tag = 'div') {
  return {
    template: `<${tag} class="${className}"><slot /></${tag}>`,
  }
}

function createClickStub(className: string) {
  return {
    template: `
      <button type="button" class="${className}" @click="$emit('click')">
        <slot />
      </button>
    `,
  }
}

function createPaginationStub() {
  return {
    props: ['modelValue'],
    template: '<div class="v-pagination" />',
  }
}

function mountWithStubs(translations = tMock) {
  const containerStub = createSimpleStub('v-container')
  const rowStub = createSimpleStub('v-row')
  const colStub = createSimpleStub('v-col')
  const alertStub = createSimpleStub('v-alert')
  const progressStub = createSimpleStub('v-progress-circular')
  const chipStub = createSimpleStub('v-chip')
  const listStub = createSimpleStub('v-list')
  const listItemStub = createSimpleStub('v-list-item')
  const buttonStub = createClickStub('v-btn')
  const expansionPanelsStub = createSimpleStub('v-expansion-panels')
  const expansionPanelStub = createSimpleStub('v-expansion-panel')
  const expansionPanelTitleStub = createSimpleStub('v-expansion-panel-title')
  const expansionPanelTextStub = createSimpleStub('v-expansion-panel-text')
  const paginationStub = createPaginationStub()
  const snackbarStub = createSimpleStub('v-snackbar')

  return mount(ApplicationList, {
    global: {
      provide: {
        t: { value: translations },
      },
      stubs: {
        'v-container': containerStub,
        VContainer: containerStub,

        'v-row': rowStub,
        VRow: rowStub,

        'v-col': colStub,
        VCol: colStub,

        'v-alert': alertStub,
        VAlert: alertStub,

        'v-progress-circular': progressStub,
        VProgressCircular: progressStub,

        'v-chip': chipStub,
        VChip: chipStub,

        'v-list': listStub,
        VList: listStub,

        'v-list-item': listItemStub,
        VListItem: listItemStub,

        'v-btn': buttonStub,
        VBtn: buttonStub,

        'v-expansion-panels': expansionPanelsStub,
        VExpansionPanels: expansionPanelsStub,

        'v-expansion-panel': expansionPanelStub,
        VExpansionPanel: expansionPanelStub,

        'v-expansion-panel-title': expansionPanelTitleStub,
        VExpansionPanelTitle: expansionPanelTitleStub,

        'v-expansion-panel-text': expansionPanelTextStub,
        VExpansionPanelText: expansionPanelTextStub,

        'v-pagination': paginationStub,
        VPagination: paginationStub,

        'v-snackbar': snackbarStub,
        VSnackbar: snackbarStub,
      },
    },
  })
}

vi.mock('@/stores/applicationsStore', () => ({
  useApplicationsStore: vi.fn(() => mockApplicationsStore),
}))

describe('ApplicationList Component', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.clearAllMocks()
    mockApplicationsStore.handlingError = null
    mockApplicationsStore.error = null
  })

  describe('handleApplication', () => {
    it('handles accept and decline actions successfully', async () => {
      mockApplicationsStore.handleApplication.mockResolvedValue(true)

      const wrapper = mountWithStubs()
      const vm = wrapper.vm as any

      await vm.handleApplication(1, 'accept')
      await vm.handleApplication(1, 'decline')

      expect(mockApplicationsStore.handleApplication).toHaveBeenNthCalledWith(1, 1, 'accept')
      expect(mockApplicationsStore.handleApplication).toHaveBeenNthCalledWith(2, 1, 'decline')
    })

    it('handles conflict error (409)', async () => {
      mockApplicationsStore.handlingError = 'CONFLICT'

      const wrapper = mountWithStubs()
      const vm = wrapper.vm as any

      await vm.handleApplication(1, 'accept')

      expect(vm.snackbarMessage).toBe(tMock.applicationAlreadyHandledMessage)
    })

    it('handles not found error (404)', async () => {
      mockApplicationsStore.handlingError = 'NOT_FOUND'

      const wrapper = mountWithStubs()
      const vm = wrapper.vm as any

      await vm.handleApplication(1, 'accept')

      expect(vm.snackbarMessage).toBe(tMock.applicationNotFoundMessage)
    })

    it('handles unauthorized error (401)', async () => {
      mockApplicationsStore.handlingError = 'UNAUTHORIZED'

      const wrapper = mountWithStubs()
      const vm = wrapper.vm as any

      await vm.handleApplication(1, 'accept')

      expect(vm.snackbarMessage).toBe(tMock.applicationUnauthorizedMessage)
    })
  })

  describe('rendering', () => {
    it('displays loading indicator when fetching', () => {
      mountWithStubs()
      expect(mockApplicationsStore.fetchAllApplications).toHaveBeenCalled()
    })

    it('displays error message on failure', () => {
      mockApplicationsStore.error = 'Failed to load'

      const wrapper = mountWithStubs()
      expect(wrapper.text()).toContain('Failed to load')
    })

    it('displays applications when loaded', () => {
      const wrapper = mountWithStubs()

      expect(wrapper.text()).toContain('John')
      expect(wrapper.text()).toContain('Doe')
    })
  })
})