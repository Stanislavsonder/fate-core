import { describe, it, expect, vi, afterEach } from 'vitest'
import { randomRange, randomArrayValue } from '@/utils/helpers/random'

afterEach(() => {
	vi.restoreAllMocks()
})

describe('randomRange', () => {
	it('returns the minimum value when Math.random() is 0', () => {
		vi.spyOn(Math, 'random').mockReturnValue(0)
		expect(randomRange(5, 10)).toBe(5)
	})

	it('returns the maximum value when Math.random() is close to 1', () => {
		vi.spyOn(Math, 'random').mockReturnValue(0.9999)
		expect(randomRange(5, 10)).toBe(10)
	})

	it('works with negative ranges', () => {
		vi.spyOn(Math, 'random').mockReturnValue(0.5)
		expect(randomRange(-5, -2)).toBe(-3)
	})
})

describe('randomArrayValue', () => {
	it('returns undefined for an empty array', () => {
		vi.spyOn(Math, 'random').mockReturnValue(0)
		expect(randomArrayValue([])).toBeUndefined()
	})

	it('returns the first element when Math.random() is 0', () => {
		vi.spyOn(Math, 'random').mockReturnValue(0)
		expect(randomArrayValue([1, 2, 3])).toBe(1)
	})

	it('returns the last element when Math.random() is close to 1', () => {
		vi.spyOn(Math, 'random').mockReturnValue(0.9999)
		expect(randomArrayValue([1, 2, 3])).toBe(3)
	})

	it('returns the only element in a single-item array', () => {
		vi.spyOn(Math, 'random').mockReturnValue(0.3)
		expect(randomArrayValue(['a'])).toBe('a')
	})
})
