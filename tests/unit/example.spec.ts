import { mount } from '@vue/test-utils'
import CharacterSheetPage from '../../src/views/CharacterSheetPage.vue'
import { describe, expect, test } from 'vitest'

describe('Tab1Page.vue', () => {
  test('renders tab 1 Tab1Page', () => {
    const wrapper = mount(CharacterSheetPage)
    expect(wrapper.text()).toMatch('Tab 1 page')
  })
})
