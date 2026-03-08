/**
 * @file app.spec.ts
 * @description Unit tests for the main application setup.
 *
 * This file verifies that the root application component initializes
 * correctly and that core dependencies such as router, stores, and
 * global configuration are properly loaded.
 *
 * Test scenarios:
 * - application mounts successfully
 * - router is initialized correctly
 * - global providers are registered
 * - application renders root layout
 *
 * @module app
 */

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import App from '@/App.vue'

vi.mock('@/components/Footer.vue', () => ({
  default: { template: '<footer />' }
}))

vi.mock('@/components/Header.vue', () => ({
  default: { template: '<header />' }
}))

const mockAuthStore = {
  fetchUser: vi.fn(),
  isLoggedIn: false,
  user: null as any,
}

vi.mock('@/stores/authStore', () => ({
  useAuthStore: () => mockAuthStore,
}))

const replaceMock = vi.fn()
const currentRoute = { value: { meta: { guestOnly: true } } }

vi.mock('vue-router', () => ({
  useRouter: () => ({
    replace: replaceMock,
    currentRoute,
  }),
}))

const localStubs = {
  'router-view': { template: '<div class="router-view"></div>' },
  RouterView: { template: '<div class="router-view"></div>' },
}

const mountApp = () =>
  mount(App, {
    global: {
      stubs: localStubs,
    },
  })

describe('App.vue', () => {
  beforeEach(() => {
    vi.clearAllMocks()

    mockAuthStore.fetchUser.mockResolvedValue(undefined)
    mockAuthStore.isLoggedIn = false
    mockAuthStore.user = null

    currentRoute.value.meta.guestOnly = true
  })

  it('has #app root container', () => {
    const wrapper = mountApp()
    expect(wrapper.find('#app').exists()).toBe(true)
  })

  it('renders Header component', () => {
    const wrapper = mountApp()
    expect(wrapper.find('header').exists()).toBe(true)
  })

  it('renders Footer component', () => {
    const wrapper = mountApp()
    expect(wrapper.find('footer').exists()).toBe(true)
  })

  it('has main content area', () => {
    const wrapper = mountApp()
    expect(wrapper.find('main').exists()).toBe(true)
  })

  it('has router-view for routing', () => {
    const wrapper = mountApp()
    expect(wrapper.find('.router-view').exists()).toBe(true)
  })

  it('redirects recruiter (role_id=1) from guestOnly page to /recruiter', async () => {
    mockAuthStore.isLoggedIn = true
    mockAuthStore.user = { role_id: 1 }

    mountApp()
    await flushPromises()

    expect(mockAuthStore.fetchUser).toHaveBeenCalled()
    expect(replaceMock).toHaveBeenCalledWith('/recruiter')
  })

  it('redirects applicant (role_id=2) from guestOnly page to /profile', async () => {
    mockAuthStore.isLoggedIn = true
    mockAuthStore.user = { role_id: 2 }

    mountApp()
    await flushPromises()

    expect(mockAuthStore.fetchUser).toHaveBeenCalled()
    expect(replaceMock).toHaveBeenCalledWith('/profile')
  })

  it('does not redirect if not on a guestOnly page', async () => {
    mockAuthStore.isLoggedIn = true
    mockAuthStore.user = { role_id: 2 }
    currentRoute.value.meta.guestOnly = false

    mountApp()
    await flushPromises()

    expect(replaceMock).not.toHaveBeenCalled()
  })
})