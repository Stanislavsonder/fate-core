import { FateModuleManifest } from '@/modules/utils/types'
import { type Constants } from '@/utils/config'

export type TranslationNode = string | TranslationMap

export interface TranslationMap {
	[key: string]: TranslationNode
}

export type Translation = TranslationMap

export type CharacterModules = {
	[id: string]: {
		version: string
		config?: Record<string, unknown>
	}
}

export type FateContext = {
	modules: Record<string, FateModuleManifest>
	constants: Constants
	templates: {
		aspect: CharacterAspect
		stunt: Stunt
		item: Item
		character: Character
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		[key: string]: any
	}
	skills: {
		enabled: boolean
		list: Skill[]
		map: Map<string, Skill>
	}
	stress: {
		enabled: boolean
		list: Stress[]
		map: Map<string, Stress>
	}
	[key: string]: unknown
}

export type Item = {
	name: string
	description?: string
	quantity: number
	icon: string
	iconColor?: string
}

export type Inventory = Item[]

export type Character = {
	_modules: CharacterModules
	_version?: string
	id: number
	name: string
	race: string
	avatar?: string
	tokens: number
	description: string
	aspects: CharacterAspect[]
	skills: {
		[key: string]: number
	}
	stunts: Stunt[]
	stress: {
		[key: string]: StressBox[]
	}
	consequences: Consequence[]
	inventory: Inventory
}

export enum CharacterAspectType {
	HighConcept = 'high-concept',
	Trouble = 'trouble',
	Consequence = 'consequence',
	Milestone = 'milestone',
	Other = 'other'
}

export type CharacterAspect = {
	name: string
	description: string
	type: CharacterAspectType
}

export type SkillUsageType = 'overcome' | 'advantage' | 'attack' | 'defend'

export type SkillUsage = {
	overcome: boolean
	advantage: boolean
	attack: boolean
	defend: boolean
}

export type Skill = {
	_id: string
	_module: {
		name: string
		version: string
	}
	name: string
	description: string
	usage: SkillUsage
}

export type CharacterSkills = {
	[level: number]: Skill[]
}

export type Stunt = {
	skillId: string | undefined
	name: string
	description: string
	priceInTokens: number
}

export type StressBox = {
	count: number
	checked: boolean
	disabled: boolean
}
export type Stress = {
	_id: string
	_module: {
		name: string
		version: string
	}
	name: string
	description: string
	boxes: StressBox[]
}

export enum ConsequenceLevel {
	Mild = 'mild',
	Moderate = 'moderate',
	Severe = 'severe'
}

export type Consequence = {
	level: ConsequenceLevel
	description: string
	disabled: boolean
}
