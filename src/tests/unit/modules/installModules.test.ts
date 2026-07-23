import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { installModule, installModules } from '@/modules/utils/installModules'
import type { FateModuleManifest } from '@/modules/utils/types'
import type { Character, FateContext } from '@/types'

const mocks = vi.hoisted(() => ({
	patchAction: vi.fn()
}))

vi.mock('@/modules/utils/getModules', () => ({
	getModules: vi.fn()
}))

vi.mock('@/modules', () => ({
	default: new Map([
		[
			'test@module',
			{
				id: 'test@module',
				name: 'Test Module',
				version: '2.0.0',
				patches: [{ version: '2.0.0', action: mocks.patchAction }]
			}
		]
	])
}))

vi.mock('@/utils/helpers/toast', () => ({
	showErrorToast: vi.fn(),
	showSuccessToast: vi.fn(),
	showWarningToast: vi.fn()
}))

import { getModules } from '@/modules/utils/getModules'
import * as updateModulesModule from '@/modules/utils/updateModules'

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

describe('installModule', () => {
	afterEach(() => {
		vi.restoreAllMocks()
	})

	it('registers the module in context and calls onInstall', async () => {
		const context = createContext()
		const character = createCharacter({
			_modules: { 'test@module': { version: '1.0.0' } }
		})
		const onInstall = vi.fn()
		const module = createModule({ onInstall })

		await installModule(module, context, character)

		expect(context.modules['test@module']).toBe(module)
		expect(onInstall).toHaveBeenCalledTimes(1)
		expect(onInstall).toHaveBeenCalledWith(context, character)
	})

	it('awaits version update before calling onInstall', async () => {
		const callOrder: string[] = []

		vi.spyOn(updateModulesModule, 'updateModule').mockImplementation(async () => {
			await new Promise(resolve => setTimeout(resolve, 10))
			callOrder.push('updateModule')
			return true
		})

		const onInstall = vi.fn(() => {
			callOrder.push('onInstall')
		})
		const context = createContext()
		const character = createCharacter({
			_modules: { 'test@module': { version: '1.0.0' } }
		})
		const module = createModule({ version: '2.0.0', onInstall })

		await installModule(module, context, character)

		expect(updateModulesModule.updateModule).toHaveBeenCalledWith(context, character, 'test@module', character._modules['test@module'])
		expect(callOrder).toEqual(['updateModule', 'onInstall'])
	})

	it('skips version update when versions match', async () => {
		const updateModuleSpy = vi.spyOn(updateModulesModule, 'updateModule')
		const context = createContext()
		const character = createCharacter({
			_modules: { 'test@module': { version: '1.0.0' } }
		})
		const module = createModule({ version: '1.0.0' })

		await installModule(module, context, character)

		expect(updateModuleSpy).not.toHaveBeenCalled()
	})
})

describe('installModules', () => {
	beforeEach(() => {
		vi.mocked(getModules).mockReset()
		mocks.patchAction.mockClear()
	})

	afterEach(() => {
		vi.restoreAllMocks()
	})

	it('installs each provided module', async () => {
		const context = createContext()
		const character = createCharacter({
			_modules: {
				'mod-a': { version: '1.0.0' },
				'mod-b': { version: '1.0.0' }
			}
		})
		const modA = createModule({ id: 'mod-a', onInstall: vi.fn() })
		const modB = createModule({ id: 'mod-b', onInstall: vi.fn() })

		await installModules(context, character, [modA, modB])

		expect(context.modules['mod-a']).toBe(modA)
		expect(context.modules['mod-b']).toBe(modB)
		expect(modA.onInstall).toHaveBeenCalledWith(context, character)
		expect(modB.onInstall).toHaveBeenCalledWith(context, character)
	})

	it('falls back to getModules(character._modules) when modules are omitted', async () => {
		const context = createContext()
		const character = createCharacter({
			_modules: { 'test@module': { version: '1.0.0' } }
		})
		const module = createModule({ onInstall: vi.fn() })
		vi.mocked(getModules).mockReturnValue([module])

		await installModules(context, character)

		expect(getModules).toHaveBeenCalledWith(character._modules)
		expect(module.onInstall).toHaveBeenCalledWith(context, character)
	})

	it('runs version patches once when followed by updateModules', async () => {
		mocks.patchAction.mockImplementation(async () => {
			await new Promise(resolve => setTimeout(resolve, 10))
		})

		const context = createContext()
		const character = createCharacter({
			_modules: { 'test@module': { version: '1.0.0' } }
		})
		const module = createModule({ version: '2.0.0' })

		await installModules(context, character, [module])
		await updateModulesModule.updateModules(context, character)

		expect(mocks.patchAction).toHaveBeenCalledTimes(1)
		expect(character._modules['test@module'].version).toBe('2.0.0')
	})
})
