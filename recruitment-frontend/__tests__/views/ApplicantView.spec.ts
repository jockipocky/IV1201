/**
 * @file ApplicantView.spec.ts
 * @description Unit tests for the ApplicantView page.
 *
 * This file tests the applicant view container and verifies that
 * the nested route outlet is rendered correctly.
 *
 * Test scenarios:
 * - renders router-view
 *
 * @module views
 */

import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import ApplicantView from '../../src/views/ApplicantView.vue'

function createSimpleStub(className: string, tag = 'div') {
  return {
    template: `<${tag} class="${className}"><slot /></${tag}>`,
  }
}

function mountWithStubs() {
  const routerViewStub = createSimpleStub('router-view')

  return mount(ApplicantView, {
    global: {
      stubs: {
        'router-view': routerViewStub,
        RouterView: routerViewStub,
      },
    },
  })
}

describe('ApplicantView', () => {
  it('renders router-view', () => {
    const wrapper = mountWithStubs()
    expect(wrapper.find('.router-view').exists()).toBe(true)
  })
})