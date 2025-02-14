// @ts-ignore
export type JSONRecord = Record<string, JSONRecord | string | number | boolean | null>
export type Translation = Record<string, JSONRecord>
export type Input = Translation & {
	__system?: Partial<SystemData>
}
export type SystemData = {
	deleteKeys: string[]
	renameKeys: Record<string, string>
	moveKeys: Record<string, string>
}
export type InputData = {
	translations: Translation
	systemData: SystemData
}

export function getAllKeys(obj: JSONRecord, prefix = ''): string[] {
	return Object.entries(obj).flatMap(([key, value]) => {
		return typeof value === 'object' && value !== null ? getAllKeys(value as JSONRecord, `${prefix}${key}.`) : `${prefix}${key}`
	})
}

export function getValueByPath(obj: JSONRecord, pathStr: string): unknown {
	const parts = pathStr.split('.')
	let current: JSONRecord = obj
	for (const p of parts) {
		if (current[p] === undefined) return undefined
		current = current[p] as JSONRecord
	}
	return current
}

export function setValueByPath(obj: JSONRecord, pathStr: string, value: unknown): void {
	const parts = pathStr.split('.')
	let current: JSONRecord = obj
	while (parts.length > 1) {
		const p = parts.shift()!
		if (!current[p] || typeof current[p] !== 'object') {
			current[p] = {}
		}
		current = current[p] as JSONRecord
	}
	current[parts[0]] = value
}

export function deleteKeyByPath(obj: JSONRecord, keyPath: string): void {
	const parts = keyPath.split('.')
	const last = parts.pop()
	if (!last) return
	let current: JSONRecord = obj
	for (const p of parts) {
		if (!current[p] || typeof current[p] !== 'object') return
		current = current[p] as JSONRecord
	}
	if (Object.prototype.hasOwnProperty.call(current, last)) {
		delete current[last]
	}
}

export function moveKeyByPath(obj: JSONRecord, oldPath: string, newPath: string): void {
	const val = getValueByPath(obj, oldPath)
	if (val === undefined) return
	deleteKeyByPath(obj, oldPath)
	setValueByPath(obj, newPath, val)
}

export function deepMerge(target: JSONRecord, source: JSONRecord): void {
	for (const key of Object.keys(source)) {
		const val = source[key]
		if (val && typeof val === 'object' && !Array.isArray(val)) {
			if (!target[key] || typeof target[key] !== 'object') {
				target[key] = {}
			}
			deepMerge(target[key] as JSONRecord, val as JSONRecord)
		} else {
			target[key] = val
		}
	}
}
