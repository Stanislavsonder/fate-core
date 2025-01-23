import { Character, FateContext, Translation } from '@/types'

export interface FateModulePatch {
	fromVersion: string
	toVersion: string
	note: string
	action?: (context: FateContext, character: Character) => Promise<void> | void
}

export interface FateModuleManifest {
	id: string
	name: string
	version: string
	author: {
		name: string
		email?: string
		url?: string
	}
	description: {
		short: string
		full?: string
	}
	languages: string[]
	type: string | string[]
	translations: Translation
	dependencies?: Record<string, string>
	appVersion?: string
	loadPriority?: number

	onInstall?(context: FateContext, character: Character): Promise<void> | void
	onUninstall?(context: FateContext, character: Character): Promise<void> | void
	onUpdate?(context: FateContext, character: Character): Promise<void> | void

	patches?: FateModulePatch[]

	extra?: {
		[key: string]: unknown
	}
}
