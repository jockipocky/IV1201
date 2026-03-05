/**
 * @file Footer.spec.ts
 * @description Unit tests for the Footer Vue component.
 *
 * This file verifies the Footer renders expected structure/content.
 *
 * Test scenarios:
 * - renders the component successfully
 * - displays expected footer content
 */

import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import Footer from '../../src/components/Footer.vue'

describe('Footer Component', () => {
  it('renders copyright text', () => {
    const wrapper = mount(Footer)
    expect(wrapper.text()).toContain('© 2026 Recruit Boyz')
  })

  it('has correct footer class', () => {
    const wrapper = mount(Footer)
    expect(wrapper.classes()).toContain('footer')
  })

  it('renders the footer element', () => {
    const wrapper = mount(Footer)
    expect(wrapper.find('footer').exists()).toBe(true)
  })

  it('displays all rights reserved text', () => {
    const wrapper = mount(Footer)
    expect(wrapper.text()).toContain('All rights reserved')
  })
})
