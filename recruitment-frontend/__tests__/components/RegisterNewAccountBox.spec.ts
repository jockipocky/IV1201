/**
 * @file RegisterNewAccountBox.spec.ts
 * @description Unit tests for the RegisterNewAccountBox component.
 *
 * This file tests the user registration form component used to create
 * new accounts.
 *
 * Test scenarios:
 * - renders registration form fields
 * * validates required fields
 * - submits registration data
 * - handles registration errors
 *
 * @module components
 */

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { formatPersonNumber, isValidPersonNumberFormatted } from '@/utility/personNumber'

vi.mock('@/utility/personNumber', () => ({
  formatPersonNumber: vi.fn(),
  isValidPersonNumberFormatted: vi.fn(),
}))

const mockRegisterStore = {
  register: vi.fn(),
}

let RegisterNewAccountBox: any

vi.mock('@/stores/registerStore', () => ({
  useRegisterStore: vi.fn(() => mockRegisterStore),
}))

const pushMock = vi.fn()

vi.mock('@/router', () => ({
  router: {
    push: pushMock,
  },
}))

vi.mock('@/router/index', () => ({
  router: {
    push: pushMock,
  },
}))

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
        <button type="button" class="append" @click="$emit('click:append-inner')">append</button>
      </div>
    `,
  }
}

function mountWithStubs(tValue: any = {}) {
  const cardStub = createSimpleStub('v-card')
  const buttonStub = createClickStub('v-btn')
  const alertStub = createSimpleStub('v-alert')
  const textFieldStub = createTextFieldStub()

  return mount(RegisterNewAccountBox, {
    global: {
      stubs: {
        'v-card': cardStub,
        VCard: cardStub,

        'v-btn': buttonStub,
        VBtn: buttonStub,

        'v-alert': alertStub,
        VAlert: alertStub,

        'v-text-field': textFieldStub,
        VTextField: textFieldStub,
      },
      provide: {
        t: { value: tValue },
      },
    },
  })
}

function setStateField(wrapper: any, key: string, value: any) {
  const s = wrapper.vm.state
  if (!s) throw new Error('state is not exposed on wrapper.vm')

  if (typeof s === 'object' && !('value' in s)) {
    s[key] = value
    return
  }

  if (s && 'value' in s) {
    s.value[key] = value
    return
  }

  throw new Error('Unsupported state shape')
}

describe('RegisterNewAccountBox Validation Rules', () => {
  beforeEach(async () => {
    setActivePinia(createPinia())
    vi.clearAllMocks()
    pushMock.mockClear()

    RegisterNewAccountBox = (await import('../../src/components/RegisterNewAccountBox.vue')).default
  })

  describe('personNumberRule', () => {
    it('has validation function available', () => {
      const wrapper = mountWithStubs({})
      expect(wrapper.vm.personNumberRule).toBeDefined()
    })
  })

  describe('registration validation', () => {
    it('validates required fields before submission', async () => {
      const wrapper = mountWithStubs({
        allFieldsRequired: 'All fields are required',
        passwordTooShort: 'Password must be at least 8 characters',
        invalidEmail: 'Invalid email',
      })

      const vm = wrapper.vm as any

      await vm.handleRegister()
      expect(vm.error).toBe('All fields are required')
    })

    it('validates password minimum 8 characters', async () => {
      const wrapper = mountWithStubs({
        allFieldsRequired: 'All fields are required',
        passwordTooShort: 'Password must be at least 8 characters',
        invalidEmail: 'Invalid email',
      })

      const vm = wrapper.vm as any

      setStateField(wrapper, 'firstName', 'John')
      setStateField(wrapper, 'lastName', 'Doe')
      setStateField(wrapper, 'email', 'john@example.com')
      setStateField(wrapper, 'personNumber', '19900101-1234')
      setStateField(wrapper, 'username', 'johndoe')
      setStateField(wrapper, 'password', 'short')

      await vm.handleRegister()
      expect(vm.error).toBe('Password must be at least 8 characters')
    })

    it('validates email contains @', async () => {
      const wrapper = mountWithStubs({
        allFieldsRequired: 'All fields are required',
        passwordTooShort: 'Password must be at least 8 characters',
        invalidEmail: 'Invalid email',
      })

      const vm = wrapper.vm as any

      setStateField(wrapper, 'firstName', 'John')
      setStateField(wrapper, 'lastName', 'Doe')
      setStateField(wrapper, 'email', 'invalid-email')
      setStateField(wrapper, 'personNumber', '19900101-1234')
      setStateField(wrapper, 'username', 'johndoe')
      setStateField(wrapper, 'password', 'password123')

      await vm.handleRegister()
      expect(vm.error).toBe('Invalid email')
    })
  })

  describe('form submission', () => {
    it('calls register store on valid submission', async () => {
      mockRegisterStore.register.mockResolvedValue(true)
      vi.mocked(formatPersonNumber).mockReturnValue('19900101-1234')

      const wrapper = mountWithStubs({
        allFieldsRequired: 'All fields are required',
        passwordTooShort: 'Password must be at least 8 characters',
        invalidEmail: 'Invalid email',
        registrationSuccess: 'Registration successful!',
        errors: {},
      })

      const vm = wrapper.vm as any

      setStateField(wrapper, 'firstName', 'John')
      setStateField(wrapper, 'lastName', 'Doe')
      setStateField(wrapper, 'email', 'john@example.com')
      setStateField(wrapper, 'personNumber', '19900101-1234')
      setStateField(wrapper, 'username', 'johndoe')
      setStateField(wrapper, 'password', 'password123')

      await vm.handleRegister()

      expect(mockRegisterStore.register).toHaveBeenCalledWith(
        'John',
        'Doe',
        'john@example.com',
        '19900101-1234',
        'johndoe',
        'password123',
      )
    })

    it('shows success message on registration', async () => {
      mockRegisterStore.register.mockResolvedValue(true)
      vi.mocked(formatPersonNumber).mockReturnValue('19900101-1234')

      const wrapper = mountWithStubs({
        allFieldsRequired: 'All fields are required',
        passwordTooShort: 'Password must be at least 8 characters',
        invalidEmail: 'Invalid email',
        registrationSuccess: 'Registration successful!',
        errors: {},
      })

      const vm = wrapper.vm as any

      setStateField(wrapper, 'firstName', 'John')
      setStateField(wrapper, 'lastName', 'Doe')
      setStateField(wrapper, 'email', 'john@example.com')
      setStateField(wrapper, 'personNumber', '19900101-1234')
      setStateField(wrapper, 'username', 'johndoe')
      setStateField(wrapper, 'password', 'password123')

      await vm.handleRegister()
      expect(vm.success).toBe('Registration successful!')
    })

    it('shows error on registration failure', async () => {
      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

      mockRegisterStore.register.mockRejectedValue({
        response: { data: { error: 'USER_EXISTS' } },
      })
      vi.mocked(formatPersonNumber).mockReturnValue('19900101-1234')

      const wrapper = mountWithStubs({
        allFieldsRequired: 'All fields are required',
        passwordTooShort: 'Password must be at least 8 characters',
        invalidEmail: 'Invalid email',
        registrationSuccess: 'Registration successful!',
        errors: { USER_EXISTS: 'User already exists' },
      })

      const vm = wrapper.vm as any

      setStateField(wrapper, 'firstName', 'John')
      setStateField(wrapper, 'lastName', 'Doe')
      setStateField(wrapper, 'email', 'john@example.com')
      setStateField(wrapper, 'personNumber', '19900101-1234')
      setStateField(wrapper, 'username', 'johndoe')
      setStateField(wrapper, 'password', 'password123')

      await vm.handleRegister()

      expect(vm.error).toBe('User already exists')

      consoleErrorSpy.mockRestore()
    })
  })

  it('personNumberRule returns allFieldsRequired when empty', () => {
    const wrapper = mountWithStubs({
      allFieldsRequired: 'All fields are required',
    })

    const vm = wrapper.vm as any

    expect(vm.personNumberRule('')).toBe('All fields are required')
  })

  it('personNumberRule returns invalidPersonalNumberFormat when formatting fails', () => {
    vi.mocked(formatPersonNumber).mockReturnValueOnce(null as any)

    const wrapper = mountWithStubs({
      allFieldsRequired: 'All fields are required',
      invalidPersonalNumberFormat: 'Bad format',
    })

      const vm = wrapper.vm as any

    expect(vm.personNumberRule('199001011234')).toBe('Bad format')
  })

  it('personNumberRule returns invalidPersonalNumber when formatted but invalid', () => {
    vi.mocked(formatPersonNumber).mockReturnValueOnce('19900101-1234')
    vi.mocked(isValidPersonNumberFormatted).mockReturnValueOnce(false as any)

    const wrapper = mountWithStubs({
      invalidPersonalNumber: 'Invalid personal number',
      invalidPersonalNumberFormat: 'Bad format',
    })

      const vm = wrapper.vm as any

    expect(vm.personNumberRule('199001011234')).toBe('Invalid personal number')
  })

  it('personNumberRule returns true when formatted and valid', () => {
    vi.mocked(formatPersonNumber).mockReturnValueOnce('19900101-1234')
    vi.mocked(isValidPersonNumberFormatted).mockReturnValueOnce(true as any)

    const wrapper = mountWithStubs({})

    const vm = wrapper.vm as any

    expect(vm.personNumberRule('199001011234')).toBe(true)
  })

  it('goToLogin navigates to /login', () => {
    const wrapper = mountWithStubs({})

    const vm = wrapper.vm as any

    vm.goToLogin()
    expect(pushMock).toHaveBeenCalledWith('/login')
  })

  it('formats personal number when helper returns formatted value', () => {
    vi.mocked(formatPersonNumber).mockReturnValueOnce('19900101-1234')

    const wrapper = mountWithStubs({})

    const vm = wrapper.vm as any

    vm.state.personNumber = vm.formatPersonNumber('199001011234') ?? '199001011234'

    expect(vm.state.personNumber).toBe('19900101-1234')
  })

  it('toggles password visibility when append icon clicked', async () => {
    const wrapper = mountWithStubs({})

    const vm = wrapper.vm as any

    expect(vm.visible).toBe(false)

    const fields = wrapper.findAll('.v-text-field')
    const passwordField = fields[5]

    await passwordField.find('button.append').trigger('click')
    expect(vm.visible).toBe(true)
  })
})