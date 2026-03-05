/**
 * @file RegisterAccountView.spec.ts
 * @description Unit tests for the RegisterAccountView view component.
 *
 * This file tests that the register page composes the registration UI correctly.
 * Child components are mocked/stubbed to focus on view layout.
 *
 * Test scenarios:
 * - renders RegisterNewAccountBox component
 * - displays expected layout structure
 */

import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import RegisterAccount from '../../src/views/RegisterAccount.vue'

vi.mock('@/components/RegisterNewAccountBox.vue', () => ({
  default: { template: '<div class="register-box">RegisterNewAccountBox</div>' }
}))

describe('RegisterAccount View', () => {
  it('renders RegisterNewAccountBox component', () => {
    const wrapper = mount(RegisterAccount)
    expect(wrapper.find('.register-box').exists()).toBe(true)
  })

  it('has fill-height class on container', () => {
    const wrapper = mount(RegisterAccount)
    const container = wrapper.find('.fill-height')
    expect(container.exists()).toBe(true)
  })

  it('has v-container element', () => {
    const wrapper = mount(RegisterAccount)
    expect(wrapper.find('v-container').exists()).toBe(true)
  })

  it('uses v-row for centering content', () => {
    const wrapper = mount(RegisterAccount)
    expect(wrapper.find('v-row').exists()).toBe(true)
  })

  it('uses v-col for column layout', () => {
    const wrapper = mount(RegisterAccount)
    const col = wrapper.find('v-col')
    expect(col.exists()).toBe(true)
    expect(col.attributes('cols')).toBe('12')
  })

  it('contains logo image', () => {
    const wrapper = mount(RegisterAccount)
    expect(wrapper.find('v-img').exists()).toBe(true)
  })
})
