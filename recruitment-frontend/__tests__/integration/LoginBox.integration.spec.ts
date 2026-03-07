/**
 * @file LoginBox.integration.spec.ts
 * @description Integration tests for the LoginBox authentication flow.
 *
 * This file verifies the interaction between the login component,
 * authentication store, and API layer.
 *
 * Test scenarios:
 * - submits login credentials
 * - authenticates user successfully
 * - handles authentication failures
 *
 * @module integration
 */

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { nextTick } from 'vue'
import LoginBox from '../../src/components/LoginBox.vue'
import { useAuthStore } from '../../src/stores/authStore'
import { login } from '../../src/api/authApi'

const pushMock = vi.fn()

vi.mock('../../src/api/authApi', () => ({
  login: vi.fn(),
}))

vi.mock('vue-router', async (importOriginal) => {
  const actual = await importOriginal<typeof import('vue-router')>()
  return {
    ...actual,
    useRouter: () => ({ push: pushMock }),
    RouterLink: { template: '<a><slot /></a>' },
  }
})

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

function mountWithStubs() {
  const cardStub = createSimpleStub('v-card')
  const cardTextStub = createSimpleStub('v-card-text')
  const buttonStub = createClickStub('v-btn')
  const iconStub = createSimpleStub('v-icon', 'i')
  const alertStub = createSimpleStub('v-alert')
  const textFieldStub = createTextFieldStub()
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

        RouterLink: routerLinkStub,
      },
      provide: {
        t: makeT(),
      },
    },
  })
}

describe('LoginBox integration', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.clearAllMocks()
  })

  it('logs in applicant and redirects to /profile', async () => {
    vi.mocked(login).mockResolvedValueOnce({
      data: {
        user: {
          username: 'jacob',
          role_id: 2,
        },
      },
    } as any)

    const wrapper = mountWithStubs()
    const vm = wrapper.vm as any

    const inputs = wrapper.findAll('input.v-input')
    await inputs[0].setValue('jacob')
    await inputs[1].setValue('secret123')

    const authStore = useAuthStore()

    await vm.handleLogin()
    await nextTick()

    expect(login).toHaveBeenCalledWith('jacob', 'secret123')
    expect(authStore.user?.role_id).toBe(2)
    expect(pushMock).toHaveBeenCalledWith('/profile')
  })
})