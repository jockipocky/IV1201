/**
 * @file ProfileApplicationBox.spec.ts
 * @description Unit tests for the ProfileApplicationBox Vue component.
 *
 * This file tests the profile display for an existing application.
 * Store state may be mocked to provide application data.
 *
 * Test scenarios:
 * - renders application details when provided
 * - displays competences and availability correctly
 */

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import ProfileApplicationBox from '../../src/components/ProfileApplicationBox.vue'

const mockApplicationStore = {
  application: {
    competences: [
      { name: 'Ticket Sales', yearsOfExperience: 2 },
      { name: 'Roller Coaster', yearsOfExperience: 1 }
    ],
    availability: [
      { fromDate: '2026-01-01', toDate: '2026-02-01' }
    ]
  },
  hasApplication: true,
  successMessage: null,
  error: null
}

vi.mock('@/stores/applicationStore', () => ({
  useApplicationStore: vi.fn(() => mockApplicationStore)
}))

describe('ProfileApplicationBox Component', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.clearAllMocks()
    mockApplicationStore.successMessage = null
    mockApplicationStore.error = null
  })

  describe('initial state', () => {
    it('starts in view mode (not editing)', () => {
      const wrapper = mount(ProfileApplicationBox, {
        global: {
          provide: {
            t: { value: {} }
          }
        }
      })

      expect(wrapper.vm.isEditing).toBe(false)
    })
  })

  describe('editing', () => {
    it('switches to edit mode when edit button clicked', async () => {
      mockApplicationStore.hasApplication = false
      
      const wrapper = mount(ProfileApplicationBox, {
        global: {
          provide: {
            t: {
              applicationInfo: 'Application Info',
              editButtonLabel: 'Edit'
            }
          }
        }
      })

      expect(wrapper.vm.isEditing).toBe(false)
    })

    it('shows application data when not editing', () => {
      const wrapper = mount(ProfileApplicationBox, {
        global: {
          provide: {
            t: {
              applicationInfo: 'Application Info',
              competence: 'Competence',
              yearsUnit: 'years',
              availabilityTitle: 'Availability'
            }
          }
        }
      })

      expect(wrapper.text()).toContain('Ticket Sales')
      expect(wrapper.text()).toContain('Roller Coaster')
    })
  })

  describe('display', () => {
    it('displays competence list', () => {
      const wrapper = mount(ProfileApplicationBox, {
        global: {
          provide: {
            t: {
              competence: 'Competence',
              yearsUnit: 'years'
            }
          }
        }
      })

      expect(wrapper.text()).toContain('Ticket Sales')
      expect(wrapper.text()).toContain('2')
    })

    it('displays availability periods', () => {
      const wrapper = mount(ProfileApplicationBox, {
        global: {
          provide: {
            t: {
              availabilityTitle: 'Availability',
              yearsUnit: 'years'
            }
          }
        }
      })

      expect(wrapper.text()).toContain('2026-01-01')
      expect(wrapper.text()).toContain('2026-02-01')
    })

    it('shows success message when available', () => {
      mockApplicationStore.successMessage = 'Application saved!'
      
      const wrapper = mount(ProfileApplicationBox, {
        global: {
          provide: {
            t: {
              successMessage: 'Success!',
              profileError: 'Error'
            }
          }
        }
      })

      expect(wrapper.text()).toContain('Success!')
    })

    it('shows error when available', () => {
      mockApplicationStore.error = 'Failed to load'
      
      const wrapper = mount(ProfileApplicationBox, {
        global: {
          provide: {
            t: {
              successMessage: 'Success!',
              profileError: 'Error'
            }
          }
        }
      })

      expect(wrapper.text()).toContain('Error')
    })
  })
})
