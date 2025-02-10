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

const INPUT_PATH = path.join(__dirname, 'input.json')
const SYSTEM_KEY = '__system'

type JSONRecord = {
	[key: string]: JSONRecord | string | number | boolean | null
}

type Translations = {
	[lang: string]: Translations
}

type SystemData = {
	deleteKeys?: string[]
	renameKeys?: Record<string, string>
	moveKeys?: Record<string, string>
}

function validateTranslations(translations: Translations): void {
	const languages = Object.keys(translations).filter(e => e !== SYSTEM_KEY)
	if (languages.length === 0 && !translations[SYSTEM_KEY]) {
		console.error('No languages found in the JSON input.')
		process.exit(1)
	}
	if (languages.length === 0 && translations[SYSTEM_KEY]) return
	if (moduleName) {
		const manifest = JSON.parse(fs.readFileSync(path.join(LANGUAGES_FOLDER, '..', 'manifest.json')).toString()) as FateModuleManifest
		const missingInInput = manifest.languages.filter(lang => !languages.includes(lang))
		if (missingInInput.length > 0) {
			console.warn(`Missing languages in input: ${missingInInput}`)
		}
	}
	function getAllKeys(obj: object, prefix = ''): string[] {
		return Object.entries(obj).flatMap(([key, value]) =>
			typeof value === 'object' && value !== null ? getAllKeys(value, `${prefix}${key}.`) : `${prefix}${key}`
		)
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
		}
		if (missing.length > 0) {
			missingFields[lang] = missing
		}
		if (extra.length > 0) {
			missingFields[lang] = (missingFields[lang] || []).concat(extra.map(k => `[Extra] ${k}`))
		}
	}
	console.log('Languages total:', languages.length)
	if (!allMatch) {
		console.error('Languages with missing/extra fields:', missingFields)
		process.exit(1)
	} else {
		console.log('All languages have identical fields')
	}
}

function deepMerge(target: JSONRecord, source: JSONRecord): JSONRecord {
	for (const key of Object.keys(source)) {
		if (source[key] !== null && typeof source[key] === 'object' && !Array.isArray(source[key])) {
			if (!target[key] || typeof target[key] !== 'object') {
				target[key] = {}
			}
			deepMerge(target[key] as JSONRecord, source[key] as JSONRecord)
		} else {
			target[key] = source[key]
		}
	}
	return target
}

function deleteKeyByPath(obj: JSONRecord, keyPath: string): void {
	const parts = keyPath.split('.')
	const last = parts.pop()
	if (!last) return
	let current: JSONRecord = obj
	for (const p of parts) {
		if (!current[p] || typeof current[p] !== 'object') {
			return
		}
		current = current[p] as JSONRecord
	}
	if (Object.hasOwn(current, last)) {
		delete current[last]
	}
}

function getValueByPath(obj: JSONRecord, pathStr: string): unknown {
	const parts = pathStr.split('.')
	let current: JSONRecord = obj
	for (const p of parts) {
		if (current[p] === undefined) return undefined
		// @ts-ignore
		current = current[p]
	}
	return current
}

function setValueByPath(obj: JSONRecord, pathStr: string, value: unknown): void {
	const parts = pathStr.split('.')
	let current: JSONRecord = obj
	while (parts.length > 1) {
		const p = parts.shift()!
		if (!current[p] || typeof current[p] !== 'object') {
			current[p] = {}
		}
		current = current[p] as JSONRecord
	}
	// @ts-ignore
	current[parts[0]] = value
}

function moveKeyByPath(obj: JSONRecord, oldPath: string, newPath: string) {
	const val = getValueByPath(obj, oldPath)
	if (val === undefined) return
	deleteKeyByPath(obj, oldPath)
	setValueByPath(obj, newPath, val)
}

async function main() {
	if (!fs.existsSync(INPUT_PATH)) {
		console.error(`File not found: ${INPUT_PATH}`)
		process.exit(1)
	}
	const rawData = fs.readFileSync(INPUT_PATH, 'utf-8')
	const parsed = JSON.parse(rawData) as JSONRecord
	validateTranslations(parsed as Translations)

	const system = (parsed[SYSTEM_KEY] || {}) as SystemData
	const { deleteKeys = [], renameKeys = {}, moveKeys = {} } = system
	delete parsed[SYSTEM_KEY]

	const langsInInput = Object.keys(parsed)
	if (langsInInput.length === 0 && (deleteKeys.length > 0 || Object.keys(renameKeys).length > 0 || Object.keys(moveKeys).length > 0)) {
		const allFiles = fs
			.readdirSync(LANGUAGES_FOLDER)
			.filter(file => file.endsWith('.json'))
			.map(file => path.join(LANGUAGES_FOLDER, file))
		for (const filePath of allFiles) {
			const data = fs.readFileSync(filePath, 'utf-8')
			const locale = JSON.parse(data) as JSONRecord
			for (const [oldPath, newPath] of Object.entries(renameKeys)) {
				moveKeyByPath(locale, oldPath, newPath)
			}
			for (const [oldPath, newPath] of Object.entries(moveKeys)) {
				moveKeyByPath(locale, oldPath, newPath)
			}
			for (const keyPath of deleteKeys) {
				deleteKeyByPath(locale, keyPath)
			}
			fs.writeFileSync(filePath, JSON.stringify(locale, null, 2), 'utf-8')
			console.log(`Updated: ${filePath}`)
		}
		console.log('Done!')
		return
	}
	for (const lang of langsInInput) {
		const localeFilePath = path.join(LANGUAGES_FOLDER, `${lang}.json`)
		let currentLocale: JSONRecord = {}
		if (fs.existsSync(localeFilePath)) {
			currentLocale = JSON.parse(fs.readFileSync(localeFilePath, 'utf-8'))
		} else {
			console.warn(`File not found: ${localeFilePath} - creating a new one.`)
		}
		deepMerge(currentLocale, parsed[lang] as JSONRecord)
		for (const [oldPath, newPath] of Object.entries(renameKeys)) {
			moveKeyByPath(currentLocale, oldPath, newPath)
		}
		for (const [oldPath, newPath] of Object.entries(moveKeys)) {
			moveKeyByPath(currentLocale, oldPath, newPath)
		}
		for (const keyPath of deleteKeys) {
			deleteKeyByPath(currentLocale, keyPath)
		}
		fs.writeFileSync(localeFilePath, JSON.stringify(currentLocale, null, 2), 'utf-8')
		console.log(`Updated locale file: ${localeFilePath}`)
	}
	console.log('Done!')
}

main().catch(err => {
	console.error(err)
	process.exit(1)
})
