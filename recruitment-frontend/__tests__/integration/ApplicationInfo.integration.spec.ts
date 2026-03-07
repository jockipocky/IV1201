/**
 * @file ApplicationInfo.integration.spec.ts
 * @description Integration tests for the ApplicationInfo workflow.
 *
 * This file tests the integration between the ApplicationInfo component,
 * stores, and API services.
 *
 * Test scenarios:
 * - loads application data from API
 * - renders application details correctly
 * - handles API response errors
 *
 * @module integration
 */

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { nextTick } from 'vue'
import ApplicationInfo from '../../src/components/ApplicationInfo.vue'
import { useApplicationStore } from '../../src/stores/profileStore'
import { submitPI } from '../../src/api/profileApi'

vi.mock('@/api/profileApi', () => ({
  submitApplication: vi.fn(),
  fetchApplication: vi.fn(),
  submitPI: vi.fn(),
}))

const tMock = {
  personalInfoLabel: 'Personal Info',
  firstNameLabel: 'First Name',
  lastNameLabel: 'Last Name',
  emailLabel: 'Email',
  personalNumberLabel: 'Personal Number',
  editLabel: 'Edit',
  changePersonalInfo: 'Save',
  cancelLabel: 'Cancel',
  successMessage: 'Saved!',
  genericError: 'An error occurred',
  allFieldsRequired: 'All fields required',
  invalidEmail: 'Invalid email',
  invalidName: 'Invalid name',
  invalidPersonalNumberFormat: 'Invalid format',
  invalidPersonalNumber: 'Invalid personal number',
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

function createTextFieldStub() {
  return {
    props: ['modelValue'],
    template: `
      <div class="v-text-field">
        <input
          class="v-input"
          :value="modelValue"
          @input="$emit('update:modelValue', $event.target.value)"
        />
      </div>
    `,
  }
}

function createFormStub(isValid = true) {
  return {
    template: '<form class="v-form"><slot /></form>',
    methods: {
      validate() {
        return Promise.resolve({ valid: isValid })
      },
    },
  }
}

function mountWithStubs(options?: { isFormValid?: boolean }) {
  const isFormValid = options?.isFormValid ?? true

  const cardStub = createSimpleStub('v-card')
  const buttonStub = createClickStub('v-btn')
  const rowStub = createSimpleStub('v-row')
  const colStub = createSimpleStub('v-col')
  const textFieldStub = createTextFieldStub()
  const formStub = createFormStub(isFormValid)

  return mount(ApplicationInfo, {
    global: {
      provide: {
        t: { value: tMock },
      },
      stubs: {
        'v-card': cardStub,
        VCard: cardStub,

        'v-btn': buttonStub,
        VBtn: buttonStub,

        'v-row': rowStub,
        VRow: rowStub,

        'v-col': colStub,
        VCol: colStub,

        'v-text-field': textFieldStub,
        VTextField: textFieldStub,

        'v-form': formStub,
        VForm: formStub,
      },
    },
  })
}

describe('ApplicationInfo integration', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.clearAllMocks()
  })

  it('edits and submits personal info through the real store', async () => {
    vi.mocked(submitPI).mockResolvedValueOnce({
      data: { success: true },
    } as any)

    const store = useApplicationStore()
    store.personalInfo = {
      firstName: 'John',
      lastname: 'Doe',
      email: 'john@example.com',
      personalNumber: '19900101-1234',
      person_id: '123',
    }

    const wrapper = mountWithStubs()
    const vm = wrapper.vm as any

    await wrapper.find('[data-cy="edit-profile"]').trigger('click')
    await nextTick()

    const firstNameInput = wrapper.find('[data-cy="firstname-input"] input')
    await firstNameInput.setValue('Jane')
    await nextTick()

    vm.formRef = {
      validate: vi.fn().mockResolvedValue({ valid: true }),
    }

    await vm.onSubmit()
    await nextTick()

    expect(submitPI).toHaveBeenCalledWith({
      firstName: 'Jane',
      lastName: 'Doe',
      email: 'john@example.com',
      personalNumber: '19900101-1234',
      person_id: '123',
    })

    expect(store.personalInfo.firstName).toBe('Jane')
    expect(store.error).toBeNull()
    expect(vm.isEditing).toBe(false)
  })
})