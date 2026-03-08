/**
 * @file Header.spec.ts
 * @description Unit tests for the Header component.
 *
 * This file tests the navigation header used across the application.
 *
 * Test scenarios:
 * - renders navigation links
 * - displays correct title or logo
 * - responds to navigation actions
 *
 * @module components
 */
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { ref } from 'vue'
import Header from '../../src/components/Header.vue'

const mockAuthStore = {
  user: null,
  isLoggedIn: false,
  logout: vi.fn()
}

const mountHeader = (lang: 'en' | 'sv' = 'en') => {
  const setLanguage = vi.fn()

  const wrapper = mount(Header, {
    global: {
      provide: {
        t: ref({ logoutButtonLabel: 'Logout' }),  
        currentLanguage: ref(lang),               
        setLanguage,
      },
    },
  })

  return { wrapper, setLanguage }
}

vi.mock('@/stores/authStore', () => ({
  useAuthStore: vi.fn(() => mockAuthStore)
}))

describe('Header Component', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.clearAllMocks()
    mockAuthStore.user = null
    mockAuthStore.isLoggedIn = false
  })

  describe('language toggle', () => {
    it('toggles language from en to sv', async () => {
      const { wrapper, setLanguage } = mountHeader('en')
      await wrapper.find('.lang-btn').trigger('click')
      expect(setLanguage).toHaveBeenCalledWith('sv')
    })

    it('toggles language from sv to en', async () => {
      const { wrapper, setLanguage } = mountHeader('sv')
      await wrapper.find('.lang-btn').trigger('click')
      expect(setLanguage).toHaveBeenCalledWith('en')
    })
  })

  describe('user display', () => {
    it('shows username when user is logged in', () => {
      mockAuthStore.user = { username: 'testuser' }
      mockAuthStore.isLoggedIn = true

      const { wrapper } = mountHeader('en')

      expect(wrapper.find('.user-name').exists()).toBe(true)
      expect(wrapper.text()).toContain('testuser')
    })

    it('hides username when user is not logged in', () => {
      const { wrapper } = mountHeader('en')

      expect(wrapper.find('.user-name').exists()).toBe(false)
    })

    it('calls logout when logout button clicked', async () => {
      mockAuthStore.user = { username: 'testuser' }
      mockAuthStore.isLoggedIn = true

      const { wrapper } = mountHeader('en')

      await wrapper.find('.logout-btn').trigger('click')
      expect(mockAuthStore.logout).toHaveBeenCalled()
    })
  })

  it('renders the title', () => {
    const { wrapper } = mountHeader('en')
    expect(wrapper.find('.title').text()).toBe('Recruit Boyz')
  })
})