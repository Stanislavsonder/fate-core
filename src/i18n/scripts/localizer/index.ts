#!/usr/bin/env ts-node

import * as fs from 'fs'
import * as path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const INPUT_PATH = path.join(__dirname, 'input.json')
const LANGUAGES_FOLDER = path.join(__dirname, '../', '../', 'locales')
const SYSTEM_KEY = '__system'

type SystemData = {
	deleteKeys?: string[]
}

type JSONRecord = {
	[key: string]: JSONRecord | string | number | boolean | null
}

type Translations = {
	[key: string]: Translations
}

function validateTranslations(translations: Translations): void {
	const languages = Object.keys(translations).filter(e => e !== SYSTEM_KEY)
	const languageCount = languages.length

	if (languageCount === 0) {
		console.error('No languages found')
		process.exit(1)
	}

	// Helper function to get all keys recursively from an object
	function getAllKeys(obj: object, prefix = ''): string[] {
		return Object.entries(obj).flatMap(([key, value]) =>
			typeof value === 'object' && value !== null ? getAllKeys(value, `${prefix}${key}.`) : `${prefix}${key}`
		)
	}

	// Get all keys for the first language as a reference
	const referenceKeys = getAllKeys(translations[languages[0]])

	const missingFields: Record<string, string[]> = {}
	let allFieldsIdentical = true

	// Compare keys of other languages with the reference
	for (const language of languages) {
		const currentKeys = getAllKeys(translations[language])

		const missingInCurrent = referenceKeys.filter(key => !currentKeys.includes(key))
		const extraInCurrent = currentKeys.filter(key => !referenceKeys.includes(key))

		if (missingInCurrent.length > 0 || extraInCurrent.length > 0) {
			allFieldsIdentical = false
		}

		if (missingInCurrent.length > 0) {
			missingFields[language] = missingInCurrent
		}

		if (extraInCurrent.length > 0) {
			missingFields[language] = (missingFields[language] || []).concat(extraInCurrent.map(key => `[Extra] ${key}`))
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

function deepMerge(target: JSONRecord, source: JSONRecord): JSONRecord {
	for (const key of Object.keys(source)) {
		if (source[key] !== null && typeof source[key] === 'object' && !Array.isArray(source[key])) {
			if (!target[key] || typeof target[key] !== 'object') {
				target[key] = {}
			}
			deepMerge(target[key], source[key])
		} else {
			target[key] = source[key]
		}
	}
	return target
}

function deleteKeyByPath(obj: JSONRecord, keyPath: string): void {
	const parts = keyPath.split('.')
	const lastPart = parts.pop()
	if (!lastPart) return

	let current: JSONRecord = obj
	for (const part of parts) {
		if (!current[part]) {
			return
		}
		// eslint-disable-next-line
		// @ts-ignore
		current = current[part]
	}

	if (current && Object.hasOwn(current, lastPart)) {
		delete current[lastPart]
	}
}

async function main() {
	if (!fs.existsSync(INPUT_PATH)) {
		console.error(`File not found: ${INPUT_PATH}`)
		process.exit(1)
	}

	const rawData = fs.readFileSync(INPUT_PATH, 'utf-8')
	const parsed: JSONRecord = JSON.parse(rawData)

	validateTranslations(parsed as Translations)

	const keysToDelete: string[] = (parsed[SYSTEM_KEY] as SystemData)?.deleteKeys || []

	delete parsed[SYSTEM_KEY]

	for (const lang of Object.keys(parsed)) {
		const localeFilePath = path.join(LANGUAGES_FOLDER, `${lang}.json`)

		let currentLocale: JSONRecord = {}
		if (fs.existsSync(localeFilePath)) {
			const fileData = fs.readFileSync(localeFilePath, 'utf-8')
			currentLocale = JSON.parse(fileData)
		} else {
			console.error(`File not found: ${localeFilePath}`)
			continue
		}

		const updatedLocale = deepMerge(currentLocale, parsed[lang] as JSONRecord)

		for (const keyPath of keysToDelete) {
			deleteKeyByPath(updatedLocale, keyPath)
		}

		fs.writeFileSync(localeFilePath, JSON.stringify(updatedLocale, null, 2), 'utf-8')
		console.log(`Updated locale file: ${localeFilePath}`)
	}
	console.log('Done!')
}

main().catch(err => {
	console.error(err)
	process.exit(1)
})
