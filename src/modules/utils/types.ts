import type { Character, CharacterModules, FateConstants, FateContext, FatePatch, FateShared, FateTemplates } from '@/types'
import type { Component } from 'vue'

export interface FateModuleComponent {
	id: string
	component: Component
	order: number
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
	tags: string[]
	dependencies?: Record<string, string>
	incompatibleWith?: string[]
	appVersion?: string
	loadPriority: number
	components?: FateModuleComponent[]
	constants?: Partial<FateConstants>
	templates?: Partial<FateTemplates>
	shared?: Partial<FateShared>

	onInstall(context: FateContext, character: Character): Promise<void> | void
	onUninstall(context: FateContext, character: Character): Promise<void> | void
	onReconfigure(context: FateContext, character: Character): Promise<void> | void

	patches?: FatePatch[]
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

export type FateModuleConfigField = {
	id: string
	name: string
	tooltip?: string
	type: 'string' | 'number' | 'select' | 'custom-list' | 'boolean' | 'range'
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
	itemTemplate?: {
		fields: FateModuleConfigField[]
	}
}

export type FateModuleConfigOption = {
	id: string
	groupId?: string
	name: string
	tooltip?: string
	type: 'number' | 'string' | 'boolean' | 'select' | 'range' | 'custom-list'
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
	itemTemplate?: {
		fields: FateModuleConfigField[]
	}
}

export type ModulesUpdateInstruction = {
	install: CharacterModules
	reconfigure: CharacterModules
	uninstall: CharacterModules
}

export type ModuleResolutionIssue = {
	type: 'missing-dependency' | 'version-mismatch' | 'app-version-mismatch' | 'incompatible-modules' | 'dependency-cycle'
	moduleId: string
	moduleName: string
	details: {
		// For missing-dependency
		dependencyId?: string
		// For version-mismatch
		requiredVersion?: string
		actualVersion?: string
		dependencyName?: string
		// For app-version-mismatch
		appVersion?: string
		requiredAppVersion?: string
		// For incompatible-modules
		incompatibleWith?: Array<{ id: string; name: string }>
		// For dependency-cycle
		cycleModules?: Array<{ id: string; name: string }>
	}
	suggestedActions: Array<{
		type: 'enable' | 'disable' | 'update' | 'choose-one'
		description: string
		targetModules: string[] // module IDs
	}>
}

export type ModuleResolutionResult = {
	resolvedModules: FateModuleManifest[]
	issues: ModuleResolutionIssue[]
	disabledModules: FateModuleManifest[]
}
