import i18n from '@/i18n'
const { t } = i18n.global

export function formatQuantity(quantity: number): string {
	if (!quantity || quantity === 1) {
		return ''
	}

	if (quantity >= 1_000_000_000) {
		const hasRemainder = quantity % 1_000_000_000 !== 0
		return `${(quantity / 1_000_000_000).toFixed(Number(hasRemainder))}${t('sonder@inventory.count.billion')}`
	}

	if (quantity >= 1_000_000) {
		const hasRemainder = quantity % 1_000_000 !== 0
		return `${(quantity / 1_000_000).toFixed(Number(hasRemainder))}${t('sonder@inventory.count.million')}`
	}

	if (quantity >= 1_000) {
		const hasRemainder = quantity % 1_000 !== 0
		return `${(quantity / 1_000).toFixed(Number(hasRemainder))}${t('sonder@inventory.count.thousand')}`
	}

	return quantity.toString()
}
