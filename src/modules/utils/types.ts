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
	config?: FateModuleConfig

	extra?: {
		[key: string]: unknown
	}
}

export interface FateModuleConfig {
	groups: FateModuleConfigGroup[]
	options: FateModuleConfigOption[]
}

export type FateModuleConfigGroup = {
	id: string
	name: string
	description: string
}

export type FateModuleConfigOption = {
	id: string
	groupId?: string
	name: string
	tooltip?: string
	type: 'number' | 'string' | 'boolean' | 'select' | 'range'
	multiple?: boolean
	default: unknown
	limits?: {
		min?: number
		max?: number
		step?: number
	}
	options?: {
		value: string
		label: string
	}[]
}
