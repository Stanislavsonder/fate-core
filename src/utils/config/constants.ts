import TokenIcon from '@/assets/icons/Token.svg'
import type { FateConstants } from '@/types'
import { CharacterAspectType, ConsequenceLevel } from '@/types'
import PositiveDiceIcon from '@/assets/icons/PositiveDice.svg'
import NegativeDiceIcon from '@/assets/icons/NegativeDice.svg'
import PlasterIcon from '@/assets/icons/Plaster.svg'
import StarIcon from '@/modules/sonder@inventory/src/assets/icons/Star.svg'

export default {
	// Identity
	MAX_AVATAR_FILE_SIZE: 5 * 1024 * 1024,

	// Consequences
	MAX_CONSEQUENCE_BOXES: 8,
	CONSEQUENCES_LEVELS: {
		[ConsequenceLevel.Mild]: 2,
		[ConsequenceLevel.Moderate]: 4,
		[ConsequenceLevel.Severe]: 6
	},

	// Tokens
	MAX_TOKENS: 9,
	TOKEN_ICON: TokenIcon,

	// Aspects
	ASPECT_ICONS: {
		[CharacterAspectType.HighConcept]: PositiveDiceIcon,
		[CharacterAspectType.Trouble]: NegativeDiceIcon,
		[CharacterAspectType.Consequence]: PlasterIcon,
		[CharacterAspectType.Milestone]: StarIcon,
		[CharacterAspectType.Other]: null
	}
} as FateConstants
