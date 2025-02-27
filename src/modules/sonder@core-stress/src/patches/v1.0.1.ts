import type { FatePatch } from '@/types'
import type { Stress } from '../types'

const v1_0_1: FatePatch = {
	version: '1.0.1',
	action: async (_context, character) => {
		if (character.stress && !Array.isArray(character.stress)) {
			const oldStress = character.stress as Record<string, { count: number; checked: boolean; disabled: boolean }[]>
			const newStress: Stress[] = Object.entries(oldStress).map(([id, stress]) => {
				const moduleId = 'sonder@core-stress'
				const stressType = id.replace('sonder@core-stress.', '')

				return {
					id,
					name: `${moduleId}.stress.${stressType}.name`,
					description: `${moduleId}.stress.${stressType}.description`,
					boxes: stress
				}
			})

			character.stress = newStress
		}
	}
}

export default v1_0_1
