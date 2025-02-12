import type { Character as _Character, FateConstants as _FateConstants } from '@/types'

declare module '@/types' {
	interface Character {
		tokens?: number
	}
	interface FateConstants {
		MAX_TOKENS?: number
		DEFAULT_TOKENS?: number
		TOKEN_ICON?: string
	}
}
