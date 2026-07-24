import { describe, it, expect, vi, beforeEach } from 'vitest'
import { updateModule, updateModules } from '@/modules/utils/updateModules'
import type { FateModuleManifest } from '@/modules/utils/types'
import type { Character, FateContext } from '@/types'

const mocks = vi.hoisted(() => ({
	patchAction: vi.fn(),
	showErrorToast: vi.fn(),
	showSuccessToast: vi.fn(),
	showWarningToast: vi.fn()
}))

vi.mock('@/modules', () => ({
	default: new Map([
		[
			'test@module',
			{
				id: 'test@module',
				name: 'Test Module',
				version: '2.0.0',
				patches: [{ version: '2.0.0', action: mocks.patchAction, note: 'Updated' }]
			}
		]
	])
}))

vi.mock('@/utils/helpers/toast', () => ({
	showErrorToast: mocks.showErrorToast,
	showSuccessToast: mocks.showSuccessToast,
	showWarningToast: mocks.showWarningToast
}))

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

describe('updateModule', () => {
	beforeEach(() => {
		vi.clearAllMocks()
	})

	it('preserves character data when the module is not in the registry', async () => {
		const context = createContext()
		const character = createCharacter({
			_modules: {
				'missing@module': { version: '1.0.0', config: { keep: true } }
			}
		})

		const result = await updateModule(context, character, 'missing@module', character._modules['missing@module'])

		expect(result).toBe(false)
		expect(character._modules['missing@module']).toEqual({ version: '1.0.0', config: { keep: true } })
		expect(mocks.showErrorToast).toHaveBeenCalledWith('modules.notFound', { module: 'missing@module' })
	})

	it('applies version patches for a registered module', async () => {
		const context = createContext({
			modules: {
				'test@module': { id: 'test@module', name: 'Test Module', version: '1.0.0' } as FateModuleManifest
			}
		})
		const character = createCharacter({
			_modules: { 'test@module': { version: '1.0.0' } }
		})

		const result = await updateModule(context, character, 'test@module', character._modules['test@module'])

		expect(result).toBe(true)
		expect(mocks.patchAction).toHaveBeenCalledWith(context, character)
		expect(character._modules['test@module'].version).toBe('2.0.0')
		expect(context.modules['test@module'].version).toBe('2.0.0')
		expect(mocks.showSuccessToast).toHaveBeenCalled()
	})
})

describe('updateModules', () => {
	beforeEach(() => {
		vi.clearAllMocks()
	})

	it('preserves unrecognized modules while updating recognized ones', async () => {
		const context = createContext({
			modules: {
				'test@module': { id: 'test@module', name: 'Test Module', version: '1.0.0' } as FateModuleManifest
			}
		})
		const character = createCharacter({
			_modules: {
				'test@module': { version: '1.0.0' },
				'missing@module': { version: '1.0.0', config: { keep: true } }
			}
		})

		const result = await updateModules(context, character)

		expect(result).toBe(true)
		expect(character._modules['missing@module']).toEqual({ version: '1.0.0', config: { keep: true } })
		expect(character._modules['test@module'].version).toBe('2.0.0')
		expect(mocks.showErrorToast).toHaveBeenCalledWith('modules.notFound', { module: 'missing@module' })
	})
})
