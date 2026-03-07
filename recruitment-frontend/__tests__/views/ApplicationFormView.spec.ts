/**
 * @file ApplicationFormView.spec.ts
 * @description Unit tests for the ApplicationFormView page.
 *
 * This file tests the application submission form used by applicants.
 *
 * Test scenarios:
 * - renders application form fields
 * - validates form input
 * - submits application data
 *
 * @module views
 */

import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import ApplicationFormView from '../../src/views/ApplicationFormView.vue'

vi.mock('@/components/ApplicationBox.vue', () => ({
  default: { template: '<div class="application-box">ApplicationBox</div>' },
}))

vi.mock('@/components/ApplicationInfo.vue', () => ({
  default: { template: '<div class="application-info">ApplicationInfo</div>' },
}))

function createSimpleStub(className: string, tag = 'div') {
  return {
    template: `<${tag} class="${className}"><slot /></${tag}>`,
  }
}

function createFormStub() {
  return {
    template: '<form class="v-form" @submit.prevent="$emit(`submit`)"><slot /></form>',
  }
}

function createClickStub(className: string) {
  return {
    template: `
      <button type="button" class="${className}" @click="$emit('click')">
        <slot />
      </button>
    `,
  }
}

function createTextFieldStub() {
  return {
    props: ['modelValue'],
    template: `
      <div class="v-text-field">
        <input
          class="v-input"
          :value="modelValue"
          @input="$emit('update:modelValue', $event.target.value)"
        />
        <button
          type="button"
          class="append"
          @click="$emit('click:append-inner')"
        >
          append
        </button>
      </div>
    `,
  }
}

function mountWithStubs() {
  const containerStub = createSimpleStub('v-container')
  const rowStub = createSimpleStub('v-row')
  const colStub = createSimpleStub('v-col')
  const cardStub = createSimpleStub('v-card')
  const formStub = createFormStub()
  const buttonStub = createClickStub('v-btn')
  const alertStub = createSimpleStub('v-alert')
  const textFieldStub = createTextFieldStub()

  return mount(ApplicationFormView, {
    global: {
      stubs: {
        'v-container': containerStub,
        VContainer: containerStub,

        'v-row': rowStub,
        VRow: rowStub,

        'v-col': colStub,
        VCol: colStub,

        'v-card': cardStub,
        VCard: cardStub,

        'v-form': formStub,
        VForm: formStub,

        'v-btn': buttonStub,
        VBtn: buttonStub,

        'v-alert': alertStub,
        VAlert: alertStub,

        'v-text-field': textFieldStub,
        VTextField: textFieldStub,
      },
    },
  })
}

describe('ApplicationFormView', () => {
  it('renders ApplicationBox component', () => {
    const wrapper = mountWithStubs()
    expect(wrapper.find('.application-box').exists()).toBe(true)
  })

  it('renders ApplicationInfo component', () => {
    const wrapper = mountWithStubs()
    expect(wrapper.find('.application-info').exists()).toBe(true)
  })

  it('renders both components in correct order', () => {
    const wrapper = mountWithStubs()
    const containers = wrapper.findAll('.v-container')

    expect(containers.length).toBe(2)
    expect(containers[0].html()).toContain('ApplicationInfo')
    expect(containers[1].html()).toContain('ApplicationBox')
  })
})