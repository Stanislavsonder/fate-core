export function debounce<T extends (...args: unknown[]) => unknown>(func: T, wait: number) {
	let timeoutId: ReturnType<typeof setTimeout> | undefined

	return (...args: Parameters<T>) => {
		if (timeoutId) {
			clearTimeout(timeoutId)
		}

		timeoutId = setTimeout(() => {
			func(...args)
		}, wait)
	}
}
