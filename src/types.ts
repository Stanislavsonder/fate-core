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

export interface FateContext {
	modules: Record<string, FateModuleManifest>
	constants: FateConstants
	components: FateModuleComponent[]
	templates: FateTemplates
}

export interface FateTemplates {
	aspect: CharacterAspect
	stunt: Stunt
	character: Character
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
	stunts: Stunt[]
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

export type Stunt = {
	skillId: string | undefined
	name: string
	description: string
	priceInTokens: number
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
	MAX_AVATAR_FILE_SIZE: number
	MAX_TOKENS: number
	TOKEN_ICON: string
	CONSEQUENCES_LEVELS: Record<ConsequenceLevel, number>
	ASPECT_ICONS: Record<CharacterAspectType, string | null>
}
