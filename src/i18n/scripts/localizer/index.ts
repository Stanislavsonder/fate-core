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
