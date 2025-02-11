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

export interface FateTemplates {
	character: Character
}

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface FateConstants {}

export interface FateContext {
	modules: Record<string, FateModuleManifest>
	constants: FateConstants
	components: FateModuleComponent[]
	templates: FateTemplates
}

export interface Character {
	_modules: CharacterModules
	_version?: string
	id: number
	name: string
}
