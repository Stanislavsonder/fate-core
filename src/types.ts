import type { FateModuleComponent, FateModuleManifest } from '@/modules/utils/types'

export type TranslationNode = string | TranslationMap

export interface TranslationMap {
	[key: string]: TranslationNode
}

export type Translation = TranslationMap

export type CharacterModule = {
	version: string
	config?: Record<string, unknown>
}

export type CharacterModules = {
	[id: string]: CharacterModule
}

export interface FateTemplates {
	character: Character
}

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface FateConstants {}

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface FateShared {}

export interface FateContext {
	modules: Record<string, FateModuleManifest>
	constants: FateConstants
	components: FateModuleComponent[]
	templates: FateTemplates
	shared: FateShared
}

export interface Character {
	_modules: CharacterModules
	_version?: string
	id: number
	name: string
}

export interface FatePatch {
	version: string
	note?: string
	incompatible?: boolean
	action: (context: FateContext, character: Character) => Promise<void>
}
