import type { FateConstants } from '@/types'
import { ConsequenceLevel } from '@/types'

export default {
	// Identity
	MAX_AVATAR_FILE_SIZE: 5 * 1024 * 1024,

	// Consequences
	MAX_CONSEQUENCE_BOXES: 8,
	CONSEQUENCES_LEVELS: {
		[ConsequenceLevel.Mild]: 2,
		[ConsequenceLevel.Moderate]: 4,
		[ConsequenceLevel.Severe]: 6
	}
} as FateConstants
