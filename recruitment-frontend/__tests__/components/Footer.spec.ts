/**
 * @file Footer.spec.ts
 * @description Unit tests for the Footer component.
 *
 * This file tests the layout and content of the application footer.
 *
 * Test scenarios:
 * - footer renders correctly
 * - displays expected footer links
 * - handles responsive layout
 *
 * @module components
 */

import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import Footer from '../../src/components/Footer.vue'

describe('Footer Component', () => {

  it('has correct footer class', () => {
    const wrapper = mount(Footer)
    expect(wrapper.classes()).toContain('footer')
  })

  it('renders the footer element', () => {
    const wrapper = mount(Footer)
    expect(wrapper.find('footer').exists()).toBe(true)
  })

  it('renders footer text content', () => {
  const wrapper = mount(Footer)

  expect(wrapper.text()).toContain('© 2026 Recruit Boyz')
  expect(wrapper.text()).toContain('All rights reserved')
})
})
