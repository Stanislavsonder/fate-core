#!/usr/bin/env ts-node

import * as fs from 'fs'
import * as path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// 1. Accept custom folder from CLI args (e.g. `./dist/locales`, etc.)
//    If nothing is provided, it defaults to ../../locales

const tmp = '../../modules/sonder@core-stress/translations'
const folderArg = process.argv[2]
const DEFAULT_LANGUAGES_FOLDER = path.join(__dirname, tmp)
const LANGUAGES_FOLDER = folderArg ? path.resolve(folderArg) : DEFAULT_LANGUAGES_FOLDER

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

	if (languageCount === 0) {
		console.error('No languages found in the JSON input.')
		process.exit(1)
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

	// 2. For each language in input, either open existing file or create a new one
	for (const lang of Object.keys(parsed)) {
		const localeFilePath = path.join(LANGUAGES_FOLDER, `${lang}.json`)

		let currentLocale: JSONRecord = {}

		// Attempt to read the existing file or create a new one if not found
		if (fs.existsSync(localeFilePath)) {
			const fileData = fs.readFileSync(localeFilePath, 'utf-8')
			currentLocale = JSON.parse(fileData)
		} else {
			console.warn(`File not found: ${localeFilePath} - will create a new file.`)
			// We'll initialize an empty file
			currentLocale = {}
		}

		// Merge provided translations into current locale
		const updatedLocale = deepMerge(currentLocale, parsed[lang] as JSONRecord)

		// Delete any specified keys
		for (const keyPath of keysToDelete) {
			deleteKeyByPath(updatedLocale, keyPath)
		}

		// Write merged updates back
		fs.writeFileSync(localeFilePath, JSON.stringify(updatedLocale, null, 2), 'utf-8')
		console.log(`Updated locale file: ${localeFilePath}`)
	}

	console.log('Done!')
}

main().catch(err => {
	console.error(err)
	process.exit(1)
})
