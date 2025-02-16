import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { supportsCssLayer } from '@/utils/helpers/browserFeatureCheck'

describe('supportsCssLayer', () => {
	let originalCSSLayerBlockRule: typeof CSSLayerBlockRule | undefined

	beforeEach(() => {
		// Save original global CSSLayerBlockRule
		originalCSSLayerBlockRule = globalThis.CSSLayerBlockRule
	})

	afterEach(() => {
		// Restore global CSSLayerBlockRule
		if (originalCSSLayerBlockRule !== undefined) {
			globalThis.CSSLayerBlockRule = originalCSSLayerBlockRule
		} else {
			// @ts-ignore
			delete globalThis.CSSLayerBlockRule
		}

		// Cleanup any appended styles
		document.head.querySelectorAll('style').forEach(style => style.remove())
	})

	it('should return true if CSS Layers are supported', () => {
		// Stub CSSLayerBlockRule to simulate a supporting browser
		// @ts-ignore
		globalThis.CSSLayerBlockRule = class {}

		const result = supportsCssLayer()
		expect(result).toBe(true)
	})

	it('should return true if CSSLayers are supported via cssText', () => {
		// Mock a style element with a stylesheet that contains @layer rule
		const style = document.createElement('style')
		document.head.appendChild(style)
		const sheet = style.sheet as CSSStyleSheet
		vi.spyOn(sheet, 'cssRules', 'get').mockReturnValue([{ cssText: '@layer test { .probe { color: red; } }' }] as unknown as CSSRuleList)

		const result = supportsCssLayer()
		expect(result).toBe(true)

		document.head.removeChild(style)
	})

	it('should return false if CSS Layers are not supported', () => {
		// Completely mock `document.createElement` to return a fake style element
		const mockStyle = {
			sheet: { cssRules: [] } // Simulate no rules being recognized
		}
		vi.spyOn(document, 'createElement').mockReturnValue(mockStyle as unknown as HTMLElement)

		const result = supportsCssLayer()
		expect(result).toBe(false)

		vi.restoreAllMocks() // Clean up mocks after test
	})

	it('should return false if an error occurs', () => {
		// Mock an error in accessing sheet.cssRules
		vi.spyOn(document, 'createElement').mockImplementation(() => {
			throw new Error('Test error')
		})

		const result = supportsCssLayer()
		expect(result).toBe(false)

		vi.restoreAllMocks()
	})
})
