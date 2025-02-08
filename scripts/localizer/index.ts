#!/usr/bin/env ts-node

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import type { FateModuleManifest } from '@/modules/utils/types'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const coreFolder = path.join(process.cwd(), 'src', 'i18n', 'translations')
const moduleName = process.argv[2]
const LANGUAGES_FOLDER = moduleName ? path.join(process.cwd(), 'src', 'modules', moduleName, 'translations') : coreFolder

if (!fs.existsSync(LANGUAGES_FOLDER)) {
	console.error(`Folder not found: ${LANGUAGES_FOLDER}`)
	process.exit(1)
}

if (moduleName) {
	console.log(`Translating module: ${moduleName}`)
} else {
	console.log('Translating core messages')
}

// input.json is still assumed to be alongside this script
const INPUT_PATH = path.join(__dirname, 'input.json')

// Name used internally to hold system meta
const SYSTEM_KEY = '__system'

type SystemData = {
	deleteKeys?: string[]
}

type JSONRecord = {
	[key: string]: JSONRecord | string | number | boolean | null
}

type Translations = {
	[lang: string]: Translations
}

// Validate that each language in input has same keys
function validateTranslations(translations: Translations): void {
	const languages = Object.keys(translations).filter(e => e !== SYSTEM_KEY)
	const languageCount = languages.length

	if (languageCount === 0 && !translations[SYSTEM_KEY]) {
		console.error('No languages found in the JSON input.')
		process.exit(1)
	}

	if (languageCount === 0 && translations[SYSTEM_KEY]) {
		return
	}

	// Check if some module languages are missing in input
	if (moduleName) {
		const { languages } = JSON.parse(fs.readFileSync(path.join(LANGUAGES_FOLDER, '..', 'manifest.json')).toString()) as FateModuleManifest
		const missingLanguages = languages.filter(lang => !languages.includes(lang))
		if (missingLanguages.length > 0) {
			console.warn(`Missing languages in input: ${missingLanguages}, but found in module manifest.`)
		}
	}

	// Helper function to get all keys recursively from an object
	function getAllKeys(obj: object, prefix = ''): string[] {
		return Object.entries(obj).flatMap(([key, value]) =>
			typeof value === 'object' && value !== null ? getAllKeys(value, `${prefix}${key}.`) : `${prefix}${key}`
		)
	}

	// Take the first language as a "reference" for keys
	const referenceLang = languages[0]
	const referenceKeys = getAllKeys(translations[referenceLang])

	const missingFields: Record<string, string[]> = {}
	let allFieldsIdentical = true

	// Compare each other language to the reference
	for (const lang of languages) {
		const currentKeys = getAllKeys(translations[lang])

		const missingInCurrent = referenceKeys.filter(key => !currentKeys.includes(key))
		const extraInCurrent = currentKeys.filter(key => !referenceKeys.includes(key))

		if (missingInCurrent.length > 0 || extraInCurrent.length > 0) {
			allFieldsIdentical = false
		}

		if (missingInCurrent.length > 0) {
			missingFields[lang] = missingInCurrent
		}

		if (extraInCurrent.length > 0) {
			missingFields[lang] = (missingFields[lang] || []).concat(extraInCurrent.map(key => `[Extra] ${key}`))
		}
	}

	console.log('Languages total:', languageCount)
	if (allFieldsIdentical) {
		console.log('All languages have identical fields')
	} else {
		console.error('Languages with missing/extra fields:', missingFields)
		process.exit(1)
	}
}

// Merge "source" into "target" recursively
function deepMerge(target: JSONRecord, source: JSONRecord): JSONRecord {
	for (const key of Object.keys(source)) {
		// if it's an object, merge deeply
		if (source[key] !== null && typeof source[key] === 'object' && !Array.isArray(source[key])) {
			if (!target[key] || typeof target[key] !== 'object') {
				target[key] = {}
			}
			deepMerge(target[key] as JSONRecord, source[key] as JSONRecord)
		} else {
			// otherwise, just overwrite
			target[key] = source[key]
		}
	}
	return target
}

// Deletes a nested key in an object given a path like "some.nested.key"
function deleteKeyByPath(obj: JSONRecord, keyPath: string): void {
	const parts = keyPath.split('.')
	const lastPart = parts.pop()
	if (!lastPart) return

	let current: JSONRecord = obj
	for (const part of parts) {
		if (!current[part] || typeof current[part] !== 'object') {
			return // Key path does not exist, skip
		}
		current = current[part] as JSONRecord
	}

	if (Object.hasOwn(current, lastPart)) {
		delete current[lastPart]
	}
}

async function main() {
	// Check if input.json exists
	if (!fs.existsSync(INPUT_PATH)) {
		console.error(`File not found: ${INPUT_PATH}`)
		process.exit(1)
	}

	// Parse input.json
	const rawData = fs.readFileSync(INPUT_PATH, 'utf-8')
	const parsed: JSONRecord = JSON.parse(rawData)

	// Validate
	validateTranslations(parsed as Translations)

	// Gather any system instructions (e.g. keys to delete)
	const keysToDelete: string[] = (parsed[SYSTEM_KEY] as SystemData)?.deleteKeys || []

	// Remove the special key from the object so it's not treated as a language
	delete parsed[SYSTEM_KEY]

	const languagesInInput = Object.keys(parsed)
	if (languagesInInput.length === 0 && keysToDelete.length > 0) {
		// Option A: delete from ALL files in LANGUAGES_FOLDER
		const allFiles = fs
			.readdirSync(LANGUAGES_FOLDER)
			.filter(file => file.endsWith('.json'))
			.map(file => path.join(LANGUAGES_FOLDER, file))

		for (const filePath of allFiles) {
			const fileData = fs.readFileSync(filePath, 'utf-8')
			const currentLocale: JSONRecord = JSON.parse(fileData)

			for (const keyPath of keysToDelete) {
				deleteKeyByPath(currentLocale, keyPath)
			}

			fs.writeFileSync(filePath, JSON.stringify(currentLocale, null, 2), 'utf-8')
			console.log(`Deleted keys from: ${filePath}`)
		}

		console.log('Done deleting keys from all locale files!')
		return
	}

	// If there are actual language blocks, or if there are no keys to delete:
	for (const lang of languagesInInput) {
		const localeFilePath = path.join(LANGUAGES_FOLDER, `${lang}.json`)

		let currentLocale: JSONRecord = {}
		if (fs.existsSync(localeFilePath)) {
			currentLocale = JSON.parse(fs.readFileSync(localeFilePath, 'utf-8'))
		} else {
			console.warn(`File not found: ${localeFilePath} - creating a new one.`)
		}

		// Merge translations
		const updatedLocale = deepMerge(currentLocale, parsed[lang] as JSONRecord)

		// Delete any specified keys
		for (const keyPath of keysToDelete) {
			deleteKeyByPath(updatedLocale, keyPath)
		}

		// Write updated file
		fs.writeFileSync(localeFilePath, JSON.stringify(updatedLocale, null, 2), 'utf-8')
		console.log(`Updated locale file: ${localeFilePath}`)
	}

	console.log('Done!')
}

main().catch(err => {
	console.error(err)
	process.exit(1)
})
