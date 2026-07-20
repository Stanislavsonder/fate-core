import { describe, it, expect, vi, beforeEach } from 'vitest'
import { uninstallModule, uninstallModules } from '@/modules/utils/uninstallModules'
import type { FateModuleManifest } from '@/modules/utils/types'
import type { Character, FateContext } from '@/types'

vi.mock('@/modules/utils/getModules', () => ({
	getModules: vi.fn()
}))

vi.mock('@/utils/config/constants', () => ({
	default: {
		MAX_TOKENS: 9
	}
}))

import { getModules } from '@/modules/utils/getModules'

function createModule(overrides: Partial<FateModuleManifest> = {}): FateModuleManifest {
	return {
		id: 'test@module',
		author: { name: 'Test' },
		description: { short: 'Test' },
		languages: ['en'],
		tags: ['test'],
		name: 'Test Module',
		version: '1.0.0',
		loadPriority: 0,
		onInstall: vi.fn(),
		onUninstall: vi.fn(),
		onReconfigure: vi.fn(),
		...overrides
	}
}

function createContext(overrides: Partial<FateContext> = {}): FateContext {
	return {
		modules: {},
		constants: {},
		components: [],
		templates: { character: { id: 0, name: '', _modules: {} } },
		shared: {},
		...overrides
	} as FateContext
}

function createCharacter(overrides: Partial<Character> = {}): Character {
	return {
		id: 1,
		name: 'Test',
		_modules: {},
		...overrides
	}
}

describe('uninstallModule', () => {
	it('removes only the uninstalled module components and keeps others', () => {
		const context = createContext({
			components: [
				{ id: 'keep-a', component: {}, order: 1 },
				{ id: 'remove-me', component: {}, order: 2 },
				{ id: 'keep-b', component: {}, order: 3 }
			]
		})
		const character = createCharacter()
		const module = createModule({
			components: [{ id: 'remove-me', component: {}, order: 2 }]
		})

		uninstallModule(module, context, character)

		expect(context.components.map(c => c.id)).toEqual(['keep-a', 'keep-b'])
	})

	it('does not touch components when the module has none', () => {
		const components = [
			{ id: 'keep-a', component: {}, order: 1 },
			{ id: 'keep-b', component: {}, order: 2 }
		]
		const context = createContext({ components: [...components] })
		const character = createCharacter()
		const module = createModule({ components: [] })

		uninstallModule(module, context, character)

		expect(context.components).toEqual(components)
	})

	it('removes shared keys declared by the module', () => {
		const context = createContext({
			shared: {
				skills: new Map(),
				other: true
			} as unknown as FateContext['shared']
		})
		const character = createCharacter()
		const module = createModule({
			shared: { skills: new Map() } as unknown as FateModuleManifest['shared']
		})

		uninstallModule(module, context, character)

		expect(context.shared).toEqual({ other: true })
	})

	it('removes template keys declared by the module', () => {
		const context = createContext({
			templates: {
				character: { id: 0, name: '', _modules: {} },
				customTemplate: { foo: 'bar' }
			} as unknown as FateContext['templates']
		})
		const character = createCharacter()
		const module = createModule({
			templates: { customTemplate: { foo: 'bar' } } as unknown as FateModuleManifest['templates']
		})

		uninstallModule(module, context, character)

		expect(context.templates).toEqual({
			character: { id: 0, name: '', _modules: {} }
		})
	})

	it('resets constants declared by the module to app defaults', () => {
		const context = createContext({
			constants: {
				MAX_TOKENS: 5,
				OTHER: 'keep'
			} as unknown as FateContext['constants']
		})
		const character = createCharacter()
		const module = createModule({
			constants: { MAX_TOKENS: 5 } as unknown as FateModuleManifest['constants']
		})

		uninstallModule(module, context, character)

		expect(context.constants).toEqual({
			MAX_TOKENS: 9,
			OTHER: 'keep'
		})
	})

	it('calls module.onUninstall with context and character', () => {
		const context = createContext()
		const character = createCharacter()
		const onUninstall = vi.fn()
		const module = createModule({ onUninstall })

		uninstallModule(module, context, character)

		expect(onUninstall).toHaveBeenCalledTimes(1)
		expect(onUninstall).toHaveBeenCalledWith(context, character)
	})
})

describe('uninstallModules', () => {
	beforeEach(() => {
		vi.mocked(getModules).mockReset()
	})

	it('uninstalls each provided module', () => {
		const context = createContext({
			components: [
				{ id: 'a', component: {}, order: 1 },
				{ id: 'b', component: {}, order: 2 },
				{ id: 'c', component: {}, order: 3 }
			]
		})
		const character = createCharacter()
		const modA = createModule({
			id: 'mod-a',
			components: [{ id: 'a', component: {}, order: 1 }],
			onUninstall: vi.fn()
		})
		const modB = createModule({
			id: 'mod-b',
			components: [{ id: 'b', component: {}, order: 2 }],
			onUninstall: vi.fn()
		})

		uninstallModules(context, character, [modA, modB])

		expect(context.components.map(c => c.id)).toEqual(['c'])
		expect(modA.onUninstall).toHaveBeenCalledWith(context, character)
		expect(modB.onUninstall).toHaveBeenCalledWith(context, character)
	})

	it('falls back to getModules(character._modules) when modules are omitted', () => {
		const context = createContext({
			components: [
				{ id: 'remove-me', component: {}, order: 1 },
				{ id: 'keep-me', component: {}, order: 2 }
			]
		})
		const character = createCharacter({
			_modules: { 'test@module': { version: '1.0.0' } }
		})
		const module = createModule({
			components: [{ id: 'remove-me', component: {}, order: 1 }],
			onUninstall: vi.fn()
		})
		vi.mocked(getModules).mockReturnValue([module])

		uninstallModules(context, character)

		expect(getModules).toHaveBeenCalledWith(character._modules)
		expect(context.components.map(c => c.id)).toEqual(['keep-me'])
		expect(module.onUninstall).toHaveBeenCalledWith(context, character)
	})
})
