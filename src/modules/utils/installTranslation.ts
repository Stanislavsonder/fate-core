import { Translation, TranslationMap } from '@/types'
import { FateModuleManifest } from '@/modules/utils/types'

export function deepMerge(base: TranslationMap, patch: TranslationMap): TranslationMap {
	// Make a shallow copy of `base`
	const output: TranslationMap = { ...base }

	for (const key of Object.keys(patch)) {
		const baseVal = output[key]
		const patchVal = patch[key]

		// If both baseVal and patchVal are objects, recurse
		if (
			typeof baseVal === 'object' &&
			baseVal !== null &&
			!Array.isArray(baseVal) &&
			typeof patchVal === 'object' &&
			patchVal !== null &&
			!Array.isArray(patchVal)
		) {
			output[key] = deepMerge(baseVal as TranslationMap, patchVal as TranslationMap)
		} else {
			// Otherwise, patch overwrites base
			output[key] = patchVal
		}
	}

	return output
}

export function installModulesTranslation(coreTranslation: Translation = {}, modules: FateModuleManifest[] = []): Translation {
	for (const m of modules) {
		const { languages, translations } = m
		for (const language of languages) {
			if (!coreTranslation[language]) {
				console.warn(`Language ${language} not found in core translation. Skipping...`)
				continue
			}
			const baseLang = coreTranslation[language] as TranslationMap
			const patchLang = translations[language] as TranslationMap

			// Deep merge so nested keys are combined rather than overwritten
			coreTranslation[language] = deepMerge(baseLang, patchLang)
		}
	}
	return coreTranslation
}
