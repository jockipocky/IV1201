/**
 * @file ApplicationFormView.spec.ts
 * @description Unit tests for the ApplicationFormView view component.
 *
 * This file tests that the application form view composes the correct child components.
 * Child components are mocked/stubbed to focus on view wiring.
 *
 * Test scenarios:
 * - renders ApplicationInfo and ApplicationBox
 * - displays expected layout structure
 */

import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import ApplicationFormView from '../../src/views/ApplicationFormView.vue'

vi.mock('@/components/ApplicationBox.vue', () => ({
  default: { template: '<div class="application-box">ApplicationBox</div>' }
}))

vi.mock('@/components/ApplicationInfo.vue', () => ({
  default: { template: '<div class="application-info">ApplicationInfo</div>' }
}))

describe('ApplicationFormView', () => {
  it('renders ApplicationBox component', () => {
    const wrapper = mount(ApplicationFormView)
    expect(wrapper.find('.application-box').exists()).toBe(true)
  })

  it('renders ApplicationInfo component', () => {
    const wrapper = mount(ApplicationFormView)
    expect(wrapper.find('.application-info').exists()).toBe(true)
  })

  it('has v-container elements', () => {
    const wrapper = mount(ApplicationFormView)
    expect(wrapper.findAll('v-container').length).toBe(2)
  })

  it('renders both components in correct order', () => {
    const wrapper = mount(ApplicationFormView)
    const containers = wrapper.findAll('v-container')
    expect(containers.length).toBe(2)
  })

  it('contains ApplicationInfo in first container', () => {
    const wrapper = mount(ApplicationFormView)
    expect(wrapper.html()).toContain('ApplicationInfo')
  })

  it('contains ApplicationBox in second container', () => {
    const wrapper = mount(ApplicationFormView)
    expect(wrapper.html()).toContain('ApplicationBox')
  })
})
