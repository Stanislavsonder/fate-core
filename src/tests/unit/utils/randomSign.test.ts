import { randomSign } from '@/utils/helpers/random'
import { describe, expect, it } from 'vitest'

describe('randomSign', () => {
	it('should return either -1 or 1', () => {
		const results = new Set<number>()
		for (let i = 0; i < 100; i++) {
			results.add(randomSign())
		}
		expect(results.has(-1)).toBe(true)
		expect(results.has(1)).toBe(true)
		expect(results.size).toBeLessThanOrEqual(2)
	})

	it('should follow discrete uniform distribution rules', () => {
		let countNegative = 0
		let countPositive = 0
		const iterations = 100000

		for (let i = 0; i < iterations; i++) {
			randomSign() === -1 ? countNegative++ : countPositive++
		}

		const ratio = countNegative / countPositive
		expect(ratio).toBeGreaterThan(0.9)
		expect(ratio).toBeLessThan(1.1)
	})
})
