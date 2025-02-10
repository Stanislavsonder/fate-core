import { Character as _Character, FateConstants as _FateConstants } from '@/types'

declare module '@/types' {
	interface Character {
		consequences: Consequence[]
	}
	interface FateConstants {
		MAX_CONSEQUENCE_BOXES: number
		CONSEQUENCES_LEVELS: Record<ConsequenceLevel, number>
	}
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
