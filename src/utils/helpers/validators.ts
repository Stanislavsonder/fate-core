import { Character, CharacterAspect, CharacterAspectType, Item, Stunt } from '@/types'
import i18n from '@/i18n'
import useFate from '@/store/useFate'
const t = i18n.global.t
const { constants } = useFate()

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

	if (!stunt.priceInTokens && stunt.priceInTokens !== 0) {
		return t('errors.stunt.priceRequired')
	}

	if (stunt.priceInTokens < 0) {
		return t('errors.stunt.priceNegative')
	}

	if (stunt.priceInTokens > constants.MAX_STUNT_PRICE) {
		return t('errors.stunt.priceTooHigh', {
			value: constants.MAX_STUNT_PRICE.toString()
		})
	}

	if (stunt.priceInTokens % 1 !== 0) {
		return t('errors.stunt.priceInteger')
	}

	if (Number(stunt.priceInTokens) !== stunt.priceInTokens) {
		return t('errors.stunt.priceInvalid')
	}
}

export function validateStress(stressArray: Character['stress']): string | undefined {
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

		if (boxes.some(box => box.count > constants.MAX_STRESS_VALUE)) {
			return t('errors.stress.tooHigh', {
				value: constants.MAX_STRESS_VALUE.toString()
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

	if (item.quantity > constants.MAX_ITEM_QUANTITY) {
		return t('errors.item.quantityTooHigh', {
			value: constants.MAX_ITEM_QUANTITY.toString()
		})
	}
}
