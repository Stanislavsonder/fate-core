import { describe, it, expect } from 'vitest'
import { mergeArraysById } from '@/utils/helpers/mergeArrays'

type TestType = {
	id: string
	value: string
}

type TestTypeCustomKey = {
	key: number
	value: string
}

describe('mergeArraysById', () => {
	it('should merge new items into the current array', () => {
		const currentArray: TestType[] = [{ id: '1', value: 'a' }]
		const newArray: TestType[] = [{ id: '2', value: 'b' }]
		const result = mergeArraysById(currentArray, newArray)
		expect(result).toEqual([{ id: '2', value: 'b' }])
	})

	it('should not update existing items in the current array if no update callback provided', () => {
		const currentArray: TestType[] = [{ id: '1', value: 'a' }]
		const newArray: TestType[] = [{ id: '1', value: 'b' }]
		const result = mergeArraysById(currentArray, newArray)
		expect(result).toEqual([{ id: '1', value: 'a' }])
	})

	it('should update existing items in the current array if update callback is provided', () => {
		const currentArray: TestType[] = [{ id: '1', value: 'a' }]
		const newArray: TestType[] = [{ id: '1', value: 'b' }]
		const onUpdate = (a: TestType, b: TestType) => {
			return {
				...a,
				value: `updated: ${b.value}`
			}
		}
		const result = mergeArraysById(currentArray, newArray, onUpdate)
		expect(result).toEqual([{ id: '1', value: 'updated: b' }])
	})

	it('should remove items not present in the new array', () => {
		const currentArray: TestType[] = [
			{ id: '1', value: 'a' },
			{ id: '2', value: 'b' }
		]
		const newArray: TestType[] = [{ id: '1', value: 'a' }]
		const result = mergeArraysById(currentArray, newArray)
		expect(result).toEqual([{ id: '1', value: 'a' }])
	})

	it('should handle empty current array', () => {
		const currentArray: TestType[] = []
		const newArray: TestType[] = [{ id: '1', value: 'a' }]
		const result = mergeArraysById(currentArray, newArray)
		expect(result).toEqual([{ id: '1', value: 'a' }])
	})

	it('should handle empty new array', () => {
		const currentArray: TestType[] = [{ id: '1', value: 'a' }]
		const newArray: TestType[] = []
		const result = mergeArraysById(currentArray, newArray)
		expect(result).toEqual([])
	})

	it('should handle custom idField', () => {
		const currentArray: TestTypeCustomKey[] = [{ key: 1, value: 'a' }]
		const newArray: TestTypeCustomKey[] = [
			{ key: 1, value: 'a' },
			{ key: 2, value: 'b' }
		]
		const result = mergeArraysById(currentArray, newArray, undefined, 'key')
		expect(result).toEqual([
			{ key: 1, value: 'a' },
			{ key: 2, value: 'b' }
		])
	})
})
