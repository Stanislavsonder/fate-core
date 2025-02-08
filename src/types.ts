import type { FateModuleComponent, FateModuleManifest } from '@/modules/utils/types'

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
	constants: FateConstants
	components: FateModuleComponent[]
	templates: {
		aspect: CharacterAspect
		stunt: Stunt
		character: Character
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		[key: string]: any
	}
	skills: Map<string, Skill>
	stress: Map<string, Stress>
	[key: string]: unknown
}

export interface Character {
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

export interface FateTemplates {
	aspect: CharacterAspect
	stunt: Stunt
	character: Character
}

export interface FateConstants {
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
}
