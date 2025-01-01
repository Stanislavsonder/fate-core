import { CharacterAspect, CharacterAspectType, Stress, Stunt } from '@/types'
import { MAX_STRESS_VALUE, MAX_STUNT_PRICE } from '@/constants'

export function validateCharacterAspect(aspect: CharacterAspect): string | undefined {
	if (!aspect.name) {
		return 'errors.aspect.name.required'
	}

	if (!aspect.description) {
		return 'errors.aspect.description.required'
	}

	if (!Object.values(CharacterAspectType).includes(aspect.type)) {
		return 'errors.aspect.type.invalid'
	}
}

export function validateStunt(stunt: Stunt): string | undefined {
	if (!stunt.name) {
		return 'errors.stunt.name.required'
	}

	if (!stunt.description) {
		return 'errors.stunt.description.required'
	}

	if (!stunt.skill) {
		return 'errors.stunt.skill.required'
	}

	if (!stunt.priceInTokens && stunt.priceInTokens !== 0) {
		return 'errors.stunt.priceInTokens.required'
	}

	if (stunt.priceInTokens < 0) {
		return 'errors.stunt.priceInTokens.negative'
	}

	if (stunt.priceInTokens > MAX_STUNT_PRICE) {
		return 'errors.stunt.priceInTokens.tooHigh'
	}

	if (stunt.priceInTokens % 1 !== 0) {
		return 'errors.stunt.priceInTokens.integer'
	}

	if (Number(stunt.priceInTokens) !== stunt.priceInTokens) {
		return 'errors.stunt.priceInTokens.invalid'
	}
}

export function validateStress(stressArray: Stress[]): string | undefined {
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
			return 'errors.stress.tooHigh'
		}
	}
}
