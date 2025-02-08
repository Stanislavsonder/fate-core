import TokenIcon from '@/assets/icons/Token.svg'
import type { FateConstants } from '@/types'
import { CharacterAspectType, ConsequenceLevel } from '@/types'
import PositiveDiceIcon from '@/assets/icons/PositiveDice.svg'
import NegativeDiceIcon from '@/assets/icons/NegativeDice.svg'
import PlasterIcon from '@/assets/icons/Plaster.svg'
import StarIcon from '@/modules/sonder@inventory/src/assets/icons/Star.svg'
import OvercomeIcon from '@/assets/icons/Overcome.svg'
import AdvantageIcon from '@/assets/icons/Advantage.svg'
import AttackIcon from '@/assets/icons/Attack.svg'
import DefendIcon from '@/assets/icons/Defend.svg'

export default {
	MAX_STUNT_PRICE: 3,
	MAX_CONSEQUENCE_BOXES: 8,
	MAX_STRESS_VALUE: 10,
	MAX_STRESS_BOXES: 10,
	MIN_SKILL_LEVEL: 1,
	MAX_SKILL_LEVEL: 10,
	MAX_AVATAR_FILE_SIZE: 5 * 1024 * 1024,
	MAX_TOKENS: 9,
	TOKEN_ICON: TokenIcon,
	CONSEQUENCES_LEVELS: {
		[ConsequenceLevel.Mild]: 2,
		[ConsequenceLevel.Moderate]: 4,
		[ConsequenceLevel.Severe]: 6
	},
	ASPECT_ICONS: {
		[CharacterAspectType.HighConcept]: PositiveDiceIcon,
		[CharacterAspectType.Trouble]: NegativeDiceIcon,
		[CharacterAspectType.Consequence]: PlasterIcon,
		[CharacterAspectType.Milestone]: StarIcon,
		[CharacterAspectType.Other]: null
	},
	SKILL_USAGE: [
		{
			type: 'overcome',
			icon: OvercomeIcon
		},
		{
			type: 'advantage',
			icon: AdvantageIcon
		},
		{
			type: 'attack',
			icon: AttackIcon
		},
		{
			type: 'defend',
			icon: DefendIcon
		}
	]
} as FateConstants
