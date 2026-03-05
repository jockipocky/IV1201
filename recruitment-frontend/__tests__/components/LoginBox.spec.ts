/**
 * @file LoginBox.spec.ts
 * @description Unit tests for the LoginBox Vue component.
 *
 * This file tests the login form UI and interaction behavior.
 * Auth store/actions may be mocked to avoid real API calls.
 *
 * Test scenarios:
 * - renders login form fields/buttons
 * - triggers login action on submit
 * - shows error state when login fails
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

const vuetifyStubs = {
  VCard: { template: '<div><slot /></div>' },
  VCardText: { template: '<div><slot /></div>' },

  VBtn: { template: '<button class="v-btn" @click="$emit(`click`)"><slot /></button>' },
  VIcon: { template: '<i><slot /></i>' },
  VAlert: { template: '<div><slot /></div>' },


  VTextField: {
    template: `
      <div class="v-text-field">
        <input class="v-input" />
        <button class="append" @click="$emit('click:append-inner')">append</button>
      </div>
    `,
  },

  VSelect: { template: '<select />' },
  VDatePicker: { template: '<div />' },
}


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
  RouterLink: { template: '<a><slot></slot></a>' },
}))

describe('LoginBox', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.clearAllMocks()
    mockAuthStore.user = null
  })

const mountLoginBox = () =>
  mount(LoginBox, {
    global: {
      stubs: {
        ...vuetifyStubs,
        RouterLink: { template: '<a><slot /></a>' },
      },
      provide: { t: makeT() },
    },
  })

  it('renders login form elements', () => {
    const wrapper = mountLoginBox()
    expect(wrapper.find('input.v-input').exists()).toBe(true)
  })

  it('has username and password fields', () => {
    const wrapper = mountLoginBox()
    expect(wrapper.findAll('input.v-input')).toHaveLength(2)
  })

  it('has login button', () => {
    const wrapper = mountLoginBox()

    const buttons = wrapper.findAll('button.v-btn')
    const loginBtn = buttons.find(b => b.text().includes('Login'))

    expect(loginBtn, 'Could not find a button containing "Login"').toBeTruthy()
  })

it('has upgrade account link', () => {
  const wrapper = mountLoginBox()
  expect(wrapper.findAll('a').length).toBeGreaterThanOrEqual(1)
})

it('has signup link', () => {
  const wrapper = mountLoginBox()
  expect(wrapper.findAll('a')).toHaveLength(2)
})

  it('toggles password visibility', async () => {
    const wrapper = mountLoginBox()


    expect(wrapper.vm.visible).toBe(false)


    const fields = wrapper.findAll('.v-text-field')
    await fields[1].find('button.append').trigger('click')

    expect(wrapper.vm.visible).toBe(true)
  })
  it('calls authStore.login with username and password', async () => {
  const wrapper = mountLoginBox()


  wrapper.vm.username = 'jacob'
  wrapper.vm.password = 'secret123'

  mockAuthStore.login.mockResolvedValueOnce(undefined)
  mockAuthStore.user = { role_id: 2 }

  await wrapper.vm.handleLogin()

  expect(mockAuthStore.login).toHaveBeenCalledWith('jacob', 'secret123')
})

it('redirects recruiter (role_id=1) to /recruiter', async () => {
  const wrapper = mountLoginBox()

  mockAuthStore.login.mockResolvedValueOnce(undefined)
  mockAuthStore.user = { role_id: 1 }

  await wrapper.vm.handleLogin()

  expect(pushMock).toHaveBeenCalledWith('/recruiter')
})

it('redirects applicant (role_id=2) to /profile', async () => {
  const wrapper = mountLoginBox()

  mockAuthStore.login.mockResolvedValueOnce(undefined)
  mockAuthStore.user = { role_id: 2 }

  await wrapper.vm.handleLogin()

  expect(pushMock).toHaveBeenCalledWith('/profile')
})

it('shows error when login resolves but user is null', async () => {
  const wrapper = mountLoginBox()

  mockAuthStore.login.mockResolvedValueOnce(undefined)
  mockAuthStore.user = null

  await wrapper.vm.handleLogin()

  expect(wrapper.vm.error).toBe('Invalid login')
  expect(wrapper.text()).toContain('Invalid login')
})

it('shows error when user has unknown role', async () => {
  const wrapper = mountLoginBox()

  mockAuthStore.login.mockResolvedValueOnce(undefined)
  mockAuthStore.user = { role_id: 999 }

  await wrapper.vm.handleLogin()

  expect(wrapper.vm.error).toBe('Invalid login')
  expect(pushMock).not.toHaveBeenCalled()
})

it('shows error when authStore.login throws', async () => {
  const wrapper = mountLoginBox()

  mockAuthStore.login.mockRejectedValueOnce(new Error('boom'))
  mockAuthStore.user = null

  await wrapper.vm.handleLogin()

  expect(wrapper.vm.error).toBe('Invalid login')
})
})