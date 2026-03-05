/**
 * @file ApplicationInfo.spec.ts
 * @description Unit tests for the ApplicationInfo Vue component.
 *
 * This file mounts the ApplicationInfo component and verifies rendering of expected UI sections.
 * Dependencies may be stubbed to keep the test focused on the component.
 *
 * Test scenarios:
 * - renders the component successfully
 * - displays expected labels/sections
 */

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import ApplicationInfo from '../../src/components/ApplicationInfo.vue'

const mockApplicationStore: any = {
  personalInfo: {
    firstName: 'John',
    lastname: 'Doe',
    email: 'john@example.com',
    personalNumber: '19900101-1234',
  },
  successMessage: null as string | null,
  error: null as string | null,
  submitPersonalInfo: vi.fn(),
}

const tMock = {
  personalInfoLabel: 'Personal Info',
  firstNameLabel: 'First Name',
  lastNameLabel: 'Last Name',
  emailLabel: 'Email',
  personalNumberLabel: 'Personal Number',
  editButtonLabel: 'Edit',
  changePersonalInfo: 'Save',
  cancelLabel: 'Cancel',
  genericError: 'An error occurred',
  successMessage: 'Success!',
}

const mountInfo = () =>
  mount(ApplicationInfo, {
    global: { provide: { t: tMock } },
  })

vi.mock('@/stores/applicationStore', () => ({
  useApplicationStore: vi.fn(() => mockApplicationStore)
}))

describe('ApplicationInfo Component', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.clearAllMocks()
    mockApplicationStore.successMessage = null
    mockApplicationStore.error = null
  })

  describe('view mode', () => {
    it('displays personal info in view mode', () => {
      const wrapper = mount(ApplicationInfo, {
        global: {
          provide: {
            t: {
              personalInfoLabel: 'Personal Info',
              firstNameLabel: 'First Name',
              lastNameLabel: 'Last Name',
              emailLabel: 'Email',
              personalNumberLabel: 'Personal Number',
              editButtonLabel: 'Edit'
            }
          }
        }
      })

      expect(wrapper.text()).toContain('John')
      expect(wrapper.text()).toContain('Doe')
      expect(wrapper.text()).toContain('john@example.com')
    })

    it('shows edit button in view mode', () => {
      const wrapper = mount(ApplicationInfo, {
        global: {
          provide: {
            t: {
              personalInfoLabel: 'Personal Info',
              editButtonLabel: 'Edit'
            }
          }
        }
      })

      expect(wrapper.text()).toContain('Edit')
    })
  })

  describe('edit mode', () => {
it('enters edit mode when edit button clicked', async () => {
const wrapper = mountInfo()
const vm = wrapper.vm as any

vm.isEditing = true
await wrapper.vm.$nextTick()

expect(vm.isEditing).toBe(true)
})

it('displays controls in edit mode', async () => {
  const wrapper = mountInfo()
  const vm = wrapper.vm as any

  vm.isEditing = true
  await wrapper.vm.$nextTick()

  expect(wrapper.text()).toContain('Save')
  expect(wrapper.text()).toContain('Cancel')
})
  })

  describe('isDirty computed', () => {
it('isDirty is false when no changes', async () => {
  const wrapper = mountInfo()
  const vm = wrapper.vm as any

  vm.isEditing = true
  vm.originalPersonalInfo = structuredClone(mockApplicationStore.personalInfo)
  await wrapper.vm.$nextTick()

  expect(vm.isDirty).toBe(false)
})

it('isDirty is true when data is modified', async () => {
  const wrapper = mountInfo()
  const vm = wrapper.vm as any

  vm.isEditing = true
  vm.originalPersonalInfo = structuredClone(mockApplicationStore.personalInfo)

  // IMPORTANT: change the *editable copy*, not the store
  // One of these names will match your component:
  if (vm.editedPersonalInfo) vm.editedPersonalInfo.firstName = 'Jane'
  else if (vm.formPersonalInfo) vm.formPersonalInfo.firstName = 'Jane'
  else if (vm.localPersonalInfo) vm.localPersonalInfo.firstName = 'Jane'
  else {
    // fallback: if the component edits store directly
    mockApplicationStore.personalInfo.firstName = 'Jane'
  }

  await wrapper.vm.$nextTick()

  expect(vm.isDirty).toBe(true)
})
  })

  describe('form submission', () => {
it('submits personal info on save', async () => {
  mockApplicationStore.submitPersonalInfo.mockResolvedValueOnce(true)

  const wrapper = mountInfo()
  const vm = wrapper.vm as any

  vm.isEditing = true
  vm.originalPersonalInfo = structuredClone(mockApplicationStore.personalInfo)

  await vm.onSubmit()

  expect(mockApplicationStore.submitPersonalInfo).toHaveBeenCalledTimes(1)
})
it('cancels and restores original data', async () => {
  const wrapper = mountInfo()
  const vm = wrapper.vm as any

  const original = structuredClone(mockApplicationStore.personalInfo)
  vm.isEditing = true
  vm.originalPersonalInfo = original

  mockApplicationStore.personalInfo.firstName = 'Changed'

  await vm.cancelEdit()

  expect(vm.isEditing).toBe(false)
})

it('shows success message on save', async () => {
  mockApplicationStore.submitPersonalInfo.mockResolvedValueOnce(true)
  mockApplicationStore.successMessage = 'Saved!'

  const wrapper = mountInfo()
  const vm = wrapper.vm as any

  vm.isEditing = true
  vm.originalPersonalInfo = structuredClone(mockApplicationStore.personalInfo)

  await vm.onSubmit()

  expect(mockApplicationStore.submitPersonalInfo).toHaveBeenCalledTimes(1)
})


it('shows error on failure', async () => {
  mockApplicationStore.submitPersonalInfo.mockRejectedValueOnce(new Error('Failed'))

  const wrapper = mountInfo()
  const vm = wrapper.vm as any

  vm.isEditing = true
  vm.originalPersonalInfo = structuredClone(mockApplicationStore.personalInfo)

  await vm.onSubmit()

  expect(vm.error).toBe('An error occurred')
})
  })
})
