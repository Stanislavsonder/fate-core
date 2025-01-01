import { getPlatforms } from '@ionic/vue'

const platforms = getPlatforms()

export const isAndroid = platforms.includes('android')
export const isIos = platforms.includes('ios')

export function clone<T>(value: T): T {
	return JSON.parse(JSON.stringify(value))
}

export function debounce<T extends (...args: never[]) => void>(func: T, wait: number): (...args: Parameters<T>) => void {
	let timeoutId: ReturnType<typeof setTimeout> | undefined

	return (...args: Parameters<T>): void => {
		if (timeoutId) {
			clearTimeout(timeoutId)
		}

		timeoutId = setTimeout(() => {
			func(...args)
		}, wait)
	}
}
