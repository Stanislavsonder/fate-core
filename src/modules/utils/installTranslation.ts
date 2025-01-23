import { FateModuleManifest } from '@/modules/utils/types'
import { Translation } from '@/types'

export function installModulesTranslation(coreTranslation: Translation = {}, modules: FateModuleManifest[] = []): Translation {
	modules.forEach(m => {
		const { languages, translations } = m
		for (const language of languages) {
			if (!coreTranslation[language]) {
				console.warn(`Language ${language} not found in core translation. Skipping...`)
				continue
			}
			coreTranslation[language] = {
				// @ts-ignore
				...coreTranslation[language],
				// @ts-ignore
				...translations[language]
			}
		}
	})
	return coreTranslation
}
