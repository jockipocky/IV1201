/**
 * @file ProfileView.spec.ts
 * @description Unit tests for the ProfileView view component.
 *
 * This file tests conditional rendering based on profile/application state.
 * Stores and child components are mocked.
 *
 * Test scenarios:
 * - fetches user info on mount
 * - fetches application when person_id exists
 * - shows ApplicationBox when no application exists
 * - shows ProfileApplicationBox when application exists
 * - handles loading state
 */

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import ProfileView from '../../src/views/ProfileView.vue'

const mockApplicationStore = {
  fetchUserInfo: vi.fn(),
  fetchApplication: vi.fn(),
  hasApplication: false,
  isLoading: false,
  personalInfo: { person_id: '' }
}

vi.mock('@/components/ApplicationBox.vue', () => ({
  default: { template: '<div class="application-box">ApplicationBox</div>' }
}))

vi.mock('@/components/ApplicationInfo.vue', () => ({
  default: { template: '<div class="application-info">ApplicationInfo</div>' }
}))

vi.mock('@/components/ProfileApplicationBox.vue', () => ({
  default: { template: '<div class="profile-application-box">ProfileApplicationBox</div>' }
}))

vi.mock('@/stores/applicationStore', () => ({
  useApplicationStore: () => mockApplicationStore
}))

describe('ProfileView', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.clearAllMocks()
    mockApplicationStore.hasApplication = false
    mockApplicationStore.isLoading = false
    mockApplicationStore.personalInfo = { person_id: '' }
  })

  it('renders ApplicationInfo component', () => {
    const wrapper = mount(ProfileView)
    expect(wrapper.find('.application-info').exists()).toBe(true)
  })

  it('renders ApplicationBox when no application exists', () => {
    mockApplicationStore.hasApplication = false
    const wrapper = mount(ProfileView)
    expect(wrapper.find('.application-box').exists()).toBe(true)
  })

  it('renders ProfileApplicationBox when application exists', () => {
    mockApplicationStore.hasApplication = true
    const wrapper = mount(ProfileView)
    expect(wrapper.find('.profile-application-box').exists()).toBe(true)
  })

  it('has v-container elements', () => {
    const wrapper = mount(ProfileView)
    expect(wrapper.findAll('v-container').length).toBe(2)
  })

  it('fetches user info on mount', async () => {
    const wrapper = mount(ProfileView)
    await wrapper.vm.$nextTick()
    expect(mockApplicationStore.fetchUserInfo).toHaveBeenCalled()
  })

  it('fetches application when user has person_id', async () => {
    mockApplicationStore.personalInfo = { person_id: '123' }
    const wrapper = mount(ProfileView)
    await wrapper.vm.$nextTick()
    expect(mockApplicationStore.fetchApplication).toHaveBeenCalled()
  })

  it('hides form when loading', () => {
    mockApplicationStore.isLoading = true
    const wrapper = mount(ProfileView)
    expect(wrapper.find('.application-box').exists()).toBe(false)
    expect(wrapper.find('.profile-application-box').exists()).toBe(false)
  })
})
