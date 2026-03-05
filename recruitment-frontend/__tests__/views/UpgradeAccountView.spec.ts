/**
 * @file UpgradeAccountView.spec.ts
 * @description Unit tests for the UpgradeAccountView view component.
 *
 * This file tests that the upgrade page composes the upgrade UI correctly.
 * Child components are mocked/stubbed to focus on view layout.
 *
 * Test scenarios:
 * - renders UpgradeAccountBox component
 * - displays expected layout structure
 */


import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import UpgradeAccount from '../../src/views/UpgradeAccount.vue'

vi.mock('@/components/UpgradeAccountBox.vue', () => ({
  default: { template: '<div class="upgrade-box">UpgradeAccountBox</div>' }
}))

describe('UpgradeAccount View', () => {
  it('renders UpgradeAccountBox component', () => {
    const wrapper = mount(UpgradeAccount)
    expect(wrapper.find('.upgrade-box').exists()).toBe(true)
  })

  it('has fill-height class on container', () => {
    const wrapper = mount(UpgradeAccount)
    const container = wrapper.find('.fill-height')
    expect(container.exists()).toBe(true)
  })

  it('has v-container element', () => {
    const wrapper = mount(UpgradeAccount)
    expect(wrapper.find('v-container').exists()).toBe(true)
  })

  it('uses v-row for centering content', () => {
    const wrapper = mount(UpgradeAccount)
    expect(wrapper.find('v-row').exists()).toBe(true)
  })

  it('uses v-col for column layout', () => {
    const wrapper = mount(UpgradeAccount)
    const col = wrapper.find('v-col')
    expect(col.exists()).toBe(true)
    expect(col.attributes('cols')).toBe('12')
  })

  it('contains logo image', () => {
    const wrapper = mount(UpgradeAccount)
    expect(wrapper.find('v-img').exists()).toBe(true)
  })
})
