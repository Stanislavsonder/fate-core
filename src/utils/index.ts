import { getPlatforms } from '@ionic/vue'
import { Dialog } from '@capacitor/dialog'
import i18n from '@/i18n'
const { t } = i18n.global

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

export function formatQuantity(quantity: number): string {
	if (!quantity || quantity === 1) {
		return ''
	}

	if (quantity >= 1_000_000_000) {
		const hasRemainder = quantity % 1_000_000_000 !== 0
		return `${(quantity / 1_000_000_000).toFixed(Number(hasRemainder))}${t('count.billion')}`
	}

	if (quantity >= 1_000_000) {
		const hasRemainder = quantity % 1_000_000 !== 0
		return `${(quantity / 1_000_000).toFixed(Number(hasRemainder))}${t('count.million')}`
	}

	if (quantity >= 1_000) {
		const hasRemainder = quantity % 1_000 !== 0
		return `${(quantity / 1_000).toFixed(Number(hasRemainder))}${t('count.thousand')}`
	}

	return quantity.toString()
}

export function randomSign(): number {
	return Math.random() < 0.5 ? -1 : 1
}

export async function confirmRemove(name?: string): Promise<boolean> {
	const { value } = await Dialog.confirm({
		title: t('common.actions.confirm'),
		message: name ? t('common.messages.remove-named', { value: name }) : t('common.messages.remove'),
		okButtonTitle: t('common.actions.remove'),
		cancelButtonTitle: t('common.actions.cancel')
	})
	return value
}
