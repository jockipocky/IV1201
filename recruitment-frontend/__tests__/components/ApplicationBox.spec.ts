/**
 * @file ApplicationBox.spec.ts
 * @description Unit tests for the ApplicationBox Vue component.
 *
 * This file tests the application form UI (competences + availability) and submission behavior.
 * It mocks the Pinia application store and stubs Vuetify components / injected i18n `t`.
 *
 * Test scenarios:
 * - adds empty competence on mount when competences is empty
 * - adds new competence when clicking plus (handler on last item)
 * - removes competence when clicking delete
 * - adds empty availability on mount
 * - submits application on apply click
 * - shows error on submission failure
 * - cancels and resets form
 */

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { nextTick } from 'vue'
import ApplicationBox from '../../src/components/ApplicationBox.vue'

const mockApplicationStore: any = {
  competences: [{ competenceType: '', competenceTime: '' }],
  availability: [{ from: null, to: null }],
  addEmptyCompetence: vi.fn(),
  removeCompetence: vi.fn(),
  addEmptyAvailability: vi.fn(),
  removeAvailability: vi.fn(),
  updateCompetence: vi.fn(),
  setAvailabilityRange: vi.fn(),
  submitApplicationForm: vi.fn(),
  resetForm: vi.fn(),
  getAvailabilityRange: vi.fn(() => []),
}

vi.mock('@/stores/applicationStore', () => ({
  useApplicationStore: vi.fn(() => mockApplicationStore),
}))

const tMock = {
  competenceProfile: 'Competence Profile',
  availabilityRange: 'Availability',
  apply: 'Apply',
  cancelLabel: 'Cancel',
  genericError: 'An error occurred',
  competence: 'Competence',
  yearsOfExperienceLabel: 'Years of Experience',

  // used in v-select :items
  ticketSalesLabel: 'Ticket Sales',
  rollerCoasterOperatorLabel: 'Roller Coaster Operator',
  lotteriesLabel: 'Lotteries',
}

function mountWithStubs() {
  return mount(ApplicationBox, {
    global: {
      provide: { t: tMock },
      stubs: {
        'v-card': { template: '<div><slot /></div>' },
        'v-select': { template: '<div />' },

        'v-text-field': {
          template: `
            <div>
              <button data-test="append" @click="$emit('click:append-inner')">append</button>
            </div>
          `,
        },

        'v-date-picker': { template: '<div />' },

        'v-btn': {
          template: `<button @click="$emit('click')"><slot /></button>`,
        },
        'v-icon': { template: '<span><slot /></span>' },

        'v-alert': { template: '<div data-test="alert"><slot /></div>' },
      },
    },
  })
}

describe('ApplicationBox.vue', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.clearAllMocks()
    mockApplicationStore.competences = [{ competenceType: '', competenceTime: '' }]
    mockApplicationStore.availability = [{ from: null, to: null }]
  })

  it('calls addEmptyCompetence on setup when competences is empty', () => {
    mockApplicationStore.competences = []
    mountWithStubs()
    expect(mockApplicationStore.addEmptyCompetence).toHaveBeenCalledTimes(1)
  })

  it('calls addEmptyAvailability on setup when availability is empty', () => {
    mockApplicationStore.availability = []
    mountWithStubs()
    expect(mockApplicationStore.addEmptyAvailability).toHaveBeenCalledTimes(1)
  })

  it('handleCompIconClick: last item adds, non-last removes', async () => {
    mockApplicationStore.competences = [
      { competenceType: 'Ticket Sales', competenceTime: '2' },
      { competenceType: 'Lotteries', competenceTime: '1' },
    ]

    const wrapper = mountWithStubs()
    const vm = wrapper.vm as any

    vm.handleCompIconClick(1)
    expect(mockApplicationStore.addEmptyCompetence).toHaveBeenCalledTimes(1)

    vm.handleCompIconClick(0)
    expect(mockApplicationStore.removeCompetence).toHaveBeenCalledWith(0)
  })

  it('handleAvailabilityIconClick: last item adds, non-last removes', () => {
    mockApplicationStore.availability = [{ from: null, to: null }, { from: null, to: null }]
    const wrapper = mountWithStubs()
    const vm = wrapper.vm as any

    vm.handleAvailabilityIconClick(1)
    expect(mockApplicationStore.addEmptyAvailability).toHaveBeenCalledTimes(1)

    vm.handleAvailabilityIconClick(0)
    expect(mockApplicationStore.removeAvailability).toHaveBeenCalledWith(0)
  })

  it('clicking append button triggers add/remove branch via template (competence)', async () => {
    mockApplicationStore.competences = [
      { competenceType: 'Ticket Sales', competenceTime: '2' },
      { competenceType: '', competenceTime: '' },
    ]

    const wrapper = mountWithStubs()

    const appendButtons = wrapper.findAll('[data-test="append"]')
    expect(appendButtons.length).toBe(2)

    await appendButtons[0].trigger('click')
    expect(mockApplicationStore.removeCompetence).toHaveBeenCalledWith(0)

    // second field: last => add
    await appendButtons[1].trigger('click')
    expect(mockApplicationStore.addEmptyCompetence).toHaveBeenCalled()
  })

it('onApply: success calls submit and reload', async () => {
  mockApplicationStore.submitApplicationForm.mockResolvedValueOnce(true)

  const reloadSpy = vi.fn()
  vi.stubGlobal('location', { reload: reloadSpy } as any)

  const wrapper = mountWithStubs()
  const vm = wrapper.vm as any

  await vm.onApply()

  expect(mockApplicationStore.submitApplicationForm).toHaveBeenCalledTimes(1)
  expect(reloadSpy).toHaveBeenCalledTimes(1)
})

  it('onApply: failure sets error and shows alert', async () => {
    mockApplicationStore.submitApplicationForm.mockRejectedValueOnce(new Error('Failed'))

    const wrapper = mountWithStubs()
    const vm = wrapper.vm as any

    await vm.onApply()
    await nextTick()

    expect(vm.error).toBe('An error occurred')
    expect(wrapper.find('[data-test="alert"]').exists()).toBe(true)
    expect(wrapper.text()).toContain('An error occurred')
  })

  it('cancelForm clears arrays, adds one empty entry each, and clears error', () => {
    const wrapper = mountWithStubs()
    const vm = wrapper.vm as any

    vm.error = 'something' 
    vm.cancelForm()

    expect(mockApplicationStore.addEmptyCompetence).toHaveBeenCalledTimes(1)
    expect(mockApplicationStore.addEmptyAvailability).toHaveBeenCalledTimes(1)
    expect(vm.error).toBe(null)
  })
})