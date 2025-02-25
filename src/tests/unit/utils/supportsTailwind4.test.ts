import { describe, it, expect, vi } from 'vitest'
import { supportsTailwind4 } from '@/utils/helpers/browserFeatureCheck'

describe('supportsCssVariables', () => {
	it('should return true if the browser supports CSS variables and OKLCH color', () => {
		// Mock CSS.supports to return true
		vi.stubGlobal('CSS', {
			supports: vi.fn(() => true)
		})

		expect(supportsTailwind4()).toBe(true)

		// Restore the original state
		vi.restoreAllMocks()
	})

	it('should return false if the browser does not support CSS variables', () => {
		// Mock CSS.supports to return false
		vi.stubGlobal('CSS', {
			supports: vi.fn(() => false)
		})

		expect(supportsTailwind4()).toBe(false)

		vi.restoreAllMocks()
	})

	it('should return false if CSS API is missing in older browsers', () => {
		// Remove `CSS` from window
		vi.stubGlobal('CSS', undefined)

		expect(supportsTailwind4()).toBe(false)

		vi.restoreAllMocks()
	})
})
