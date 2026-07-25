import { describe, it, expect } from 'vitest'
import { installFateSDK, loadFullIconset, SDK_VERSION } from '@/mods/sdk'

describe('FateSDK', () => {
	it('installs frozen, with an empty icon set until loadFullIconset runs', () => {
		installFateSDK()

		expect(globalThis.FateSDK.version).toBe(SDK_VERSION)
		expect(globalThis.FateSDK.ionicons).toEqual({})
		expect(Object.isFrozen(globalThis.FateSDK)).toBe(true)
		expect(() => {
			globalThis.FateSDK.version = 'tampered'
		}).toThrow(TypeError) // ESM modules run in strict mode, so writing to a frozen object throws
		expect(globalThis.FateSDK.version).toBe(SDK_VERSION)
	})

	it('loadFullIconset upgrades FateSDK.ionicons with the full icon set, staying frozen', async () => {
		installFateSDK()

		await loadFullIconset()

		expect(Object.keys(globalThis.FateSDK.ionicons).length).toBeGreaterThan(100)
		expect(Object.isFrozen(globalThis.FateSDK)).toBe(true)
	})
})
