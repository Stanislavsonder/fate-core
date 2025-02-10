#!/usr/bin/env ts-node
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import type { JSONRecord, Translation } from './utils.ts'
import { deepMerge } from './utils.ts'
import { getAllKeys, deleteKeyByPath, moveKeyByPath } from './utils.ts'
import { readInputFile, readSystemData, writeAndSave } from './inOut.ts'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const INPUT_PATH = path.join(__dirname, 'input.json')
const coreFolder = path.join(process.cwd(), 'src', 'i18n', 'translations')
const moduleName = process.argv[2]

const LANGUAGES_FOLDER = moduleName ? path.join(process.cwd(), 'src', 'modules', moduleName, 'translations') : coreFolder

if (!fs.existsSync(LANGUAGES_FOLDER)) {
	exit(new Error(`[Init] Folder not found: ${LANGUAGES_FOLDER}`))
}

if (moduleName) {
	console.log(`[Init] Translating module: ${moduleName}`)
} else {
	console.log('[Init] Translating core messages')
}

function validateTranslations(translations: Translation): void {
	console.log('[Validation] Validating translations...')
	const languages = Object.keys(translations)
	if (languages.length === 0) {
		exit(new Error('[Validation] No languages found in input data.'))
	}
	const refLang = languages[0]
	const refKeys = getAllKeys(translations[refLang])
	const missingFields: Record<string, string[]> = {}
	let allMatch = true

	for (const lang of languages) {
		const currKeys = getAllKeys(translations[lang])
		const missing = refKeys.filter(k => !currKeys.includes(k))
		const extra = currKeys.filter(k => !refKeys.includes(k))
		if (missing.length > 0 || extra.length > 0) {
			allMatch = false
			missingFields[lang] = [...missing.map(k => `[Missing] ${k}`), ...extra.map(k => `[Extra] ${k}`)]
		}
	}

	if (!allMatch) {
		exit(new Error(`[Validation] Some languages have missing or extra fields: ${missingFields}`))
	} else {
		console.log('[Validation] Done.')
	}
}

function exit(error?: Error) {
	if (error) {
		console.error('\x1b[31m[ERROR] ', error.message)
	} else {
		console.log('\x1b[32m%s\x1b[0m', '[Info] Translation script finished.')
	}
	process.exit(error ? 1 : 0)
}

function deleteKeys(translation: Translation, keys: string[]): void | never {
	for (const key of keys) {
		deleteKeyByPath(translation, key)
	}
}

function renameKeys(translation: Translation, keys: Record<string, string>): void | never {
	for (const [oldKey, newKey] of Object.entries(keys)) {
		moveKeyByPath(translation, oldKey, newKey)
	}
}

function moveKeys(translation: Translation, keys: Record<string, string>): void | never {
	for (const [oldPath, newPath] of Object.entries(keys)) {
		moveKeyByPath(translation, oldPath, newPath)
	}
}

function mergeTranslation(originalTranslation: JSONRecord, overrides: JSONRecord): void | never {
	deepMerge(originalTranslation, overrides)
}

function main() {
	const parsed = readInputFile(INPUT_PATH)
	const { systemData, translations } = readSystemData(parsed)

	if (systemData.deleteKeys.length) {
		console.log('[Init] Deleting keys:', systemData.deleteKeys.join(', '))
	}

	if (Object.keys(systemData.renameKeys).length) {
		console.log('[Init] Renaming keys:', systemData.renameKeys)
	}

	if (Object.keys(systemData.moveKeys).length) {
		console.log('[Init] Moving keys:', systemData.moveKeys)
	}

	const existingLanguages = fs
		.readdirSync(LANGUAGES_FOLDER)
		.filter(f => f.endsWith('.json'))
		.map(f => f.replace('.json', ''))

	const result = new Map<string, JSONRecord>()

	for (const language of existingLanguages) {
		console.log('[Processing] Processing \x1b[32m%s\x1b[0m', language)
		const targetPath = path.join(LANGUAGES_FOLDER, `${language}.json`)
		const targetMessages = readInputFile(targetPath)

		// Delete Keys
		if (systemData.deleteKeys.length > 0) {
			deleteKeys(targetMessages, systemData.deleteKeys)
			console.log('[Delete] Done.')
		}

		// Rename Keys
		if (Object.keys(systemData.renameKeys).length > 0) {
			renameKeys(targetMessages, systemData.renameKeys)
			console.log('[Rename] Done.')
		}

		// Move Keys
		if (Object.keys(systemData.moveKeys).length > 0) {
			moveKeys(targetMessages, systemData.moveKeys)
			console.log('[Move] Done.')
		}

		result.set(language, targetMessages)
	}

	// Merge translations
	const inputLanguages = Object.keys(translations)
	if (inputLanguages.length) {
		validateTranslations(translations)
		for (const language of inputLanguages) {
			console.log('[Merge] Merging translations for \x1b[32m%s\x1b[0m', language)
			const targetMessages = result.get(language) || {}
			mergeTranslation(targetMessages, translations[language])
			result.set(language, targetMessages)
		}
	}

	// Save all
	const allLanguages = new Set([...existingLanguages, ...inputLanguages])
	for (const language of allLanguages) {
		const savingPath = path.join(LANGUAGES_FOLDER, `${language}.json`)
		writeAndSave(result.get(language) || {}, savingPath)
	}

	exit()
}

try {
	main()
} catch (error) {
	exit(error as Error)
}
