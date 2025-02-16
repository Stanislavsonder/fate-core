/**
 * Merges two arrays of objects based on a unique key.
 *
 * @template T - The type of objects in the arrays.
 * @template K - The type of the key used for merging.
 * @param {T[]} current - The current array of objects.
 * @param {T[]} next - The new array of objects to merge into the current array.
 * @param {(currentItem: T, newItem: T) => T} [onUpdate] - Optional function to handle updates when an item exists in both arrays.
 * @param {K} [key='id'] - The key used to identify unique objects in the arrays.
 * @returns {T[]} - The merged array of objects.
 */
export function mergeArraysById<T, K extends keyof T>(current: T[], next: T[], onUpdate?: (currentItem: T, newItem: T) => T, key: K = 'id' as K): T[] {
	const nextMap = new Map<T[K], T>()
	for (const item of next) {
		nextMap.set(item[key], item)
	}
	const result: T[] = []
	for (const item of current) {
		if (nextMap.has(item[key])) {
			const newItem = nextMap.get(item[key])!
			result.push(onUpdate ? onUpdate(item, newItem) : item)
			nextMap.delete(item[key])
		}
	}
	for (const item of nextMap.values()) {
		result.push(item)
	}
	return result
}
