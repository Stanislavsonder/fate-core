import type { FateContext } from './context'

export type CharacterModule = {
	version: string
	config?: Record<string, unknown>
}

export type CharacterModules = {
	[id: string]: CharacterModule
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
