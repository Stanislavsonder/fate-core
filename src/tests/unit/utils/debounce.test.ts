import { describe, it, expect, vi } from 'vitest'
import { debounce } from '@/utils/helpers/debounce'

describe('debounce', () => {
	it('calls the function after the specified wait time', async () => {
		const mockFn = vi.fn()
		const debouncedFn = debounce(mockFn, 100)

		debouncedFn()
		expect(mockFn).not.toHaveBeenCalled()

		// Wait a bit longer than 100ms
		await new Promise(resolve => setTimeout(resolve, 150))
		expect(mockFn).toHaveBeenCalledTimes(1)
	})

	it('only calls the function once if invoked repeatedly within the wait period', async () => {
		const mockFn = vi.fn()
		const debouncedFn = debounce(mockFn, 100)

		debouncedFn()
		debouncedFn()
		debouncedFn()

		expect(mockFn).not.toHaveBeenCalled()

		// Wait a bit longer than 100ms
		await new Promise(resolve => setTimeout(resolve, 150))
		expect(mockFn).toHaveBeenCalledTimes(1)
	})

	it('uses the last set of arguments provided to the debounced function', async () => {
		const mockFn = vi.fn()
		const debouncedFn = debounce(mockFn, 100)

		debouncedFn('first call')
		debouncedFn('second call')

		// Wait a bit longer than 100ms
		await new Promise(resolve => setTimeout(resolve, 150))
		expect(mockFn).toHaveBeenCalledTimes(1)
		expect(mockFn).toHaveBeenCalledWith('second call')
	})
})
