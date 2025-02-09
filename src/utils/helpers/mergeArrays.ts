/**
 * Merge newArray into currentArray based on a unique idField.
 *
 * @param {Array} currentArray - The array we want to update in-place.
 * @param {Array} newArray - The array containing the new data.
 * @param {Function} [onUpdate] - An optional function called for items found in both arrays.
 *                                Signature: onUpdate(oldItem, newItem).
 * @param {String} [idField='id'] - The name of the unique identifier property.
 * @returns {Array} The updated currentArray (for convenience).
 */
export function mergeArraysById<T extends Record<string, unknown>>(
	currentArray: Array<T>,
	newArray: T[],
	onUpdate?: (a: T, b: T) => void,
	idField: string = 'id'
): T[] {
	const newIds = new Set(newArray.map(item => item[idField]))

	for (let i = currentArray.length - 1; i >= 0; i--) {
		const oldItem = currentArray[i]
		if (!newIds.has(oldItem[idField])) {
			currentArray.splice(i, 1)
		}
	}

	const currentMap = new Map(currentArray.map(item => [item[idField], item]))

	for (const newItem of newArray) {
		const id = newItem[idField]
		const existingItem = currentMap.get(id)

		if (!existingItem) {
			currentArray.push(newItem)
			currentMap.set(id, newItem)
		} else {
			if (typeof onUpdate === 'function') {
				onUpdate(existingItem, newItem)
			}
		}
	}

	return currentArray
}
