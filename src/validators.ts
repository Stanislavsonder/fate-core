import { CharacterAspect, CharacterAspectType, Item, Stress, Stunt } from '@/types'
import { MAX_ITEM_COUNT, MAX_STRESS_VALUE, MAX_STUNT_PRICE } from '@/constants'

export type ValidationResult = [string, Record<string, unknown>] | string | undefined

export function validateCharacterAspect(aspect: CharacterAspect): ValidationResult {
	if (!aspect.name) {
		return 'errors.aspect.nameRequired'
	}

	if (!aspect.description) {
		return 'errors.aspect.descriptionRequired'
	}

	if (!Object.values(CharacterAspectType).includes(aspect.type)) {
		return 'errors.aspect.typeInvalid'
	}
}

export function validateStunt(stunt: Stunt): ValidationResult {
	if (!stunt.name) {
		return 'errors.stunt.nameRequired'
	}

	if (!stunt.description) {
		return 'errors.stunt.descriptionRequired'
	}

	if (!stunt.skill) {
		return 'errors.stunt.skillRequired'
	}

	if (!stunt.priceInTokens && stunt.priceInTokens !== 0) {
		return 'errors.stunt.priceRequired'
	}

	if (stunt.priceInTokens < 0) {
		return 'errors.stunt.priceNegative'
	}

	if (stunt.priceInTokens > MAX_STUNT_PRICE) {
		return [
			'errors.stunt.priceTooHigh',
			{
				value: MAX_STUNT_PRICE.toString()
			}
		]
	}

	if (stunt.priceInTokens % 1 !== 0) {
		return 'errors.stunt.priceInteger'
	}

	if (Number(stunt.priceInTokens) !== stunt.priceInTokens) {
		return 'errors.stunt.priceInvalid'
	}
}

export function validateStress(stressArray: Stress[]): ValidationResult {
	for (const stress of stressArray) {
		console.log(JSON.stringify(stress))
		if (!stress.boxes.length) {
			return 'errors.stress.empty'
		}

		if (stress.boxes.some(box => box.count <= 0)) {
			return 'errors.stress.notPositive'
		}

		if (stress.boxes.some(box => box.count % 1 !== 0)) {
			return 'errors.stress.integer'
		}

		if (stress.boxes.some(box => Number(box.count) !== box.count)) {
			return 'errors.stress.invalid'
		}

		if (stress.boxes.some(box => box.count > MAX_STRESS_VALUE)) {
			return [
				'errors.stress.tooHigh',
				{
					value: MAX_STRESS_VALUE.toString()
				}
			]
		}
	}
}

export function validateItem(item: Item): ValidationResult {
	if (!item.name) {
		return 'errors.item.nameRequired'
	}

	if (!item.count) {
		return 'errors.item.countRequired'
	}

	if (item.count < 0) {
		return 'errors.item.countNegative'
	}

	if (item.count > MAX_ITEM_COUNT) {
		return [
			'errors.item.countTooHigh',
			{
				value: MAX_ITEM_COUNT.toString()
			}
		]
	}
}
