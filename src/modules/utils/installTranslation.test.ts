import { describe, it, vi, expect } from 'vitest'
import { installModulesTranslation } from './installTranslation'
import { type Translation } from '@/types'
import { type FateModuleManifest } from '@/modules/utils/types'

describe('installModulesTranslation', () => {
	it('should return the core translation when no modules are provided', () => {
		const coreTranslation: Translation = { en: { key: 'value' } }
		const result = installModulesTranslation(coreTranslation, [])
		expect(result).toEqual(coreTranslation)
	})

	it('should return the core translation when it is empty', () => {
		const result = installModulesTranslation({}, [])
		expect(result).toEqual({})
	})

	it('should log a warning and skip languages not found in core translation', () => {
		const coreTranslation: Translation = { en: { key: 'value' } }
		const modules: Partial<FateModuleManifest>[] = [
			{
				languages: ['fr'],
				translations: { fr: { key: 'valeur' } }
			}
		]
		const consoleWarnSpy = vi.spyOn(console, 'warn')
		const result = installModulesTranslation(coreTranslation, modules as FateModuleManifest[])
		expect(consoleWarnSpy).toHaveBeenCalledWith('Language fr not found in core translation. Skipping...')
		expect(result).toEqual(coreTranslation)
	})

	it('should merge translations for existing languages in core translation', () => {
		const coreTranslation: Translation = { en: { key: 'value' } }
		const modules: Partial<FateModuleManifest>[] = [
			{
				languages: ['en'],
				translations: { en: { newKey: 'newValue' } }
			}
		]
		const result = installModulesTranslation(coreTranslation, modules as FateModuleManifest[])
		expect(result).toEqual({ en: { key: 'value', newKey: 'newValue' } })
	})

	it('should handle multiple modules and languages', () => {
		const coreTranslation: Translation = { en: { key: 'value' }, fr: { key: 'valeur' } }
		const modules: Partial<FateModuleManifest>[] = [
			{
				languages: ['en', 'fr'],
				translations: { en: { newKey: 'newValue' }, fr: { newKey: 'nouvelleValeur' } }
			},
			{
				languages: ['en'],
				translations: { en: { anotherKey: 'anotherValue' } }
			}
		]
		const result = installModulesTranslation(coreTranslation, modules as FateModuleManifest[])
		expect(result).toEqual({
			en: { key: 'value', newKey: 'newValue', anotherKey: 'anotherValue' },
			fr: { key: 'valeur', newKey: 'nouvelleValeur' }
		})
	})
})
