import type { Character } from './character'
import type { FateModuleComponent, FateModuleManifest } from './manifest'

export interface FateTemplates {
	character: Character
	[modKey: string]: unknown
}

export interface FateConstants {
	[modKey: string]: unknown
}

export interface FateShared {
	[modKey: string]: unknown
}

export interface FateContext {
	modules: Record<string, FateModuleManifest>
	constants: FateConstants
	components: FateModuleComponent[]
	templates: FateTemplates
	shared: FateShared
}
