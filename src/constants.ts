import { Character, CharacterAspectType, ConsequenceLevel, Item, type Skill, Stunt } from '@/types'
import AttackIcon from './assets/icons/Attack.svg'
import DefendIcon from './assets/icons/Defend.svg'
import OvercomeIcon from './assets/icons/Overcome.svg'
import AdvantageIcon from './assets/icons/Advantage.svg'
import TokenIcon from './assets/icons/Token.svg'
import PositiveDiceIcon from './assets/icons/PositiveDice.svg'
import NegativeDiceIcon from './assets/icons/NegativeDice.svg'
import EmptyDiceIcon from './assets/icons/NeutralDice.svg'
import PlasterIcon from './assets/icons/Plaster.svg'
import { version } from '@/../package.json' with { type: 'json' }

export const MAX_STUNT_PRICE = 3
export const MAX_STRESS_VALUE = 10
export const MAX_AVATAR_FILE_SIZE = 2 * 1024 * 1024 // 2MB
export const MAX_ITEM_COUNT = 1_000_000_000
export const MAX_TOKENS = 9
export const TOKEN_ICON = TokenIcon
export const SKILL_USAGE_ICONS = {
	attack: AttackIcon,
	defend: DefendIcon,
	overcome: OvercomeIcon,
	advantage: AdvantageIcon
}

export const DICE_ICONS = {
	positive: PositiveDiceIcon,
	negative: NegativeDiceIcon,
	neutral: EmptyDiceIcon
}

export const CONSEQUENCES_LEVELS: Record<string, number> = {
	[ConsequenceLevel.Mild]: 2,
	[ConsequenceLevel.Moderate]: 4,
	[ConsequenceLevel.Severe]: 6
}

export const ASPECT_ICONS: Record<CharacterAspectType, string | null> = {
	[CharacterAspectType.HighConcept]: DICE_ICONS.positive,
	[CharacterAspectType.Trouble]: DICE_ICONS.negative,
	[CharacterAspectType.Consequence]: PlasterIcon,
	[CharacterAspectType.Other]: null,
	[CharacterAspectType.Milestone]: null
}

export const BASE_SKILLS: Record<string, Skill> = {
	athletics: {
		name: 'athletics',
		usage: {
			attack: false,
			defend: true,
			overcome: true,
			advantage: true
		}
	},
	rapport: {
		name: 'rapport',
		usage: {
			attack: false,
			defend: true,
			overcome: true,
			advantage: true
		}
	},
	notice: {
		name: 'notice',
		usage: {
			attack: false,
			defend: false,
			overcome: true,
			advantage: true
		}
	},
	drive: {
		name: 'drive',
		usage: {
			attack: false,
			defend: true,
			overcome: true,
			advantage: true
		}
	},
	will: {
		name: 'will',
		usage: {
			attack: false,
			defend: true,
			overcome: true,
			advantage: false
		}
	},
	burglary: {
		name: 'burglary',
		usage: {
			attack: false,
			defend: false,
			overcome: true,
			advantage: true
		}
	},
	fight: {
		name: 'fight',
		usage: {
			attack: true,
			defend: true,
			overcome: true,
			advantage: true
		}
	},
	lore: {
		name: 'lore',
		usage: {
			attack: false,
			defend: false,
			overcome: true,
			advantage: true
		}
	},
	contacts: {
		name: 'contacts',
		usage: {
			attack: false,
			defend: true,
			overcome: true,
			advantage: true
		}
	},
	deceive: {
		name: 'deceive',
		usage: {
			attack: false,
			defend: true,
			overcome: true,
			advantage: true
		}
	},
	provoke: {
		name: 'provoke',
		usage: {
			attack: true,
			defend: false,
			overcome: true,
			advantage: true
		}
	},
	investigate: {
		name: 'investigate',
		usage: {
			attack: false,
			defend: false,
			overcome: true,
			advantage: true
		}
	},
	craft: {
		name: 'craft',
		usage: {
			attack: false,
			defend: false,
			overcome: true,
			advantage: true
		}
	},
	resources: {
		name: 'resources',
		usage: {
			attack: false,
			defend: false,
			overcome: true,
			advantage: true
		}
	},
	stealth: {
		name: 'stealth',
		usage: {
			attack: false,
			defend: false,
			overcome: true,
			advantage: true
		}
	},
	shoot: {
		name: 'shoot',
		usage: {
			attack: true,
			defend: false,
			overcome: true,
			advantage: true
		}
	},
	physique: {
		name: 'shoot',
		usage: {
			attack: false,
			defend: true,
			overcome: true,
			advantage: false
		}
	},
	empathy: {
		name: 'empathy',
		usage: {
			attack: false,
			defend: true,
			overcome: true,
			advantage: true
		}
	}
}

export const EMPTY_STUNT: Stunt = {
	name: '',
	description: '',
	skill: Object.keys(BASE_SKILLS)[0],
	priceInTokens: 0
}

export const EMPTY_ITEM: Item = {
	name: '',
	description: '',
	count: 1,
	icon: 'Cube',
	iconColor: undefined
}

export const BASE_CHARACTER: Character = {
	_version: version,
	name: '',
	race: '',
	description: '',
	tokens: {
		current: 3,
		refresh: 3
	},
	aspects: [],
	skills: Object.fromEntries(Object.keys(BASE_SKILLS).map(e => [e, 0])),
	stunts: [],
	stress: [
		{
			type: 'physical',
			boxes: [
				{
					count: 1,
					checked: false,
					disabled: false
				},
				{
					count: 2,
					checked: false,
					disabled: false
				},
				{
					count: 3,
					checked: false,
					disabled: true
				},
				{
					count: 4,
					checked: false,
					disabled: true
				}
			]
		},
		{
			type: 'mental',
			boxes: [
				{
					count: 1,
					checked: false,
					disabled: false
				},
				{
					count: 2,
					checked: false,
					disabled: false
				},
				{
					count: 3,
					checked: false,
					disabled: true
				},
				{
					count: 4,
					checked: false,
					disabled: true
				}
			]
		}
	],
	consequences: [
		{
			level: ConsequenceLevel.Mild,
			description: '',
			disabled: false
		},
		{
			level: ConsequenceLevel.Mild,
			description: '',
			disabled: true
		},
		{
			level: ConsequenceLevel.Moderate,
			description: '',
			disabled: false
		},
		{
			level: ConsequenceLevel.Severe,
			description: '',
			disabled: false
		}
	],
	inventory: []
}
