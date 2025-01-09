import { getPlatforms } from '@ionic/vue'
import { Character } from '@/types'
import { version } from '@/../package.json' with { type: 'json' }

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

export function formatQuantity(quantity: number, t: (key: string) => string): string {
	if (!quantity || quantity === 1) {
		return ''
	}

	if (quantity >= 1_000_000_000) {
		const hasRemainder = quantity % 1_000_000_000 !== 0
		return `${(quantity / 1_000_000_000).toFixed(Number(hasRemainder))}${t('quantity.billion')}`
	}

	if (quantity >= 1_000_000) {
		const hasRemainder = quantity % 1_000_000 !== 0
		return `${(quantity / 1_000_000).toFixed(Number(hasRemainder))}${t('quantity.million')}`
	}

	if (quantity >= 1_000) {
		const hasRemainder = quantity % 1_000 !== 0
		return `${(quantity / 1_000).toFixed(Number(hasRemainder))}${t('quantity.thousand')}`
	}

	return quantity.toString()
}

export function isCharacterNeedsUpdate(character: Character): boolean {
	return character._version !== version
}

export function updateCharacterVersion(character: Character): Character {
	if (version === character._version) {
		return character
	}
	return {
		...character,
		_version: version,
		inventory: []
	}
}

export function randomSign(): number {
	return Math.random() < 0.5 ? -1 : 1
}
