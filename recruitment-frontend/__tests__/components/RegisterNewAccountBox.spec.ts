/**
 * @file RegisterNewAccountBox.spec.ts
 * @description Unit tests for the RegisterNewAccountBox Vue component.
 *
 * This file tests the registration form UI and interaction behavior.
 * Register store/actions may be mocked to avoid real API calls.
 *
 * Test scenarios:
 * - renders registration form fields/buttons
 * - triggers register action on submit
 * - shows error state when register fails
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


var pushMock: any
pushMock = vi.fn()

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


const vuetifyStubs = {
  VCard: { template: '<div><slot /></div>' },
  VBtn: { template: '<button class="v-btn" @click="$emit(`click`)"><slot /></button>' },
  VAlert: { template: '<div class="v-alert"><slot /></div>' },


  VTextField: {
    props: ['modelValue'],
    template: `
      <div class="v-text-field">
        <input
          class="v-input"
          :value="modelValue"
          @input="$emit('update:modelValue', $event.target.value)"
        />
        <button class="append" @click="$emit('click:append-inner')">append</button>
      </div>
    `,
  },
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
      const wrapper = mount(RegisterNewAccountBox, {
        global: {
          provide: {
            t: { value: {} },
          },
        },
      })

      expect(wrapper.vm.personNumberRule).toBeDefined()
    })
  })

  describe('registration validation', () => {
    it('validates required fields before submission', async () => {
      const wrapper = mount(RegisterNewAccountBox, {
        global: {
          provide: {
            t: {
              value: {
                allFieldsRequired: 'All fields are required',
                passwordTooShort: 'Password must be at least 8 characters',
                invalidEmail: 'Invalid email',
              },
            },
          },
        },
      })

      await wrapper.vm.handleRegister()
      expect(wrapper.vm.error).toBe('All fields are required')
    })

    it('validates password minimum 8 characters', async () => {
      const wrapper = mount(RegisterNewAccountBox, {
        global: {
          provide: {
            t: {
              value: {
                allFieldsRequired: 'All fields are required',
                passwordTooShort: 'Password must be at least 8 characters',
                invalidEmail: 'Invalid email',
              },
            },
          },
        },
      })

      setStateField(wrapper, 'firstName', 'John')
      setStateField(wrapper, 'lastName', 'Doe')
      setStateField(wrapper, 'email', 'john@example.com')
      setStateField(wrapper, 'personNumber', '19900101-1234')
      setStateField(wrapper, 'username', 'johndoe')
      setStateField(wrapper, 'password', 'short')

      await wrapper.vm.handleRegister()
      expect(wrapper.vm.error).toBe('Password must be at least 8 characters')
    })

    it('validates email contains @', async () => {
      const wrapper = mount(RegisterNewAccountBox, {
        global: {
          provide: {
            t: {
              value: {
                allFieldsRequired: 'All fields are required',
                passwordTooShort: 'Password must be at least 8 characters',
                invalidEmail: 'Invalid email',
              },
            },
          },
        },
      })

      setStateField(wrapper, 'firstName', 'John')
      setStateField(wrapper, 'lastName', 'Doe')
      setStateField(wrapper, 'email', 'invalid-email')
      setStateField(wrapper, 'personNumber', '19900101-1234')
      setStateField(wrapper, 'username', 'johndoe')
      setStateField(wrapper, 'password', 'password123')

      await wrapper.vm.handleRegister()
      expect(wrapper.vm.error).toBe('Invalid email')
    })
  })

  describe('form submission', () => {
    it('calls register store on valid submission', async () => {
      mockRegisterStore.register.mockResolvedValue(true)

      const wrapper = mount(RegisterNewAccountBox, {
        global: {
          provide: {
            t: {
              value: {
                allFieldsRequired: 'All fields are required',
                passwordTooShort: 'Password must be at least 8 characters',
                invalidEmail: 'Invalid email',
                registrationSuccess: 'Registration successful!',
                errors: {},
              },
            },
          },
        },
      })

      setStateField(wrapper, 'firstName', 'John')
      setStateField(wrapper, 'lastName', 'Doe')
      setStateField(wrapper, 'email', 'john@example.com')
      setStateField(wrapper, 'personNumber', '19900101-1234')
      setStateField(wrapper, 'username', 'johndoe')
      setStateField(wrapper, 'password', 'password123')

      await wrapper.vm.handleRegister()

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

      const wrapper = mount(RegisterNewAccountBox, {
        global: {
          provide: {
            t: {
              value: {
                allFieldsRequired: 'All fields are required',
                passwordTooShort: 'Password must be at least 8 characters',
                invalidEmail: 'Invalid email',
                registrationSuccess: 'Registration successful!',
                errors: {},
              },
            },
          },
        },
      })

      setStateField(wrapper, 'firstName', 'John')
      setStateField(wrapper, 'lastName', 'Doe')
      setStateField(wrapper, 'email', 'john@example.com')
      setStateField(wrapper, 'personNumber', '19900101-1234')
      setStateField(wrapper, 'username', 'johndoe')
      setStateField(wrapper, 'password', 'password123')

      await wrapper.vm.handleRegister()
      expect(wrapper.vm.success).toBe('Registration successful!')
    })

    it('shows error on registration failure', async () => {
      mockRegisterStore.register.mockRejectedValue({
        response: { data: { error: 'USER_EXISTS' } },
      })

      const wrapper = mount(RegisterNewAccountBox, {
        global: {
          provide: {
            t: {
              value: {
                allFieldsRequired: 'All fields are required',
                passwordTooShort: 'Password must be at least 8 characters',
                invalidEmail: 'Invalid email',
                registrationSuccess: 'Registration successful!',
                errors: { USER_EXISTS: 'User already exists' },
              },
            },
          },
        },
      })

      setStateField(wrapper, 'firstName', 'John')
      setStateField(wrapper, 'lastName', 'Doe')
      setStateField(wrapper, 'email', 'john@example.com')
      setStateField(wrapper, 'personNumber', '19900101-1234')
      setStateField(wrapper, 'username', 'johndoe')
      setStateField(wrapper, 'password', 'password123')

      await wrapper.vm.handleRegister()
      expect(wrapper.vm.error).toBe('User already exists')
    })
  })
  it('personNumberRule returns allFieldsRequired when empty', () => {
  const wrapper = mount(RegisterNewAccountBox, {
    global: { provide: { t: { value: { allFieldsRequired: 'All fields are required' } } } },
  })

  expect(wrapper.vm.personNumberRule('')).toBe('All fields are required')
})

it('personNumberRule returns invalidPersonalNumberFormat when formatting fails', () => {
  vi.mocked(formatPersonNumber).mockReturnValueOnce(null as any)

  const wrapper = mount(RegisterNewAccountBox, {
    global: {
      provide: {
        t: { value: { allFieldsRequired: 'All fields are required', invalidPersonalNumberFormat: 'Bad format' } },
      },
    },
  })

  expect(wrapper.vm.personNumberRule('199001011234')).toBe('Bad format')
})

it('personNumberRule returns invalidPersonalNumber when formatted but invalid', () => {
  vi.mocked(formatPersonNumber).mockReturnValueOnce('19900101-1234')
  vi.mocked(isValidPersonNumberFormatted).mockReturnValueOnce(false as any)

  const wrapper = mount(RegisterNewAccountBox, {
    global: {
      provide: {
        t: { value: { invalidPersonalNumber: 'Invalid personal number', invalidPersonalNumberFormat: 'Bad format' } },
      },
    },
  })

  expect(wrapper.vm.personNumberRule('199001011234')).toBe('Invalid personal number')
})

it('personNumberRule returns true when formatted and valid', () => {
  vi.mocked(formatPersonNumber).mockReturnValueOnce('19900101-1234')
  vi.mocked(isValidPersonNumberFormatted).mockReturnValueOnce(true as any)

  const wrapper = mount(RegisterNewAccountBox, {
    global: { provide: { t: { value: {} } } },
  })

  expect(wrapper.vm.personNumberRule('199001011234')).toBe(true)
})

it('goToLogin navigates to /login', () => {
  const wrapper = mount(RegisterNewAccountBox, {
    global: { provide: { t: { value: {} } } },
  })

  wrapper.vm.goToLogin()
  expect(pushMock).toHaveBeenCalledWith('/login')
})

it('formats personal number when helper returns formatted value', () => {
  vi.mocked(formatPersonNumber).mockReturnValueOnce('19900101-1234')

  const wrapper = mount(RegisterNewAccountBox, {
    global: { provide: { t: { value: {} } } },
  })


  wrapper.vm.state.personNumber = wrapper.vm.formatPersonNumber('199001011234') ?? '199001011234'

  expect(wrapper.vm.state.personNumber).toBe('19900101-1234')
})

it('toggles password visibility when append icon clicked', async () => {
  const wrapper = mount(RegisterNewAccountBox, {
    global: {
      stubs: vuetifyStubs,
      provide: { t: { value: {} } },
    },
  })

  expect(wrapper.vm.visible).toBe(false)


  const fields = wrapper.findAll('.v-text-field')
  const passwordField = fields[5]

  await passwordField.find('button.append').trigger('click')
  expect(wrapper.vm.visible).toBe(true)
})
})