import { CharacterAspect, CharacterAspectType, Item, Stress, Stunt } from '@/types'
import { MAX_ITEM_QUANTITY, MAX_STRESS_VALUE, MAX_STUNT_PRICE } from '@/utils/constants'
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

export function validateStunt(stunt: Stunt): string | undefined {
	if (!stunt.name) {
		return t('errors.stunt.nameRequired')
	}

	if (!stunt.description) {
		return t('errors.stunt.descriptionRequired')
	}

	if (!stunt.skill) {
		return t('errors.stunt.skillRequired')
	}

	if (!stunt.priceInTokens && stunt.priceInTokens !== 0) {
		return t('errors.stunt.priceRequired')
	}

	if (stunt.priceInTokens < 0) {
		return t('errors.stunt.priceNegative')
	}

	if (stunt.priceInTokens > MAX_STUNT_PRICE) {
		return t('errors.stunt.priceTooHigh', {
			value: MAX_STUNT_PRICE.toString()
		})
	}

	if (stunt.priceInTokens % 1 !== 0) {
		return t('errors.stunt.priceInteger')
	}

	if (Number(stunt.priceInTokens) !== stunt.priceInTokens) {
		return t('errors.stunt.priceInvalid')
	}
}

export function validateStress(stressArray: Stress[]): string | undefined {
	for (const stress of stressArray) {
		if (!stress.boxes.length) {
			return t('errors.stress.empty')
		}

		if (stress.boxes.some(box => box.count <= 0)) {
			return t('errors.stress.notPositive')
		}

		if (stress.boxes.some(box => box.count % 1 !== 0)) {
			return t('errors.stress.integer')
		}

		if (stress.boxes.some(box => Number(box.count) !== box.count)) {
			return t('errors.stress.invalid')
		}

		if (stress.boxes.some(box => box.count > MAX_STRESS_VALUE)) {
			return t('errors.stress.tooHigh', {
				value: MAX_STRESS_VALUE.toString()
			})
		}
	}
}

export function validateItem(item: Item): string | undefined {
	if (!item.name) {
		return t('errors.item.nameRequired')
	}

	if (!item.quantity) {
		return t('errors.item.quantityRequired')
	}

	if (item.quantity < 0) {
		return t('errors.item.quantityNegative')
	}

	if (item.quantity > MAX_ITEM_QUANTITY) {
		return t('errors.item.quantityTooHigh', {
			value: MAX_ITEM_QUANTITY.toString()
		})
	}
}
