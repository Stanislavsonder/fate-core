import type { Character as _Character, FateConstants as _FateConstants } from '@fate-core/mod-types'

declare module '@fate-core/mod-types' {
	interface Character {
		race?: string
		description?: string
	}
	interface FateConstants {
		MAX_AVATAR_FILE_SIZE?: number
	}
}
