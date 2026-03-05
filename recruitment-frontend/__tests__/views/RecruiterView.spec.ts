/**
 * @file RecruiterView.spec.ts
 * @description Unit tests for the RecruiterView view component.
 *
 * This file tests recruiter page composition.
 * ApplicationList/Footer are mocked/stubbed to focus on view layout.
 *
 * Test scenarios:
 * - renders recruiter layout
 * - includes ApplicationList and Footer components
 */

import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import RecruiterView from '../../src/views/RecruiterView.vue'

vi.mock('@/components/ApplicationList.vue', () => ({
  default: { template: '<div class="application-list">ApplicationList</div>' }
}))

vi.mock('@/components/Footer.vue', () => ({
  default: { template: '<footer>Footer</footer>' }
}))

describe('RecruiterView', () => {
  it('renders ApplicationList component', () => {
    const wrapper = mount(RecruiterView)
    expect(wrapper.find('.application-list').exists()).toBe(true)
  })

  it('has fill-height class on container', () => {
    const wrapper = mount(RecruiterView)
    const container = wrapper.find('.fill-height')
    expect(container.exists()).toBe(true)
  })

  it('has v-container element', () => {
    const wrapper = mount(RecruiterView)
    expect(wrapper.find('v-container').exists()).toBe(true)
  })

  it('uses v-row for centering content', () => {
    const wrapper = mount(RecruiterView)
    expect(wrapper.find('v-row').exists()).toBe(true)
  })

  it('uses v-col for column layout', () => {
    const wrapper = mount(RecruiterView)
    const col = wrapper.find('v-col')
    expect(col.exists()).toBe(true)
    expect(col.attributes('md')).toBe('10')
  })

  it('renders Footer component', () => {
    const wrapper = mount(RecruiterView)
    expect(wrapper.find('footer').exists()).toBe(true)
  })
})
