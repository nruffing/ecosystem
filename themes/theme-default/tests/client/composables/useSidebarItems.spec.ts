import { resolveSidebarItems } from '@vuepress/theme-default/client'
import { describe, expect, it } from 'vitest'

describe('theme-default > client > composables > resolveSidebarItems', () => {
  it('should work', () => {
    const sidebarItems = resolveSidebarItems({}, {})
    expect(sidebarItems).toEqual([])
  })
})
