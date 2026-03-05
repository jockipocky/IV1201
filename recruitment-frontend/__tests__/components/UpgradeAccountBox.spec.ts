/**
 * @file UpgradeAccountBox.spec.ts
 * @description Unit tests for the UpgradeAccountBox Vue component.
 *
 * This file tests the upgrade account form UI and interaction behavior.
 * Upgrade store/actions may be mocked to avoid real API calls.
 *
 * Test scenarios:
 * - renders upgrade form fields/buttons
 * - triggers upgrade action on submit
 * - shows error state when upgrade fails
 */

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import UpgradeAccountBox from '../../src/components/UpgradeAccountBox.vue'
import { formatPersonNumber, isValidPersonNumberFormatted } from '@/utility/personNumber'

const mockUpgradeStore = {
  upgrade: vi.fn()
}

vi.mock('@/stores/upgradeStore', () => ({
  useUpgradeStore: vi.fn(() => mockUpgradeStore)
}))


const vuetifyStubs = {
  VCard: { template: '<div><slot /></div>' },
  VForm: { template: '<form @submit.prevent="$emit(`submit`)"><slot /></form>' },
  VBtn: { template: '<button class="v-btn" @click="$emit(`click`)"><slot /></button>' },
  VAlert: { template: '<div class="v-alert"><slot /></div>' },
  VTextField: {
    props: ['modelValue'],
    template: `
      <div class="v-text-field">
        <input class="v-input" :value="modelValue"
          @input="$emit('update:modelValue', $event.target.value)" />
        <button class="append" @click="$emit('click:append-inner')">append</button>
      </div>
    `,
  },
}
const pushMock = vi.fn()

vi.mock('vue-router', () => ({
  useRouter: () => ({ push: pushMock }),
}))

vi.mock('@/utility/personNumber', () => ({
  formatPersonNumber: vi.fn(),
  isValidPersonNumberFormatted: vi.fn(),
}))

const mountBox = (tValue: any = {}) =>
  mount(UpgradeAccountBox, {
    global: {
      stubs: vuetifyStubs,
      provide: { t: { value: tValue } },
    },
  })

describe('UpgradeAccountBox Validation Rules', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.clearAllMocks()
  })

  describe('emailRule', () => {
    it('returns error message for invalid email', () => {
      const wrapper = mount(UpgradeAccountBox, {
        global: {
          provide: {
            t: {
              value: {
                allFieldsRequired: 'All fields are required',
                invalidPersonalNumberFormat: 'Invalid format',
                invalidPersonalNumber: 'Invalid personal number'
              }
            }
          }
        }
      })
      const vm = wrapper.vm as any

      const result = vm.emailRule('invalid-email')
      expect(result).toBe('Enter a valid email')
    })

    it('returns true for valid email', () => {
      const wrapper = mount(UpgradeAccountBox, {
        global: {
          provide: {
            t: { value: {} }
          }
        }
      })
      const vm = wrapper.vm as any

      const result = vm.emailRule('test@example.com')
      expect(result).toBe(true)
    })

    it('returns error for email without @', () => {
      const wrapper = mount(UpgradeAccountBox, {
        global: {
          provide: {
            t: { value: {} }
          }
        }
      })
      const vm = wrapper.vm as any

      const result = vm.emailRule('testexample.com')
      expect(result).toBe('Enter a valid email')
    })

    it('returns error for email without domain', () => {
      const wrapper = mount(UpgradeAccountBox, {
        global: {
          provide: {
            t: { value: {} }
          }
        }
      })
      const vm = wrapper.vm as any

      const result = vm.emailRule('test@')
      expect(result).toBe('Enter a valid email')
    })
  })

  describe('requiredRule', () => {
    it('returns error for empty string', () => {
      const wrapper = mount(UpgradeAccountBox, {
        global: {
          provide: {
            t: { value: { allFieldsRequired: 'All fields are required' } }
          }
        }
      })
      const vm = wrapper.vm as any

      const result = vm.requiredRule('')
      expect(result).toBe('All fields are required')
    })

    it('returns error for whitespace only', () => {
      const wrapper = mount(UpgradeAccountBox, {
        global: {
          provide: {
            t: { value: { allFieldsRequired: 'All fields are required' } }
          }
        }
      })
      const vm = wrapper.vm as any

      const result = vm.requiredRule('   ')
      expect(result).toBe('All fields are required')
    })

    it('returns true for non-empty string', () => {
      const wrapper = mount(UpgradeAccountBox, {
        global: {
          provide: {
            t: { value: {} }
          }
        }
      })
      const vm = wrapper.vm as any

      const result = vm.requiredRule('valid')
      expect(result).toBe(true)
    })
  })

  describe('passwordMinRule', () => {
    it('returns error for password less than 8 characters', () => {
      const wrapper = mount(UpgradeAccountBox, {
        global: {
          provide: {
            t: { value: {} }
          }
        }
      })
      const vm = wrapper.vm as any

      const result = vm.passwordMinRule('short')
      expect(result).toBe('Password must be at least 8 characters')
    })

    it('returns true for password with 8 or more characters', () => {
      const wrapper = mount(UpgradeAccountBox, {
        global: {
          provide: {
            t: { value: {} }
          }
        }
      })
      const vm = wrapper.vm as any

      const result = vm.passwordMinRule('password123')
      expect(result).toBe(true)
    })

    it('returns error for exactly 7 characters', () => {
      const wrapper = mount(UpgradeAccountBox, {
        global: {
          provide: {
            t: { value: {} }
          }
        }
      })
      const vm = wrapper.vm as any

      const result = vm.passwordMinRule('1234567')
      expect(result).toBe('Password must be at least 8 characters')
    })
  })

  describe('personNumberRule', () => {
    it('returns error for invalid format', () => {
      const wrapper = mount(UpgradeAccountBox, {
        global: {
          provide: {
            t: { value: { allFieldsRequired: 'All fields required' } }
          }
        }
      })
      const vm = wrapper.vm as any

      const result = vm.personNumberRule('invalid')
      expect(result).not.toBe(true)
    })

    it('returns error for empty input', () => {
      const wrapper = mount(UpgradeAccountBox, {
        global: {
          provide: {
            t: { value: { allFieldsRequired: 'All fields required' } }
          }
        }
      })
      const vm = wrapper.vm as any

      const result = vm.personNumberRule('')
      expect(result).toBe('All fields required')
    })
  })

  it('goToLogin navigates to /login', () => {
  const wrapper = mountBox()
  wrapper.vm.goToLogin()
  expect(pushMock).toHaveBeenCalledWith('/login')
})

it('handleUpgrade returns early when form is invalid', async () => {
  const wrapper = mountBox()

  wrapper.vm.formRef = { validate: vi.fn().mockResolvedValue({ valid: false }) }

  await wrapper.vm.handleUpgrade()

  expect(mockUpgradeStore.upgrade).not.toHaveBeenCalled()
  expect(wrapper.vm.loading).toBe(false)
})

it('sets invalidPersonalNumberFormat when formatting fails in handleUpgrade', async () => {
  vi.mocked(formatPersonNumber).mockReturnValueOnce(null as any)

  const wrapper = mountBox({
    invalidPersonalNumberFormat: 'Invalid format',
  })

  wrapper.vm.formRef = { validate: vi.fn().mockResolvedValue({ valid: true }) }
  wrapper.vm.state.personNumber = '199001011234'

  await wrapper.vm.handleUpgrade()

  expect(wrapper.vm.error).toBe('Invalid format')
  expect(mockUpgradeStore.upgrade).not.toHaveBeenCalled()
  expect(wrapper.vm.loading).toBe(false)
})

it('calls upgrade store and sets success on valid submission', async () => {
  vi.mocked(formatPersonNumber).mockReturnValueOnce('19900101-1234')
  mockUpgradeStore.upgrade.mockResolvedValueOnce(true)

  const wrapper = mountBox({
    upgradeSuccess: 'Upgrade successful!',
  })

  wrapper.vm.formRef = { validate: vi.fn().mockResolvedValue({ valid: true }) }

  wrapper.vm.state.email = ' test@example.com '
  wrapper.vm.state.personNumber = '19900101-1234'
  wrapper.vm.state.upgradeCode = ' CODE '
  wrapper.vm.state.username = ' user '
  wrapper.vm.state.password = 'password123'

  await wrapper.vm.handleUpgrade()

  expect(mockUpgradeStore.upgrade).toHaveBeenCalledWith(
    'test@example.com',
    '19900101-1234',
    'CODE',
    'user',
    'password123',
  )
  expect(wrapper.vm.success).toBe('Upgrade successful!')
  expect(wrapper.vm.loading).toBe(false)
})

it('uses backend messageKey on failure when provided', async () => {
  vi.mocked(formatPersonNumber).mockReturnValueOnce('19900101-1234')
  mockUpgradeStore.upgrade.mockRejectedValueOnce({
    response: { data: { error: { messageKey: 'someBackendKey' } } },
  })

  const wrapper = mountBox({
    someBackendKey: 'Backend says no',
  })

  wrapper.vm.formRef = { validate: vi.fn().mockResolvedValue({ valid: true }) }
  wrapper.vm.state.email = 'test@example.com'
  wrapper.vm.state.personNumber = '19900101-1234'
  wrapper.vm.state.upgradeCode = 'CODE'
  wrapper.vm.state.username = 'user'
  wrapper.vm.state.password = 'password123'

  await wrapper.vm.handleUpgrade()

  expect(wrapper.vm.error).toBe('Backend says no')
  expect(wrapper.vm.loading).toBe(false)
})

it('falls back to upgradeFailed when backend key missing', async () => {
  vi.mocked(formatPersonNumber).mockReturnValueOnce('19900101-1234')
  mockUpgradeStore.upgrade.mockRejectedValueOnce(new Error('network'))

  const wrapper = mountBox({
    upgradeFailed: 'Upgrade failed',
  })

  wrapper.vm.formRef = { validate: vi.fn().mockResolvedValue({ valid: true }) }
  wrapper.vm.state.email = 'test@example.com'
  wrapper.vm.state.personNumber = '19900101-1234'
  wrapper.vm.state.upgradeCode = 'CODE'
  wrapper.vm.state.username = 'user'
  wrapper.vm.state.password = 'password123'

  await wrapper.vm.handleUpgrade()

  expect(wrapper.vm.error).toBe('Upgrade failed')
  expect(wrapper.vm.loading).toBe(false)
})

it('formats personNumber when update:modelValue fires', async () => {
  vi.mocked(formatPersonNumber).mockReturnValueOnce('19900101-1234')

  const wrapper = mountBox()
  const inputs = wrapper.findAll('input.v-input')


  await inputs[1].setValue('199001011234')

  expect(wrapper.vm.state.personNumber).toBe('19900101-1234')
})
})
