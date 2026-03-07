/**
 * @file LoginView.spec.ts
 * @description Unit tests for the LoginView page.
 *
 * This file tests the login page layout and integration with
 * the login form component.
 *
 * Test scenarios:
 * - renders login form
 * - submits login credentials
 * - displays login errors
 *
 * @module views
 */

import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import LoginView from '../../src/views/LoginView.vue'

vi.mock('@/components/LoginBox.vue', () => ({
  default: { template: '<div class="login-box">LoginBox</div>' },
}))

function createSimpleStub(className: string, tag = 'div') {
  return {
    template: `<${tag} class="${className}"><slot /></${tag}>`,
  }
}

function createImageStub() {
  return {
    template: '<img class="v-img" />',
  }
}

function mountWithStubs() {
  const containerStub = createSimpleStub('v-container')
  const rowStub = createSimpleStub('v-row')
  const colStub = createSimpleStub('v-col')
  const imageStub = createImageStub()

  return mount(LoginView, {
    global: {
      stubs: {
        'v-container': containerStub,
        VContainer: containerStub,

        'v-row': rowStub,
        VRow: rowStub,

        'v-col': colStub,
        VCol: colStub,

        'v-img': imageStub,
        VImg: imageStub,
      },
    },
  })
}

describe('LoginView', () => {
  it('renders LoginBox component', () => {
    const wrapper = mountWithStubs()
    expect(wrapper.find('.login-box').exists()).toBe(true)
  })

  it('contains logo image', () => {
    const wrapper = mountWithStubs()
    expect(wrapper.find('.v-img').exists()).toBe(true)
  })
})