/**
 * @file ApplicantView.spec.ts
 * @description Unit tests for the ApplicantView view component.
 *
 * This file tests view composition and basic rendering for applicant-facing pages.
 * Child components are mocked/stubbed.
 *
 * Test scenarios:
 * - renders expected child components/layout
 * - handles base view structure correctly
 */

import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import ApplicantView from '../../src/views/ApplicantView.vue'

describe('ApplicantView', () => {
  it('renders router-view', () => {
    const wrapper = mount(ApplicantView)
    expect(wrapper.find('router-view').exists()).toBe(true)
  })

  it('has template with router-view element', () => {
    const wrapper = mount(ApplicantView)
    expect(wrapper.html()).toContain('router-view')
  })

  it('contains router-view element', () => {
    const wrapper = mount(ApplicantView)
    expect(wrapper.find('router-view').exists()).toBe(true)
  })
})
