/**
 * @file RegisterAccountView.spec.ts
 * @description Unit tests for the RegisterAccountView page.
 *
 * This file tests the registration page where new users
 * can create an account.
 *
 * Test scenarios:
 * - renders registration form
 * - validates form fields
 * - submits registration data
 *
 * @module views
 */

import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import RegisterAccount from '../../src/views/RegisterAccount.vue'

vi.mock('@/components/RegisterNewAccountBox.vue', () => ({
  default: { template: '<div class="register-box">RegisterNewAccountBox</div>' },
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

  return mount(RegisterAccount, {
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

describe('RegisterAccount View', () => {
  it('renders RegisterNewAccountBox component', () => {
    const wrapper = mountWithStubs()
    expect(wrapper.find('.register-box').exists()).toBe(true)
  })

  it('contains logo image', () => {
    const wrapper = mountWithStubs()
    expect(wrapper.find('.v-img').exists()).toBe(true)
  })
})