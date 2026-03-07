/**
 * @file ProfileApplicationBox.spec.ts
 * @description Unit tests for the ProfileApplicationBox component.
 *
 * This file tests the component that displays a user's application
 * information within the profile view.
 *
 * Test scenarios:
 * - renders profile application information
 * - displays application status
 * - handles empty data
 *
 * @module components
 */

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import ProfileApplicationBox from '../../src/components/ProfileApplicationBox.vue'

const mockApplicationStore = {
  application: {
    competences: [
      { name: 'Ticket Sales', yearsOfExperience: 2 },
      { name: 'Roller Coaster', yearsOfExperience: 1 },
    ],
    availability: [
      { fromDate: '2026-01-01', toDate: '2026-02-01' },
    ],
  },
  hasApplication: true,
  successMessage: null as string | null,
  error: null as string | null,
  isEditingApplication: false,
}

const tMock = {
  applicationInfo: 'Application Info',
  competence: 'Competence',
  yearsUnit: 'years',
  availabilityTitle: 'Availability',
  resubmitLabel: 'Edit',
  editButtonLabel: 'Edit',
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

function mountWithStubs(translations = tMock) {
  const cardStub = createSimpleStub('v-card')
  const buttonStub = createClickStub('v-btn')
  const alertStub = createSimpleStub('v-alert')
  const listStub = createSimpleStub('v-list')
  const listItemStub = createSimpleStub('v-list-item')
  const listItemTitleStub = createSimpleStub('v-list-item-title')
  const listItemSubtitleStub = createSimpleStub('v-list-item-subtitle')

  return mount(ProfileApplicationBox, {
    global: {
      provide: {
        t: translations,
      },
      stubs: {
        'v-card': cardStub,
        VCard: cardStub,

        'v-btn': buttonStub,
        VBtn: buttonStub,

        'v-alert': alertStub,
        VAlert: alertStub,

        'v-list': listStub,
        VList: listStub,

        'v-list-item': listItemStub,
        VListItem: listItemStub,

        'v-list-item-title': listItemTitleStub,
        VListItemTitle: listItemTitleStub,

        'v-list-item-subtitle': listItemSubtitleStub,
        VListItemSubtitle: listItemSubtitleStub,
      },
    },
  })
}

vi.mock('@/stores/profileStore', () => ({
  useApplicationStore: vi.fn(() => mockApplicationStore),
}))

describe('ProfileApplicationBox Component', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.clearAllMocks()

    mockApplicationStore.application = {
      competences: [
        { name: 'Ticket Sales', yearsOfExperience: 2 },
        { name: 'Roller Coaster', yearsOfExperience: 1 },
      ],
      availability: [
        { fromDate: '2026-01-01', toDate: '2026-02-01' },
      ],
    }
    mockApplicationStore.hasApplication = true
    mockApplicationStore.isEditingApplication = false
    mockApplicationStore.successMessage = null
    mockApplicationStore.error = null
  })

  it('shows edit button when not editing', () => {
    const wrapper = mountWithStubs()

    expect(wrapper.find('[data-cy="edit-application"]').exists()).toBe(true)
    expect(wrapper.text()).toContain('Edit')
  })

  it('displays application competences and availability when application exists', () => {
    const wrapper = mountWithStubs()

    expect(wrapper.text()).toContain('Ticket Sales')
    expect(wrapper.text()).toContain('Roller Coaster')
    expect(wrapper.text()).toContain('2')
    expect(wrapper.text()).toContain('2026-01-01')
    expect(wrapper.text()).toContain('2026-02-01')
  })

  it('does not display application details when application is null', () => {
    mockApplicationStore.application = null

    const wrapper = mountWithStubs()

    expect(wrapper.text()).toContain('Application Info')
    expect(wrapper.text()).not.toContain('Ticket Sales')
    expect(wrapper.text()).not.toContain('Roller Coaster')
    expect(wrapper.text()).not.toContain('2026-01-01')
  })

  it('sets editing mode when edit button is clicked', async () => {
    const wrapper = mountWithStubs()

    await wrapper.find('[data-cy="edit-application"]').trigger('click')

    expect(mockApplicationStore.isEditingApplication).toBe(true)
  })
})