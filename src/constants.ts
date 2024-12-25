import { Character, CharacterAspectType, ConsequenceLevel, type Skill, Stunt } from '@/types'
import AttackIcon from './assets/icons/Attack.svg'
import DefendIcon from './assets/icons/Defend.svg'
import OvercomeIcon from './assets/icons/Overcome.svg'
import AdvantageIcon from './assets/icons/Advantage.svg'
import TokenIcon from './assets/icons/Token.svg'
import PositiveDiceIcon from './assets/icons/PositiveDice.svg'
import NegativeDiceIcon from './assets/icons/NegativeDice.svg'
import EmptyDiceIcon from './assets/icons/NeutralDice.svg'
import PlasterIcon from './assets/icons/Plaster.svg'

export const MAX_STUNT_PRICE = 3
export const MAX_STRESS_VALUE = 10
export const MAX_AVATAR_FILE_SIZE = 2 * 1024 * 1024 // 2MB
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

export const CONSEQUENCES_LEVELS = {
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
		name: 'skills.athletics.name',
		description: 'skills.athletics.description',
		usage: {
			attack: false,
			defend: true,
			overcome: true,
			advantage: true
		}
	},
	rapport: {
		name: 'skills.rapport.name',
		description: 'skills.rapport.description',
		usage: {
			attack: false,
			defend: true,
			overcome: true,
			advantage: true
		}
	},
	notice: {
		name: 'skills.notice.name',
		description: 'skills.notice.description',
		usage: {
			attack: false,
			defend: false,
			overcome: true,
			advantage: true
		}
	},
	drive: {
		name: 'skills.drive.name',
		description: 'skills.drive.description',
		usage: {
			attack: false,
			defend: true,
			overcome: true,
			advantage: true
		}
	},
	will: {
		name: 'skills.will.name',
		description: 'skills.will.description',
		usage: {
			attack: false,
			defend: true,
			overcome: true,
			advantage: false
		}
	},
	burglary: {
		name: 'skills.burglary.name',
		description: 'skills.burglary.description',
		usage: {
			attack: false,
			defend: false,
			overcome: true,
			advantage: true
		}
	},
	fight: {
		name: 'skills.fight.name',
		description: 'skills.fight.description',
		usage: {
			attack: true,
			defend: true,
			overcome: true,
			advantage: true
		}
	},
	lore: {
		name: 'skills.lore.name',
		description: 'skills.lore.description',
		usage: {
			attack: false,
			defend: false,
			overcome: true,
			advantage: true
		}
	},
	contacts: {
		name: 'skills.contacts.name',
		description: 'skills.contacts.description',
		usage: {
			attack: false,
			defend: true,
			overcome: true,
			advantage: true
		}
	},
	deceive: {
		name: 'skills.deceive.name',
		description: 'skills.deceive.description',
		usage: {
			attack: false,
			defend: true,
			overcome: true,
			advantage: true
		}
	},
	provoke: {
		name: 'skills.provoke.name',
		description: 'skills.provoke.description',
		usage: {
			attack: true,
			defend: false,
			overcome: true,
			advantage: true
		}
	},
	investigate: {
		name: 'skills.investigate.name',
		description: 'skills.investigate.description',
		usage: {
			attack: false,
			defend: false,
			overcome: true,
			advantage: true
		}
	},
	craft: {
		name: 'skills.craft.name',
		description: 'skills.craft.description',
		usage: {
			attack: false,
			defend: false,
			overcome: true,
			advantage: true
		}
	},
	resources: {
		name: 'skills.resources.name',
		description: 'skills.resources.description',
		usage: {
			attack: false,
			defend: false,
			overcome: true,
			advantage: true
		}
	},
	stealth: {
		name: 'skills.stealth.name',
		description: 'skills.stealth.description',
		usage: {
			attack: false,
			defend: false,
			overcome: true,
			advantage: true
		}
	},
	shoot: {
		name: 'skills.shoot.name',
		description: 'skills.shoot.description',
		usage: {
			attack: true,
			defend: false,
			overcome: true,
			advantage: true
		}
	},
	physique: {
		name: 'skills.physique.name',
		description: 'skills.physique.description',
		usage: {
			attack: false,
			defend: true,
			overcome: true,
			advantage: false
		}
	},
	empathy: {
		name: 'skills.empathy.name',
		description: 'skills.empathy.description',
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

export const BASE_CHARACTER: Character = {
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
	]
}
