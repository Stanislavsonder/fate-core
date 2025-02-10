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
	consequences: Consequence[]
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
	character: Character
}

export interface FateConstants {
	MAX_AVATAR_FILE_SIZE: number

	MAX_CONSEQUENCE_BOXES: number
	CONSEQUENCES_LEVELS: Record<ConsequenceLevel, number>
}
