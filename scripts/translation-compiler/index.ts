import fs from 'fs'
import path from 'path'
import type { Translation } from '@/types'

const coreLangDir = path.join(process.cwd(), 'src', 'i18n', 'translations')
const modulesDir = path.join(process.cwd(), 'src', 'modules')
const modulesLocalesDir = 'translations'
const moduleManifestFilename = 'manifest.json'
const outputLocation = path.join(process.cwd(), 'src', 'i18n')
const outputFilename = 'languages.json'
const ignoredDirectories = ['utils']

function loadJson(filePath: string) {
	return JSON.parse(fs.readFileSync(filePath, 'utf-8'))
}

function installModulesTranslation(coreTranslation: Record<string, Translation>, moduleTranslation: Record<string, Translation>, moduleId: string) {
	for (const lang in moduleTranslation) {
		if (!coreTranslation[lang]) {
			console.warn('Language is not supported by the application: ', lang, ' for module: ', moduleId, ' skipping...')
			continue
		}
		coreTranslation[lang][moduleId] = moduleTranslation[lang]
	}
	return coreTranslation
}

function compileTranslations() {
	if (!fs.existsSync(outputLocation)) {
		console.error('Output location does not exist: ', outputLocation)
		process.exit(1)
	}

	let coreTranslation: Record<string, Translation> = {}

	for (const file of fs.readdirSync(coreLangDir)) {
		const langKey = path.parse(file).name
		const filePath = path.join(coreLangDir, file)
		coreTranslation[langKey] = loadJson(filePath)
	}

	for (const moduleName of fs.readdirSync(modulesDir)) {
		if (ignoredDirectories.includes(moduleName)) {
			console.log('Ignoring directory: ', moduleName)
			continue
		}

		const translationsPath = path.join(modulesDir, moduleName, modulesLocalesDir)
		const manifestPath = path.join(modulesDir, moduleName, moduleManifestFilename)

		if (!fs.existsSync(translationsPath)) {
			console.warn('Module does not have translations folder: ', moduleName)
			continue
		}

		if (!fs.existsSync(manifestPath)) {
			console.warn('Module does not have manifest file: ', moduleName)
			continue
		}

		const moduleId = JSON.parse(fs.readFileSync(manifestPath, 'utf-8')).id
		const moduleTranslation: Record<string, Translation> = {}

		for (const file of fs.readdirSync(translationsPath)) {
			if (!file.endsWith('.json')) {
				console.warn('Module translations file is not a json file: ', translationsPath)
				continue
			}

			const langKey = path.parse(file).name
			const filePath = path.join(translationsPath, file)
			moduleTranslation[langKey] = loadJson(filePath)
		}
		coreTranslation = installModulesTranslation(coreTranslation, moduleTranslation, moduleId)
	}

	const outputFilePath = path.join(outputLocation, outputFilename)
	fs.writeFileSync(outputFilePath, JSON.stringify(coreTranslation))
}

compileTranslations()
