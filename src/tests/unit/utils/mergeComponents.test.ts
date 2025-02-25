import { describe, expect, it } from 'vitest'
import { mergeComponents } from '@/utils/helpers/mergeComponents'
import type { FateModuleComponent } from '@/modules/utils/types'
import type { Component } from 'vue'

const mockComponent: Component = {
	name: 'mock-component'
}

describe('mergeComponents', () => {
	it('should return an empty array when given an empty array', () => {
		expect(mergeComponents([])).toEqual([])
	})

	it('should return a single component when given a single component', () => {
		const components: FateModuleComponent[] = [{ id: '1', component: mockComponent, order: 1 }]
		expect(mergeComponents(components)).toEqual(components)
	})

	it('should return components sorted by order', () => {
		const components: FateModuleComponent[] = [
			{ id: '2', component: mockComponent, order: 3 },
			{ id: '1', component: mockComponent, order: 1 },
			{ id: '3', component: mockComponent, order: 2 }
		]

		const result = mergeComponents(components)
		expect(result.map(c => c.id)).toEqual(['1', '3', '2'])
	})

	it('should remove duplicate ids and keep the one with the lowest order', () => {
		const components: FateModuleComponent[] = [
			{ id: '1', component: mockComponent, order: 2 },
			{ id: '1', component: mockComponent, order: 1 },
			{ id: '2', component: mockComponent, order: 3 }
		]

		const result = mergeComponents(components)
		expect(result).toHaveLength(2)
		expect(result.map(c => c.id)).toEqual(['1', '2'])
		expect(result[0].order).toBe(2)
	})

	it('should handle multiple components with different ids correctly', () => {
		const components: FateModuleComponent[] = [
			{ id: '1', component: mockComponent, order: 2 },
			{ id: '2', component: mockComponent, order: 1 },
			{ id: '3', component: mockComponent, order: 3 }
		]

		const result = mergeComponents(components)
		expect(result.map(c => c.id)).toEqual(['2', '1', '3'])
	})
})
