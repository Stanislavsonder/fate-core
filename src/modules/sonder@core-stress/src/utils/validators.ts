import type { Character, FateConstants } from '@/types'
import i18n from '@/i18n'
const { t } = i18n.global

type ValidateStressOptions = Pick<FateConstants, 'MAX_STRESS_VALUE'>

export function validateStress(stressArray: Character['stress'], options: ValidateStressOptions): string | undefined {
	for (const stressType of stressArray) {
		const boxes = stressType.boxes
		if (!boxes.length) {
			return t('sonder@core-stress.errors.empty')
		}

		if (boxes.some(box => box.count <= 0)) {
			return t('sonder@core-stress.errors.notPositive')
		}

		if (boxes.some(box => box.count % 1 !== 0)) {
			return t('sonder@core-stress.errors.integer')
		}

		if (boxes.some(box => Number(box.count) !== box.count)) {
			return t('sonder@core-stress.errors.invalid')
		}

		if (boxes.some(box => box.count > options.MAX_STRESS_VALUE)) {
			return t('sonder@core-stress.errors.tooHigh', {
				value: options.MAX_STRESS_VALUE.toString()
			})
		}
	}
}
