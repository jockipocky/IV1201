/**
 * @file UpgradeAccountBox.spec.ts
 * @description Unit tests for the UpgradeAccountBox component.
 *
 * This file tests the component responsible for upgrading a user's
 * account permissions or role.
 *
 * Test scenarios:
 * - renders upgrade account form
 * - validates upgrade input
 * - submits upgrade request
 * - handles upgrade errors
 *
 * @module components
 */

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import UpgradeAccountBox from '../../src/components/UpgradeAccountBox.vue'
import { formatPersonNumber } from '@/utility/personNumber'

const mockUpgradeStore = {
  upgrade: vi.fn(),
}

vi.mock('@/stores/upgradeStore', () => ({
  useUpgradeStore: vi.fn(() => mockUpgradeStore),
}))

const pushMock = vi.fn()

vi.mock('vue-router', () => ({
  useRouter: () => ({ push: pushMock }),
}))

vi.mock('@/utility/personNumber', () => ({
  formatPersonNumber: vi.fn(),
  isValidPersonNumberFormatted: vi.fn(),
}))

function createSimpleStub(className: string, tag = 'div') {
  return {
    template: `<${tag} class="${className}"><slot /></${tag}>`,
  }
}

function createFormStub() {
  return {
    template: '<form class="v-form" @submit.prevent="$emit(`submit`)"><slot /></form>',
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
  const formStub = createFormStub()
  const buttonStub = createClickStub('v-btn')
  const alertStub = createSimpleStub('v-alert')
  const textFieldStub = createTextFieldStub()

  return mount(UpgradeAccountBox, {
    global: {
      stubs: {
        'v-card': cardStub,
        VCard: cardStub,

        'v-form': formStub,
        VForm: formStub,

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

describe('UpgradeAccountBox', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.clearAllMocks()
  })

  it('goToLogin navigates to /login', () => {
    const wrapper = mountWithStubs()
    const vm = wrapper.vm as any

    vm.goToLogin()

    expect(pushMock).toHaveBeenCalledWith('/login')
  })

  it('handleUpgrade returns early when form is invalid', async () => {
    const wrapper = mountWithStubs()
    const vm = wrapper.vm as any

    vm.formRef = { validate: vi.fn().mockResolvedValue({ valid: false }) }

    await vm.handleUpgrade()

    expect(mockUpgradeStore.upgrade).not.toHaveBeenCalled()
    expect(vm.loading).toBe(false)
  })

  it('sets invalidPersonalNumberFormat when formatting fails in handleUpgrade', async () => {
    vi.mocked(formatPersonNumber).mockReturnValueOnce(null as any)

    const wrapper = mountWithStubs({
      invalidPersonalNumberFormat: 'Invalid format',
    })
    const vm = wrapper.vm as any

    vm.formRef = { validate: vi.fn().mockResolvedValue({ valid: true }) }
    vm.state.personNumber = '199001011234'

    await vm.handleUpgrade()

    expect(vm.error).toBe('Invalid format')
    expect(mockUpgradeStore.upgrade).not.toHaveBeenCalled()
    expect(vm.loading).toBe(false)
  })

  it('calls upgrade store and sets success on valid submission', async () => {
    vi.mocked(formatPersonNumber).mockReturnValueOnce('19900101-1234')
    mockUpgradeStore.upgrade.mockResolvedValueOnce(true)

    const wrapper = mountWithStubs({
      upgradeSuccess: 'Upgrade successful!',
    })
    const vm = wrapper.vm as any

    vm.formRef = { validate: vi.fn().mockResolvedValue({ valid: true }) }
    vm.state.email = ' test@example.com '
    vm.state.personNumber = '19900101-1234'
    vm.state.upgradeCode = ' CODE '
    vm.state.username = ' user '
    vm.state.password = 'password123'

    await vm.handleUpgrade()

    expect(mockUpgradeStore.upgrade).toHaveBeenCalledWith(
      'test@example.com',
      '19900101-1234',
      'CODE',
      'user',
      'password123',
    )
    expect(vm.success).toBe('Upgrade successful!')
    expect(vm.loading).toBe(false)
  })

  it('uses backend messageKey on failure when provided', async () => {
    vi.mocked(formatPersonNumber).mockReturnValueOnce('19900101-1234')
    mockUpgradeStore.upgrade.mockRejectedValueOnce({
      response: { data: { error: { messageKey: 'someBackendKey' } } },
    })

    const wrapper = mountWithStubs({
      someBackendKey: 'Backend says no',
    })
    const vm = wrapper.vm as any

    vm.formRef = { validate: vi.fn().mockResolvedValue({ valid: true }) }
    vm.state.email = 'test@example.com'
    vm.state.personNumber = '19900101-1234'
    vm.state.upgradeCode = 'CODE'
    vm.state.username = 'user'
    vm.state.password = 'password123'

    await vm.handleUpgrade()

    expect(vm.error).toBe('Backend says no')
    expect(vm.loading).toBe(false)
  })

  it('falls back to upgradeFailed when backend key is missing', async () => {
    vi.mocked(formatPersonNumber).mockReturnValueOnce('19900101-1234')
    mockUpgradeStore.upgrade.mockRejectedValueOnce(new Error('network'))

    const wrapper = mountWithStubs({
      upgradeFailed: 'Upgrade failed',
    })
    const vm = wrapper.vm as any

    vm.formRef = { validate: vi.fn().mockResolvedValue({ valid: true }) }
    vm.state.email = 'test@example.com'
    vm.state.personNumber = '19900101-1234'
    vm.state.upgradeCode = 'CODE'
    vm.state.username = 'user'
    vm.state.password = 'password123'

    await vm.handleUpgrade()

    expect(vm.error).toBe('Upgrade failed')
    expect(vm.loading).toBe(false)
  })

  it('formats personNumber when update:modelValue fires', async () => {
    vi.mocked(formatPersonNumber).mockReturnValueOnce('19900101-1234')

    const wrapper = mountWithStubs()
    const vm = wrapper.vm as any
    const inputs = wrapper.findAll('input.v-input')

    await inputs[1].setValue('199001011234')

    expect(vm.state.personNumber).toBe('19900101-1234')
  })
})