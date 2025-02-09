import type { Character as _Character, FateConstants as _FateConstants } from '@/types'

declare module '@/types' {
	interface Character {
		stress: Stress[]
	}
	interface FateConstants {
		MAX_STRESS_VALUE: number
		MAX_STRESS_BOXES: number
	}
}

export type StressBox = {
	count: number
	checked: boolean
	disabled: boolean
}

export type Stress = {
	id: string
	name: string
	description: string
	boxes: StressBox[]
}
