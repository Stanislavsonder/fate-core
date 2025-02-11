import type { Character as _Character, FateConstants as _FateConstants } from '@/types'

declare module '@/types' {
	interface Character {
		race: string
		description: string
		avatar?: string
	}
	interface FateConstants {
		MAX_AVATAR_FILE_SIZE: number
	}
}
