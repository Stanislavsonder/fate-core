import { describe, it, expect, vi, afterEach } from 'vitest'

const mockModules = (entries: Array<[string, { id: string; version: string; tags: string[] }]>) => {
	vi.doMock('@/modules', () => ({
		default: new Map(entries)
	}))
}

describe('getCoreModulesConfig', () => {
	afterEach(() => {
		vi.resetModules()
		vi.restoreAllMocks()
	})

	it('returns configuration only for modules tagged with "core"', async () => {
		mockModules([
			['core1', { id: 'core1', version: '1.0.0', tags: ['core'] }],
			['non', { id: 'non', version: '1.0.0', tags: ['other'] }],
			['core2', { id: 'core2', version: '2.0.0', tags: ['extra', 'core'] }]
		])

		const { getCoreModulesConfig } = await import('@/utils/helpers/getCoreModulesConfig')
		const result = getCoreModulesConfig()
		expect(result).toEqual({
			core1: { config: {}, version: '1.0.0' },
			core2: { config: {}, version: '2.0.0' }
		})
	})

	it('returns empty object when no core modules are present', async () => {
		mockModules([['mod', { id: 'mod', version: '1.0.0', tags: ['notcore'] }]])
		const { getCoreModulesConfig } = await import('@/utils/helpers/getCoreModulesConfig')
		expect(getCoreModulesConfig()).toEqual({})
	})
})
