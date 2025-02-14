import type { Stunt } from '../types'
import i18n from '@/i18n'
import type { FateConstants } from '@/types'
const t = i18n.global.t

export function validateStunt(stunt: Stunt, options: Required<Pick<FateConstants, 'MAX_STUNT_PRICE'>>): string | undefined {
	if (!stunt.name) {
		return t('sonder@core-stunts.errors.nameRequired')
	}

	if (!stunt.description) {
		return t('sonder@core-stunts.errors.descriptionRequired')
	}

	if (!stunt.priceInTokens && stunt.priceInTokens !== 0) {
		return t('sonder@core-stunts.errors.priceRequired')
	}

	if (stunt.priceInTokens < 0) {
		return t('sonder@core-stunts.errors.priceNegative')
	}

	if (stunt.priceInTokens > options.MAX_STUNT_PRICE) {
		return t('sonder@core-stunts.errors.priceTooHigh', {
			value: options.MAX_STUNT_PRICE.toString()
		})
	}

	if (stunt.priceInTokens % 1 !== 0) {
		return t('sonder@core-stunts.errors.priceInteger')
	}

	if (Number(stunt.priceInTokens) !== stunt.priceInTokens) {
		return t('sonder@core-stunts.errors.priceInvalid')
	}
}
