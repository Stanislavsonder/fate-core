import { describe, it, expect, vi } from 'vitest'
import { installModulesTranslation } from '@/modules/utils/installTranslation'
import type { FateModuleManifest } from '@/modules/utils/types'
import type { Translation } from '@/types'

describe('installModulesTranslation', () => {
	it('should merge module translations into an existing core translation', () => {
		// Suppose we have a core translation with two languages
		const coreTranslation: Translation = {
			en: { greeting: 'Hello' },
			es: { greeting: 'Hola' }
		}

		// Each module can define translations for these languages
		const modules: FateModuleManifest[] = [
			{
				id: 'example-1',
				name: 'Module 1',
				version: '1.0',
				author: { name: 'Author A' },
				description: { short: 'Example module' },
				languages: ['en', 'es'],
				type: 'custom',
				translations: {
					en: { farewell: 'Goodbye' },
					es: { farewell: 'Adiós' }
				}
			}
		]

		const updatedTranslation = installModulesTranslation(coreTranslation, modules)

		// We expect 'greeting' + 'farewell' in each language
		expect(updatedTranslation.en).toEqual({
			greeting: 'Hello',
			farewell: 'Goodbye'
		})
		expect(updatedTranslation.es).toEqual({
			greeting: 'Hola',
			farewell: 'Adiós'
		})
	})

	it('should skip languages not in the core translation', () => {
		// Only 'en' is in the core
		const coreTranslation: Translation = {
			en: { greeting: 'Hello' }
		}

		// The module also has 'fr'
		const modules: FateModuleManifest[] = [
			{
				id: 'example-2',
				name: 'Module 2',
				version: '1.0',
				author: { name: 'Author B' },
				description: { short: 'Example module 2' },
				languages: ['en', 'fr'],
				type: 'custom',
				translations: {
					en: { farewell: 'Goodbye' },
					fr: { farewell: 'Au revoir' }
				}
			}
		]

		// Spy on console.warn
		const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})

		const updatedTranslation = installModulesTranslation(coreTranslation, modules)

		// 'en' is merged
		expect(updatedTranslation.en).toEqual({
			greeting: 'Hello',
			farewell: 'Goodbye'
		})
		// 'fr' does not exist in core; it is skipped
		expect(updatedTranslation.fr).toBeUndefined()

		// console.warn is called for the missing 'fr'
		expect(warnSpy).toHaveBeenCalledWith('Language fr not found in core translation. Skipping...')

		// Restore original console.warn behavior
		warnSpy.mockRestore()
	})

	it('should work fine with no modules passed', () => {
		const coreTranslation: Translation = {
			en: { greeting: 'Hello' }
		}
		const updatedTranslation = installModulesTranslation(coreTranslation, [])
		// Should return the same translation object
		expect(updatedTranslation).toEqual(coreTranslation)
	})

	it('should handle an empty core translation gracefully', () => {
		const coreTranslation: Translation = {}
		const modules: FateModuleManifest[] = [
			{
				id: 'example-3',
				name: 'Module 3',
				version: '1.0',
				author: { name: 'Author C' },
				description: { short: 'Example module 3' },
				languages: ['en'],
				type: 'custom',
				translations: {
					en: { farewell: 'Goodbye' }
				}
			}
		]

		// We'll get a warning because 'en' is not in coreTranslation
		const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})

		const updatedTranslation = installModulesTranslation(coreTranslation, modules)
		// Nothing merges because 'en' was missing in core
		expect(updatedTranslation).toEqual({})
		expect(warnSpy).toHaveBeenCalledOnce()
		expect(warnSpy).toHaveBeenCalledWith('Language en not found in core translation. Skipping...')

		warnSpy.mockRestore()
	})

	it('should merge recursively if nested translations exist', () => {
		// Example of nested translations
		const coreTranslation: Translation = {
			en: {
				ui: {
					buttons: {
						save: 'Save'
					}
				}
			}
		}

		const modules: FateModuleManifest[] = [
			{
				id: 'nested-module',
				name: 'Nested Module',
				version: '1.0',
				author: { name: 'Author D' },
				description: { short: 'Adds nested translations' },
				languages: ['en'],
				type: 'custom',
				translations: {
					en: {
						ui: {
							buttons: {
								cancel: 'Cancel'
							}
						}
					}
				}
			}
		]

		const updatedTranslation = installModulesTranslation(coreTranslation, modules)

		// We expect the nested 'cancel' key to be merged in
		expect(updatedTranslation.en).toEqual({
			ui: {
				buttons: {
					save: 'Save',
					cancel: 'Cancel'
				}
			}
		})
	})
})
