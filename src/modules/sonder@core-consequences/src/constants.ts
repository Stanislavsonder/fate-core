import type { FateConstants } from '@/types'
import { ConsequenceLevel } from '@/modules/sonder@core-consequences/src/types'

const constants: Pick<FateConstants, 'MAX_CONSEQUENCE_BOXES' | 'CONSEQUENCES_LEVELS'> = {
	MAX_CONSEQUENCE_BOXES: 8,
	CONSEQUENCES_LEVELS: {
		[ConsequenceLevel.Mild]: 2,
		[ConsequenceLevel.Moderate]: 4,
		[ConsequenceLevel.Severe]: 6
	}
}

export default constants
