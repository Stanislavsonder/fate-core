import type { Item } from '../types'
import i18n from '@/i18n'
const t = i18n.global.t

type ValidateItemOptions = {
	MAX_ITEM_QUANTITY: number
}

export function validateItem(item: Item, options: ValidateItemOptions): string | undefined {
	if (!item.name) {
		return t('sonder@inventory.errors.item.nameRequired')
	}

	if (!item.quantity) {
		return t('sonder@inventory.errors.item.quantityRequired')
	}

	if (item.quantity < 0) {
		return t('sonder@inventory.errors.item.quantityNegative')
	}

	if (item.quantity > options.MAX_ITEM_QUANTITY) {
		return t('sonder@inventory.errors.item.quantityTooHigh', {
			value: options.MAX_ITEM_QUANTITY.toString()
		})
	}
}
