/**
 * @file LoginBox.spec.ts
 * @description Unit tests for the LoginBox component.
 *
 * This file tests the login form component responsible for handling
 * user authentication input.
 *
 * Test scenarios:
 * - renders login form fields
 * - validates user input
 * - submits login credentials
 * - handles login errors
 *
 * @module components
 */

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import LoginBox from '../../src/components/LoginBox.vue'

const makeT = () => ({
  loginBoxTitle: 'Welcome',
  usernameLabel: 'Username',
  passwordFieldPlaceholder: 'Password',
  loginButtonLabel: 'Login',
  upgradeAccountLink: 'Upgrade',
  signUpNowLink: 'Sign up',
  value: {
    loginError: 'Invalid login',
  },
})

const mockAuthStore = {
  login: vi.fn(),
  user: null as null | { role_id: number },
}

const pushMock = vi.fn()

vi.mock('@/stores/authStore', () => ({
  useAuthStore: vi.fn(() => mockAuthStore),
}))

vi.mock('vue-router', () => ({
  useRouter: vi.fn(() => ({ push: pushMock })),
  RouterLink: { template: '<a><slot /></a>' },
}))

function createSimpleStub(className: string, tag = 'div') {
  return {
    template: `<${tag} class="${className}"><slot /></${tag}>`,
  }
}

function createClickStub(className: string, tag = 'button') {
  return {
    template: `
      <${tag} class="${className}" @click="$emit('click')">
        <slot />
      </${tag}>
    `,
  }
}

function createTextFieldStub() {
  return {
    template: `
      <div class="v-text-field">
        <input class="v-input" />
        <button type="button" class="append" @click="$emit('click:append-inner')">append</button>
      </div>
    `,
  }
}

function mountWithStubs() {
  const cardStub = createSimpleStub('v-card')
  const cardTextStub = createSimpleStub('v-card-text')
  const buttonStub = createClickStub('v-btn')
  const iconStub = createSimpleStub('v-icon', 'i')
  const alertStub = createSimpleStub('v-alert')
  const textFieldStub = createTextFieldStub()
  const selectStub = createSimpleStub('v-select', 'select')
  const datePickerStub = createSimpleStub('v-date-picker')
  const routerLinkStub = {
    template: '<a><slot /></a>',
  }

  return mount(LoginBox, {
    global: {
      stubs: {
        'v-card': cardStub,
        VCard: cardStub,

        'v-card-text': cardTextStub,
        VCardText: cardTextStub,

        'v-btn': buttonStub,
        VBtn: buttonStub,

        'v-icon': iconStub,
        VIcon: iconStub,

        'v-alert': alertStub,
        VAlert: alertStub,

        'v-text-field': textFieldStub,
        VTextField: textFieldStub,

        'v-select': selectStub,
        VSelect: selectStub,

        'v-date-picker': datePickerStub,
        VDatePicker: datePickerStub,

        RouterLink: routerLinkStub,
      },
      provide: {
        t: makeT(),
      },
    },
  })
}

describe('LoginBox', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.clearAllMocks()
    mockAuthStore.user = null
  })

  it('renders login form controls and links', () => {
    const wrapper = mountWithStubs()

    expect(wrapper.findAll('input.v-input')).toHaveLength(2)

    const buttons = wrapper.findAll('button.v-btn')
    const loginBtn = buttons.find(b => b.text().includes('Login'))
    expect(loginBtn).toBeTruthy()

    expect(wrapper.findAll('a')).toHaveLength(2)
  })

  it('toggles password visibility', async () => {
    const wrapper = mountWithStubs()

    expect((wrapper.vm as any).visible).toBe(false)

    const fields = wrapper.findAll('.v-text-field')
    await fields[1].find('button.append').trigger('click')

    expect((wrapper.vm as any).visible).toBe(true)
  })

  it('calls authStore.login with username and password', async () => {
    const wrapper = mountWithStubs()

    ;(wrapper.vm as any).username = 'jacob'
    ;(wrapper.vm as any).password = 'secret123'

    mockAuthStore.login.mockResolvedValueOnce(undefined)
    mockAuthStore.user = { role_id: 2 }

    await (wrapper.vm as any).handleLogin()

    expect(mockAuthStore.login).toHaveBeenCalledWith('jacob', 'secret123')
  })

  it('redirects recruiter (role_id=1) to /recruiter', async () => {
    const wrapper = mountWithStubs()

    mockAuthStore.login.mockResolvedValueOnce(undefined)
    mockAuthStore.user = { role_id: 1 }

    await (wrapper.vm as any).handleLogin()

    expect(pushMock).toHaveBeenCalledWith('/recruiter')
  })

  it('redirects applicant (role_id=2) to /profile', async () => {
    const wrapper = mountWithStubs()

    mockAuthStore.login.mockResolvedValueOnce(undefined)
    mockAuthStore.user = { role_id: 2 }

    await (wrapper.vm as any).handleLogin()

    expect(pushMock).toHaveBeenCalledWith('/profile')
  })

  it('shows error when login resolves but user is null', async () => {
    const wrapper = mountWithStubs()

    mockAuthStore.login.mockResolvedValueOnce(undefined)
    mockAuthStore.user = null

    await (wrapper.vm as any).handleLogin()

    expect((wrapper.vm as any).error).toBe('Invalid login')
    expect(wrapper.text()).toContain('Invalid login')
  })

  it('shows error when user has unknown role', async () => {
    const wrapper = mountWithStubs()

    mockAuthStore.login.mockResolvedValueOnce(undefined)
    mockAuthStore.user = { role_id: 999 }

    await (wrapper.vm as any).handleLogin()

    expect((wrapper.vm as any).error).toBe('Invalid login')
    expect(pushMock).not.toHaveBeenCalled()
  })

  it('shows error when authStore.login throws', async () => {
    const wrapper = mountWithStubs()

    mockAuthStore.login.mockRejectedValueOnce(new Error('boom'))
    mockAuthStore.user = null

    await (wrapper.vm as any).handleLogin()

    expect((wrapper.vm as any).error).toBe('Invalid login')
  })
})