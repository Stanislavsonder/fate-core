import { describe, it, expect, vi, beforeEach } from 'vitest'

const { getMod, putMod, deleteMod, setEnabledMod } = vi.hoisted(() => ({
	getMod: vi.fn(),
	putMod: vi.fn(),
	deleteMod: vi.fn(),
	setEnabledMod: vi.fn()
}))
vi.mock('@/db/tables/mods', () => ({ modsService: { get: getMod, put: putMod, delete: deleteMod, setEnabled: setEnabledMod } }))

const { loadExternalMod, safeManifest } = vi.hoisted(() => ({
	loadExternalMod: vi.fn(),
	safeManifest: vi.fn((row: { id: string; version: string }) => ({ id: row.id, version: row.version }))
}))
vi.mock('@/mods/loader', () => ({ loadExternalMod, safeManifest }))

const { getCharacters } = vi.hoisted(() => ({ getCharacters: vi.fn().mockResolvedValue([]) }))
vi.mock('@/service/character.service', () => ({ default: { getCharacters } }))

import { ModRegistry } from '@/mods/modRegistry'
import { installFromUrl, update, remove, setEnabled } from '@/mods/installService'
import type { StoredMod } from '@/db/tables/mods'

function jsonResponse(body: unknown, ok = true, status = 200) {
	return { ok, status, json: async () => body }
}

function textResponse(body: string, ok = true, status = 200) {
	return { ok, status, text: async () => body }
}

function baseStoredRow(overrides: Partial<StoredMod> = {}): StoredMod {
	return {
		id: 'author@mod',
		version: '1.0.0',
		source: 'url',
		enabled: true,
		manifestJson: JSON.stringify({ id: 'author@mod', version: '1.0.0' }),
		bundleCode: 'export default {}',
		translationsJson: '{}',
		sha256: 'abc',
		sourceUrl: 'https://example.com/mods/author@mod',
		installedAt: 0,
		updatedAt: 0,
		...overrides
	}
}

beforeEach(() => {
	vi.clearAllMocks()
	getCharacters.mockResolvedValue([])
	putMod.mockResolvedValue(undefined)
	deleteMod.mockResolvedValue(undefined)
	setEnabledMod.mockResolvedValue(undefined)
})

describe('installFromUrl', () => {
	it('fetches manifest+bundle+translations, persists, loads, and registers', async () => {
		const manifest = { id: 'fresh@mod', version: '1.0.0', entry: 'bundle.mjs', languages: ['en'] }
		const fetchMock = vi
			.fn()
			.mockResolvedValueOnce(jsonResponse(manifest))
			.mockResolvedValueOnce(textResponse('export default {}'))
			.mockResolvedValueOnce(jsonResponse({ greeting: 'hi' }))
		vi.stubGlobal('fetch', fetchMock)
		getMod.mockResolvedValue(undefined)
		loadExternalMod.mockResolvedValue({ id: 'fresh@mod', version: '1.0.0' })

		const result = await installFromUrl('https://example.com/mods/fresh@mod')

		expect(result.ok).toBe(true)
		expect(fetchMock).toHaveBeenCalledTimes(3)
		expect(putMod).toHaveBeenCalledTimes(1)
		expect(ModRegistry.get('fresh@mod')).toEqual({ manifest: { id: 'fresh@mod', version: '1.0.0' }, source: 'url', status: 'loaded' })
	})

	it('refuses an id that conflicts with a built-in mod without fetching the bundle', async () => {
		ModRegistry.register({ manifest: { id: 'builtin@mod', version: '1.0.0' } as never, source: 'builtin', status: 'loaded' })
		const fetchMock = vi.fn().mockResolvedValue(jsonResponse({ id: 'builtin@mod', version: '1.0.0' }))
		vi.stubGlobal('fetch', fetchMock)

		const result = await installFromUrl('https://example.com/mods/builtin@mod')

		expect(result).toEqual({ ok: false, error: '"builtin@mod" conflicts with a built-in mod' })
		expect(putMod).not.toHaveBeenCalled()
		expect(fetchMock).toHaveBeenCalledTimes(1)
	})

	it('refuses a duplicate install and suggests update instead, without fetching the bundle', async () => {
		const fetchMock = vi.fn().mockResolvedValue(jsonResponse({ id: 'dup@mod', version: '1.0.0' }))
		vi.stubGlobal('fetch', fetchMock)
		getMod.mockResolvedValue(baseStoredRow({ id: 'dup@mod' }))

		const result = await installFromUrl('https://example.com/mods/dup@mod')

		expect(result.ok).toBe(false)
		expect(fetchMock).toHaveBeenCalledTimes(1)
		expect(!result.ok && result.error).toMatch(/already installed/)
		expect(putMod).not.toHaveBeenCalled()
	})

	it('rolls back the stored row when the fetched bundle fails to load', async () => {
		const manifest = { id: 'bad@mod', version: '1.0.0', languages: [] }
		vi.stubGlobal('fetch', vi.fn().mockResolvedValueOnce(jsonResponse(manifest)).mockResolvedValueOnce(textResponse('export default {}')))
		getMod.mockResolvedValue(undefined)
		loadExternalMod.mockRejectedValue(new Error('boom'))

		const result = await installFromUrl('https://example.com/mods/bad@mod')

		expect(result.ok).toBe(false)
		expect(putMod).toHaveBeenCalledTimes(1)
		expect(deleteMod).toHaveBeenCalledWith('bad@mod')
	})

	it('surfaces a fetch failure without touching storage', async () => {
		vi.stubGlobal('fetch', vi.fn().mockResolvedValue(jsonResponse({}, false, 404)))

		const result = await installFromUrl('https://example.com/mods/missing')

		expect(result.ok).toBe(false)
		expect(putMod).not.toHaveBeenCalled()
	})
})

describe('update', () => {
	it('validates the new bundle BEFORE overwriting the stored row', async () => {
		getMod.mockResolvedValue(baseStoredRow())
		const manifest = { id: 'author@mod', version: '1.1.0', languages: [] }
		vi.stubGlobal('fetch', vi.fn().mockResolvedValueOnce(jsonResponse(manifest)).mockResolvedValueOnce(textResponse('export default {}')))
		loadExternalMod.mockResolvedValue({ id: 'author@mod', version: '1.1.0' })

		const result = await update('author@mod')

		expect(result.ok).toBe(true)
		const loadOrder = loadExternalMod.mock.invocationCallOrder[0]
		const putOrder = putMod.mock.invocationCallOrder[0]
		expect(loadOrder).toBeLessThan(putOrder)
	})

	it('keeps the previous version installed when the new bundle fails to load', async () => {
		getMod.mockResolvedValue(baseStoredRow())
		const manifest = { id: 'author@mod', version: '2.0.0', languages: [] }
		vi.stubGlobal('fetch', vi.fn().mockResolvedValueOnce(jsonResponse(manifest)).mockResolvedValueOnce(textResponse('export default {}')))
		loadExternalMod.mockRejectedValue(new Error('boom'))

		const result = await update('author@mod')

		expect(result.ok).toBe(false)
		expect(putMod).not.toHaveBeenCalled()
	})

	it('refuses when the mod is not installed', async () => {
		getMod.mockResolvedValue(undefined)

		const result = await update('nope@mod')

		expect(result).toEqual({ ok: false, error: '"nope@mod" is not installed' })
	})
})

describe('remove', () => {
	it('blocks removal when a character still references the mod', async () => {
		getCharacters.mockResolvedValue([
			{ id: 1, name: 'Hero', avatar: '', _modules: { 'author@mod': { version: '1.0.0' } } },
			{ id: 2, name: 'Other', avatar: '', _modules: {} }
		])

		const result = await remove('author@mod')

		expect(result).toEqual({ ok: false, reason: 'blocked', characterNames: ['Hero'] })
		expect(deleteMod).not.toHaveBeenCalled()
	})

	it('removes the mod when no character references it', async () => {
		ModRegistry.register({ manifest: { id: 'removable@mod', version: '1.0.0' } as never, source: 'url', status: 'loaded' })

		const result = await remove('removable@mod')

		expect(result).toEqual({ ok: true })
		expect(deleteMod).toHaveBeenCalledWith('removable@mod')
		expect(ModRegistry.get('removable@mod')).toBeUndefined()
	})
})

describe('setEnabled', () => {
	it('disabling flips the in-session ModRegistry status without deleting the record', async () => {
		ModRegistry.register({ manifest: { id: 'toggle@mod', version: '1.0.0' } as never, source: 'url', status: 'loaded' })
		getMod.mockResolvedValue(baseStoredRow({ id: 'toggle@mod' }))

		const result = await setEnabled('toggle@mod', false)

		expect(result).toEqual({ ok: true })
		expect(setEnabledMod).toHaveBeenCalledWith('toggle@mod', false)
		expect(ModRegistry.get('toggle@mod')?.status).toBe('disabled')
	})

	it('re-enabling an in-session-disabled mod flips it back without reloading', async () => {
		ModRegistry.register({ manifest: { id: 'toggle2@mod', version: '1.0.0' } as never, source: 'url', status: 'disabled' })
		getMod.mockResolvedValue(baseStoredRow({ id: 'toggle2@mod' }))

		const result = await setEnabled('toggle2@mod', true)

		expect(result).toEqual({ ok: true })
		expect(loadExternalMod).not.toHaveBeenCalled()
		expect(ModRegistry.get('toggle2@mod')?.status).toBe('loaded')
	})

	it('enabling a mod with no in-session record loads it fresh', async () => {
		getMod.mockResolvedValue(baseStoredRow({ id: 'toggle3@mod' }))
		loadExternalMod.mockResolvedValue({ id: 'toggle3@mod', version: '1.0.0' })

		const result = await setEnabled('toggle3@mod', true)

		expect(result).toEqual({ ok: true })
		expect(loadExternalMod).toHaveBeenCalled()
		expect(ModRegistry.get('toggle3@mod')?.status).toBe('loaded')
	})

	it('refuses when the mod is not installed', async () => {
		getMod.mockResolvedValue(undefined)

		const result = await setEnabled('nope@mod', true)

		expect(result).toEqual({ ok: false, error: '"nope@mod" is not installed' })
	})
})
