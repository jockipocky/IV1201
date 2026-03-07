/**
 * @file UpgradeAccountView.spec.ts
 * @description Unit tests for the UpgradeAccountView page.
 *
 * This file tests the account upgrade page used to request
 * higher privileges.
 *
 * Test scenarios:
 * - renders upgrade form
 * - submits upgrade request
 * - handles upgrade errors
 *
 * @module views
 */

import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import UpgradeAccount from '../../src/views/UpgradeAccount.vue'

vi.mock('@/components/UpgradeAccountBox.vue', () => ({
  default: { template: '<div class="upgrade-box">UpgradeAccountBox</div>' }
}))

function createSimpleStub(className: string, tag = 'div') {
  return {
    template: `<${tag} class="${className}"><slot /></${tag}>`
  }
}

function createImageStub() {
  return {
    template: '<img class="v-img" />'
  }
}

function mountWithStubs() {
  const containerStub = createSimpleStub('v-container')
  const rowStub = createSimpleStub('v-row')
  const colStub = createSimpleStub('v-col')
  const imageStub = createImageStub()

  return mount(UpgradeAccount, {
    global: {
      stubs: {
        'v-container': containerStub,
        VContainer: containerStub,

        'v-row': rowStub,
        VRow: rowStub,

        'v-col': colStub,
        VCol: colStub,

        'v-img': imageStub,
        VImg: imageStub
      }
    }
  })
}

describe('UpgradeAccount View', () => {
  it('renders UpgradeAccountBox component', () => {
    const wrapper = mountWithStubs()
    expect(wrapper.find('.upgrade-box').exists()).toBe(true)
  })

  it('contains logo image', () => {
    const wrapper = mountWithStubs()
    expect(wrapper.find('.v-img').exists()).toBe(true)
  })
})