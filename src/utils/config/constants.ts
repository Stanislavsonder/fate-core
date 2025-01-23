import TokenIcon from '@/assets/icons/Token.svg'
import { CharacterAspectType, ConsequenceLevel, SkillUsageType } from '@/types'
import PositiveDiceIcon from '@/assets/icons/PositiveDice.svg'
import NegativeDiceIcon from '@/assets/icons/NegativeDice.svg'
import PlasterIcon from '@/assets/icons/Plaster.svg'
import StarIcon from '@/assets/icons/items/Star.svg'
import OvercomeIcon from '@/assets/icons/Overcome.svg'
import AdvantageIcon from '@/assets/icons/Advantage.svg'
import AttackIcon from '@/assets/icons/Attack.svg'
import DefendIcon from '@/assets/icons/Defend.svg'

export type Constants = {
	MAX_STUNT_PRICE: number
	MAX_CONSEQUENCE_BOXES: number
	MAX_STRESS_VALUE: number
	MAX_STRESS_BOXES: number
	MIN_SKILL_LEVEL: number
	MAX_SKILL_LEVEL: number
	MAX_AVATAR_FILE_SIZE: number
	MAX_ITEM_QUANTITY: number
	MAX_TOKENS: number
	TOKEN_ICON: string
	CONSEQUENCES_LEVELS: Record<ConsequenceLevel, number>
	ASPECT_ICONS: Record<CharacterAspectType, string | null>
	SKILL_USAGE: { type: SkillUsageType; icon: string }[]
	COLORS_OPTIONS: string[]
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	[key: string]: any
}

export default {
	MAX_STUNT_PRICE: 3,
	MAX_CONSEQUENCE_BOXES: 8,
	MAX_STRESS_VALUE: 10,
	MAX_STRESS_BOXES: 10,
	MIN_SKILL_LEVEL: 1,
	MAX_SKILL_LEVEL: 10,
	MAX_AVATAR_FILE_SIZE: 5 * 1024 * 1024,
	MAX_ITEM_QUANTITY: 1_000_000_000,
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
	],
	// prettier-ignore
	COLORS_OPTIONS: [
		'#ffc400', // Gold
		'#D32F2F', // Red 700
		'#1976D2', // Blue 700
		'#388E3C', // Green 700
		'#7B1FA2', // Purple 700
		'#5D4037', // Brown 700
		'#00796B', // Teal 700
	]
} as Constants
