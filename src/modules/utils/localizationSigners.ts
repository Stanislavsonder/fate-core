import { clone } from '@/utils/helpers/clone'

export function signRecord<T extends Record<string, unknown>>(record: T[], id: string, keys?: string[]): T[]
export function signRecord<T extends Record<string, unknown>>(record: T, id: string, keys?: string[]): T
export function signRecord<T extends Record<string, unknown>>(record: T | T[], id: string, keys?: string[]): T | T[] {
	if (Array.isArray(record)) {
		return record.map(item => signRecord(item, id, keys)) as T[]
	}

	const signedRecord = clone(record) as Record<string, unknown>

	Object.keys(signedRecord).forEach(key => {
		if (keys && keys.includes(key)) {
			signedRecord[key] = `${id}.${signedRecord[key]}`
		} else if (typeof signedRecord[key] === 'string' && signedRecord[key].startsWith('t.')) {
			signedRecord[key] = `${id}.${signedRecord[key].replace('t.', '')}`
		} else if (typeof signedRecord[key] === 'object' && signedRecord[key] !== null) {
			signedRecord[key] = signRecord(signedRecord[key] as Record<string, unknown>, id, keys)
		}
	})

	return signedRecord as T
}
