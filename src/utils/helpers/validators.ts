import type { Character, CharacterAspect, Stunt } from '@/types'
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

interface ValidateStressOptions {
	MAX_STRESS_VALUE: number
}
export function validateStress(stressArray: Character['stress'], options: ValidateStressOptions): string | undefined {
	for (const boxes of Object.values(stressArray)) {
		if (!boxes.length) {
			return t('errors.stress.empty')
		}

		if (boxes.some(box => box.count <= 0)) {
			return t('errors.stress.notPositive')
		}

		if (boxes.some(box => box.count % 1 !== 0)) {
			return t('errors.stress.integer')
		}

		if (boxes.some(box => Number(box.count) !== box.count)) {
			return t('errors.stress.invalid')
		}

		if (boxes.some(box => box.count > options.MAX_STRESS_VALUE)) {
			return t('errors.stress.tooHigh', {
				value: options.MAX_STRESS_VALUE.toString()
			})
		}
	}
}
