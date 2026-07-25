import type { Character as _Character, FateConstants as _FateConstants, FateTemplates as _FateTemplates } from '@fate-core/mod-types'

declare module '@fate-core/mod-types' {
	interface Character {
		aspects?: CharacterAspect[]
	}
	interface FateConstants {
		ASPECT_ICONS: Record<CharacterAspectType, string | undefined>
	}
	interface FateTemplates {
		aspect: CharacterAspect
	}
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
