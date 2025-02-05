import { clone } from '@/utils/helpers/clone'

export function signRecord<T extends Record<string, unknown>>(record: T[], id: string, keys?: string[]): T[]
export function signRecord<T extends Record<string, unknown>>(record: T, id: string, keys?: string[]): T
export function signRecord<T extends Record<string, unknown>>(record: T | T[], id: string, keys?: string[]): T | T[] {
	if (Array.isArray(record)) {
		return record.map(item => signRecord(item, id, keys)) as T[]
	}

	const signedRecord = clone(record)

	Object.keys(signedRecord).forEach(key => {
		if (keys && keys.includes(key)) {
			// @ts-ignore
			signedRecord[key] = `${id}.${signedRecord[key]}`
		} else if (typeof signedRecord[key] === 'string' && signedRecord[key].startsWith('t.')) {
			// @ts-ignore
			signedRecord[key] = `${id}.${signedRecord[key].replace('t.', '')}`
		} else if (typeof signedRecord[key] === 'object' && signedRecord[key] !== null) {
			// @ts-ignore
			signedRecord[key] = signRecord(signedRecord[key] as T, id, keys)
		}
	})

	return signedRecord
}
