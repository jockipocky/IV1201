/**
 * @file App.spec.ts
 * @description Unit tests for the root App Vue component.
 *
 * This file tests:
 * - basic rendering/layout (header/footer/main/router-view)
 * - onMounted redirect behavior on guestOnly routes based on user role
 *
 * Dependencies mocked:
 * - auth store (useAuthStore)
 * - vue-router (useRouter + currentRoute meta)
 * - Header/Footer components
 *
 * Test scenarios:
 * - renders #app root container
 * - renders Header and Footer
 * - renders main content area
 * - provides a RouterView outlet
 * - redirects recruiter (role_id=1) from guestOnly route to /recruiter
 * - redirects applicant (role_id=2) from guestOnly route to /profile
 * - does not redirect when route is not guestOnly
 */

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import App from '@/App.vue'


vi.mock('@/components/Footer.vue', () => ({ default: { template: '<footer />' } }))
vi.mock('@/components/Header.vue', () => ({ default: { template: '<header />' } }))


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

describe('App.vue', () => {
  beforeEach(() => {
    vi.clearAllMocks()


    mockAuthStore.fetchUser.mockResolvedValue(undefined)
    mockAuthStore.isLoggedIn = false
    mockAuthStore.user = null


    currentRoute.value.meta.guestOnly = true
  })


  it('has #app root container', () => {
    const wrapper = mount(App)
    expect(wrapper.find('#app').exists()).toBe(true)
  })

  it('renders Header component', () => {
    const wrapper = mount(App)
    expect(wrapper.find('header').exists()).toBe(true)
  })

  it('renders Footer component', () => {
    const wrapper = mount(App)
    expect(wrapper.find('footer').exists()).toBe(true)
  })

  it('has main content area', () => {
    const wrapper = mount(App)
    expect(wrapper.find('main').exists()).toBe(true)
  })

  it('has router-view for routing', () => {
    const wrapper = mount(App, {
      global: {
        stubs: {
          RouterView: { template: '<div data-test="router-view" />' },
        },
      },
    })
    expect(wrapper.find('[data-test="router-view"]').exists()).toBe(true)
  })


  it('redirects recruiter (role_id=1) from guestOnly page to /recruiter', async () => {
    mockAuthStore.isLoggedIn = true
    mockAuthStore.user = { role_id: 1 }

    mount(App)
    await flushPromises()

    expect(mockAuthStore.fetchUser).toHaveBeenCalled()
    expect(replaceMock).toHaveBeenCalledWith('/recruiter')
  })

  it('redirects applicant (role_id=2) from guestOnly page to /profile', async () => {
    mockAuthStore.isLoggedIn = true
    mockAuthStore.user = { role_id: 2 }

    mount(App)
    await flushPromises()

    expect(mockAuthStore.fetchUser).toHaveBeenCalled()
    expect(replaceMock).toHaveBeenCalledWith('/profile')
  })

  it('does not redirect if not on a guestOnly page', async () => {
    mockAuthStore.isLoggedIn = true
    mockAuthStore.user = { role_id: 2 }
    currentRoute.value.meta.guestOnly = false

    mount(App)
    await flushPromises()

    expect(replaceMock).not.toHaveBeenCalled()
  })
})