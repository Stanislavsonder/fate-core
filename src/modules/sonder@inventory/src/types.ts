import type { Character as _Character, FateConstants as _FateConstants, FateTemplates as _FateTemplates } from '@/types'

declare module '@/types' {
	interface Character {
		inventory?: Item[]
	}
	interface FateConstants {
		COLORS_OPTIONS?: string[]
		MAX_ITEM_QUANTITY?: number
	}
	interface FateTemplates {
		item?: Item
	}
}

export type Item = {
	name: string
	description: string
	quantity: number
	icon: string
	iconColor: string | undefined
}
