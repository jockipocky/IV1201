/**
 * @file ApplicationBox.spec.ts
 * @description Unit tests for the ApplicationBox component.
 *
 * This file tests the component responsible for displaying a summary
 * of an application within the UI.
 *
 * Test scenarios:
 * - renders application information correctly
 * - displays application status
 * - handles missing or empty data
 * - responds to user interactions
 *
 * @module components
 */

import { ref } from 'vue'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import ApplicationBox from '../../src/components/ApplicationBox.vue'

const mockApplicationStore: any = {
  competences: [{ competenceType: '', competenceTime: '' }],
  availability: [{ from: null, to: null }],
  hasApplication: true,
  isEditingApplication: true,
  error: null,

  addEmptyCompetence: vi.fn(),
  removeCompetence: vi.fn(),
  addEmptyAvailability: vi.fn(),
  removeAvailability: vi.fn(),
  updateCompetence: vi.fn(),
  setAvailabilityRange: vi.fn(),
  submitApplicationForm: vi.fn(),
  fetchApplication: vi.fn(),
  resetForm: vi.fn(),
  getAvailabilityRange: vi.fn(() => []),
}

vi.mock('@/stores/profileStore', () => ({
  useApplicationStore: vi.fn(() => mockApplicationStore),
}))

const tMock = ref({
  competenceProfile: 'Competence Profile',
  availabilityRange: 'Availability',
  apply: 'Apply',
  cancelLabel: 'Cancel',
  genericError: 'An error occurred',
  competence: 'Competence',
  yearsOfExperienceLabel: 'Years of Experience',
  allFieldsRequired: 'Required',
  numberCheck: 'Invalid number',
  ticketSalesLabel: 'Ticket Sales',
  rollerCoasterOperatorLabel: 'Roller Coaster Operator',
  lotteriesLabel: 'Lotteries',
})



function createSimpleStub(className: string, tag = 'div') {
  return {
    template: `<${tag} class="${className}"><slot /></${tag}>`,
  }
}

function createModelStub(className: string, value: unknown) {
  return {
    template: `
      <div class="${className}" @click="$emit('update:model-value', value)">
        <slot />
      </div>
    `,
    data() {
      return { value }
    },
  }
}

function createFormStub() {
  return {
    template: '<form><slot /></form>',
    methods: {
      validate() {
        return Promise.resolve({ valid: true })
      },
    },
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

const cardStub = createSimpleStub('v-card')
const formStub = createFormStub()
const selectStub = createModelStub('v-select', 'Ticket Sales')
const textFieldStub = createModelStub('v-text-field', '2')
const datePickerStub = createModelStub('v-date-picker', [
  new Date('2026-01-01'),
  new Date('2026-02-01')
])
const buttonStub = createClickStub('v-btn')
const iconStub = createSimpleStub('v-icon', 'span')

function mountWithStubs() {
  return mount(ApplicationBox, {
    global: {
      provide: {
        t: tMock,
      },
      stubs: {
        'v-card': cardStub,
        VCard: cardStub,

        'v-form': formStub,
        VForm: formStub,

        'v-select': selectStub,
        VSelect: selectStub,

        'v-text-field': textFieldStub,
        VTextField: textFieldStub,

        'v-date-picker': datePickerStub,
        VDatePicker: datePickerStub,

        'v-btn': buttonStub,
        VBtn: buttonStub,

        'v-icon': iconStub,
        VIcon: iconStub,
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
    mockApplicationStore.hasApplication = true
    mockApplicationStore.isEditingApplication = true
    mockApplicationStore.error = null
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


  it('onApply: success submits, fetches application, and exits editing', async () => {
    mockApplicationStore.competences = [
      { competenceType: 'Ticket Sales', competenceTime: '2' },
    ]
    mockApplicationStore.availability = [
      { from: '2026-01-01', to: '2026-02-01' },
    ]
    mockApplicationStore.getAvailabilityRange.mockReturnValue([
      new Date('2026-01-01'),
      new Date('2026-02-01')
    ])

    mockApplicationStore.submitApplicationForm.mockResolvedValueOnce(true)
    mockApplicationStore.fetchApplication.mockResolvedValueOnce(true)
    mockApplicationStore.isEditingApplication = true

    const wrapper = mountWithStubs()
    const vm = wrapper.vm as any
    vm.formRef = {
      validate: vi.fn().mockResolvedValue({ valid: true }),
    }

    await vm.onApply()

    expect(mockApplicationStore.submitApplicationForm).toHaveBeenCalledTimes(1)
    expect(mockApplicationStore.fetchApplication).toHaveBeenCalledTimes(1)
    expect(mockApplicationStore.isEditingApplication).toBe(false)
  })

  it('onApply: failure sets generic error', async () => {
    mockApplicationStore.competences = [
      { competenceType: 'Ticket Sales', competenceTime: '2' },
    ]
    mockApplicationStore.availability = [
      { from: '2026-01-01', to: '2026-02-01' },
    ]
    mockApplicationStore.getAvailabilityRange.mockReturnValue([
      new Date('2026-01-01'),
      new Date('2026-02-01')
    ])

    mockApplicationStore.submitApplicationForm.mockRejectedValueOnce(new Error('Failed'))

    const wrapper = mountWithStubs()
    const vm = wrapper.vm as any
    vm.formRef = {
      validate: vi.fn().mockResolvedValue({ valid: true }),
    }

    await vm.onApply()

    expect(mockApplicationStore.error).toBe('genericError')
  })


  it('onApply does nothing when form validation fails', async () => {
  const wrapper = mount(ApplicationBox, {
    global: {
      provide: { t: tMock },
      stubs: {
        'v-card': { template: '<div><slot /></div>' },
        'v-form': {
          template: '<form><slot /></form>',
          methods: {
            validate() {
              return Promise.resolve({ valid: false })
            },
          },
        },
        'v-select': { template: '<div />' },
        'v-text-field': { template: '<div />' },
        'v-date-picker': { template: '<div />' },
        'v-btn': { template: '<button @click="$emit(`click`)"><slot /></button>' },
        'v-icon': { template: '<span><slot /></span>' },
      },
    },
  })

  const vm = wrapper.vm as any
  await vm.onApply()

  expect(mockApplicationStore.submitApplicationForm).not.toHaveBeenCalled()
  expect(mockApplicationStore.fetchApplication).not.toHaveBeenCalled()
})
it('does not show cancel button when hasApplication is false', () => {
  mockApplicationStore.hasApplication = false

  const wrapper = mountWithStubs()

  expect(wrapper.find('[data-cy="cancel-button"]').exists()).toBe(false)
})
it('clicking cancel button clears error and exits editing', async () => {
  mockApplicationStore.hasApplication = true
  mockApplicationStore.isEditingApplication = true
  mockApplicationStore.error = 'someError'

  const wrapper = mountWithStubs()

  await wrapper.find('[data-cy="cancel-button"]').trigger('click')

  expect(mockApplicationStore.isEditingApplication).toBe(false)
  expect(mockApplicationStore.error).toBe(null)
})
it('clicking last competence action button adds a competence', async () => {
  mockApplicationStore.competences = [
    { competenceType: 'Ticket Sales', competenceTime: '2' },
    { competenceType: '', competenceTime: '' },
  ]

  const wrapper = mountWithStubs()
  const buttons = wrapper.findAll('.v-btn')

  // first competence action button is before apply/cancel buttons
  await buttons[1].trigger('click')

  expect(mockApplicationStore.addEmptyCompetence).toHaveBeenCalled()
})
it('clicking non-last competence action button removes a competence', async () => {
  mockApplicationStore.competences = [
    { competenceType: 'Ticket Sales', competenceTime: '2' },
    { competenceType: 'Lotteries', competenceTime: '1' },
  ]

  const wrapper = mountWithStubs()
  const buttons = wrapper.findAll('.v-btn')

  await buttons[0].trigger('click')

  expect(mockApplicationStore.removeCompetence).toHaveBeenCalledWith(0)
})



it('updates competence type from select event', async () => {
  mockApplicationStore.competences = [
    { competenceType: '', competenceTime: '' },
  ]

  const wrapper = mountWithStubs()

  await wrapper.find('.v-select').trigger('click')

  expect(mockApplicationStore.updateCompetence).toHaveBeenCalledWith(0, {
    competenceType: 'Ticket Sales',
  })
})
it('updates competence time from text field event', async () => {
  mockApplicationStore.competences = [
    { competenceType: '', competenceTime: '' },
  ]

  const wrapper = mountWithStubs()

  await wrapper.find('.v-text-field').trigger('click')

  expect(mockApplicationStore.updateCompetence).toHaveBeenCalledWith(0, {
    competenceTime: '2',
  })
})
it('updates availability range from date picker event', async () => {
  mockApplicationStore.availability = [
    { from: null, to: null },
  ]

  const wrapper = mountWithStubs()

  await wrapper.find('.v-date-picker').trigger('click')

  expect(mockApplicationStore.setAvailabilityRange).toHaveBeenCalledWith(0, [
    new Date('2026-01-01'),
    new Date('2026-02-01'),
  ])
})
})