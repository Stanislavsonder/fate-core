import fs from 'fs'
import type { JSONRecord, Input, InputData, Translation } from './utils.ts'

export function readInputFile(filePath: string): JSONRecord {
	if (!fs.existsSync(filePath)) {
		console.error(`File not found: ${filePath}`)
		process.exit(1)
	}
	const rawData = fs.readFileSync(filePath, 'utf-8')
	return JSON.parse(rawData) as JSONRecord
}

export function readSystemData(translations: Input): InputData {
	const data = translations.__system
	delete translations.__system
	return {
		translations,
		systemData: {
			deleteKeys: data?.deleteKeys ?? [],
			renameKeys: data?.renameKeys ?? {},
			moveKeys: data?.moveKeys ?? {}
		}
	}
}

export function writeAndSave(translations: Translation, targetPath: string): void {
	fs.writeFileSync(targetPath, JSON.stringify(translations, null, 2), 'utf-8')
	console.log('[Save] Done.')
}
