import type { Character as _Character, FateConstants as _FateConstants } from '@/types'

declare module '@/types' {
	interface Character {
		stunts: Stunt[]
	}
	interface FateConstants {
		MAX_STUNT_PRICE: number
	}
	interface FateTemplates {
		stunt: Stunt
	}
}

export type Stunt = {
	skillId?: string
	name: string
	description: string
	priceInTokens: number
}
