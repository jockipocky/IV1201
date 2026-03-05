/**
 * @file LoginView.spec.ts
 * @description Unit tests for the LoginView view component.
 *
 * This file tests that LoginView composes the login UI correctly.
 * LoginBox is mocked/stubbed to focus on view layout.
 *
 * Test scenarios:
 * - renders LoginBox component
 * - displays expected layout structure
 */

import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '../../src/views/LoginView.vue'

vi.mock('@/components/LoginBox.vue', () => ({
  default: { template: '<div class="login-box">LoginBox</div>' }
}))

describe('LoginView', () => {
  it('renders LoginBox component', () => {
    const wrapper = mount(LoginView)
    expect(wrapper.find('.login-box').exists()).toBe(true)
  })

  it('has fill-height class on container', () => {
    const wrapper = mount(LoginView)
    const container = wrapper.find('.fill-height')
    expect(container.exists()).toBe(true)
  })

  it('has v-container element', () => {
    const wrapper = mount(LoginView)
    expect(wrapper.find('v-container').exists()).toBe(true)
  })

  it('uses v-row for centering content', () => {
    const wrapper = mount(LoginView)
    const row = wrapper.find('v-row')
    expect(row.exists()).toBe(true)
  })

  it('uses v-col for column layout', () => {
    const wrapper = mount(LoginView)
    const col = wrapper.find('v-col')
    expect(col.exists()).toBe(true)
  })

  it('contains logo image', () => {
    const wrapper = mount(LoginView)
    const img = wrapper.find('v-img')
    expect(img.exists()).toBe(true)
  })

  it('has proper responsive columns', () => {
    const wrapper = mount(LoginView)
    const col = wrapper.find('v-col')
    expect(col.attributes('cols')).toBe('12')
    expect(col.attributes('sm')).toBe('6')
    expect(col.attributes('md')).toBe('4')
  })
})
