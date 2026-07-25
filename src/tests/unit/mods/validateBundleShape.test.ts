import { describe, it, expect } from 'vitest'
import { validateBundleShape } from '@fate-core/mod-types'

describe('validateBundleShape', () => {
	it('accepts a minimal valid bundle', () => {
		expect(() => validateBundleShape({}, undefined)).not.toThrow()
	})

	it('rejects a non-object default export', () => {
		expect(() => validateBundleShape('not an object', undefined)).toThrow(/must be an object/)
		expect(() => validateBundleShape(null, undefined)).toThrow(/must be an object/)
	})

	it('validates components when sheetComponents is declared', () => {
		expect(() => validateBundleShape({ components: 'nope' }, ['sheetComponents'])).toThrow(/components must be an array/)
		expect(() => validateBundleShape({ components: [{ id: 'x' }] }, ['sheetComponents'])).toThrow(/components\[0\]/)
		expect(() => validateBundleShape({ components: [{ id: 'x', order: 1, component: {} }] }, ['sheetComponents'])).not.toThrow()
	})

	it('ignores components when sheetComponents is not declared', () => {
		expect(() => validateBundleShape({ components: 'nope' }, ['dice'])).not.toThrow()
	})

	it('rejects non-function lifecycle hooks', () => {
		expect(() => validateBundleShape({ onInstall: 'nope' }, undefined)).toThrow(/onInstall must be a function/)
	})

	it('validates patches entries', () => {
		expect(() => validateBundleShape({ patches: [{ version: '1.0.0' }] }, undefined)).toThrow(/patches\[0\]/)
		expect(() => validateBundleShape({ patches: [{ version: '1.0.0', action: () => {} }] }, undefined)).not.toThrow()
	})

	it('validates theme.css when theme is declared', () => {
		expect(() => validateBundleShape({ theme: {} }, ['theme'])).toThrow(/theme.css must be a string/)
		expect(() => validateBundleShape({ theme: { css: '' } }, ['theme'])).not.toThrow()
	})
})
