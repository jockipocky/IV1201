/**
 * @file ProfileView.spec.ts
 * @description Unit tests for the ProfileView page.
 *
 * This file tests the user profile page where account details
 * and applications are displayed.
 *
 * Test scenarios:
 * - renders user profile information
 * - displays user applications
 * - handles empty profile state
 *
 * @module views
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import ProfileView from '../../src/views/ProfileView.vue'

let consoleSpy: any

const mockApplicationStore = {
  fetchUserInfo: vi.fn(),
  fetchApplication: vi.fn(),
  hasApplication: false,
  isLoading: false,
  isEditingApplication: false,
  successMessage: null,
  error: null,
  personalInfo: { person_id: '' },
}

const tMock = {
  'User not logged in': 'User not logged in',
  genericError: 'An error occurred',
}

vi.mock('@/components/ApplicationBox.vue', () => ({
  default: { template: '<div class="application-box">ApplicationBox</div>' },
}))

vi.mock('@/components/ApplicationInfo.vue', () => ({
  default: { template: '<div class="application-info">ApplicationInfo</div>' },
}))

vi.mock('@/components/ProfileApplicationBox.vue', () => ({
  default: { template: '<div class="profile-application-box">ProfileApplicationBox</div>' },
}))

vi.mock('@/stores/profileStore', () => ({
  useApplicationStore: () => mockApplicationStore,
}))

function createSimpleStub(className: string, tag = 'div') {
  return {
    template: `<${tag} class="${className}"><slot /></${tag}>`,
  }
}

function mountWithStubs() {
  const containerStub = createSimpleStub('v-container')
  const rowStub = createSimpleStub('v-row')
  const colStub = createSimpleStub('v-col')

  return mount(ProfileView, {
    global: {
      stubs: {
        'v-container': containerStub,
        VContainer: containerStub,

        'v-row': rowStub,
        VRow: rowStub,

        'v-col': colStub,
        VCol: colStub,
      },
      provide: {
        t: tMock,
      },
    },
  })
}

describe('ProfileView', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.clearAllMocks()
    consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})
    mockApplicationStore.hasApplication = false
    mockApplicationStore.isLoading = false
    mockApplicationStore.isEditingApplication = false
    mockApplicationStore.personalInfo = { person_id: '' }
  })
  afterEach(() => {
    consoleSpy.mockRestore()
  })
  it('renders ApplicationInfo component', () => {
    const wrapper = mountWithStubs()
    expect(wrapper.find('.application-info').exists()).toBe(true)
  })

  it('renders ApplicationBox when editing and not loading', () => {
    mockApplicationStore.hasApplication = false
    mockApplicationStore.isLoading = false
    mockApplicationStore.isEditingApplication = true

    const wrapper = mountWithStubs()

    expect(wrapper.find('.application-box').exists()).toBe(true)
  })

  it('renders ProfileApplicationBox when application exists', () => {
    mockApplicationStore.hasApplication = true
    mockApplicationStore.isLoading = false
    mockApplicationStore.isEditingApplication = false

    const wrapper = mountWithStubs()

    expect(wrapper.find('.profile-application-box').exists()).toBe(true)
  })

  it('fetches user info on mount', async () => {
    const wrapper = mountWithStubs()
    await wrapper.vm.$nextTick()
    expect(mockApplicationStore.fetchUserInfo).toHaveBeenCalled()
  })

  it('fetches application when user has person_id', async () => {
    mockApplicationStore.personalInfo = { person_id: '123' }

    const wrapper = mountWithStubs()
    await wrapper.vm.$nextTick()

    expect(mockApplicationStore.fetchApplication).toHaveBeenCalled()
  })

  it('hides form when loading', async () => {
    mockApplicationStore.isLoading = true
    mockApplicationStore.isEditingApplication = true

    const wrapper = mountWithStubs()
    await wrapper.vm.$nextTick()

    expect(wrapper.find('.application-box').exists()).toBe(false)
    expect(wrapper.find('.profile-application-box').exists()).toBe(false)
  })
})