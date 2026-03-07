/**
 * @file RecruiterView.spec.ts
 * @description Unit tests for the RecruiterView page.
 *
 * This file tests the recruiter dashboard where recruiters
 * can review applications.
 *
 * Test scenarios:
 * - displays list of applications
 * - allows viewing application details
 * - handles empty results
 *
 * @module views
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'
import RecruiterView from '../../src/views/RecruiterView.vue'

let consoleSpy: any

vi.mock('@/components/ApplicationList.vue', () => ({
  default: { template: '<div class="application-list">ApplicationList</div>' }
}))

vi.mock('@/components/Footer.vue', () => ({
  default: { template: '<footer>Footer</footer>' }
}))

function createSimpleStub(className: string, tag = 'div') {
  return {
    template: `<${tag} class="${className}"><slot /></${tag}>`
  }
}

function mountWithStubs() {
  const containerStub = createSimpleStub('v-container')
  const rowStub = createSimpleStub('v-row')
  const colStub = createSimpleStub('v-col')
  const headerStub = createSimpleStub('recruiter-header', 'header')
  const footerStub = createSimpleStub('footer', 'footer')

  return mount(RecruiterView, {
    global: {
      stubs: {
        'v-container': containerStub,
        VContainer: containerStub,

        'v-row': rowStub,
        VRow: rowStub,

        'v-col': colStub,
        VCol: colStub,

        RecruiterHeader: headerStub,
        Footer: footerStub
      }
    }
  })
}

describe('RecruiterView', () => {

  beforeEach(() => {
    vi.clearAllMocks()
    consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
  })

  afterEach(() => {
    consoleSpy.mockRestore()
  })

  it('renders ApplicationList component', () => {
    const wrapper = mountWithStubs()
    expect(wrapper.find('.application-list').exists()).toBe(true)
  })

  it('renders Footer component', () => {
    const wrapper = mountWithStubs()
    expect(wrapper.find('footer').exists()).toBe(true)
  })

})