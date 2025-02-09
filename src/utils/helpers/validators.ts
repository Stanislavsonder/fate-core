import type { CharacterAspect, Stunt } from '@/types'
import { CharacterAspectType } from '@/types'
import i18n from '@/i18n'
const t = i18n.global.t

export function validateCharacterAspect(aspect: CharacterAspect): string | undefined {
	if (!aspect.name) {
		return t('errors.aspect.nameRequired')
	}

	if (!aspect.description) {
		return t('errors.aspect.descriptionRequired')
	}

	if (!Object.values(CharacterAspectType).includes(aspect.type)) {
		return t('errors.aspect.typeInvalid')
	}
}

interface ValidateStuntOptions {
	MAX_STUNT_PRICE: number
}
export function validateStunt(stunt: Stunt, options: ValidateStuntOptions): string | undefined {
	if (!stunt.name) {
		return t('errors.stunt.nameRequired')
	}

	if (!stunt.description) {
		return t('errors.stunt.descriptionRequired')
	}

	if (!stunt.priceInTokens && stunt.priceInTokens !== 0) {
		return t('errors.stunt.priceRequired')
	}

	if (stunt.priceInTokens < 0) {
		return t('errors.stunt.priceNegative')
	}

	if (stunt.priceInTokens > options.MAX_STUNT_PRICE) {
		return t('errors.stunt.priceTooHigh', {
			value: options.MAX_STUNT_PRICE.toString()
		})
	}

	if (stunt.priceInTokens % 1 !== 0) {
		return t('errors.stunt.priceInteger')
	}

	if (Number(stunt.priceInTokens) !== stunt.priceInTokens) {
		return t('errors.stunt.priceInvalid')
	}
}
