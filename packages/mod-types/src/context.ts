import type { Character } from './character'
import type { FateModuleComponent, FateModuleManifest } from './manifest'

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
